import { fetchAllComments } from "@/lib/actions/thread.actions";
import ReplyThreadCard from "../cards/ReplyThreadCard";

interface Props {
  currentLoggedInUserId: string;
  accountThreads: any[];
}

export default async function ProfileRepliesTab({
  accountThreads,
  currentLoggedInUserId,
}: Props) {
  const structuredReplies = accountThreads
    .filter((thread: any) => thread.children && thread.children.length > 0)
    .map((thread: any) => {
      // Filter out comments by the current logged-in user
      const threadComments = thread.children
        .filter(
          (comment: any) =>
            comment.threadAuthor._id.toString() !== currentLoggedInUserId
        )
        .map((comment: any) => {
          return {
            commentAuthor: comment.threadAuthor,
            commentContent: comment.threadContent,
            commentDate: comment.createdAt,
            commentParentId: thread._id,
            commentParentContent: thread.threadContent,
          };
        });
      return threadComments;
    })
    .flat();

  console.log(structuredReplies);

  return (
    <div className="mt-9 flex flex-col gap-10">
      {structuredReplies.length === 0 ? (
        <p className="no-result">No replies yet.</p>
      ) : (
        <div>
          {structuredReplies.map((reply: any) => (
            <ReplyThreadCard key={reply.commentContent} replyData={reply} />
          ))}
        </div>
      )}
    </div>
  );
}
