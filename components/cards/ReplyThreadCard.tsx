import Image from "next/image";
import Link from "next/link";

/**
 * Displays a card component for a reply in a thread, including information about the reply,
 * the author, and the content of the original thread the reply was made to. It provides links
 * to the author's profile and the original thread. The component utilizes Next.js's `Link`
 * for navigation and `Image` for displaying the author's profile picture.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.replyData - The data related to the reply and its context within a thread.
 * @param {Object} props.replyData.commentAuthor - The author of the comment. Includes `_id`, `name`, and `image` properties.
 * @param {string} props.replyData.commentContent - The content of the reply.
 * @param {Date} props.replyData.commentDate - The date when the reply was posted.
 * @param {string} props.replyData.commentParentId - The ID of the parent thread to which the reply was made.
 * @param {string} props.replyData.commentParentContent - A brief content of the parent thread.
 *
 * @returns {React.ReactElement} A React element representing the visual structure of a reply within a thread,
 * including profile image, author name, content of the reply, and a reference to the original thread's content.
 */
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

          <div className="w-fit bg-dark-1 md:bg-glassmorphism mt-4 p-2 px-4 whitespace-pre-line break-all rounded-lg">
            <h4 className="cursor-pointer text-small-regular">Replied to:</h4>
            <Link href={`/thread/${replyData.commentParentId.toString()}`}>
              <p className="no-result hover:ml-2 hover:underline transition-all duration-200 ease-in-out">
                {replyData.commentParentContent}
              </p>
            </Link>
          </div>

          <p className="mt-2 text-small-regular text-light-2 whitespace-pre-line break-all">
            {replyData.commentContent}
          </p>
        </div>
      </div>
    </div>
  );
}
