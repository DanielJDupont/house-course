import {
  ObjectType,
  Field,
  Int,
  Resolver,
  Mutation,
  Authorized,
} from "type-graphql";
const cloudinary = require("cloudinary").v2;

/*
Query is just asking for data, like http verb or restful route get.
Mutation is like update, patch, delete, post.
*/

// We return an object type.
// The use of bang here means you will take care of the error that is otherwise there.
// An object type, we return this object from the resolver below.
@ObjectType()
class ImageSignature {
  @Field((_type) => String)
  signature!: string;

  @Field((_type) => Int)
  timestamp!: number;
}

// We have to tell graphql we are returning the ImageSignature object,
// And we also have to tell TypeScript we are returning the ImageSignature object.
// Is bad design but that is how it works.
// Note that the index.ts file in our schema holds all of our resolvers to then build our actual schema with.
@Resolver()
export class ImageResolver {
  // You do the graphql types first with the @Mutation decorator here, then provide the TypeScript type below.
  // Authorized allows the resolver to work only if auth.ts returns true.
  @Authorized()
  @Mutation((_returns) => ImageSignature)
  createImageSignature(): ImageSignature {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature: string = cloudinary.utils.api_sign_request(
      {
        timestamp,
      },
      process.env.CLOUDINARY_SECRET
    );
    return { timestamp, signature };
  }
}
