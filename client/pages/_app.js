import { ApolloProvider } from "@apollo/client";
import client from "../apollo-client";

import "../styles/globals.css";

function App({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default App;
