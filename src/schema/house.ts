import {
  ObjectType,
  InputType,
  Field,
  ID,
  Float,
  Int,
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  Authorized,
} from "type-graphql";
import { Min, Max } from "class-validator";
import { getBoundsOfDistance } from "geolib";
import { Context, AuthorizedContext } from "./context";

// Package together latitude and longitude.
@InputType()
class CoordinatesInput {
  @Min(-90)
  @Max(90)
  @Field((_type) => Float)
  latitude!: number;

  @Min(-180)
  @Min(180)
  @Field((_type) => Float)
  longitude!: number;
}

// What about the rest of the house information?
// Call this a house input.
@InputType()
class HouseInput {
  @Field((_type) => String)
  address!: string;

  @Field((_type) => String)
  image!: string;

  @Field((_type) => CoordinatesInput)
  coordinates!: CoordinatesInput;

  @Field((_type) => Int)
  bedrooms!: number;
}

@ObjectType()
class House {
  @Field((_type) => ID)
  id!: number;

  @Field((_type) => String)
  userId!: string;

  @Field((_type) => Float)
  latitude!: number;

  @Field((_type) => Float)
  longitude!: number;

  @Field((_type) => String)
  address!: string;

  @Field((_type) => String)
  image!: string;
  publicId(): string {
    const parts = this.image.split("/");
    return parts[parts.length - 1];
  }
  // image!: string;

  @Field((_type) => Int)
  bedrooms!: number;
}

// Make the mutation that will live inside of this resolver.
@Resolver()
export class HouseResolver {
  @Authorized()
  @Mutation((_returns) => House, { nullable: true })
  // Note that this will access the database so it needs to be asynchronous.
  async createHouse(
    // type-graphql
    // Decorate, variable name, Typescript.
    // Inputs are declared with the use of decorators with type-graphql.
    // We have not yet connected our resolver to the schema. Go to index.ts and add it to the resolvers list.
    @Arg("input") input: HouseInput,
    @Ctx() ctx: AuthorizedContext
  ) {
    return await ctx.prisma.house.create({
      data: {
        // We are passing all of the fields that exist in the database for this.
        userId: ctx.uid,
        image: input.image,
        address: input.address,
        latitude: input.coordinates.latitude,
        longitude: input.coordinates.longitude,
        bedrooms: input.bedrooms,
      },
    });
  }
}
