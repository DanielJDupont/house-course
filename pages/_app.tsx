import { AppProps } from "next/app";
import Head from "next/head";
import { ApolloProvider } from "@apollo/client";
import { useApollo } from "src/apollo";
import { AuthProvider } from "src/auth/useAuth";
import "../styles/index.css";

export const MyApp = ({ Component, pageProps }: AppProps) => {
  const client = useApollo();

  return (
    <AuthProvider>
      <ApolloProvider client={client}>
        <Head>
          <title>Home Sweet Home</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Component {...pageProps} />
      </ApolloProvider>
    </AuthProvider>
  );
};

export default MyApp;

/*
Note that this file is used on every single page.
It wraps itself around all other components.

We want apollo client on every single page.
We put our apollo provider here so every page can execute queries and mutations with graphql.

So that is it for setting up the apollo client here.
Wrote the apollo.ts file for the client setup.

Wrote the apollo provider as well.
*/
