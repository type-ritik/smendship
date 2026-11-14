import http from "http";
import express from "express";
import { ApolloServer } from "@apollo/server";
import "dotenv/config";
import cors from "cors";
import { typeDefs } from "./routes/typeDefs";
import { resolvers } from "./controllers/resolvers";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/use/ws";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { JwtToken } from "./utils/JwtToken";
import { presenceService } from "./services/presenceService";
import { expressMiddleware } from "@as-integrations/express5";
import bodyParser from "body-parser";
import { getContext } from "./config/context";
import { appServices } from "./config/container";
import { Mailer } from "./config/mailConfig";

async function main() {
  // Start Express + Apollo
  const app = express();

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const server = new ApolloServer({ schema });

  // Verify the nodemailer connection
  new Mailer().serverStart();

  await server.start();
  app.use(
    "/graphql",
    cors(),
    express.json(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        // 1. Run your existing base HTTP JWT verification logic
        const baseContext = await getContext(req, res);

        // 2. Merge the authenticated user state with your app services container
        return {
          ...baseContext,
          services: appServices, // 👈 Resolvers can now access context.services.user
        };
      },
    }),
  );

  // Create HTTP server
  const httpServer = http.createServer(app);

  // Set up WebSocket server for subscriptions
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  useServer(
    {
      schema,
      onConnect: async (ctx) => {
        const token =
          (ctx.connectionParams?.Authorization as string) ||
          (ctx.connectionParams?.authorization as string);

        if (!token) throw new Error("Unauthorized");

        const jwtToken = new JwtToken();
        const user = jwtToken.verify(token);
        if (!user) throw new Error("Invalid token");

        const socketId = crypto.randomUUID();

        await presenceService.setUserOnline(user.id, socketId);

        Object.assign(ctx.extra, {
          user,
          socketId,
        });

        return true;
      },
      onSubscribe: (ctx) => {
        if (!ctx.extra?.user) throw new Error("Unauthorized");
      },
      context: async (ctx) => {
        return {
          user: ctx.extra?.user,
          socketId: ctx.extra?.socketId,
          services: appServices,
        };
      },
      onDisconnect: async (ctx) => {
        const extra = ctx.extra as { user?: { id: string }; socketId?: string };
        const userId = extra.user?.id;
        const socketId = extra.socketId;

        if (userId && socketId) {
          // 3. Execute via the class instance
          await presenceService.setUserOffline(userId, socketId);
        }
      },
    },
    wsServer,
  );

  // Start the server
  httpServer.listen(process.env.PORT, () => {
    console.log(
      `Server is running on http://localhost:${process.env.PORT}/graphql`,
    );
    console.log(
      `Subscriptions are running on ws://localhost:${process.env.PORT}/graphql`,
    );
  });
}

main().catch((err) => {
  console.error("Server failed to start", err);
});
