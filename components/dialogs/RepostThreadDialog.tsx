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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

interface Props {
  triggerImage: React.ReactNode;
  currentUserId: string | null;
  threadContent: string;
}
export default function RepostThreadDialog({
  triggerImage,
  currentUserId,
  threadContent,
}: Props) {
  const [threadReposted, setThreadReposted] = useState(false);
  const [loadingThreadRepost, setLoadingThreadRepost] = useState(false);
  const pathname = usePathname();

  const handleThreadRepost = async () => {
    setLoadingThreadRepost(true);
    await createThread({
      threadContent: threadContent,
      threadAuthor: currentUserId ? currentUserId : "",
      threadCommunity: null,
      path: pathname,
    });
    setThreadReposted(true);
    setLoadingThreadRepost(false);
  };

  useEffect(() => {
    setLoadingThreadRepost(false);
    setThreadReposted(false);
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>{triggerImage}</DialogTrigger>
      <DialogContent className="max-w-[90%] sm:max-w-md bg-dark-2 text-white">
        <DialogHeader>
          <DialogTitle className="text-light-1">
            {!threadReposted
              ? "Repost Thread"
              : "Thread resposted succesfully!"}
          </DialogTitle>
          {!threadReposted ? (
            <DialogDescription className="text-light-2">
              Are you sure you want to repost this Thread on your profile feed?
            </DialogDescription>
          ) : (
            <div className="w-[90%] h-full items-center justify-center">
              <CheckIcon className="h-14 w-14" />
            </div>
          )}
        </DialogHeader>
        <DialogFooter className="sm:justify-start flex flex-row w-full items-center justify-around">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              className={`${
                !threadReposted ? "bg-red-300 hover:bg-red-400" : ""
              } ${loadingThreadRepost && "cursor-not-allowed"}`}
            >
              {!threadReposted ? "Cancel" : "Go Back"}
            </Button>
          </DialogClose>
          {!threadReposted ? (
            <Button
              type="button"
              variant="secondary"
              onClick={!loadingThreadRepost ? handleThreadRepost : () => {}}
              className={`${loadingThreadRepost && "cursor-not-allowed"}`}
            >
              Yes, repost
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
