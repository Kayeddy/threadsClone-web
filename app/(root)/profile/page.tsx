import UserProfileHeader from "@/components/shared/AccountProfileHeader";
import AccountProfileTabs from "@/components/shared/AccountProfileTabs";
import { profileTabs } from "@/constants";
import { fetchProfileThreads, fetchUserData } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function UserProfile() {
  const currentLoggedInUser = await currentUser();

  if (!currentLoggedInUser) return null;

  const currentLoggedInUserData = await fetchUserData(currentLoggedInUser.id);

  const fetchedThreads = await fetchProfileThreads(currentLoggedInUserData._id);

  if (!currentLoggedInUserData?.onboarded) {
    redirect("/onboarding");
  }

  const profileHeaderProps = {
    accessedAccountUserId: currentLoggedInUserData.userId,
    currentLoggedInUserId: currentLoggedInUserData.id,
    accessedAccountName: currentLoggedInUserData.name,
    accessedAcountUsername: currentLoggedInUserData.username,
    accessedAcountProfileImage: currentLoggedInUserData.image,
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
}
