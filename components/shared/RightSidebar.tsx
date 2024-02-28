import { currentUser } from "@clerk/nextjs";
import UserCard from "../cards/UserCard";
import CommunityCard from "../cards/CommunityCard";
import {
  fetchAllUsers,
  fetchUserData,
  fetchUserCommunities,
} from "@/lib/actions/user.actions";

/**
 * Server-side component to render the right sidebar with user's communities and similar minds.
 * @returns {Promise<JSX.Element|null>} The right sidebar component or null if the user is not logged in.
 */
export default async function RightSidebar() {
  // Fetch current logged-in user
  const currentLoggedInUser = await currentUser();
  if (!currentLoggedInUser) return null;

  // Fetch data for the logged-in user
  const currentLoggedInUserData = await fetchUserData(
    currentLoggedInUser.id || ""
  );
  if (!currentLoggedInUserData) return null;

  // Fetch similar minds based on the current user's data
  const similarMinds = await fetchAllUsers({
    userId: currentLoggedInUserData._id,
    pageSize: 4,
  });

  // Fetch communities associated with the user
  const userCommunities = await fetchUserCommunities(
    currentLoggedInUserData._id
  );

  // Render the component based on the fetched data
  return (
    <section className="custom-scrollbar right-sidebar">
      {/* Render user communities */}
      <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-light-1">My Communities</h3>
        <div className="mt-7 flex flex-col gap-10">
          {userCommunities.length > 0 ? (
            userCommunities.map((community: any) => (
              <CommunityCard
                key={community._id}
                id={community._id.toString()}
                name={community.name}
                imgUrl={community.image}
                members={community.members}
                createdBy={community.createdBy._id.toString()}
                isFromSidebar={true}
              />
            ))
          ) : (
            <p className="!text-base-regular text-light-3 text">
              No community available to show
            </p>
          )}
        </div>
      </div>

      {/* Render similar minds */}
      <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-light-1">Similar Minds</h3>
        <div className="mt-7 flex w-[300px] flex-col gap-10">
          {similarMinds.retrievedUsers.length > 0 ? (
            similarMinds.retrievedUsers.map((user: any) => (
              <UserCard
                key={user._id}
                userId={user._id.toString()}
                name={user.name}
                username={user.username}
                userProfileImage={user.image}
                personType="User"
              />
            ))
          ) : (
            <p className="!text-base-regular text-light-3">No users yet</p>
          )}
        </div>
      </div>
    </section>
  );
}
