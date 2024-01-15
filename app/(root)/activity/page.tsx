import { fetchUserData, getUserActivity } from "@/lib/actions/user.actions";
import { formatDateString } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Activity() {
  const currentLoggedInUser = await currentUser();
  const currentLoggedInUserData = await fetchUserData(
    currentLoggedInUser ? currentLoggedInUser?.id : ""
  );

  const accountActivity = await getUserActivity(currentLoggedInUserData._id);

  if (!currentLoggedInUser) return null;

  if (!currentLoggedInUserData?.onboarded) {
    redirect("/onboarding");
  }

  return (
    <section>
      <h1 className="head-text mb-10"> Activity </h1>
      <section className="mt-10 flex flex-col gap-5">
        {accountActivity && accountActivity.length > 0 ? (
          <>
            {accountActivity.map((activity) => (
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
            ))}
          </>
        ) : (
          <p className="!text-base-regular text-light-3">
            This account has no activity
          </p>
        )}
      </section>
    </section>
  );
}
