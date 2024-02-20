"use client";
import { createThread, deleteThread } from "@/lib/actions/thread.actions";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

interface Props {
  triggerImage: React.ReactNode;
  threadId: string;
}

export default function DeleteThreadDialog({ triggerImage, threadId }: Props) {
  const [threadDeleted, setThreadDeleted] = useState(false);
  const [loadingThreadDeletion, setLoadingThreadDeletion] = useState(false);
  const pathname = usePathname();

  const handleThreadDeletion = async () => {
    setLoadingThreadDeletion(true);
    const deleteThreadResponse = await deleteThread(threadId, pathname);
    setLoadingThreadDeletion(false);
    setThreadDeleted(true);
  };

  const handleDialogReset = () => {
    setLoadingThreadDeletion(false);
    setThreadDeleted(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{triggerImage}</DialogTrigger>
      <DialogContent className="max-w-[90%] sm:max-w-md bg-dark-2 text-white">
        <DialogHeader>
          <DialogTitle className="text-light-1">
            {!threadDeleted ? "Delete Thread" : "Thread deleted succesfully"}
          </DialogTitle>
          {!threadDeleted ? (
            <DialogDescription className="text-light-2">
              Are you sure you want to delete this Thread? This action cannot be
              undone.
            </DialogDescription>
          ) : (
            <div className="w-[90%] h-full items-center justify-center">
              <CheckIcon className="h-14 w-14" />
            </div>
          )}
        </DialogHeader>
        <DialogFooter className="sm:justify-start flex flex-row w-full items-center justify-around">
          <DialogClose asChild>
            {!loadingThreadDeletion && (
              <Button
                type="button"
                variant="secondary"
                className={` ${loadingThreadDeletion && "cursor-not-allowed"}`}
                onClick={handleDialogReset}
              >
                {`${!threadDeleted ? "Cancel" : "Go back"}`}
              </Button>
            )}
          </DialogClose>
          {!threadDeleted ? (
            <Button
              type="button"
              variant="secondary"
              onClick={!loadingThreadDeletion ? handleThreadDeletion : () => {}}
              className={`bg-red-300 hover:bg-red-400 ${
                loadingThreadDeletion && "cursor-not-allowed"
              }`}
            >
              Delete Thread
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
