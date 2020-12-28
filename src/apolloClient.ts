import "cross-fetch/polyfill";
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  NormalizedCache,
} from "@apollo/client/core";
import { SESSION_NAME } from "./config";

const cache: InMemoryCache = new InMemoryCache({});

export const client = ({ headers }: { headers?: any } = { headers: {} }) => {
  return new ApolloClient({
    cache,
    link: createHttpLink({
      uri: "http://localhost:3000/graphql",
      fetch,
      credentials: "include",
      headers,
    }),
  });
};

export const clientWithSession = (session: any) => {
  let apolloClient: any;
  if (session.cookie) {
    apolloClient = client({
      headers: { Cookie: SESSION_NAME + "=" + session.cookie },
    });
  } else {
    apolloClient = client();
  }

  return apolloClient as ApolloClient<NormalizedCache>;
};

export default client();
