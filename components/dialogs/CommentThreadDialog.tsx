import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

/**
 * Displays a dialog containing a thread of comments.
 *
 * @param {Props} props - The properties passed to the component.
 * @returns {JSX.Element} A dialog component populated with thread and comments data.
 */
export default function CommentThreadDialog({
  triggerImage,
  parentThread,
  comments,
  currentUserId,
  currentUserImage,
}: Props) {
  // Profile link - navigates to current user's profile if the thread is by them, otherwise to the thread author's profile.
  const profileLink =
    currentUserId === parentThread.userId
      ? "/profile"
      : `/profile/${parentThread.userId}`;

  return (
    <Dialog>
      <DialogTrigger asChild>{triggerImage}</DialogTrigger>
      <DialogContent className="max-w-[90vw] h-fit max-h-[570px] sm:max-w-xl bg-dark-3 text-white overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex flex-col items-start w-full">
            <Link
              href={profileLink}
              className="relative h-10 w-fit hover:scale-110 transition-all duration-300 ease-in-out flex flex-row items-center justify-start gap-4"
            >
              <Image
                src={parentThread.authorImage}
                alt="Author profile image"
                width={24}
                height={24}
                className="cursor-pointer object-contain"
              />
              <span className="text-base-semibold">
                {currentUserId === parentThread.userId
                  ? "You"
                  : parentThread.authorName}
              </span>
            </Link>
            <span className="mt-2 text-base-regular whitespace-pre-line break-all">
              {parentThread.content}
            </span>
          </DialogTitle>
          <DialogDescription className="custom-scrollbar overflow-y-scroll h-[350px] py-4">
            {comments.length > 0 ? (
              <DynamicCommentsTab
                //@ts-ignore
                commentsList={comments}
                currentUserId={currentUserId || ""}
                parentThreadId={parentThread.id}
              />
            ) : (
              <p className="no-result">No comments available</p>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <ThreadCommentForm
            threadId={parentThread.id}
            currentLoggedInUserImage={currentUserImage}
            userId={currentUserId || ""}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
