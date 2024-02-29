"use client";
import { createThread } from "@/lib/actions/thread.actions";
import { usePathname } from "next/navigation";
import { CheckIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";

interface Props {
  triggerImage: React.ReactNode;
  currentUserId: string | null;
  threadContent: string;
}
/**
 * A dialog for confirming the repost of a thread.
 *
 * @param {Props} props The component props.
 */
export default function RepostThreadDialog({
  triggerImage,
  currentUserId,
  threadContent,
}: Props) {
  const [threadReposted, setThreadReposted] = useState(false);
  const [loadingThreadRepost, setLoadingThreadRepost] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false); // State to track dialog visibility
  const pathname = usePathname();

  const handleThreadRepost = async () => {
    setLoadingThreadRepost(true);
    await createThread({
      threadContent,
      threadAuthor: currentUserId || "",
      threadCommunity: null,
      tags: null,
      path: pathname,
    });
    setLoadingThreadRepost(false);
    setThreadReposted(true);
  };

  // Effect to reset state when dialog is opened
  useEffect(() => {
    if (dialogOpen) {
      setThreadReposted(false);
      setLoadingThreadRepost(false);
    }
  }, [dialogOpen]);

  return (
    <Dialog onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>{triggerImage}</DialogTrigger>
      <DialogContent className="max-w-[90%] sm:max-w-md bg-dark-2 text-white flex flex-col items-center justify-center">
        <DialogHeader>
          <DialogTitle>
            {threadReposted ? "Thread reposted successfully!" : "Repost Thread"}
          </DialogTitle>
          <DialogDescription>
            {threadReposted ? (
              <CheckIcon className="h-14 w-14 mx-auto" />
            ) : (
              "Are you sure you want to repost this Thread on your profile feed?"
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex w-full justify-around">
          <DialogClose asChild>
            <Button variant="secondary" disabled={loadingThreadRepost}>
              {threadReposted ? "Go Back" : "Cancel"}
            </Button>
          </DialogClose>
          {!threadReposted && (
            <Button
              variant="secondary"
              onClick={handleThreadRepost}
              disabled={loadingThreadRepost}
            >
              Yes, repost
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
