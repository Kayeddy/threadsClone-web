"use client";

import { ChangeEvent, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useUploadThing } from "@/lib/uploadThing";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

import * as zodValidator from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userFormDataValidation } from "@/lib/validations/userFormDataValidation";
import { Button } from "../ui/button";
import Image from "next/image";
import { Textarea } from "../ui/textarea";
import { isBase64Image } from "@/lib/utils";
import { updateUser } from "@/lib/actions/user.actions";

interface Props {
  currentUserData: {
    userId: string;
    objectId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
  };
  buttonTitle: string;
}

/**
 * A form component for updating the account profile of a user.
 * It allows for updating the user's name, username, bio, and profile image.
 *
 * @param {Props} props - The props for the AccountProfileForm component.
 * @returns {JSX.Element} The AccountProfileForm component.
 */
const AccountProfileForm = ({ currentUserData }: Props) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { startUpload } = useUploadThing("media");

  const router = useRouter();
  const pathname = usePathname();

  // Setup form handling with react-hook-form and Zod schema validation
  const formData = useForm({
    resolver: zodResolver(userFormDataValidation), // Logic that takes care of the form's submission
    defaultValues: {
      userProfileImage: currentUserData?.image || "",
      name: currentUserData?.name || "",
      username: currentUserData?.username || "",
      bio: currentUserData?.bio || "",
    }, // Default values for fields within the form
  });

  /**
   * Handles the uploading of a profile image, converting it to a Base64 URL.
   * Sets the file to the local state and updates the form value.
   *
   * @param {ChangeEvent<HTMLInputElement>} e - The event triggered on file input change.
   * @param {Function} fieldChange - Function to update the form field value.
   */
  const handleProfileImageUpload = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();

    const fileReader = new FileReader();
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      setFiles(Array.from(e.target.files));

      if (!file.type.includes("image")) return;

      fileReader.onload = async (e) => {
        const imageUrl = e.target?.result?.toString() || "";

        fieldChange(imageUrl);
      };

      fileReader.readAsDataURL(file);
    }
  };

  /**
   * Handles the profile image submission, uploading it if it's a new image.
   *
   * @param {any} values - The form values including the potentially new profile image.
   */
  const handleProfileImageSubmission = async (
    values: zodValidator.infer<typeof userFormDataValidation>
  ) => {
    const blob = values.userProfileImage;
    const hasImageChanged = isBase64Image(blob);

    if (hasImageChanged) {
      const imageUploadResponse = await startUpload(files);

      if (imageUploadResponse && imageUploadResponse[0].url) {
        values.userProfileImage = imageUploadResponse[0].url;
      }
    }
  };

  /**
   * The onSubmit function for the form. It handles image submission,
   * updates the user profile, and navigates accordingly.
   *
   * @param {zodValidator.infer<typeof userFormDataValidation>} values - The validated form values.
   */
  const onSubmit = async (
    values: zodValidator.infer<typeof userFormDataValidation>
  ) => {
    setIsSubmitting(true); // Prevent further submissions during processing.
    await handleProfileImageSubmission(values);

    await updateUser({
      username: values.username,
      name: values.name,
      bio: values.bio,
      image: values.userProfileImage,
      userId: currentUserData.userId,
      path: pathname,
    });

    setIsSubmitting(false); // Re-enable the submit button after processing
    if (pathname === "/profile/edit") {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="">
      <Form {...formData}>
        <form
          onSubmit={formData.handleSubmit(onSubmit)}
          className="flex flex-col justify-start gap-10"
        >
          {/* User profile image upload field */}
          <FormField
            control={formData.control}
            name="userProfileImage"
            render={({ field }) => (
              <FormItem className="flex items-center gap-4">
                <FormLabel className="account-form_image-label cursor-pointer">
                  {field.value ? (
                    <Image
                      src={field.value}
                      alt="Profile_image"
                      width={96}
                      height={96}
                      priority
                      className="rounded-full object-contain max-h-[100px]"
                    />
                  ) : (
                    <Image
                      src="assets/profile.svg"
                      alt="Profile_image"
                      width={32}
                      height={32}
                      className="rounded-full object-contain"
                    />
                  )}
                </FormLabel>
                <FormControl className="flex-1 text-base-semibold text-gray-200">
                  <Input
                    type="file"
                    accept="image/*"
                    placeholder="Upload_profile_image_input"
                    className="account-form_image-input"
                    onChange={(e) =>
                      handleProfileImageUpload(e, field.onChange)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* User name field */}
          <FormField
            control={formData.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 w-full">
                <FormLabel className="text-base-semibold text-light-2 ">
                  Name
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="account-form_input no-focus"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* User username field */}
          <FormField
            control={formData.control}
            name="username"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 w-full">
                <FormLabel className="text-base-semibold text-light-2">
                  Username
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="account-form_input no-focus"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* User Bio field */}
          <FormField
            control={formData.control}
            name="bio"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 w-full">
                <FormLabel className="text-base-semibold text-light-2">
                  Bio
                </FormLabel>
                <FormControl className="flex-1 text-base-semibold text-gray-200">
                  <Textarea
                    rows={10}
                    className="account-form_input no-focus"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="bg-primary-500"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AccountProfileForm;
