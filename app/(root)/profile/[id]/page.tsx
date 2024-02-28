import UserProfileHeader from "@/components/shared/AccountProfileHeader";
import AccountProfileTabs from "@/components/shared/AccountProfileTabs";
import { profileTabs } from "@/constants";
import {
  fetchProfileThreads,
  fetchUserData,
  fetchUserDataByDBId,
} from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

/**
 * Renders the profile page for a user. This includes profile header and tabs.
 * Redirects to onboarding if the current logged-in user hasn't completed it.
 *
 * @param {{ params: { id: string; }; }} { params } - Contains the ID of the user profile to be accessed.
 * @returns {Promise<JSX.Element|null>} The user profile section or null if no user is logged in.
 */
export default async function UserProfile({
  params,
}: {
  params: { id: string };
}) {
  try {
    const currentLoggedInUser = await currentUser();
    if (!currentLoggedInUser) return null;

    const currentLoggedInUserData = await fetchUserData(currentLoggedInUser.id);

    // Redirect if not onboarded before fetching other user's data
    if (!currentLoggedInUserData?.onboarded) {
      redirect("/onboarding");
      return null;
    }

    const accessedUserProfileData = await fetchUserDataByDBId(params.id);
    const fetchedThreads = await fetchProfileThreads(params.id);

    const profileHeaderProps = {
      accessedAccountUserId: accessedUserProfileData.userId,
      currentLoggedInUserId: currentLoggedInUserData.id,
      accessedAccountName: accessedUserProfileData.name,
      accessedAccountUsername: accessedUserProfileData.username,
      accessedAccountProfileImage: accessedUserProfileData.image,
      accessedAccountBio: accessedUserProfileData.bio,
    };

    return (
      <section>
        <UserProfileHeader {...profileHeaderProps} />
        <div className="mt-9">
          <AccountProfileTabs
            userId={currentLoggedInUserData.id}
            accountId={accessedUserProfileData.id}
            accountImage={accessedUserProfileData.image}
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
    // Handle the error more gracefully here
    return <p>Error loading profile. Please try again later.</p>;
  }
}
