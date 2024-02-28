import { fetchUserData, getUserActivity } from "@/lib/actions/user.actions";
import { formatDateString } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

/**
 * Renders the activity of the current logged-in user.
 * Redirects to the onboarding page if the user hasn't completed onboarding.
 * @returns {JSX.Element|null} The activity section or null if no user is logged in.
 */
export default async function Activity() {
  // Early return if no user is logged in to avoid unnecessary API calls
  const currentLoggedInUser = await currentUser();
  if (!currentLoggedInUser) return null;

  try {
    // Fetch user data and activity based on the current logged-in user
    const currentLoggedInUserData = await fetchUserData(currentLoggedInUser.id);
    if (!currentLoggedInUserData?.onboarded) {
      redirect("/onboarding");
      return null; // Exit the function to avoid rendering
    }

    const accountActivity = await getUserActivity(currentLoggedInUserData._id);

    // Render user activity or a message indicating no activity
    return (
      <section>
        <h1 className="head-text mb-10">Activity</h1>
        <section className="mt-10 flex flex-col gap-5">
          {accountActivity && accountActivity.length > 0 ? (
            accountActivity.map((activity) => (
              <Link key={activity._id} href={`/thread/${activity.parentId}`}>
                <article className="activity-card">
                  <Image
                    src={activity.threadAuthor.image}
                    alt="Account_Activity_User_Profile_Image"
                    width={20}
                    height={20}
                    className="rounded-full object-contain"
                  />
                  <div className="flex-1 flex flex-row items-center justify-between">
                    <p className="!text-small-regular text-light-1">
                      <span className="mr-1 text-primary-500">
                        {activity.threadAuthor.name}
                      </span>
                      replied to your Thread
                    </p>
                    <p className="text-light-3 !text-small-regular">
                      {formatDateString(activity.createdAt)}
                    </p>
                  </div>
                </article>
              </Link>
            ))
          ) : (
            <p className="!text-base-regular text-light-3">
              This account has no activity
            </p>
          )}
        </section>
      </section>
    );
  } catch (error) {
    // Handle any errors gracefully
    console.error("Failed to fetch user activity:", error);
    return <p>Error loading activity.</p>;
  }
}
