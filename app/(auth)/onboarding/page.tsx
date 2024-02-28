import AccountProfileForm from "@/components/forms/AccountProfileForm";
import { currentUser } from "@clerk/nextjs";
import { fetchUserData } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

async function page() {
  const loggedInUser = await currentUser();
  const currentLoggedInUserData = await fetchUserData(
    loggedInUser ? loggedInUser.id : ""
  );
  const currentUserPartialData = {
    _id: "",
    username: "",
    name: "",
    bio: "",
    image: "",
  };
  const currentUserCompleteData = {
    userId: loggedInUser?.id || "",
    objectId: currentUserPartialData?._id || "",
    username: currentUserPartialData?.username || loggedInUser?.username || "",
    name: currentUserPartialData?.name || loggedInUser?.firstName || "",
    bio: currentUserPartialData?.bio || "",
    image: currentUserPartialData?.image || loggedInUser?.imageUrl || "",
  };

  if (!loggedInUser) redirect("/sign-in");
  if (
    loggedInUser &&
    currentLoggedInUserData &&
    currentLoggedInUserData?.onboarded
  )
    redirect("/");

  return (
    <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
      <h1 className="head-text">Onboarding</h1>
      <p className="mt-3 text-base-regular text-light-2">
        Complete your profile now
      </p>
      <section className="mt-9 bg-dark-2 p-10">
        <AccountProfileForm
          currentUserData={currentUserCompleteData}
          buttonTitle="Continue"
        />
      </section>
    </main>
  );
}

export default page;
