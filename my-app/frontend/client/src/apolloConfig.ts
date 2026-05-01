import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
// import { GraphQLWsLink } from "@apollo/client/link/subscriptions";

// Http link for queries and mutation
const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql",
});

// const wsLink = new GraphQLWsLink({
//   uri: "ws://localhost:4000/graphql",
//   options: {
//     reconnect: true,
//   },
// });

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
