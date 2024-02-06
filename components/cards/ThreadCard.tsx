"use client";
import { formatDateString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import ShareThreadDialog from "../dialogs/ShareThreadDialog";
import { useState } from "react";
import CommentsTab from "../tabs/CommentsTab";

interface Props {
  threadId: string;
  currentUserData: {
    id: string;
    image: string;
  };
  parentId: string | null;
  threadContent: string;
  threadAuthor: {
    name: string;
    image: string;
    id: string;
  };
  threadCommunity: {
    id: string;
    name: string;
    image: string;
  } | null;
  createdAt: string;
  threadComments: {
    threadAuthor: {
      image: string;
    };
  }[];
  isComment?: boolean; // Not required
  isInCommunityPage?: boolean;
}

export default function ThreadCard({
  threadId,
  currentUserData,
  parentId,
  threadContent,
  threadAuthor,
  threadCommunity,
  createdAt,
  threadComments,
  isComment,
  isInCommunityPage = false,
}: Props) {
  const [isCommenting, setIsCommenting] = useState(false);

  const handleThreadLike = async () => {
    //TODO: Implement user like post backend logic
  };

  const handleThreadComment = (isCommenting: boolean) => {
    setIsCommenting(isCommenting);
  };

  const handleThreadRepost = async () => {};

  const handleThreadShare = () => {};

  const targetThreadProps = {
    threadId: threadId,
    currentUserId: currentUserData.id,
    parentId: parentId,
    threadContent: threadContent,
    threadAuthor: {
      name: threadAuthor.name,
      image: threadAuthor.image,
      _id: threadAuthor.id,
    },
    threadCommunity: threadCommunity,
    createdAt: createdAt,
    threadComments: threadComments,
  };

  return (
    <article className="flex flex-row items-center justify-between bg-dark-2 rounded-xl p-7 gap-4">
      <section
        className={`flex flex-col ${isCommenting && "pr-4"} ${
          isComment && "px-0 xs:px-7"
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex w-full flex-1 flex-row gap-4">
            <div className="flex flex-col items-center">
              <Link
                href={`/profile/${threadAuthor.id}`}
                className="relative h-11 w-11"
              >
                <Image
                  src={threadAuthor.image}
                  alt="Thread_Author_Profile_Image"
                  fill
                  className="cursor-pointer rounded-full"
                />
              </Link>

              <div className="thread-card_bar" />
            </div>

            <div className="flex w-full flex-col items-start justify-center">
              <Link href={`/profile/${threadAuthor.id}`} className="w-fit">
                <h4 className="cursor-pointer text-base-semibold text-light-1">
                  {threadAuthor.name}
                </h4>
              </Link>

              <p className="mt-2 text-small-regular text-light-2">
                {threadContent}
              </p>

              <div
                className={`mt-5 flex flex-col gap-3 ${isComment && "mb-8"}`}
              >
                <div className="flex gap-3.5">
                  <Image
                    src="/assets/heart-gray.svg"
                    alt="Thread_Heart_Reaction_Icon"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain hover:scale-110 transition-all duration-300 ease-in-out hover:brightness-200"
                    //onClick={handlePostLike}
                  ></Image>

                  <span onClick={() => handleThreadComment(!isCommenting)}>
                    <Image
                      src="/assets/reply.svg"
                      alt="Thread_Reply_Icon"
                      width={24}
                      height={24}
                      className="cursor-pointer object-contain hover:scale-110 transition-all duration-300 ease-in-out hover:brightness-200"
                    ></Image>
                  </span>

                  <Image
                    src="/assets/repost.svg"
                    alt="Thread_Repost_Icon"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain hover:scale-110 transition-all duration-300 ease-in-out hover:brightness-200"
                  ></Image>

                  <ShareThreadDialog
                    triggerImage={
                      <Image
                        src="/assets/share.svg"
                        alt="Thread_Share_Icon"
                        width={24}
                        height={24}
                        className="cursor-pointer object-contain hover:scale-110 transition-all duration-300 ease-in-out hover:brightness-200"
                      ></Image>
                    }
                    threadLink={`/thread/${threadId}`}
                  />
                </div>
                {isComment && threadComments.length > 0 && (
                  <Link href={`/thread/${threadId}`}>
                    <p className="mt-1 text-subtle-medium text-gray-1">
                      {threadComments.length} replies
                    </p>
                  </Link>
                )}
              </div>
            </div>
          </div>
          {/** TODO: Delete thread functionality */}
          {/** TODO: Show number of replies with recent replicants logos */}
          {/** TODO: show Thread post time */}
        </div>
        {!isComment && threadCommunity && !isInCommunityPage ? (
          <Link
            href={`/communities/${threadCommunity.id}`}
            className="mt-5 flex items-center"
          >
            <p className="text-subtle-medium text-gray-1">
              {formatDateString(createdAt)} | {threadCommunity.name} community
            </p>

            <Image
              src={threadCommunity.image}
              alt={threadCommunity.name}
              width={14}
              height={14}
              className="ml-1 rounded-full object-cover"
            />
          </Link>
        ) : (
          <p className="text-subtle-medium text-gray-1 mt-5">
            {formatDateString(createdAt)}
          </p>
        )}
      </section>
      {isCommenting && (
        <>
          <div className="h-[200px] w-[0.5px] bg-white" />
          <section className="flex flex-1 flex-col items-center justify-center">
            <CommentsTab
              targetThread={targetThreadProps}
              userData={{
                id: currentUserData.id,
                image: currentUserData.image,
              }}
            />
          </section>
        </>
      )}
    </article>
  );
}
