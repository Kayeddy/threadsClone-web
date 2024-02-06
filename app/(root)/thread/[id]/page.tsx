import CommentsTab from "@/components/tabs/CommentsTab";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import { fetchUserData } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Thread({ params }: { params: { id: string } }) {
  const currentLoggedInUser = await currentUser();
  const currentLoggedInUserData = await fetchUserData(
    currentLoggedInUser ? currentLoggedInUser.id : ""
  );

  const targetThread = await fetchThreadById(params.id);

  if (!params.id || !currentLoggedInUser) return null;
  if (!currentLoggedInUserData.onboarded) redirect("/onboarding");

  return (
    <section className="relative">
      <CommentsTab
        userData={currentLoggedInUserData}
        targetThread={targetThread}
      />
    </section>
  );
}
