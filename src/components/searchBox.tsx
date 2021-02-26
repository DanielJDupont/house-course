import { ChangeEvent } from "react";
import { FunctionComponent } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { useGoogleMapsScript, Libraries } from "use-google-maps-script";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";

interface ISearchBoxProps {
  onSelectAddress: (
    address: string,
    latitude: number | null,
    longitude: number | null
  ) => void;
  defaultValue: string;
}

// Declare what libraries do you want, places, maps...
const libraries: Libraries = ["places"];

export const SearchBox = ({
  onSelectAddress,
  defaultValue,
}: ISearchBoxProps) => {
  const { isLoaded, loadError } = useGoogleMapsScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
    libraries,
  });

  if (!isLoaded) return null;
  if (loadError) return <div>Error Loading</div>;

  return (
    <ReadySearchBox
      onSelectAddress={onSelectAddress}
      defaultValue={defaultValue}
    />
  );
};

const ReadySearchBox = ({ onSelectAddress, defaultValue }: ISearchBoxProps) => {
  // The debounce will save you very large amounts of money in stopping API request spam.
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({ debounce: 300 });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    // If the user passes in no information, then clear the address and all of its information.
    if (e.target.value === "") onSelectAddress("", null, null);
  };

  const handleSelect = async (address: string) => {
    // False is passed here because we do not need to fetch additional data, we already have all of our data.
    setValue(address, false);

    // You have already selected a suggestion, no reason to keep showing them.
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      onSelectAddress(address, lat, lng);
    } catch (error) {
      console.error("😱 Error: ", error);
    }
  };

  // console.log({ status, data });

  return (
    <Combobox onSelect={handleSelect}>
      <ComboboxInput
        id="search"
        value={value}
        onChange={handleChange}
        disabled={!ready}
        placeholder="Search your location"
        className="w-full p-2"
        // There is no autocomplete, the suggestion of autocomplete comes from the browser, which is not how it is implemented in ComboboxInput.
        autoComplete="off"
      />
      {/* We need a popover to view the suggested options. */}
      <ComboboxPopover>
        <ComboboxList>
          {status === "OK" &&
            data.map(({ place_id, description }) => (
              <ComboboxOption key={place_id} value={description} />
            ))}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  );
};

/*
Note that hot reloading does not play well with things like firebase, as firebase is an external script, whatever that means.
*/
