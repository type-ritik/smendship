import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { RetryLink } from "@apollo/client/link/retry";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";
import { store } from "./redux/store";
import { logOut } from "./redux/user/userSlice";

// Single source of truth: the persisted redux user (it already holds the
// token). Previously the token lived in BOTH redux and localStorage["token"],
// which could drift apart. Login code no longer needs to write localStorage.
// PersistGate in main.tsx guarantees rehydration finished before any request.
const getToken = () => store.getState().user.currentUser?.token ?? null;

const errorLink = onError(({ graphQLErrors, networkError }) => {
  const isUnauthorized =
    graphQLErrors?.some(
      (e) =>
        e.message === "Unauthorized Entity" ||
        e.extensions?.code === "UNAUTHENTICATED",
    ) ||
    (networkError &&
      "statusCode" in networkError &&
      networkError.statusCode === 401);

  // Only if we had a session, so a failed login can't loop.
  if (isUnauthorized && getToken()) {
    store.dispatch(logOut()); // RequireAuth then redirects to /auth/login
    void resetClientSession();
  }
});

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_API_URL,
  fetch: (uri, options) => {
    const headers = new Headers(options?.headers);
    const token = getToken();
    if (token) headers.set("authorization", token);
    return fetch(uri, { ...options, headers });
  },
});

// Retry only queries (never mutations) on transient failures.
const retryLink = new RetryLink({
  attempts: {
    max: 3,
    retryIf: (error, operation) => {
      if (!error) return false;
      const status = (error as { statusCode?: number }).statusCode;
      if (status && status < 500) return false;
      const def = getMainDefinition(operation.query);
      return def.kind === "OperationDefinition" && def.operation === "query";
    },
  },
});

export const wsClient = createClient({
  url: import.meta.env.VITE_API_URL_WS,
  connectionParams: () => {
    const token = getToken();
    return token ? { authorization: token } : {};
  },
  retryAttempts: Infinity,
});

const wsLink = new GraphQLWsLink(wsClient);

const linkChain = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  errorLink.concat(retryLink).concat(httpLink),
);

export const client = new ApolloClient({
  link: linkChain,
  cache: new InMemoryCache(),
  name: "react-web-client", // Apollo Client v3 (use clientAwareness on v4)
  version: "1.0",
});

/** Call after login and logout: reconnect the socket with the new token and wipe cached data. */
export const resetClientSession = async () => {
  wsClient.terminate();
  await client.clearStore();
};
