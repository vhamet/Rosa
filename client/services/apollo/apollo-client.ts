import {
  ApolloClient,
  createHttpLink,
  from,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import Cookies from "js-cookie";
import { ACCESS_TOKEN } from "../../utils/const";
import { isSSR } from "../../utils/utils";

let apolloClient;

const httpLink = createHttpLink({ uri: "http://localhost:3000/graphql" });

const getLocalToken = () => Cookies.get(ACCESS_TOKEN);

const getRequestToken = (request) => request?.cookies[ACCESS_TOKEN];

const getAuthLink = (context) => {
  return setContext((_, { headers }) => {
    const token = isSSR() ? getRequestToken(context?.req) : getLocalToken();

    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });
};

const createApolloClient = (context) => {
  return new ApolloClient({
    ssrMode: typeof window === undefined,
    link: from([getAuthLink(context), httpLink]),
    cache: new InMemoryCache(),
  });
};

export const initializeApollo = ({ initialState = null, context = null }) => {
  const _apolloClient = apolloClient ?? createApolloClient(context);
  if (initialState) {
    const existingCache = _apolloClient.extract();
    _apolloClient.cache.restore({ ...existingCache, ...initialState });
  }
  if (isSSR()) return _apolloClient;
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
};
