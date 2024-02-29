"use client";
import { deleteThread } from "@/lib/actions/thread.actions";
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

import { useState, useEffect } from "react";

interface Props {
  triggerImage: React.ReactNode;
  threadId: string;
  isComment?: boolean;
}

/**
 * A dialog for confirming the deletion of a thread or comment.
 *
 * @param {Props} props The component props.
 */
export default function DeleteThreadDialog({
  triggerImage,
  threadId,
  isComment = false,
}: Props) {
  const [threadDeleted, setThreadDeleted] = useState(false);
  const [loadingThreadDeletion, setLoadingThreadDeletion] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false); // Track dialog visibility
  const pathname = usePathname();

  /**
   * Handles the deletion of the thread or comment.
   */
  const handleThreadDeletion = async () => {
    setLoadingThreadDeletion(true);
    await deleteThread(threadId, pathname);
    setLoadingThreadDeletion(false);
    setThreadDeleted(true);
  };

  // Effect to reset state when dialog is opened
  useEffect(() => {
    if (dialogOpen) {
      setThreadDeleted(false);
      setLoadingThreadDeletion(false);
    }
  }, [dialogOpen]);

  return (
    <Dialog onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>{triggerImage}</DialogTrigger>
      <DialogContent className="max-w-[90%] sm:max-w-md bg-dark-2 text-white flex flex-col items-center justify-center">
        <DialogHeader>
          <DialogTitle>
            {threadDeleted ? "Thread deleted successfully" : "Delete Thread"}
          </DialogTitle>
          <DialogDescription>
            {threadDeleted ? (
              <CheckIcon className="h-14 w-14 m-auto" />
            ) : (
              `Are you sure you want to delete this ${
                isComment ? "comment" : "thread"
              }? This action cannot be undone.`
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex w-full justify-around">
          <DialogClose asChild>
            <Button variant="secondary" disabled={loadingThreadDeletion}>
              {threadDeleted ? "Go back" : "Cancel"}
            </Button>
          </DialogClose>
          {!threadDeleted && (
            <Button
              variant="secondary"
              className="hover:bg-red-300"
              onClick={handleThreadDeletion}
              disabled={loadingThreadDeletion}
            >
              Delete {isComment ? "comment" : "Thread"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
