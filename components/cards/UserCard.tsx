"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

interface Props {
  userId: string;
  currentUserId?: string;
  name: string;
  username: string;
  userProfileImage: string;
  personType: string;
}
export default function UserCard({
  userId,
  currentUserId,
  name,
  username,
  userProfileImage,
  personType,
}: Props) {
  const router = useRouter();

  return (
    <article className="user-card">
      <div className="user-card_avatar">
        <Image
          src={userProfileImage}
          alt="User_Card_Profile_Image"
          width={48}
          height={48}
          className="rounded-full"
        />

        <div className="flex-1 text-ellipsis">
          <h4 className="text-base-semibold text-light-1">
            {currentUserId === userId ? "You" : name}
          </h4>
          <p className="text-small-medium text-gray-1">@{username}</p>
        </div>
      </div>
      <Button
        className="user-card_btn hover:scale-110 transition-all duration-300 ease-in-out"
        onClick={() => router.push(`/profile/${userId}`)}
      >
        View
      </Button>
    </article>
  );
}
