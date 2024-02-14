import { formatDateString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import ThreadInteractionSection from "../shared/ThreadInteractionSection";

interface ThreadCardProps {
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
  threadLikes: string[];
  isComment?: boolean; // Not required
  isInCommunityPage?: boolean;
  renderCardInteractions: boolean;
}

interface AuthorSectionProps {
  currentUserId: string | null;
  threadAuthor: {
    id: string;
    name: string;
    image: string;
  };
}

interface ContentSectionProps {
  currentUserId: string | null;
  threadContent: string;
  threadAuthor: {
    id: string;
    name: string;
  };
}

interface InteractionSectionProps {
  threadId: string;
  threadAuthor: {
    id: string;
    name: string;
    image: string;
  };
  threadContent: string;
  currentUserId: string | null;
  currentUserImage: string | undefined;
  threadComments: {}[];
  threadLikes: string[];
}

interface CommunityInfoSectionProps {
  createdAt: string;
  threadCommunity: {
    id: string;
    name: string;
    image: string;
  } | null;
  isInCommunityPage?: boolean;
}

/**
 * Displays the thread author's profile picture and name.
 *
 * @param {AuthorSectionProps} props - The props for the component.
 */
const AuthorSection: React.FC<AuthorSectionProps> = ({
  currentUserId,
  threadAuthor,
}) => (
  <div className="flex flex-col items-center">
    <Link
      href={`/profile/${
        currentUserId === threadAuthor.id ? "" : threadAuthor.id
      }`}
      className="relative h-11 w-11"
    >
      <Image
        src={threadAuthor.image}
        alt="Thread Author Profile Image"
        fill
        className="cursor-pointer rounded-full"
      />
    </Link>
    <div className="thread-card_bar" />
  </div>
);

/**
 * Displays the thread content text.
 *
 * @param {ContentSectionProps} props - The props for the component.
 */
const ContentSection: React.FC<ContentSectionProps> = ({
  currentUserId,
  threadContent,
  threadAuthor,
}) => (
  <div className="flex w-full flex-col items-start justify-center">
    <Link href={`/profile/${threadAuthor.id}`} className="w-fit">
      <h4 className="cursor-pointer text-base-semibold text-light-1">
        {currentUserId === threadAuthor.id ? "You" : threadAuthor.name}
      </h4>
    </Link>
    <p className="mt-2 text-small-regular text-light-2 whitespace-pre-line break-all">
      {threadContent}
    </p>
  </div>
);

// Assuming InteractionSectionProps are defined with the necessary props
// that ThreadInteractionSection requires.
const InteractionSection: React.FC<InteractionSectionProps> = (props) => (
  <div className={`mt-5 flex flex-col gap-3`}>
    <ThreadInteractionSection {...props} />
  </div>
);

/**
 * Shows information about the community, if applicable.
 *
 * @param {CommunityInfoSectionProps} props - The props for the component.
 */
const CommunityInfoSection: React.FC<CommunityInfoSectionProps> = ({
  createdAt,
  threadCommunity,
  isInCommunityPage,
}) => {
  if (!threadCommunity || isInCommunityPage) {
    return (
      <p className="text-subtle-medium text-gray-1 mt-5">
        {formatDateString(createdAt)}
      </p>
    );
  }

  return (
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
  );
};

/**
 * Represents a card displaying a thread with interactions such as comments.
 *
 * @param {Object} props - The component props.
 * @param {string} props.threadId - The unique identifier for the thread.
 * @param {string|null} props.currentUserId - The current user's ID, or null if not logged in.
 * @param {string} [props.currentUserImage] - The current user's profile image URL.
 * @param {string|null} props.parentId - The parent thread ID, if this is a comment thread.
 * @param {string} props.threadContent - The content of the thread.
 * @param {Object} props.threadAuthor - The author of the thread.
 * @param {Object|null} props.threadCommunity - The community the thread belongs to, if any.
 * @param {string} props.createdAt - The creation date of the thread.
 * @param {Array} props.threadComments - The comments on the thread.
 * @param {boolean} [props.isComment=false] - Flag indicating if the thread is a comment.
 * @param {boolean} [props.isInCommunityPage=false] - Flag indicating if the thread is displayed within a community page.
 * @param {boolean} [props.renderCardInteractions=true] - Flag indicating if interactions (like, share, etc.) should be rendered.
 */
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
  threadLikes,
  isComment,
  isInCommunityPage = false,
  renderCardInteractions = true,
}: ThreadCardProps) {
  let commentsData: {}[] = [];

  if (renderCardInteractions) {
    commentsData = threadComments.map((comment) => ({
      threadId: comment._id.toString(),
      threadContent: comment.threadContent,
      children: comment.children.map((commentChild: any) => {
        return {
          id: commentChild._id.toString(),
          content: commentChild.threadContent,
          author: {
            authorId: comment.threadAuthor._id.toString(),
            authorName: comment.threadAuthor.name,
            authorImage: comment.threadAuthor.image,
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
      <article
        className={`flex-container w-full flex-col rounded-xl p-7 ${
          isComment ? "px-0 xs:px-7" : "bg-dark-2"
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex w-full flex-1 flex-row gap-4">
            {/* Author Section */}
            <AuthorSection
              currentUserId={currentUserId}
              threadAuthor={threadAuthor}
            />

            <div className="flex flex-col">
              {/* Content Section */}
              <ContentSection
                currentUserId={currentUserId}
                threadContent={threadContent}
                threadAuthor={threadAuthor}
              />

              {/* Interaction Section, if applicable */}
              {renderCardInteractions && (
                <InteractionSection
                  threadId={threadId}
                  threadAuthor={threadAuthor}
                  threadContent={threadContent}
                  currentUserId={currentUserId}
                  currentUserImage={currentUserImage}
                  threadComments={commentsData}
                  threadLikes={threadLikes}
                />
              )}
            </div>
          </div>
        </div>

        {/* Community Info Section, if applicable */}
        {!isComment && (
          <CommunityInfoSection
            createdAt={createdAt}
            threadCommunity={threadCommunity}
            isInCommunityPage={isInCommunityPage}
          />
        )}
      </article>
    </article>
  );
}
