import { formatDateString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface Props {
  threadId: string;
  currentUserId: string | null;
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
}

export default function ThreadCard({
  threadId,
  currentUserId,
  parentId,
  threadContent,
  threadAuthor,
  threadCommunity,
  createdAt,
  threadComments,
  isComment,
}: Props) {
  const handlePostLike = async () => {
    //TODO: Implement user like post backend logic
  };
  return (
    <article
      className={`flex-container w-full flex-col rounded-xl  ${
        isComment ? "px-0 xs:px-7" : "bg-dark-2 p-7"
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

            <div className={`mt-5 flex flex-col gap-3 ${isComment && "mb-8"}`}>
              <div className="flex gap-3.5">
                <Image
                  src="/assets/heart-gray.svg"
                  alt="Thread_Heart_Reaction_Icon"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                  //onClick={handlePostLike}
                ></Image>

                <Link href={`/thread/${threadId}`}>
                  <Image
                    src="/assets/reply.svg"
                    alt="Thread_Reply_Icon"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain"
                  ></Image>
                </Link>

                <Image
                  src="/assets/repost.svg"
                  alt="Thread_Repost_Icon"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                ></Image>

                <Image
                  src="/assets/share.svg"
                  alt="Thread_Share_Icon"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                ></Image>
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
        {!isComment && threadCommunity && (
          <Link
            href={`/communities/${threadCommunity.id}`}
            className="mt-5 flex items-center"
          >
            <p className="text-subtle-medium text-gray-1">
              {formatDateString(createdAt)}- {threadCommunity.name} community
            </p>

            <Image
              src={threadCommunity.image}
              alt={threadCommunity.name}
              width={14}
              height={14}
              className="ml-1 rounded-full object-cover"
            />
          </Link>
        )}
      </div>
    </article>
  );
}
