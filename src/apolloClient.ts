import 'cross-fetch/polyfill';
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client/core";

const cache: InMemoryCache = new InMemoryCache({});

export const client = new ApolloClient({
  cache,
  link: createHttpLink({
    uri: '/graphql',
    fetch,
    credentials: "include",
  }),
});