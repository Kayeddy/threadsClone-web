import ThreadCard from "@/components/cards/ThreadCard";
import ThreadsTab from "@/components/tabs/ThreadsTab";
import { fetchThreads } from "@/lib/actions/thread.actions";
import { fetchUserData } from "@/lib/actions/user.actions";
import { UserButton, currentUser } from "@clerk/nextjs";

export default async function Home() {
  const threads = await fetchThreads(1, 30);
  const currentLoggedInUser = await currentUser();
  const currentLoggedInUserData = await fetchUserData(
    currentLoggedInUser ? currentLoggedInUser.id : ""
  );

  return (
    <div className="overflow-hidden flex flex-col relative">
      <section className="flex flex-row gap-4 items-center justify-start ml-2">
        <UserButton afterSignOutUrl="/" />
        <h1 className="head-text">Home</h1>
      </section>
      <section className="mt-9 flex flex-col gap-10">
        <div className="h-auto overflow-x-hidden overflow-y-auto relative flex flex-col gap-10 py-10">
          <ThreadsTab
            currentLoggedInUserData={{
              id: currentLoggedInUserData._id.toString(),
              name: currentLoggedInUserData.name,
              username: currentLoggedInUserData.username,
              image: currentLoggedInUserData.image,
            }}
            accessedAccountImage={currentLoggedInUserData.image}
            accessedAccountId={currentLoggedInUserData._id.toString()}
            accountThreads={threads.obtainedThreads}
            accountType="User"
          />
        </div>
      </section>
    </div>
  );
}
