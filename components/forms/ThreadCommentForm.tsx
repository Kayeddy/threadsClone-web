"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import * as zodValidator from "zod";

import { usePathname, useRouter } from "next/navigation";

import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { ThreadCommentFormValidation } from "@/lib/validations/threadsFormValidation";
import { Input } from "../ui/input";
import Image from "next/image";
import { commentThread } from "@/lib/actions/thread.actions";

interface Props {
  threadId: string;
  currentLoggedInUserImage: string;
  userId: string;
}

export default function ThreadCommentForm({
  threadId,
  currentLoggedInUserImage,
  userId,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const formData = useForm({
    resolver: zodResolver(ThreadCommentFormValidation), // Logic that takes care of the form's submission
    defaultValues: {
      threadComment: "",
      accountId: userId,
    }, // Default values for fields within the form
  });

  const onSubmit = async (
    values: zodValidator.infer<typeof ThreadCommentFormValidation>
  ) => {
    //e.preventDefault()

    await commentThread({
      CommentText: values.threadComment,
      userId: userId,
      path: pathname,
      threadId: threadId,
    });

    formData.reset();
  };

  return (
    <div>
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
                    src={currentLoggedInUserImage}
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

          <Button type="submit" className="comment-form_btn">
            Reply
          </Button>
        </form>
      </Form>
    </div>
  );
}
