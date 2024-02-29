"use client";

import { usePathname, useRouter } from "next/navigation";
import { useUploadThing } from "@/lib/uploadThing";
import { Cross1Icon } from "@radix-ui/react-icons";

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
import CustomUserTagSelector from "../shared/CustomUserTagSelector";
import { updateUserTags } from "@/lib/actions/user.actions";

interface selectedUserProps {
  userId: string;
  username: string;
}
/**
 * Form component for posting a new thread.
 *
 * @param {object} props Component props
 * @param {string} props.userId Current user's ID
 */
function PostThreadForm({
  userId,
  retrievedUserTags,
}: {
  userId: string;
  retrievedUserTags: { _id: string; username: string; image: string }[];
}) {
  const [postingThread, setPostingThread] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<selectedUserProps[]>([]);
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
      const createdThread = await createThread({
        threadContent: values.thread,
        threadAuthor: userId,
        threadCommunity: threadCommunityId,
        path: pathname,
        likes: [],
        tags: selectedUsers.map((user) => user.userId),
      });

      const updateUserTagsParams = {
        userId: userId,
        tags: selectedUsers.map((user) => user.userId),
        threadId: createdThread?._id,
        threadContent: createdThread.threadContent,
      };
      await updateUserTags(updateUserTagsParams);
    } catch (error) {
      console.error("Failed to post thread:", error);
    } finally {
      router.push("/"); // Navigate to home after successful thread creation
      setPostingThread(false); // Unblock button after process is completed
    }
  };

  const handleSelectionChange = (newSelectedUsers: selectedUserProps[]) => {
    // Create a new set to avoid duplicates, using the userId for comparison
    const updatedSelectedUsersSet = new Set([
      ...selectedUsers.map((user) => user.userId),
      ...newSelectedUsers.map((user) => user.userId),
    ]);

    // Filter the userList to include only users whose userId is in the updated set
    const updatedSelectedUsers = retrievedUserTags
      .filter((user) => updatedSelectedUsersSet.has(user._id))
      .map((user) => ({ userId: user._id, username: user.username }));

    setSelectedUsers(updatedSelectedUsers);
  };

  const deleteUserTag = (userId: string) => {
    setSelectedUsers((currentSelectedUsers) =>
      currentSelectedUsers.filter((user) => user.userId !== userId)
    );
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
                  <Textarea rows={5} {...field} className="max-h-[200px]" />
                </FormControl>
                <div className="flex flex-row gap-4">
                  <CustomUserTagSelector
                    userList={retrievedUserTags}
                    selectedUserIds={selectedUsers.map((user) => user.userId)}
                    onSelectionChange={handleSelectionChange}
                  />
                  <div className="flex flex-1 flex-row px-4 gap-4 items-center justify-start bg-glassmorphism rounded-lg">
                    {selectedUsers.map((user) => (
                      <div key={user.userId} className="flex flex-row gap-2">
                        <p className="no-result">@{user.username}</p>
                        <button
                          className="text-white text-[12px] "
                          onClick={() => deleteUserTag(user.userId)}
                        >
                          <Cross1Icon />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
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
