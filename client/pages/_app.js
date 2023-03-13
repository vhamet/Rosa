import { ApolloProvider } from "@apollo/client";
import { UserProvider } from "../services/authentication/user-context";
import { initializeApollo } from "../services/apollo/apollo-client";

import "../styles/globals.css";

const apolloClient = initializeApollo({});

function App({ Component, pageProps }) {
  return (
    <ApolloProvider client={apolloClient}>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </ApolloProvider>
  );
}

export default App;
