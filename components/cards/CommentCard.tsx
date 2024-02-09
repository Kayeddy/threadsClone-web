"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ThreadCommentChildForm from "../forms/ThreadCommentChildForm";
import CommentChildCard from "./CommentChildCard";

interface Props {
  commentAuthor: {
    id: string;
    name: string;
    image: string;
  };
  currentUserId: string;
  commentContent: string;
  commentThreadId: string;
  commentChildren?: any;
}

export default function CommentCard({
  commentAuthor,
  commentContent,
  commentThreadId,
  commentChildren,
  currentUserId,
}: Props) {
  const [isCommenting, setIsCommenting] = useState(false);

  const handleCommenting = () => {
    setIsCommenting(!isCommenting);
  };

  return (
    <div className="flex items-start justify-between p-7 bg-[#000000a2] rounded-lg w-[95%] my-4 transition-all duration-200 ease-in-out">
      <div className="flex w-full flex-1 flex-row gap-4">
        <div className="flex flex-col items-center">
          <Link
            href={`${
              currentUserId === commentAuthor.id
                ? "/profile"
                : `/${commentAuthor.id}`
            }`}
            className="relative h-11 w-11"
          >
            <Image
              src={commentAuthor.image}
              alt="Thread_Author_Profile_Image"
              fill
              className="cursor-pointer rounded-full"
            />
          </Link>

          <div className="thread-card_bar" />
        </div>

        <div className="flex w-full flex-col items-start justify-center">
          <Link href={`/profile/${commentAuthor.id}`} className="w-fit">
            <h4 className="cursor-pointer text-base-semibold text-light-1">
              {currentUserId === commentAuthor.id ? "You" : commentAuthor.name}
            </h4>
          </Link>

          <p className="mt-2 text-small-regular text-light-2 whitespace-pre-line break-all text-left">
            {commentContent}
          </p>

          <div className="mt-5 flex flex-col gap-3 mb-4">
            <div className="flex gap-3.5">
              <Image
                src="/assets/heart-gray.svg"
                alt="Thread_Heart_Reaction_Icon"
                width={24}
                height={24}
                className="cursor-pointer object-contain hover:scale-110 transition-all duration-300 ease-in-out hover:brightness-200"
                //onClick={handlePostLike}
              ></Image>

              <Image
                src="/assets/reply.svg"
                alt="Thread_Reply_Icon"
                width={24}
                height={24}
                className={`cursor-pointer object-contain hover:scale-110 transition-all duration-300 ease-in-out hover:brightness-200 ${
                  isCommenting && "brightness-200"
                }`}
                onClick={handleCommenting}
              ></Image>
            </div>
            {isCommenting && (
              <div className="flex flex-col h-[200px]">
                <div className="h-[150px] overflow-hidden custom-scrollbar overflow-y-scroll">
                  {commentChildren.length > 0 ? (
                    commentChildren?.map((child: any) => (
                      <CommentChildCard
                        commentAuthor={child.author}
                        commentContent={child.content}
                        currentUserId={currentUserId}
                      />
                    ))
                  ) : (
                    <p className="no-result">No comments yet.</p>
                  )}
                </div>
                <div className="mt-8">
                  <ThreadCommentChildForm
                    parentThreadId={commentThreadId}
                    userId={commentAuthor.id}
                  />
                </div>
              </div>
            )}
            {commentChildren && !isCommenting && commentChildren.length > 0 && (
              <p
                className="mt-1 text-subtle-medium text-gray-1 hover:underline cursor-pointer"
                onClick={handleCommenting}
              >
                {commentChildren.length} replies
              </p>
            )}
          </div>
        </div>
      </div>
      {/** TODO: Delete thread functionality */}
      {/** TODO: Show number of replies with recent replicants logos */}
      {/** TODO: show Thread post time */}
    </div>
  );
}
