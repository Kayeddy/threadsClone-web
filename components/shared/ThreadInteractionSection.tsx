"use client";
import Image from "next/image";
import CommentThreadDialog from "../dialogs/CommentThreadDialog";
import RepostThreadDialog from "../dialogs/RepostThreadDialog";
import ShareThreadDialog from "../dialogs/ShareThreadDialog";
import { toggleLikeThread } from "@/lib/actions/thread.actions";
import { useState, useEffect } from "react";
import DeleteThreadDialog from "../dialogs/DeleteThreadDialog";
import { usePathname } from "next/navigation";
import { Tooltip } from "@nextui-org/tooltip";
import { tooltipVariants } from "@/config/motion";
import { AnimatedTooltip } from "./AnimatedTooltip";

interface Props {
  threadId: string;
  currentUserId: string | null;
  currentUserImage?: string | undefined;
  threadContent?: string;
  threadAuthor: {
    name: string;
    image: string;
    id: string;
  };
  threadComments?: {}[];
  threadLikes?: {}[];
  isComment?: boolean;
}

/**
 * Displays interaction options for a thread, including like, comment, repost, share, and delete.
 *
 * @param {Object} props Component props
 * @param {string} props.threadId Unique identifier for the thread.
 * @param {Object} props.threadAuthor Author of the thread.
 * @param {string} props.threadContent Content of the thread.
 * @param {Array} props.threadComments Array of thread comments.
 * @param {Array} props.threadLikes Array of thread likes.
 * @param {string | null} props.currentUserId Current user's identifier.
 * @param {string} [props.currentUserImage] Current user's image URL.
 * @param {boolean} [props.isComment=false] Flag indicating if the current thread is a comment.
 * @returns {JSX.Element} The ThreadInteractionSection component.
 */
export default function ThreadInteractionSection({
  threadId,
  threadAuthor,
  threadContent,
  threadComments,
  threadLikes,
  currentUserId,
  currentUserImage,
  isComment = false,
}: Props) {
  const [threadLiked, setThreadLiked] = useState(false);
  const pathname = usePathname();

  /**
   * Toggles the like status for the thread.
   */
  const handleThreadLike = async () => {
    const toggleResult = await toggleLikeThread(
      threadId,
      currentUserId || "",
      pathname
    );
    //@ts-ignore
    setThreadLiked(toggleResult.likes?.includes(currentUserId || ""));
  };

  // Effect to set initial like status based on threadLikes array.
  useEffect(() => {
    setThreadLiked(
      threadLikes?.includes(currentUserId ? currentUserId : "guest") ?? false
    );
  }, [threadLikes, currentUserId]);

  return (
    <div className="flex flex-row items-center gap-6">
      <AnimatedTooltip tooltipText="Like">
        <Image
          src={
            threadLiked ? "/assets/heart-filled.svg" : "/assets/heart-gray.svg"
          }
          alt="Like"
          width={24}
          height={24}
          className="cursor-pointer object-contain hover:scale-110 transition-all duration-300 ease-in-out hover:brightness-200"
          onClick={handleThreadLike}
        />
      </AnimatedTooltip>
      {!isComment && (
        <>
          <AnimatedTooltip tooltipText="Comment">
            <CommentThreadDialog
              triggerImage={
                <Image
                  src="/assets/reply.svg"
                  alt="Reply"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain hover:scale-110 transition-all duration-300 ease-in-out hover:brightness-200"
                />
              }
              parentThread={{
                id: threadId,
                userId: threadAuthor.id,
                authorName: threadAuthor.name,
                authorImage: threadAuthor.image,
                content: threadContent || "",
              }}
              comments={threadComments || []}
              currentUserId={currentUserId}
              currentUserImage={currentUserImage}
            />
          </AnimatedTooltip>

          <AnimatedTooltip tooltipText="Repost">
            <RepostThreadDialog
              triggerImage={
                <Image
                  src="/assets/repost.svg"
                  alt="Repost"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain hover:scale-110 transition-all duration-300 ease-in-out hover:brightness-200"
                />
              }
              currentUserId={currentUserId}
              threadContent={threadContent || ""}
            />
          </AnimatedTooltip>

          <AnimatedTooltip tooltipText="Share">
            <ShareThreadDialog
              triggerImage={
                <Image
                  src="/assets/share.svg"
                  alt="Share"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain hover:scale-110 transition-all duration-300 ease-in-out hover:brightness-200"
                />
              }
              threadId={threadId}
            />
          </AnimatedTooltip>
        </>
      )}

      {currentUserId === threadAuthor.id && (
        <AnimatedTooltip tooltipText="Delete">
          <DeleteThreadDialog
            triggerImage={
              <Image
                src="/assets/delete.svg"
                alt="Delete"
                width={16}
                height={16}
                className="cursor-pointer object-contain hover:scale-110 transition-all duration-300 ease-in-out hover:brightness-200"
              />
            }
            threadId={threadId}
            isComment={isComment}
          />
        </AnimatedTooltip>
      )}
    </div>
  );
}
