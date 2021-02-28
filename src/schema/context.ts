import { PrismaClient } from "../prisma";

export interface Context {
  // string if authenticated, and null if they are not.
  // this context is provided.
  uid: string | null;
  prisma: PrismaClient;
}

export interface AuthorizedContext extends Context {
  // If the user is logged in, there will always be a uid, there is no possibility of it being null.
  uid: string;
}
