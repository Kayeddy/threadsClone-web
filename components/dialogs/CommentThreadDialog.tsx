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
import { fetchAllComments } from "@/lib/actions/thread.actions";
import DynamicCommentsTab from "../tabs/DynamicCommentsTab";
import Image from "next/image";
import ThreadCommentForm from "../forms/ThreadCommentForm";
import Link from "next/link";

interface Props {
  triggerImage: React.ReactNode;
  parentThread: {
    id: string;
    userId: string;
    authorName: string;
    authorImage: string;
    content: string;
  };
  comments: {}[];
  currentUserId: string | null;
  currentUserImage: string | undefined;
}

export default function CommentThreadDialog({
  triggerImage,
  parentThread,
  comments,
  currentUserId,
  currentUserImage,
}: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>{triggerImage}</DialogTrigger>
      <DialogContent className="max-w-[90vw] h-fit max-h-[570px] sm:max-w-xl bg-dark-3 text-white overflow-hidden flex flex-col">
        <DialogHeader className="flex flex-col">
          <DialogTitle className="text-light-1">
            <div className="flex flex-col items-start">
              <Link
                href={`${
                  currentUserId === parentThread.userId
                    ? "/profile"
                    : `/${parentThread.userId}`
                }`}
                className="relative h-10 w-11 hover:scale-110 transition-all duration-300 ease-in-out hover:brightness-200 flex flex-row items-center justify-start gap-4"
              >
                <Image
                  src={parentThread.authorImage}
                  alt="Thread_author_image"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain "
                ></Image>

                <span className="text-base-semibold text-light-1">
                  {currentUserId === parentThread.userId
                    ? "You"
                    : parentThread.authorName}
                </span>
              </Link>

              <p className="mt-2 text-base-regular text-light-2 whitespace-pre-line break-all">
                {parentThread.content}
              </p>
            </div>
          </DialogTitle>
          <DialogDescription className="text-light-2 custom-scrollbar overflow-y-scroll h-[350px] py-4 transition-all duration-200 ease-in-out">
            {comments.length > 0 ? (
              <DynamicCommentsTab
                commentsList={comments}
                currentUserId={currentUserId ? currentUserId : ""}
                parentThreadId={parentThread.id}
              />
            ) : (
              <p className="no-result">No comments available</p>
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-start">
          <ThreadCommentForm
            threadId={parentThread.id}
            currentLoggedInUserImage={currentUserImage}
            userId={currentUserId ? currentUserId : ""}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
