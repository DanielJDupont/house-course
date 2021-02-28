import { AuthChecker } from "type-graphql";
import { Context } from "./context";

// Our graphql schema would be good but we need our auth checker.
// This is for typegraphql is the user has access to a certain query or mutation or field.
// context contains uid and prisma fields.
// Go to localhost:3000/api/graphql to access the graphql playground to interact with the api through a nice user interface.
// We can see the whole schema and documentation.
// Apollo Sever supports tracing as well. It gives you timing information about every query and every field to locate performance issues.

export const authChecker: AuthChecker<Context> = ({ context }) => {
  // Convert the string to a boolean really explicitly.
  const { uid } = context;
  return !!uid;
};
