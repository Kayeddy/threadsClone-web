import { DoubleArrowRightIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";

export default function ReplyThreadCard({
  replyData,
}: {
  replyData: {
    commentAuthor: any;
    commentContent: string;
    commentDate: Date;
    commentParentId: string;
    commentParentContent: string;
  };
}) {
  return (
    <div className="thread-card">
      <div className="flex w-full flex-1 flex-row gap-4">
        <div className="flex flex-col items-center">
          <Link
            href={`/profile/${replyData.commentAuthor._id.toString()}`}
            className="relative h-11 w-11"
          >
            <Image
              src={replyData.commentAuthor.image}
              alt="Thread Author Profile Image"
              fill
              sizes="32x32"
              className="cursor-pointer rounded-full"
            />
          </Link>
          <div className="thread-card_bar" />
        </div>

        <div className="flex w-full flex-col items-start justify-center">
          <Link
            href={`/profile/${replyData.commentAuthor._id.toString()}`}
            className="w-fit"
          >
            <h4 className="cursor-pointer text-base-semibold text-light-1">
              {replyData.commentAuthor.name}
            </h4>
          </Link>

          <Link
            href={`/profile/${replyData.commentAuthor._id.toString()}`}
            className="w-fit bg-dark-1 md:bg-glassmorphism mt-4 p-2 px-4 whitespace-pre-line break-all rounded-lg"
          >
            <h4 className="cursor-pointer text-small-regular">Replied to:</h4>
            <p className="no-result hover:ml-2 hover:underline transition-all duration-200 ease-in-out">
              {replyData.commentParentContent}
            </p>
          </Link>

          <p className="mt-2 text-small-regular text-light-2 whitespace-pre-line break-all">
            {replyData.commentContent}
          </p>
        </div>
      </div>
    </div>
  );
}
