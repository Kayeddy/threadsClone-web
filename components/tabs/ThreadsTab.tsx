import ThreadCard from "@/components/cards/ThreadCard";
import { fetchProfileThreads } from "@/lib/actions/user.actions";

interface Props {
  currentLoggedInUserId: string;
  accessedAccountId: string;
  accessedAccountImage: string;
  accountThreads: any[];
  accountType: string;
}

export default async function ThreadsTab({
  currentLoggedInUserId,
  accessedAccountImage,
  accessedAccountId,
  accountThreads,
  accountType,
}: Props) {
  return (
    <section className="mt-9 flex flex-col gap-10">
      {accountThreads.length ? (
        accountThreads.map((thread: any) => {
          const threadCardProps = {
            threadId: thread._id,
            currentUserId: currentLoggedInUserId,
            parentId: thread.parentId ? thread.parentId : null,
            threadContent: thread.threadContent,
            threadAuthor: {
              name: thread.threadAuthor.name,
              image: accessedAccountImage,
              id: thread.threadAuthor.userId,
            },
            threadCommunity: thread.threadCommunity,
            createdAt: thread.createdAt,
            threadComments: thread.children,
            isInCommunityPage: accountType === "Community" ? true : false,
          };

          return <ThreadCard key={thread._id} {...threadCardProps} />;
        })
      ) : (
        <p>No threads available.</p>
      )}
    </section>
  );
}
