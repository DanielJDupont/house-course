import "reflect-metadata";
import { NextApiRequest } from "next";
import { ApolloServer } from "apollo-server-micro";
import { schema } from "src/schema";
import { Context } from "src/schema/context";
import { prisma } from "src/prisma";
import { loadIdToken } from "src/auth/firebaseAdmin";

/*
GraphQL is a single endpoint, it recieves all requests, then it passes each request to the correct resolver or function.
Rather than what we have in REST, where we code many endpoints with each endpoint having one or at most 3 or 4 functions (GET, POST, UPDATE, DELETE).
GraphQL sort of takes the idea of GET, POST, UPDATE for 1 REST endpoint and expands upon it massively so we only need 1 REST endpoint with as many resolvers as we like.
Can set tracing on as well.
Our graphql server is apollo server, well, apollo server micro.
*/

const server = new ApolloServer({
  schema,
  // NextApiRequest is our interface.
  // Get the user Id, used to check server side as well to see if the user is authenticated.
  context: async ({ req }: { req: NextApiRequest }): Promise<Context> => {
    const uid = await loadIdToken(req);
    return {
      uid,
      prisma,
    };
  },
  tracing: process.env.NODE_ENV === "development",
});

// The handler tells the server to listen to requests at a certain endpoint, give it the enpoint.
const handler = server.createHandler({ path: "/api/graphql" });

// Next.js wants to parse the body of the incoming requests, but that messes with apollo server, which then attempts to do the same thing.
// This disables the parsing of Apollo Server body parser, so we are using the built in equivalent Next.js request body parser.
export const config = {
  api: {
    bodyParser: false,
  },
};

/*
There are two key things we must export from our file.
We must export our handler, so our API can recieve and process requests.
We also need to export an additional config in additional to handler, or a configuration to our handler.
Not sure where config is used, i think handler is automatically used, both may be automatically used.
Note that you must go to the /api/graphql endpoint to update the graphql schema file: schema.gql to the latest version.
This is important because we are doing typescript code generation based upon the contents of the schema.gql file.

Note that it is going to be common that schema.gql is not up to date due to failing to visit the /api/graphql endpoint after
adding in new or changing the graphql resolvers.
*/

export default handler;
