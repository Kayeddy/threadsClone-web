import { currentUser } from "@clerk/nextjs";
import { communityTabs } from "@/constants";
import UserProfileHeader from "@/components/shared/AccountProfileHeader";
import { fetchUserData } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import {
  fetchCommunityDetails,
  fetchCommunityPosts,
} from "@/lib/actions/community.actions";
import AccountProfileTabs from "@/components/shared/AccountProfileTabs";

/**
 * Represents the page component for community details, including profile header and community posts.
 * This component fetches and displays the community details and its posts.
 *
 * @param {object} props - The component props.
 * @param {object} props.params - Parameters passed to the component, including the community ID.
 * @returns {Promise<JSX.Element|null>} A section element containing community details or null if the user is not logged in or onboarded.
 */
export default async function Page({ params }: { params: { id: string } }) {
  try {
    const currentLoggedInUser = await currentUser();
    if (!currentLoggedInUser) return null;

    const currentLoggedInUserData = await fetchUserData(currentLoggedInUser.id);
    if (!currentLoggedInUserData?.onboarded) {
      redirect("/onboarding");
      return null;
    }

    const communityDetails = await fetchCommunityDetails(params.id);
    const communityThreads = await fetchCommunityPosts(communityDetails._id);

    const profileHeaderProps = {
      accessedAccountUserId: communityDetails.id,
      currentLoggedInUserId: currentLoggedInUserData.id,
      accessedAccountName: communityDetails.name,
      accessedAccountUsername: communityDetails.alias,
      accessedAccountProfileImage: communityDetails.image,
      accessedAccountBio: communityDetails.bio,
      type: "Community",
    };

    const isUserFromCommunity = currentLoggedInUserData.communities.some(
      (community: any) => community.id === communityDetails.id
    );

    const accountProfileTabsProps = {
      userId: currentLoggedInUserData._id.toString(),
      accountId: communityDetails.id,
      accountImage: currentLoggedInUserData.image,
      accountThreads: communityThreads.threads,
      tabList: communityTabs,
      accountType: "Community",
      accountMembers: communityDetails.members,
      renderCardInteractions: false,
      isUserFromCommunity,
    };

    return (
      <section>
        <UserProfileHeader {...profileHeaderProps} />
        <div className="mt-9">
          <AccountProfileTabs {...accountProfileTabsProps} />
        </div>
      </section>
    );
  } catch (error) {
    console.error("Error loading community page:", error);
    return <p>Error loading page. Please try again later.</p>;
  }
}
