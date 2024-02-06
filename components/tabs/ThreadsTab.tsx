import ThreadCard from "@/components/cards/ThreadCard";

interface Props {
  currentLoggedInUserData: {
    id: string;
    name: string;
    username: string;
    image: string;
  };
  accessedAccountId: string;
  accessedAccountImage: string;
  accountThreads: any[];
  accountType: string;
}

export default function ThreadsTab({
  currentLoggedInUserData,
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
            threadId: thread._id.toString(),
            currentUserData: {
              id: currentLoggedInUserData.id,
              image: currentLoggedInUserData.image,
            },
            parentId: thread.parentId ? thread.parentId.toString() : null,
            threadContent: thread.threadContent,
            threadAuthor: {
              name: thread.threadAuthor.name,
              image: accessedAccountImage,
              id: thread.threadAuthor._id.toString(),
            },
            threadCommunity: thread.community
              ? {
                  id: thread.threadCommunity._id.toString(),
                  name: thread.threadCommunity.name,
                  image: thread.threadCommunity.image,
                }
              : null,
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
