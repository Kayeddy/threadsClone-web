import UserCard from "../cards/UserCard";

// Define TypeScript interfaces for clearer, type-safe code

interface Member {
  _id: string;
  name: string;
  username: string;
  image: string;
}

interface MembersTabProps {
  communityMembersList?: Member[] | null;
  currentUserId: string;
}

/**
 * MembersTab - Renders a list of community members using the UserCard component.
 *
 * @param {MembersTabProps} props - The component's properties.
 * @param {Member[]} [props.communityMembersList] - Optional list of community members to display.
 * @param {string} props.currentUserId - The ID of the current user viewing the members.
 */
export default function MembersTab({
  communityMembersList = [],
  currentUserId,
}: MembersTabProps) {
  // Check if there are members to display
  if (!communityMembersList || communityMembersList.length === 0) {
    return <div>No community members to display.</div>;
  }

  return (
    <section className="mt-9 flex flex-col gap-10">
      {communityMembersList.map((member) => {
        const memberDetails = {
          userId: member._id,
          name: member.name,
          username: member.username,
          userProfileImage: member.image,
          personType: "User",
        };
        return (
          <UserCard
            key={member._id}
            {...memberDetails}
            currentUserId={currentUserId}
          />
        );
      })}
    </section>
  );
}
