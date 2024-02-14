import ThreadCard from "@/components/cards/ThreadCard";
import { fetchThreads } from "@/lib/actions/thread.actions";
import { fetchUserData } from "@/lib/actions/user.actions";
import { UserButton, currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Home() {
  const currentLoggedInUser = await currentUser();
  if (!currentLoggedInUser) redirect("/sign-in");
  const currentLoggedInUserData = await fetchUserData(
    currentLoggedInUser ? currentLoggedInUser.id : ""
  );
  if (
    (currentLoggedInUser && !currentLoggedInUserData) ||
    !currentLoggedInUserData?.onboarded
  )
    redirect("/onboarding");

  const fetchThreadsResponse = await fetchThreads(1, 30);

  return (
    <>
      {currentLoggedInUser && currentLoggedInUserData && (
        <div className="overflow-hidden flex flex-col relative">
          {" "}
          <section className="flex flex-row gap-4 items-center justify-start ml-2">
            <UserButton afterSignOutUrl="/" />
            <h1 className="head-text">Home</h1>
          </section>
          <section className="mt-9 flex flex-col gap-10">
            {fetchThreadsResponse.threads.length === 0 ? (
              <p className="no-result">No threads available at this moment</p>
            ) : (
              <div className="h-auto overflow-x-hidden overflow-y-auto relative flex flex-col gap-10 py-10">
                {fetchThreadsResponse.threads.map((thread: any) => (
                  <ThreadCard
                    key={thread._id.toString()}
                    threadId={thread._id.toString()}
                    currentUserId={currentLoggedInUserData._id.toString()}
                    currentUserImage={currentLoggedInUserData.image}
                    parentId={thread.parentId ? thread.parentId : null}
                    threadContent={thread.threadContent}
                    threadAuthor={{
                      name: thread.threadAuthor.name,
                      image: thread.threadAuthor.image,
                      id: thread.threadAuthor._id.toString(),
                    }}
                    threadCommunity={thread.threadCommunity}
                    createdAt={thread.createdAt}
                    threadComments={thread.children}
                    threadLikes={thread.likes.map((userId: any) => {
                      return userId.toString();
                    })}
                    renderCardInteractions={true}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </>
  );
}
