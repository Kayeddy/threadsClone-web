import Image from "next/image";
import { currentUser } from "@clerk/nextjs";

import { communityTabs } from "@/constants";

import UserProfileHeader from "@/components/shared/AccountProfileHeader";
import ThreadsTab from "@/components/tabs/ThreadsTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { fetchUserData } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import {
  fetchCommunityDetails,
  fetchCommunityPosts,
} from "@/lib/actions/community.actions";
import AccountProfileTabs from "@/components/shared/AccountProfileTabs";

export default async function Page({ params }: { params: { id: string } }) {
  const currentLoggedInUser = await currentUser();

  if (!currentLoggedInUser) return null;

  const currentLoggedInUserData = await fetchUserData(currentLoggedInUser.id);

  if (!currentLoggedInUserData?.onboarded) {
    redirect("/onboarding");
  }

  const communityDetails = await fetchCommunityDetails(params.id);

  console.log(communityDetails);
  const communityThreads = await fetchCommunityPosts(communityDetails._id);

  const profileHeaderProps = {
    accessedAccountUserId: communityDetails.id,
    currentLoggedInUserId: currentLoggedInUserData.id,
    accessedAccountName: communityDetails.name,
    accessedAcountUsername: communityDetails.alias,
    accessedAcountProfileImage: communityDetails.image,
    accessedAccountBio: communityDetails.bio,
    type: "Community",
  };

  console.log(currentLoggedInUserData);

  const accountProfileTabsProps = {
    userId: currentLoggedInUserData._id,
    accountId: communityDetails._id,
    accountImage: currentLoggedInUserData.image,
    accountThreads: communityThreads.threads,
    tabList: communityTabs,
    accountType: "Community",
    accountMembers: communityDetails.members,
    renderCardInteractions: false,
  };

  return (
    <section>
      <UserProfileHeader {...profileHeaderProps} />
      <div className="mt-9">
        <AccountProfileTabs {...accountProfileTabsProps} />
      </div>
    </section>
  );
}
