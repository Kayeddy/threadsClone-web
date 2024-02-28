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
import { useState, useEffect } from "react";

/**
 * Component to display a dialog for sharing a thread via a link.
 *
 * @param {object} props Component props
 * @param {React.ReactNode} props.triggerImage Element to trigger the dialog.
 * @param {string} props.threadId ID of the thread to share.
 */
export default function ShareThreadDialog({
  triggerImage,
  threadId,
}: {
  triggerImage: React.ReactNode;
  threadId: string;
}) {
  const [linkCopied, setLinkCopied] = useState(false); // State to track if link is copied
  const [dialogOpen, setDialogOpen] = useState(false); // State to track dialog visibility
  const pathname = typeof window !== "undefined" ? window.location.href : ""; // Dynamically get the current URL
  const threadLink = `${pathname}thread/${threadId}`; // Construct the link to the thread

  /**
   * Function to copy the thread link to clipboard.
   */
  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(threadLink)
      .then(() => {
        setLinkCopied(true); // Indicate that link is copied
        // Optionally reset linkCopied after a delay
        // setTimeout(() => setLinkCopied(false), 3000);
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
      });
  };

  /**
   * Effect to reset linkCopied state when dialog is opened.
   */
  useEffect(() => {
    if (dialogOpen) {
      setLinkCopied(false); // Reset link copied state
    }
  }, [dialogOpen]); // Depend on dialogOpen state

  return (
    <Dialog onOpenChange={setDialogOpen}>
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
