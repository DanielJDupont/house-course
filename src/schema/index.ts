import { buildSchemaSync, Resolver, Query } from "type-graphql";
// import { ImageResolver } from "./image";
// import { HouseResolver } from "./house";
import { authChecker } from "./auth";

/*
This decorator and class functionality is something you don't see much in TypeScript unless you are writing resolvers or "endpoints" in graphql.
Decorators are functions that go before a class or a function, and they essentially add on additional functionality.
This resolver has a query, it can also have a mutation or an update or deletion I suppose.
Note that resolvers are the equivalent to the REST api endpoint.
*/
@Resolver()
class DummyResolver {
  // Query decorator. This query will return a String.
  // The way hello is defined is kind of magic to me.
  // This query will return a string.
  @Query((_returns) => String)
  hello() {
    return "Nice to meet you!";
  }
}

// Resolvers instruct you on how to actually process and handle your different mutations, queries, updates, deletions, etc.\
// Note that our system here wants to emit a schema file badly.
// The front end needs to generate types from the schema file so our graphql is typed in development.
// It is useless to generate types in production.
export const schema = buildSchemaSync({
  // Need to actually register our resolvers. Declare all of our queries, mutations.
  resolvers: [DummyResolver],
  // It also wants to emit a schema file.
  // Useless to have a schema file to generate types from in production. Used for the @prisma/client pseudo-npm file.
  emitSchemaFile: process.env.NODE_ENV === "development",
  // We are going to generate types from the schema file.
  authChecker,
});
