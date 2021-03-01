import { ApolloClient, InMemoryCache } from "@apollo/client";
import { HttpLink } from "@apollo/client/link/http";
import { useMemo } from "react";

/*
We have one location in our app, this file, so we don't create multiple clients.
We make one apollo client and return it.
For an apollo client to work it needs a link.
A link takes graphql requests and it transforms it to a new form that is better understood by graphql, mainly headers.
The last step of the link is to execute the http request to the server.

Setup the link, send the link.
*/

const createApolloClient = () => {
  return new ApolloClient({
    // We are storing the credentials in a cookie.
    // credentials "same-origin" means to send up the user's cookies to the sever for auth.
    link: new HttpLink({ uri: "/api/graphql", credentials: "same-origin" }),
    // Apollo stores the results of every query in a normalized cache, it checks to see if multiple queries are made it already has the data.
    cache: new InMemoryCache(),
    // First look in the cache, but then also do another network request.
    // It gives us the speed of getting data instantly and also prevents our data from going stale.
    // It would be ideal if it only did network requests when absolutely needed upon the data actually being stale but this is good enough.
  });
};

// Note that this is a hook, I suppose because it is a function that uses hooks, therefore we call the function a hook,
// even though it is just a function using hooks.
export const useApollo = () => {
  // We are creating and returning the client, he like transitive variable identifiers for self documenting purposes for maintenance.
  // We have a memo as another buffer to prevent us from creating multiple clients if this file is called multiple times.
  const client = useMemo(() => createApolloClient(), []);
  return client;
};
