import { AppContext, AppInitialProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import { Oswald } from "next/font/google";
import { UserProvider } from "../services/authentication/user-context";
import { useApollo } from "../services/apollo/apollo-client";
import MainLayout from "../components/MainLayout";

import "../styles/globals.css";
import "../styles/globals.scss";

import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

const oswald = Oswald({ subsets: ["latin"] });

const App = ({ Component, pageProps }: AppContext & AppInitialProps) => {
  const apolloClient = useApollo(pageProps);

  return (
    <ApolloProvider client={apolloClient}>
      <UserProvider>
        <main className={oswald.className}>
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        </main>
      </UserProvider>
    </ApolloProvider>
  );
};

export default App;
