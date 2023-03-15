import { ApolloProvider } from "@apollo/client";
import { UserProvider } from "../services/authentication/user-context";
import { initializeApollo } from "../services/apollo/apollo-client";
import MainLayout from "../components/MainLayout";

import "../styles/globals.css";

const apolloClient = initializeApollo({});

const App = ({ Component, pageProps }) => {
  return (
    <ApolloProvider client={apolloClient}>
      <UserProvider>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </UserProvider>
    </ApolloProvider>
  );
};

export default App;
