import { formatDateString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import ShareThreadDialog from "../dialogs/ShareThreadDialog";
import CommentThreadDialog from "../dialogs/CommentThreadDialog";
import RepostThreadDialog from "../dialogs/RepostThreadDialog";

interface Props {
  threadId: string;
  currentUserId: string | null;
  currentUserImage?: string | undefined;
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
    _id: string;
    threadContent: string;
    children: any;
    threadAuthor: {
      _id: string;
      name: string;
      image: string;
    };
  }[];
  isComment?: boolean; // Not required
  isInCommunityPage?: boolean;
  renderCardInteractions: boolean;
}

export default function ThreadCard({
  threadId,
  currentUserId,
  currentUserImage,
  parentId,
  threadContent,
  threadAuthor,
  threadCommunity,
  createdAt,
  threadComments,
  isComment,
  isInCommunityPage = false,
  renderCardInteractions = true,
}: Props) {
  const handlePostLike = async () => {
    //TODO: Implement user like post backend logic
  };

  let commentsData;

  if (renderCardInteractions) {
    commentsData = threadComments.map((comment) => ({
      threadId: comment._id.toString(),
      threadContent: comment.threadContent,
      children: comment.children.map((commentChild: any) => {
        return {
          id: commentChild._id.toString(),
          content: commentChild.threadContent,
          author: {
            authorId: "",
            authorName: "",
            authorImage: "",
          },
        };
      }),
      threadAuthor: {
        id: comment.threadAuthor._id.toString(),
        name: comment.threadAuthor.name,
        image: comment.threadAuthor.image,
      },
    }));
  }

  return (
    <article
      className={`flex-container w-full flex-col rounded-xl p-7 ${
        isComment ? "px-0 xs:px-7" : "bg-dark-2"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <Link
              href={`/profile/${
                currentUserId === threadAuthor.id ? "" : threadAuthor.id
              }`}
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
                {`${
                  currentUserId === threadAuthor.id ? "You" : threadAuthor.name
                }`}
              </h4>
            </Link>

            <p className="mt-2 text-small-regular text-light-2 whitespace-pre-line break-all">
              {threadContent}
            </p>

            {renderCardInteractions && (
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

                  <CommentThreadDialog
                    triggerImage={
                      <Image
                        src="/assets/reply.svg"
                        alt="Thread_Reply_Icon"
                        width={24}
                        height={24}
                        className="cursor-pointer object-contain hover:scale-110 transition-all duration-300 ease-in-out hover:brightness-200"
                      ></Image>
                    }
                    parentThread={{
                      id: threadId,
                      userId: threadAuthor.id,
                      authorName: threadAuthor.name,
                      authorImage: threadAuthor.image,
                      content: threadContent,
                    }}
                    comments={commentsData ? commentsData : []}
                    currentUserId={currentUserId}
                    currentUserImage={currentUserImage}
                  />

                  <RepostThreadDialog
                    triggerImage={
                      <Image
                        src="/assets/repost.svg"
                        alt="Thread_Repost_Icon"
                        width={24}
                        height={24}
                        className="cursor-pointer object-contain hover:scale-110 transition-all duration-300 ease-in-out hover:brightness-200"
                      ></Image>
                    }
                    currentUserId={currentUserId}
                    threadContent={threadContent}
                  />

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
                    threadId={threadId}
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
            )}
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
    </article>
  );
}
