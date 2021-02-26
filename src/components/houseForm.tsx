import { useState, useEffect, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { useMutation, gql } from "@apollo/client";
import { useRouter } from "next/router";
import Link from "next/link";
import { Image } from "cloudinary-react";
import { SearchBox } from "./searchBox";
// import {
//   CreateHouseMutation,
//   CreateHouseMutationVariables,
// } from "src/generated/CreateHouseMutation";
// import {
//   UpdateHouseMutation,
//   UpdateHouseMutationVariables,
// } from "src/generated/UpdateHouseMutation";
// import { CreateSignatureMutation } from "src/generated/CreateSignatureMutation";

interface IFormData {
  address: string;
  latitude: number;
  longitude: number;
  bedrooms: string;
  image: FileList;
}

interface IProps {}

export default function HouseForm({}: IProps) {
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, setValue, errors, watch } = useForm<
    IFormData
  >({ defaultValues: {} });

  const address = watch("address");

  useEffect(() => {
    register({ name: "address" }, { required: "Please enter your address" });
    register({ name: "latitude" }, { required: true, min: -90, max: 90 });
    register({ name: "longitude" }, { required: true, min: -180, max: 180 });
  }, [register]);

  // Note that handleSubmit does not know what to even do with the submission, we must instruct it how.
  const onSubmit = (data: IFormData) => {
    setSubmitting(true);
    // Creation of a house.
    handleCreate(data);
  };

  // onSubmit means it is successful, you cna use an onError for the second argument of handleSubmit to manage an error.

  const handleCreate = async (data: IFormData) => {};

  return (
    // We need to pass in a function into handleSubmit so handleSubmit actually knows what to even do with the form it is given with the onClick.
    <form className="mx-auto max-w-xl py-4" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl">Add a New House</h1>
      <div className="mt-4">
        <label htmlFor="search" className="block">
          Search for your address
        </label>
        <SearchBox
          onSelectAddress={(address, latitude, longitude) => {
            setValue("address", address);
            setValue("latitude", latitude);
            setValue("longitude", longitude);
          }}
          defaultValue=""
        />
        {errors.address && <p>{errors.address.message}</p>}
        {/* Display the selected address */}
        <h2>{address}</h2>
      </div>
    </form>
  );
}

/*
Note that you can use typescript check with: yarn tsc, to be certain that VSCode isn't missing any TypeScript error messages.

What is register with react hook form?
https://react-hook-form.com/api#register

required, boolean, if a value is required before submission.
maxLength: max length of value.
minLength
max, maximum value.
min
pattern, a regex that must be present on the input value.

validate, can pass either one callback function or many callback functions to ensure that your input is valid.
To pass many callback functions is odd, rather than a list of callback functions the author decided to make it fields.
You can use the field keys to name each callback function meaningfully, whereas a list would not be able to do this.

valueAsDate, text input only, returns a Date string.
setValueAs, return input value by running through the function.
*/
