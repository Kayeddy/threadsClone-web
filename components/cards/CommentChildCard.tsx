"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ThreadCommentChildForm from "../forms/ThreadCommentChildForm";

interface Props {
  commentAuthor: {
    authorId: string;
    authorName: string;
    authorImage: string;
  };
  currentUserId: string;
  commentContent: string;
  commentChildren?: any;
}

export default function CommentChildCard({
  commentAuthor,
  commentContent,
  currentUserId,
}: Props) {
  return (
    <div className="flex items-start justify-between py-2 rounded-lg w-[90%] my-4">
      <div className="flex w-full flex-1 flex-row gap-4">
        <div className="flex flex-col items-center">
          <Link
            href={`${
              currentUserId === commentAuthor.authorId
                ? "/profile"
                : `/${commentAuthor.authorId}`
            }`}
            className="relative h-11 w-11"
          >
            <Image
              src={commentAuthor.authorImage}
              alt="Thread_Author_Profile_Image"
              fill
              className="cursor-pointer rounded-full"
            />
          </Link>

          <div className="thread-card_bar" />
        </div>

        <div className="flex w-full flex-col items-start justify-center">
          <Link href={`/profile/${commentAuthor.authorId}`} className="w-fit">
            <h4 className="cursor-pointer text-base-semibold text-light-1">
              {currentUserId === commentAuthor.authorId
                ? "You"
                : commentAuthor.authorName}
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
            </div>
          </div>
        </div>
      </div>
      {/** TODO: Delete thread functionality */}
      {/** TODO: Show number of replies with recent replicants logos */}
      {/** TODO: show Thread post time */}
    </div>
  );
}
