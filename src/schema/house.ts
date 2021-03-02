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

  @Field((_type) => String)
  publicId(): string {
    const parts = this.image.split("/");
    return parts[parts.length - 1];
  }
  // image!: string;

  // The front end cloudinary api wants the public id to display the image, we have no other use of it.
  @Field((_type) => Int)
  bedrooms!: number;

  // Note we have to use this. because of our use of class instances.
  // Get all of the homes within this bounding box.
  /*
      [
        { latitude: 10, longitude: 15 },
        { latitude: 15, longitude: 20 }
      ]
    */
  @Field((_type) => [House])
  async nearby(@Ctx() ctx: Context) {
    const bounds = getBoundsOfDistance(
      {
        latitude: this.latitude,
        longitude: this.longitude,
      },
      10000
    );

    return ctx.prisma.house.findMany({
      where: {
        latitude: { gte: bounds[0].latitude, lte: bounds[1].latitude },
        longitude: { gte: bounds[0].longitude, lte: bounds[1].longitude },
        id: { not: { equals: this.id } },
      },
      // To avoid grabbing a million homes in a city. Pretty sure it is 25 random entries within the bounding box.
      take: 25,
    });
  }
}

// Make the mutation that will live inside of this resolver.
// Note that Resolver has a Query and a Mutation here.
// Note that we name our query and mutation under @Query and @Mutation decorators.
// Note the broken looking syntax, just write the name of the query or mutation followed by parenthesis then a curly bracket body.
// Note that we write async before our query and mutation names because we often want to access the database, which is an asynchronous operation
// which takes a relatively large amount of time, miliseconds or maybe even seconds, compared to microseconds.
@Resolver()
export class HouseResolver {
  // Anyone can load a house, do not need the authorized context.
  @Query((_returns) => House, { nullable: true })
  // Simply calling this query "house"
  async house(@Arg("id") id: string, @Ctx() ctx: Context) {
    return ctx.prisma.house.findOne({ where: { id: parseInt(id) } });
  }

  @Authorized()
  @Mutation((_returns) => House, { nullable: true })
  // Note that this will access the database so it needs to be asynchronous.
  // Simply calling this mutation "createHouse"
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
