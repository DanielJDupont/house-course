import { useState } from "react";
import Link from "next/link";
import ReactMapGL, { Marker, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface House {
  id: string;
  latitude: number;
  longitude: number;
}

const SingleMap: React.FC<{ house: House }> = ({ house }) => {
  const [viewport, setViewport] = useState({
    latitude: house.latitude,
    longitude: house.longitude,
    zoom: 13,
  });

  return (
    <div className="text-black">
      <ReactMapGL
        {...viewport}
        width="100%"
        height="calc(100vh - 64px)"
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
        mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN}
        mapStyle="mapbox://styles/leighhalliday/ckhjaksxg0x2v19s1ovps41ef"
        minZoom={8}
      >
        <div className="absolute top-0 left-0 p-4">
          <NavigationControl showCompass={false} />
        </div>

        {/* Adds the current location of this house to the mapbox map. */}
        {/* I had an error because I did not put Navigation Control and Marker as childrne of ReactMapGL. */}
        <Marker
          latitude={house.latitude}
          longitude={house.longitude}
          offsetLeft={-15}
          offsetTop={-15}
        >
          <button
            type="button"
            // Shrinks the button slightly.
            style={{ width: "30px", height: "30px", fontSize: "30px" }}
          >
            <img src="/home-color.svg" className="w-8" alt="select house" />
          </button>
        </Marker>
      </ReactMapGL>
    </div>
  );
};

export default SingleMap;
