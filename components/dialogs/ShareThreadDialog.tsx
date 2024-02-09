"use client";
import { CopyIcon } from "@radix-ui/react-icons";

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
import { useRouter } from "next/router";

export default function ShareThreadDialog({
  triggerImage,
  threadId,
}: {
  triggerImage: React.ReactNode;
  threadId: string;
}) {
  const pathname = window.location.href;
  const threadLink = `${pathname}thread/${threadId}`;
  return (
    <Dialog>
      <DialogTrigger asChild>{triggerImage}</DialogTrigger>
      <DialogContent className="sm:max-w-md bg-dark-2 text-white">
        <DialogHeader>
          <DialogTitle className="text-light-1">Share Thread</DialogTitle>
          <DialogDescription className="text-light-2">
            Anyone who has this link will be able to view this.
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
            onClick={() => navigator.clipboard.writeText(threadLink)}
          >
            <span className="sr-only">Copy</span>
            <CopyIcon className="h-4 w-4" />
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
