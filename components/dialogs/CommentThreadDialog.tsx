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

interface Props {
  triggerImage: React.ReactNode;
  authorData: {
    name: string;
    image: string;
  };
  threadData: {
    id: string;
    content: string;
    comments?: any[];
  };
}

export default function CommentThreadDialog({
  triggerImage,
  authorData,
  threadData,
}: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>{triggerImage}</DialogTrigger>
      <DialogContent className="sm:max-w-md bg-dark-2 text-white sm:max-h-52">
        <DialogHeader>
          <DialogTitle className="text-light-1">Share Thread</DialogTitle>
          <DialogDescription className="text-light-2"></DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              className="text-black"
              id="link"
              defaultValue={""}
              readOnly
            />
          </div>
          <Button type="submit" size="sm" className="px-3" onClick={() => {}}>
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
