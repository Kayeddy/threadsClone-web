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

//import { updateThread } from "@/lib/actions/user.actions";

function PostThreadForm({ userId }: { userId: string }) {
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

  const onSubmit = async (
    values: zodValidator.infer<typeof ThreadFormValidation>
  ) => {
    const threadCommunityId = !organization ? null : organization?.id;

    await createThread({
      threadContent: values.thread,
      threadAuthor: userId,
      threadCommunity: threadCommunityId,
      path: pathname,
      likes: [],
    });

    router.push("/");
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

          <Button type="submit" className="bg-primary-500">
            Post thread
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default PostThreadForm;
