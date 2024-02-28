import UserProfileHeader from "@/components/shared/AccountProfileHeader";
import AccountProfileTabs from "@/components/shared/AccountProfileTabs";
import ProfileRepliesTab from "@/components/tabs/ProfileRepliesTab";
import { profileTabs } from "@/constants";
import { fetchAllComments } from "@/lib/actions/thread.actions";
import { fetchProfileThreads, fetchUserData } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

/**
 * Renders the user profile page including the profile header and tabs with threads.
 * Redirects to onboarding if the user hasn't completed it.
 *
 * @returns {Promise<JSX.Element|null>} The user profile section or null if no user is logged in.
 */
export default async function UserProfile() {
  try {
    const currentLoggedInUser = await currentUser();
    if (!currentLoggedInUser) return null;

    const currentLoggedInUserData = await fetchUserData(currentLoggedInUser.id);

    // Redirect if the user hasn't completed onboarding
    if (!currentLoggedInUserData?.onboarded) {
      redirect("/onboarding");
      return null;
    }

    const fetchedThreads = await fetchProfileThreads(
      currentLoggedInUserData._id
    );

    //const comments = await fetchAllComments("65deb60cce32e20b03bd304a");
    //console.log(fetchedThreads);

    const profileHeaderProps = {
      accessedAccountUserId: currentLoggedInUserData.userId,
      currentLoggedInUserId: currentLoggedInUserData.id,
      accessedAccountName: currentLoggedInUserData.name,
      accessedAccountUsername: currentLoggedInUserData.username,
      accessedAccountProfileImage: currentLoggedInUserData.image,
      accessedAccountBio: currentLoggedInUserData.bio,
    };

    return (
      <section>
        <UserProfileHeader {...profileHeaderProps} />
        <div className="mt-9">
          <AccountProfileTabs
            userId={currentLoggedInUserData._id.toString()}
            accountId={currentLoggedInUserData.id}
            accountImage={currentLoggedInUserData.image}
            accountThreads={fetchedThreads}
            tabList={profileTabs}
            accountType="User"
            renderCardInteractions={false}
          />
        </div>
      </section>
    );
  } catch (error) {
    console.error("Error loading user profile:", error);
    // Optionally, handle the error more gracefully here, such as displaying an error message to the user
    return <p>Error loading profile. Please try again later.</p>;
  }
}
