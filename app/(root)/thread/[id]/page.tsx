import CommentCard from "@/components/cards/CommentCard";
import ThreadCard from "@/components/cards/ThreadCard";
import ThreadCommentForm from "@/components/forms/ThreadCommentForm";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import { fetchUserData } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

/**
 * Fetches and displays a thread along with its comments.
 * @param {Object} params - The parameters object.
 * @param {string} params.id - The ID of the thread to fetch.
 * @returns The thread page component or redirects based on user state.
 */
export default async function Thread({ params }: { params: { id: string } }) {
  if (!params.id) return null;
  const currentLoggedInUser = await currentUser();

  if (!currentLoggedInUser) return null; // Redirect or handle unauthenticated user

  try {
    const [currentLoggedInUserData, thread] = await Promise.all([
      fetchUserData(currentLoggedInUser.id),
      fetchThreadById(params.id),
    ]);

    if (!currentLoggedInUserData.onboarded) {
      redirect("/onboarding");
      return null;
    }

    const threadCardProps = {
      threadId: thread._id.toString(),
      currentUserId: currentLoggedInUser.id,
      currentUserImage: currentLoggedInUserData.image,
      parentId: thread.parentId?.toString(),
      threadContent: thread.threadContent,
      threadAuthor: thread.threadAuthor,
      threadCommunity: thread.threadCommunity,
      createdAt: thread.createdAt,
      threadComments: thread.children,
      renderCardInteractions: false,
    };

    const threadCommentFormProps = {
      threadId: thread._id.toString(),
      currentLoggedInUserImage: currentLoggedInUserData.image,
      userId: currentLoggedInUserData._id.toString(),
    };

    return (
      <section className="relative">
        <div>
          <ThreadCard {...threadCardProps} />
        </div>
        <div className="mt-7">
          <ThreadCommentForm {...threadCommentFormProps} />
        </div>
        <div className="mt-10">
          {thread.children.map((commentThread: any) => (
            <CommentCard
              key={commentThread._id}
              commentThreadId={commentThread._id.toString()}
              currentUserId={currentLoggedInUserData._id.toString()}
              commentContent={commentThread.threadContent}
              commentAuthor={{
                name: commentThread.threadAuthor.name,
                image: commentThread.threadAuthor.image,
                id: commentThread.threadAuthor._id.toString(),
              }}
              threadLikes={commentThread.likes.map((like: any) =>
                like.toString()
              )}
              createdAt={commentThread.createdAt}
              isInThreadPage={true}
            />
          ))}
        </div>
      </section>
    );
  } catch (error) {
    // Handle the error appropriately
    console.error("Failed to fetch thread or user data", error);
    return null;
  }
}
