import {
  ApolloClient,
  createHttpLink,
  from,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import merge from "deepmerge";
import Cookies from "js-cookie";
import { useMemo } from "react";
import isEqual from "lodash/isEqual";

import { ACCESS_TOKEN } from "../../utils/const";
import { isSSR } from "../../utils/utils";

export const APOLLO_STATE_PROP_NAME = "__APOLLO_STATE__";

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;

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
    cache: new InMemoryCache({
      typePolicies: {
        User: {
          keyFields: ["id"],
        },
        Event: {
          keyFields: ["id"],
        },
      },
    }),
  });
};

type ApolloInitializationProps = {
  initialState?: NormalizedCacheObject | null;
  context?: any;
};

export const initializeApollo = ({
  initialState = null,
  context = null,
}: ApolloInitializationProps) => {
  const _apolloClient = apolloClient ?? createApolloClient(context);

  if (initialState) {
    const existingCache = _apolloClient.extract();
    const data = merge(initialState, existingCache, {
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter((d) =>
          sourceArray.every((s) => !isEqual(d, s))
        ),
      ],
    });

    _apolloClient.cache.restore(data);
  }

  if (typeof window === "undefined") return _apolloClient;

  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
};

export const addApolloState = (
  client: ApolloClient<NormalizedCacheObject>,
  pageProps: any
) => {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract();
  }

  return pageProps;
};

export const useApollo = (pageProps: any) => {
  const state = pageProps[APOLLO_STATE_PROP_NAME];
  const store = useMemo(
    () => initializeApollo({ initialState: state }),
    [state]
  );
  return store;
};
