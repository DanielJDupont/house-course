import { useRouter } from "next/router";
import { Image } from "cloudinary-react";
import { useQuery, gql } from "@apollo/client";
import Layout from "src/components/layout";
// import HouseNav from "src/components/houseNav";
// import SingleMap from "src/components/singleMap";
import {
  ShowHouseQuery,
  ShowHouseQueryVariables,
} from "src/generated/ShowHouseQuery";

const SHOW_HOUSE_QUERY = gql`
  query ShowHouseQuery($id: String!) {
    house(id: $id) {
      id
      userId
      address
      publicId
      bedrooms
      latitude
      longitude
    }
  }
`;

export default function ShowHouse() {
  const {
    query: { id },
  } = useRouter();

  // Next.js generates this page statically, upon the first visit, the router will not be initialized, upon the re-render it will then show the id.
  if (!id) return null;

  // We know for sure id will just be one string, not an array.
  // TypeGraphQL uses uppercase for types, TypeScript uses lowercase.
  return <HouseData id={id as string} />;
}

const HouseData = ({ id }: { id: string }) => {
  const { data, loading } = useQuery<ShowHouseQuery>(SHOW_HOUSE_QUERY, {
    variables: { id },
  });

  if (loading || !data) return <Layout main={<div>Loading ...</div>} />;
  if (!data.house)
    return <Layout main={<div>Unable to load house {id}</div>} />;

  const { house } = data;
  return (
    <Layout
      main={
        <div>
          {/* <pre>{JSON.stringify(house, null, 2)}</pre> */}
          <div className="sm:w-full md:w-1/2 p-4">
            <h1 className="text-3xl my-2">{house.address}</h1>
            <div className="sm:w-full md:w-1/2">SingleMap</div>
            <Image
              className="pb-2"
              cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
              publicId={house.publicId}
              alt={house.address}
              secure
              // Something to do with pixel depth.
              dpr="auto"
              quality="auto"
              width={900}
              // Maintain an aspect ratio of 9 by 16.
              height={Math.floor((9 / 16) * 900)}
              crop="fill"
              // When cropped, it will try to focus on what part of the image is the most interesting.
              gravity="auto"
            />
          </div>
          <p>{house.bedrooms} Bedroom House</p>
        </div>
      }
    />
  );
};

// Note that id is created dynamically.
// Note that id is a dynamic placeholder.
