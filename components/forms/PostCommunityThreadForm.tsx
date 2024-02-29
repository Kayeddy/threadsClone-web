"use client";

import { usePathname, useRouter } from "next/navigation";

import { useUploadThing } from "@/lib/uploadThing";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";

import * as zodValidator from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ThreadFormValidation } from "@/lib/validations/threadsFormValidation";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { createThread } from "@/lib/actions/thread.actions";
import { useOrganization } from "@clerk/nextjs";
import { useState } from "react";

/**
 * Form for posting threads within a community.
 *
 * @param {{ userId: string, clerkCommunityId: string }} props The component props.
 */
function PostCommunityThreadForm({
  userId,
  clerkCommunityId,
}: {
  userId: string;
  clerkCommunityId: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false); // State to track form submission status

  const { startUpload } = useUploadThing("media");

  const router = useRouter();
  const pathname = usePathname();
  const { organization } = useOrganization();

  const enableFormCondition =
    !organization || !organization.id || clerkCommunityId !== organization?.id;

  const formData = useForm({
    resolver: zodResolver(ThreadFormValidation), // Logic that takes care of the form's submission
    defaultValues: {
      thread: "",
      accountId: userId,
    }, // Default values for fields within the form
    disabled: enableFormCondition,
  });

  /**
   * Handles form submission, creating a new thread.
   * Disables the form during submission to prevent duplicate submissions.
   *
   * @param {object} values The form values.
   */
  const onSubmit = async (values: any) => {
    setIsSubmitting(true); // Disable submit button

    try {
      await createThread({
        threadContent: values.thread,
        threadAuthor: userId,
        threadCommunity: organization?.id || null,
        tags: null,
        path: pathname,
      });

      router.push("/"); // Navigate away after successful submission
    } finally {
      setIsSubmitting(false); // Re-enable submit button
    }
  };

  return (
    <div>
      <Form {...formData}>
        <form
          onSubmit={formData.handleSubmit(onSubmit)}
          className="flex flex-col justify-start gap-2 mt-10"
        >
          <FormField
            control={formData.control}
            name="thread"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 w-full">
                <FormControl className="border border-dark-4 bg-dark-3 text-light-1 no-focus">
                  <Textarea
                    rows={5}
                    {...field}
                    placeholder={
                      enableFormCondition
                        ? "Switch to the corresponding organization profile to post Threads."
                        : "Type your message here..."
                    }
                    className="resize-none disabled:placeholder:text-red-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={enableFormCondition || isSubmitting}
            className="bg-primary-500 w-[150px]"
          >
            {isSubmitting ? "Posting..." : "Post new Thread"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default PostCommunityThreadForm;
