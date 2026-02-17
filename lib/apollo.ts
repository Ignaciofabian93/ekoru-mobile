import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

const cache = new InMemoryCache();
const link = new HttpLink({ uri: "http://192.168.0.5:4000/graphql" });

const client = new ApolloClient({
  link,
  cache,
});

export default client;
