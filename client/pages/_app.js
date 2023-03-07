import { ApolloProvider } from "@apollo/client";
import client from "../services/apollo/apollo-client";
import { UserProvider } from "../services/authentication/user-context";

import "../styles/globals.css";

function App({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </ApolloProvider>
  );
}

export default App;
