import ThreadCard from "@/components/cards/ThreadCard";
import { fetchThreads } from "@/lib/actions/thread.actions";
import { UserButton, currentUser } from "@clerk/nextjs";

export default async function Home() {
  const threads = (await fetchThreads(1, 30))?.obtainedThreads;
  const currentLoggedInUser = await currentUser();

  return (
    <div className="h-screen">
      <UserButton afterSignOutUrl="/" />
      <h1 className="head-text text-left">Home</h1>
      <section className="mt-9 flex flex-col gap-10">
        {threads.length === 0 ? (
          <p className="no-result">No threads available at this moment</p>
        ) : (
          <>
            {threads.map((thread) => {
              const threadCardProps = {
                threadId: thread._id,
                currentUserId: currentLoggedInUser
                  ? currentLoggedInUser?.id
                  : null,
                parentId: thread.parentId ? thread.parentId : null,
                threadContent: thread.threadContent,
                threadAuthor: thread.threadAuthor,
                threadCommunity: thread.threadCommunity,
                createdAt: thread.createdAt,
                threadComments: thread.children,
              };

              return <ThreadCard key={thread._id} {...threadCardProps} />;
            })}
          </>
        )}
      </section>
    </div>
  );
}
