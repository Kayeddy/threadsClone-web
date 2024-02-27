import Image from "next/image";
import Link from "next/link";
import CommentCard from "../cards/CommentCard";

export default function DynamicCommentsTab({
  commentsList,
  currentUserId,
  parentThreadId,
}: {
  commentsList: {}[];
  currentUserId: string;
  parentThreadId: string;
}) {
  return commentsList.map((comment: any) => (
    <div
      key={comment.threadId.toString()}
      className="flex flex-col items-center gap-8 transition-all duration-200 ease-in-out"
    >
      <CommentCard
        commentAuthor={{
          id: comment.threadAuthor.id,
          name: comment.threadAuthor.name,
          image: comment.threadAuthor.image,
        }}
        currentUserId={currentUserId}
        commentContent={comment.threadContent}
        commentThreadId={comment.threadId}
        threadLikes={comment.threadLikes}
        createdAt={comment.createdAt}
      />
    </div>
  ));
}
