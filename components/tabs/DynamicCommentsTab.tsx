import CommentCard from "../cards/CommentCard";

// Define a TypeScript interface for the comment object
interface Comment {
  threadId: string;
  threadAuthor: {
    id: string;
    name: string;
    image: string;
  };
  threadContent: string;
  threadLikes: any[]; // Consider defining a more specific type
  createdAt: string;
}

// Define the props for the DynamicCommentsTab component using TypeScript
interface DynamicCommentsTabProps {
  commentsList: Comment[];
  currentUserId: string;
}

/**
 * DynamicCommentsTab - Renders a list of comments as specified in the commentsList prop.
 * Utilizes the CommentCard component for individual comment display.
 *
 * @param {DynamicCommentsTabProps} props - The component props.
 * @param {Comment[]} props.commentsList - Array of comments to display.
 * @param {string} props.currentUserId - The ID of the current user for context-sensitive actions.
 */
export default function DynamicCommentsTab({
  commentsList,
  currentUserId,
}: DynamicCommentsTabProps) {
  return (
    <>
      {commentsList.map((comment) => (
        <div
          key={comment.threadId}
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
      ))}
    </>
  );
}
