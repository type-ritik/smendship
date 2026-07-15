import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";
import { RetryLink } from "@apollo/client/link/retry";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";

// Http link for queries and mutation
const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql",
  headers: {
    authorization: window.localStorage.getItem("token") || "",
  },
});

const retryLink = new RetryLink();

const wsLnk = new GraphQLWsLink(
  createClient({
    url: "ws://localhost:4000/graphql",
    connectionParams: () => ({
      authorization: window.localStorage.getItem("token") || "",
    }),
    retryAttempts: Infinity,
    shouldRetry: () => true,
  }),
);

const linkChain = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLnk,
  retryLink.concat(httpLink),
);

export const client = new ApolloClient({
  link: linkChain,
  cache: new InMemoryCache(),

  clientAwareness: {
    name: "react-web-client",
    version: "1.0",
  },
  queryDeduplication: false,
});
