import ReplyThreadCard from "../cards/ReplyThreadCard";

interface Props {
  currentLoggedInUserId: string;
  accountThreads: any[];
}

/**
 * Processes and displays replies to threads created by the current logged-in user, excluding replies made by the user.
 * Threads with replies are structured and displayed using the `ReplyThreadCard` component. If there are no replies,
 * a message "No replies yet." is shown.
 *
 * @component
 * @param {Object} props The properties passed to the component.
 * @param {string} props.currentLoggedInUserId The ID of the current logged-in user, used to exclude replies made by the user.
 * @param {Array} props.accountThreads An array of thread objects, potentially including replies (`children`). Each thread object
 * must contain an `_id`, `threadContent`, and a `children` array. Replies in `children` must include a `threadAuthor` object with
 * an `_id`, `threadContent`, and `createdAt`, which are used to structure the reply details.
 *
 * @returns {React.ReactElement} A React element displaying structured replies using `ReplyThreadCard` components or a message
 * indicating the absence of replies.
 */
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
