"use client";
import { CopyIcon, CheckIcon } from "@radix-ui/react-icons";

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
import { useState } from "react";

export default function ShareThreadDialog({
  triggerImage,
  threadId,
}: {
  triggerImage: React.ReactNode;
  threadId: string;
}) {
  const [linkCopied, setLinkCopied] = useState(false);
  const pathname = typeof window !== "undefined" ? window.location.href : "";
  const threadLink = `${pathname}thread/${threadId}`;

  // Function to handle link copy
  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(threadLink)
      .then(() => {
        setLinkCopied(true);
        setTimeout(() => {
          setLinkCopied(false); // Reset after 3 seconds
        }, 3000);
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
      });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{triggerImage}</DialogTrigger>
      <DialogContent className="max-w-[90%] sm:max-w-md bg-dark-2 text-white">
        <DialogHeader>
          <DialogTitle className="text-light-1">Share Thread</DialogTitle>
          <DialogDescription className="text-light-2">
            Anyone who has this link will be able to view your Thread.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              className="text-black"
              id="link"
              defaultValue={threadLink}
              readOnly
            />
          </div>
          <Button
            type="submit"
            size="sm"
            className="px-3"
            onClick={handleCopyLink}
          >
            <span className="sr-only">Copy</span>
            {linkCopied ? (
              <CheckIcon className="h-4 w-4" />
            ) : (
              <CopyIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
