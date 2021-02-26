import { useRef, useState } from "react";
import Link from "next/link";
import { Image } from "cloudinary-react";
import ReactMapGL, { Marker, Popup, ViewState } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
// import { useLocalState } from "src/utils/useLocalState";
// import { HousesQuery_houses } from "src/generated/HousesQuery";
// import { SearchBox } from "./searchBox";

interface IProps {}

const Map: React.FC<IProps> = () => {
  const mapRef = useRef<ReactMapGL | null>(null);
  const [viewport, setViewport] = useState<ViewState>({
    latitude: 43,
    longitude: -79,
    zoom: 10,
  });

  return (
    <div className="text-black relative">
      <ReactMapGL
        {...viewport}
        width="100%"
        height="calc(100vh - 64px)"
        mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN}
        // onViewPortChange allows for dragging and zooming.
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
        // I think the ref allows you to use functions inside of ReactMapGL.
        ref={(instance) => (mapRef.current = instance)}
        // Prevent the user from zooming in to uselessly tiny levels.
        minZoom={5}
        // Prevent the user from loading the whole world's worth of data.
        maxZoom={15}
        mapStyle="mapbox://styles/leighhalliday/ckhjaksxg0x2v19s1ovps41ef"
      ></ReactMapGL>
    </div>
  );
};

export default Map;
