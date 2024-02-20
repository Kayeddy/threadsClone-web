import { currentUser } from "@clerk/nextjs";

import UserCard from "../cards/UserCard";

import { fetchCommunities } from "@/lib/actions/community.actions";
import { fetchAllUsers, fetchUserData } from "@/lib/actions/user.actions";
import CommunityCard from "../cards/CommunityCard";

export default async function RightSidebar() {
  const currentLoggedInUser = await currentUser();
  if (!currentLoggedInUser) return null;

  const currentLoggedInUserData = await fetchUserData(
    currentLoggedInUser ? currentLoggedInUser?.id : ""
  );

  if (!currentLoggedInUserData) return null;

  const similarMinds = await fetchAllUsers({
    userId: currentLoggedInUserData._id,
    pageSize: 4,
  });

  const suggestedCommunities = await fetchCommunities({ pageSize: 4 });

  return (
    <section className="custom-scrollbar right-sidebar">
      <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-light-1">
          Suggested Communities
        </h3>

        <div className="mt-7 flex flex-col gap-10">
          {suggestedCommunities.communities.length > 0 ? (
            <>
              {suggestedCommunities.communities.map((community) => (
                <CommunityCard
                  key={community._id}
                  id={community._id}
                  name={community.name}
                  alias={community.username}
                  imgUrl={community.image}
                  members={community.members}
                  createdBy={community.createdBy.toString()}
                  isFromSidebar={true}
                />
              ))}
            </>
          ) : (
            <p className="!text-base-regular text-light-3">
              No communities yet
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-light-1">Similar Minds</h3>
        <div className="mt-7 flex w-[300px] flex-col gap-10">
          {similarMinds.retrievedUsers.length > 0 ? (
            <>
              {similarMinds.retrievedUsers.map((user) => (
                <UserCard
                  key={user.id}
                  userId={user._id.toString()}
                  name={user.name}
                  username={user.username}
                  userProfileImage={user.image}
                  personType="User"
                />
              ))}
            </>
          ) : (
            <p className="!text-base-regular text-light-3">No users yet</p>
          )}
        </div>
      </div>
    </section>
  );
}
