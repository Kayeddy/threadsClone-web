"use client";

import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import * as zodValidator from "zod";

import { usePathname } from "next/navigation";

import { Button } from "../ui/button";
import { ThreadCommentFormValidation } from "@/lib/validations/threadsFormValidation";
import { Input } from "../ui/input";
import Image from "next/image";
import { commentThread } from "@/lib/actions/thread.actions";
import { useState } from "react";

interface Props {
  threadId: string;
  currentLoggedInUserImage: string | undefined;
  userId: string;
}

/**
 * Component for submitting comments on a thread.
 * @param {Props} props The properties passed to the component.
 * @returns {JSX.Element} The ThreadCommentForm component.
 */
export default function ThreadCommentForm({
  threadId,
  currentLoggedInUserImage,
  userId,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false); // State to track form submission status

  const pathname = usePathname();

  const formData = useForm({
    resolver: zodResolver(ThreadCommentFormValidation), // Logic that takes care of the form's submission
    defaultValues: {
      threadComment: "",
      accountId: userId,
    }, // Default values for fields within the form
  });

  /**
   * Handles the form submission for commenting on a thread.
   * Prevents multiple submissions by disabling the submit button while processing.
   * @param {zodValidator.infer<typeof ThreadCommentFormValidation>} values - The form values.
   */
  const onSubmit = async (values: any) => {
    setIsSubmitting(true); // Disable submit button to prevent multiple submissions
    try {
      await commentThread({
        CommentText: values.threadComment,
        userId,
        path: pathname,
        threadId,
      });
    } finally {
      formData.reset(); // Reset form fields after submission
      setIsSubmitting(false); // Re-enable submit button after processing is complete
    }
  };

  return (
    <div className="w-full">
      <Form {...formData}>
        <form
          onSubmit={formData.handleSubmit(onSubmit)}
          className="comment-form"
        >
          <FormField
            control={formData.control}
            name="threadComment"
            render={({ field }) => (
              <FormItem className="flex items-center gap-3 w-full">
                <FormLabel>
                  <Image
                    src={
                      currentLoggedInUserImage ? currentLoggedInUserImage : ""
                    }
                    alt="commenting-user-profile-image"
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                </FormLabel>
                <FormControl className="border-none bg-transparent">
                  <Input
                    type="text"
                    placeholder="Comment..."
                    className="no-focus text-light-1 outline-none"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="ml-auto bg-primary-500 rounded-lg"
          >
            {isSubmitting ? "Replying..." : "Reply"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
