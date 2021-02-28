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
  // We want some preview image state.
  const [previewImage, setPreviewImage] = useState<string>();
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
  const handleCreate = async (data: IFormData) => {
    console.log({ data });
  };

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
        {errors.address && (
          <p style={{ color: "#ff6060" }}>{errors.address.message}</p>
        )}
      </div>

      {address && (
        <>
          <div className="mt-4">
            <label
              htmlFor="image"
              className="p-4 border-dashed border-4 border-gray-600 block cursor-pointer"
            >
              Click to add image (16:9)
            </label>
            {/* The input functionality here is sort of added behind the scenes, label allows interactivity to it as well, just hide what input renders. */}
            <input
              id="image"
              name="image"
              type="file"
              accept="images/*"
              style={{ display: "none" }}
              ref={register({
                validate: (fileList: FileList) => {
                  if (fileList.length === 1) return true;
                  return "Please upload one file";
                },
              })}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                // Use optional chaining to stop failure if one of the objects or fields here is null.
                // Note that optional chaining messes badly with the syntax of lists in javascript, you need to use a dot and square brackets to access elements now.
                if (event?.target?.files?.[0]) {
                  const file = event.target.files[0];
                  const reader = new FileReader();
                  // Takes in a blob type.
                  reader.readAsDataURL(file);
                  reader.onloadend = () => {
                    setPreviewImage(reader.result as string);
                  };
                }
              }}
            />

            {previewImage && (
              <img
                src={previewImage}
                className="mt-4 object-cover"
                // a dynamic 9 by 16 aspect ratio styled
                style={{ width: "576px", height: `${(9 / 16) * 576}px` }}
              />
            )}
          </div>
          {errors.image && (
            <p style={{ color: "#ff6060" }}>{errors.image.message}</p>
          )}
          <div className="mt-4">
            <label htmlFor="bedrooms" className="block">
              Beds
            </label>
            <input
              id="bedrooms"
              name="bedrooms"
              type="number"
              className="p-2"
              ref={register({
                required: "Please enter the number of bedrooms",
                max: { value: 10, message: "Wooah, too big of a house!" },
                min: { value: 1, message: "Must have at least 1 bedroom!" },
              })}
            />
            {/* This works because of our dependence on refs. */}
            {errors.bedrooms && (
              <p style={{ color: "#ff6060" }}>{errors.bedrooms.message}</p>
            )}
          </div>

          <div className="mt-4">
            <button
              className="bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded"
              style={{ marginRight: "20px" }}
              type="submit"
              disabled={submitting}
            >
              Save
            </button>
            {/* Sends us back to the homepage. */}
            <Link href="/">
              <a>Cancel</a>
            </Link>
          </div>
        </>
      )}
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
