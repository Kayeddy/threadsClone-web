import PostThreadForm from "@/components/forms/PostThreadForm";
import { fetchUserData } from "@/lib/actions/user.actions";
import { fetchUserTags } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

/**
 * Page component for creating a new thread.
 * It renders a form for posting a thread, but only for logged-in and onboarded users.
 * Non-onboarded or non-logged-in users are redirected to the onboarding page or prevented from accessing the form.
 *
 * @returns {Promise<JSX.Element|null>} The form for creating a new thread or null if the user is not logged in.
 */
async function Page() {
  try {
    const currentLoggedInUser = await currentUser();

    // Redirect non-logged-in users
    if (!currentLoggedInUser) {
      return null; // Consider redirecting to login page if applicable
    }

    const currentLoggedInUserData = await fetchUserData(currentLoggedInUser.id);

    const userTags = await fetchUserTags(currentLoggedInUserData._id);

    // Redirect users who haven't completed onboarding
    if (!currentLoggedInUserData?.onboarded) {
      redirect("/onboarding");
      return null;
    }

    return (
      <>
        <h1 className="head-text">Create Thread</h1>
        <PostThreadForm
          userId={currentLoggedInUserData._id.toString()}
          //@ts-ignore
          retrievedUserTags={userTags.flat()}
        />
      </>
    );
  } catch (error) {
    console.error("Error loading the create thread page:", error);
    // Optionally, redirect to an error page or display an error message
    return <p>Error loading page. Please try again later.</p>;
  }
}

export default Page;
