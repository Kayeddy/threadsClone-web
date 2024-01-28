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

export default async function UserProfile({
  params,
}: {
  params: { id: string };
}) {
  const currentLoggedInUser = await currentUser();

  if (!currentLoggedInUser) return null;

  const currentLoggedInUserData = await fetchUserData(currentLoggedInUser.id);

  const accessedUserProfileData = await fetchUserDataByDBId(params.id);

  const fetchedThreads = await fetchProfileThreads(params.id);

  if (!currentLoggedInUserData?.onboarded) {
    redirect("/onboarding");
  }

  const profileHeaderProps = {
    accessedAccountUserId: accessedUserProfileData.userId,
    currentLoggedInUserId: currentLoggedInUserData.id,
    accessedAccountName: accessedUserProfileData.name,
    accessedAcountUsername: accessedUserProfileData.username,
    accessedAcountProfileImage: accessedUserProfileData.image,
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
          accountThreads={fetchedThreads.threads}
          tabList={profileTabs}
          accountType="User"
        />
      </div>
    </section>
  );
}
