// import { useState } from "react";
import { useQuery, gql } from "@apollo/client";
// import { useDebounce } from "use-debounce";
import Layout from "src/components/layout";
import Map from "src/components/map";
// import HouseList from "src/components/houseList";
// import { useLastData } from "src/utils/useLastData";
// import { useLocalState } from "src/utils/useLocalState";
// import { HousesQuery, HousesQueryVariables } from "src/generated/HousesQuery";

const HELLO_QUERY = gql`
  query HelloQuery {
    hello
  }
`;

const Home = () => {
  // A very simple query, we are not passing in our own parameters into it.
  const { data, loading } = useQuery(HELLO_QUERY);

  return (
    <Layout
      main={
        <div className="flex">
          <div
            className="w-1/2 pb-4"
            style={{ maxHeight: "calc(100vh - 64px)", overflowX: "scroll" }}
          >
            HouseList
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
          <div className="w-1/2">
            <Map />
          </div>
        </div>
      }
    />
  );
};

export default Home;

/*
This is our homepage.

Check the request payload, to see the hello query being sent to the backend.

Note in our Network tab we can see the graphql request itself.
Note all of the tracing information in the payload's extensions.
The data section in the payload is really important.
*/
