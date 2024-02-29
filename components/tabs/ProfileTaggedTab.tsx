"use client";

import UserTaggedCard from "../cards/UserTaggedCard";

export default function ({ userTagsData }: { userTagsData: any }) {
  return (
    <div className="mt-9 flex flex-col gap-10">
      {userTagsData.length > 0 ? (
        userTagsData.map((tag: any) => (
          <UserTaggedCard
            key={`tag_byUser-${tag.taggedBy.username}_content-${tag.thread.threadContent}`}
            tagData={tag}
          />
        ))
      ) : (
        <p className="no-result">You haven't been tagged in any Threads yet</p>
      )}
    </div>
  );
}
