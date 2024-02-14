import { currentUser } from "@clerk/nextjs";

import UserCard from "../cards/UserCard";

import { fetchCommunities } from "@/lib/actions/community.actions";
import { fetchAllUsers, fetchUserData } from "@/lib/actions/user.actions";

export default async function RightSidebar() {
  const currentLoggedInUser = await currentUser();
  if (!currentLoggedInUser) return null;

  const currentLoggedInUserData = await fetchUserData(
    currentLoggedInUser ? currentLoggedInUser?.id : ""
  );

  if (!currentLoggedInUser) return null;

  console.log(currentLoggedInUserData);

  const similarMinds = await fetchAllUsers({
    userId: currentLoggedInUserData._id,
    pageSize: 4,
  });

  const suggestedCOmmunities = await fetchCommunities({ pageSize: 4 });

  return (
    <section className="custom-scrollbar right-sidebar">
      <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-light-1">
          Suggested Communities
        </h3>

        <div className="mt-7 flex w-[300px] flex-col gap-9">
          {suggestedCOmmunities.communities.length > 0 ? (
            <>
              {suggestedCOmmunities.communities.map((community) => (
                <UserCard
                  key={community.id}
                  userId={community.id}
                  name={community.name}
                  username={community.username}
                  userProfileImage={community.image}
                  personType="Community"
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
