import CommentCard from "@/components/cards/CommentCard";
import ThreadCard from "@/components/cards/ThreadCard";
import ThreadCommentForm from "@/components/forms/ThreadCommentForm";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import { fetchUserData } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Thread({ params }: { params: { id: string } }) {
  const currentLoggedInUser = await currentUser();
  const currentLoggedInUserData = await fetchUserData(
    currentLoggedInUser ? currentLoggedInUser.id : ""
  );

  const thread = await fetchThreadById(params.id);

  if (!params.id || !currentLoggedInUser) return null;
  if (!currentLoggedInUserData.onboarded) redirect("/onboarding");

  const threadCardProps = {
    threadId: thread._id.toString(),
    currentUserId: currentLoggedInUser ? currentLoggedInUser?.id : null,
    currentUserImage: currentLoggedInUserData.image,
    parentId: thread.parentId ? thread.parentId : null,
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
        <ThreadCard {...threadCardProps} />;
      </div>
      <div className="mt-7">
        <ThreadCommentForm {...threadCommentFormProps} />
      </div>
      <div className="mt-10">
        {thread.children.map((commentThread: any) => {
          const commentThreadCardProps = {
            commentThreadId: commentThread._id.toString(),
            currentUserId: currentLoggedInUserData._id.toString(),
            commentContent: commentThread.threadContent,
            commentAuthor: {
              name: commentThread.threadAuthor.name,
              image: commentThread.threadAuthor.image,
              id: commentThread.threadAuthor._id.toString(),
            },
            threadLikes: commentThread.likes.map((like: any) => {
              return like.toString();
            }),
            createdAt: commentThread.createdAt,
            isInThreadPage: true,
          };

          return (
            <CommentCard key={commentThread._id} {...commentThreadCardProps} />
          );
        })}
      </div>
    </section>
  );
}
