import Image from "next/image";
import Link from "next/link";

import { Button } from "../ui/button";
import { fetchUserDataByDBId } from "@/lib/actions/user.actions";

interface Props {
  id: string;
  name: string;
  imgUrl: string;
  createdBy: string;
  members: {
    image: string;
  }[];
  isFromSidebar?: boolean;
}
export default async function CommunityCard({
  id,
  name,
  imgUrl,
  createdBy,
  members,
  isFromSidebar = false,
}: Props) {
  const communityCreatorDetails = await fetchUserDataByDBId(createdBy);
  return (
    <article
      className={`community-card ${
        !isFromSidebar
          ? "bg-dark-3 sm:w-96 p-4"
          : "flex flex-row justify-between items-center"
      }`}
    >
      <div className="flex flex-wrap items-center gap-3">
        <Link href={`/communities/${id}`} className="relative h-12 w-12">
          <Image
            src={imgUrl}
            alt="community_logo"
            fill
            sizes="32x32"
            className="rounded-full object-cover"
          />
        </Link>

        <div>
          <Link href={`/communities/${id}`}>
            <h4 className="text-base-semibold text-light-1">{name}</h4>
          </Link>
          <Link
            href={`/profile/${communityCreatorDetails._id}`}
            className="hover:text-gray-200 transition-all duration-200 ease-in-out text-subtle-medium text-gray-1"
          >
            By @{communityCreatorDetails.username}
          </Link>
        </div>
      </div>

      {!isFromSidebar && (
        <p className="mt-4 text-subtle-medium text-gray-1">
          By {communityCreatorDetails && communityCreatorDetails.name}
          <br />
          <Link
            href={`/profile/${communityCreatorDetails._id}`}
            className="hover:text-gray-200 transition-all duration-200 ease-in-out"
          >
            <span>
              @{communityCreatorDetails && communityCreatorDetails.username}
            </span>
          </Link>
        </p>
      )}

      <div
        className={`${
          !isFromSidebar && "mt-5"
        } flex flex-wrap items-center justify-between gap-3`}
      >
        <Link href={`/communities/${id}`}>
          <Button
            size="sm"
            className="community-card_btn hover:scale-110 transition-all duration-300 ease-in-out"
          >
            View
          </Button>
        </Link>

        {members.length > 0 && !isFromSidebar && (
          <div className="flex items-center">
            {members.map((member, index) => (
              <Image
                key={index}
                src={member.image}
                alt={`user_${index}`}
                width={28}
                height={28}
                className={`${
                  index !== 0 && "-ml-2"
                } rounded-full object-cover`}
              />
            ))}
            {members.length >= 2 ? (
              <p className="ml-1 text-subtle-medium text-gray-1">
                {members.length} members
              </p>
            ) : (
              <p className="ml-1 text-subtle-medium text-gray-1">
                {members.length} member
              </p>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
