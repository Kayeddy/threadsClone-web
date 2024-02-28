"use client";

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
 * Form component for posting a new thread.
 *
 * @param {object} props Component props
 * @param {string} props.userId Current user's ID
 */
function PostThreadForm({ userId }: { userId: string }) {
  const [postingThread, setPostingThread] = useState(false);
  const { startUpload } = useUploadThing("media");

  const router = useRouter();
  const pathname = usePathname();
  const { organization } = useOrganization();

  const formData = useForm({
    resolver: zodResolver(ThreadFormValidation), // Logic that takes care of the form's submission
    defaultValues: {
      thread: "",
      accountId: userId,
    }, // Default values for fields within the form
  });

  /**
   * Handles the form submission.
   *
   * @param {object} values Form values
   */
  const onSubmit = async (values: any) => {
    setPostingThread(true); // Block button to prevent multiple submissions
    try {
      const threadCommunityId = organization?.id || null;
      await createThread({
        threadContent: values.thread,
        threadAuthor: userId,
        threadCommunity: threadCommunityId,
        path: pathname,
        likes: [],
      });
    } catch (error) {
      console.error("Failed to post thread:", error);
    } finally {
      router.push("/"); // Navigate to home after successful thread creation
      setPostingThread(false); // Unblock button after process is completed
    }
  };

  return (
    <div>
      <Form {...formData}>
        <form
          onSubmit={formData.handleSubmit(onSubmit)}
          className="flex flex-col justify-start gap-10 mt-10"
        >
          <FormField
            control={formData.control}
            name="thread"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 w-full">
                <FormLabel className="text-base-semibold text-light-2 ">
                  Thread content
                </FormLabel>
                <FormControl className="border border-dark-4 bg-dark-3 text-light-1 no-focus">
                  <Textarea rows={15} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="bg-primary-500"
            disabled={postingThread}
          >
            {postingThread ? "Posting..." : "Post thread"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default PostThreadForm;
