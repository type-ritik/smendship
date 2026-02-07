// File: backend/src/index.js
const express = require("express");
const { ApolloServer } = require("@apollo/server");
require("dotenv").config();
const cors = require("cors");
const typeDefs = require("./schema/typeDefs");
const resolvers = require("./resolvers/index");
const bodyParser = require("body-parser");
const { expressMiddleware } = require("@as-integrations/express4");
const { getContext } = require("./utils/context");

async function startServer() {
  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();
  app.use(
    "/graphql",
    cors(),
    express.json(),
    bodyParser.json(),
    expressMiddleware(server, { context: getContext }),
  );

  return app;
}

module.exports = {
  startServer,
};
