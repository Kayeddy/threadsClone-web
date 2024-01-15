import PostThreadForm from "@/components/forms/PostThreadForm";
import { fetchUserData } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

async function Page() {
  const currentLoggedInUser = await currentUser();

  if (!currentLoggedInUser) return null;

  const currentLoggedInUserData = await fetchUserData(currentLoggedInUser.id);

  if (!currentLoggedInUserData?.onboarded) {
    redirect("/onboarding");
  }

  return (
    <>
      <h1 className="head-text">Create Thread</h1>
      <PostThreadForm userId={currentLoggedInUserData?._id} />
    </>
  );
}

export default Page;
