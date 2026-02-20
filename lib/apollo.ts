import { GRAPHQL_URL } from "@/config/endpoints";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

const cache = new InMemoryCache();
const link = new HttpLink({ uri: GRAPHQL_URL });

const client = new ApolloClient({
  link,
  cache,
});

export default client;
