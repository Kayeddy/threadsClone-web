"use client";
import ThreadCard from "@/components/cards/ThreadCard";
import ThreadCommentForm from "@/components/forms/ThreadCommentForm";

const ThreadCommentsSection = ({
  commentThread,
  userData,
}: {
  commentThread: {
    _id: string;
    parentId: string;
    threadContent: string;
    threadAuthor: {
      name: string;
      image: string;
      id: string;
    };
    threadCommunity: any;
    createdAt: any;
    children: any;
  };
  userData: {
    id: string;
    image: string;
  };
}) => {
  const commentThreadCardProps = {
    threadId: commentThread._id,
    currentUserId: userData.id,
    parentId: commentThread.parentId ? commentThread.parentId : null,
    threadContent: commentThread.threadContent,
    threadAuthor: commentThread.threadAuthor,
    threadCommunity: commentThread.threadCommunity,
    createdAt: commentThread.createdAt,
    threadComments: commentThread.children,
  };

  return (
    <ThreadCard
      key={commentThread._id}
      {...commentThreadCardProps}
      currentUserData={userData}
      isComment
    />
  );
};

export default function CommentsTab({
  targetThread,
  userData,
}: {
  targetThread: any;
  userData: {
    id: string;
    image: string;
  };
}) {
  console.log(targetThread);

  const threadCommentFormProps = {
    threadId: targetThread.threadId,
    currentLoggedInUserImage: userData.image,
    userId: userData.id,
  };

  return (
    <section>
      {/**
     
       */}
      <div className="flex flex-col">
        {targetThread.children ? (
          targetThread.children.map((commentThread: any) => (
            <ThreadCommentsSection
              key={commentThread._id}
              commentThread={{ ...commentThread }}
              userData={userData}
            />
          ))
        ) : (
          <p className="text-light-1 text-base-regular">
            Be the first to comment!
          </p>
        )}

        <div className="mt-7">
          <ThreadCommentForm {...threadCommentFormProps} />
        </div>
      </div>
    </section>
  );
}
