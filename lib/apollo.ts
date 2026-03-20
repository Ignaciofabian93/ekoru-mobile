import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  Observable,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

import { RefreshToken } from "@/api/auth/login";
import { GRAPHQL_URL } from "@/config/endpoints";
import useAuthStore from "@/store/useAuthStore";

// Attaches the stored JWT to every GraphQL request as an Authorization header.
const authLink = setContext((_, { headers }) => {
  const token = useAuthStore.getState().token;
  return {
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
});

// On UNAUTHENTICATED errors or HTTP 401, silently refresh the access token
// and retry the failed operation. If the refresh itself fails, log the user out.
let isRefreshing = false;
let pendingRequests: Array<() => void> = [];

const resolvePendingRequests = () => {
  pendingRequests.forEach((resolve) => resolve());
  pendingRequests = [];
};

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    const isUnauthenticated =
      graphQLErrors?.some(
        (e) =>
          e.extensions?.code === "UNAUTHENTICATED" ||
          e.extensions?.code === "UNAUTHORIZED" ||
          e.extensions?.statusCode === 401 ||
          e.extensions?.status === 401,
      ) ||
      (networkError &&
        "statusCode" in networkError &&
        networkError.statusCode === 401);

    if (!isUnauthenticated) return;

    if (isRefreshing) {
      // Queue subsequent operations until the refresh resolves
      return new Observable((observer) => {
        pendingRequests.push(() => {
          forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          });
        });
      });
    }

    isRefreshing = true;

    return new Observable((observer) => {
      RefreshToken()
        .then((data) => {
          if (!data?.token) {
            useAuthStore.getState().logout();
            observer.complete();
            return;
          }

          // Persist the new token and update the operation header
          useAuthStore.getState().updateToken(data.token);
          operation.setContext(
            ({ headers = {} }: { headers: Record<string, string> }) => ({
              headers: { ...headers, Authorization: `Bearer ${data.token}` },
            }),
          );

          resolvePendingRequests();

          forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          });
        })
        .catch(() => {
          pendingRequests = [];
          useAuthStore.getState().logout();
          observer.complete();
        })
        .finally(() => {
          isRefreshing = false;
        });
    });
  },
);

const httpLink = new HttpLink({ uri: GRAPHQL_URL });

const client = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;
