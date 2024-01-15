import UserCard from "@/components/cards/UserCard";
import { fetchAllUsers, fetchUserData } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Search() {
  const currentLoggedInUser = await currentUser();
  const currentLoggedInUserData = await fetchUserData(
    currentLoggedInUser ? currentLoggedInUser?.id : ""
  );

  if (!currentLoggedInUser) return null;

  if (!currentLoggedInUserData?.onboarded) {
    redirect("/onboarding");
  }

  // Fetch all users from database
  const fetchedUsers = await fetchAllUsers({
    userId: currentLoggedInUser.id,
    searchString: "",
    pageNumber: 1,
    pageSize: 25,
  });

  return (
    <section>
      <h1 className="head-text mb-10"> search </h1>
      {/** Seaerchbar */}
      <div className="mt-14 flex flex-col gap-9">
        {fetchedUsers.retrievedUsers.length === 0 ? (
          <p className="no-result">No users were found</p>
        ) : (
          <>
            {fetchedUsers.retrievedUsers.map((user) => {
              const userCardProps = {
                userId: JSON.stringify(user._id),
                name: user.name,
                username: user.username,
                userProfileImage: user.image,
                personType: "User",
              };

              return <UserCard key={user.id} {...userCardProps} />;
            })}
          </>
        )}
      </div>
    </section>
  );
}
