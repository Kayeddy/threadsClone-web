import UserCard from "../cards/UserCard";

export default function MembersTab({
  communityMembersList = null,
}: {
  communityMembersList?: any[] | null;
}) {
  return (
    <section className="mt-9 flex flex-col gap-10">
      {communityMembersList &&
        communityMembersList.map((member: any) => {
          const memberDetails = {
            userId: member._id,
            name: member.name,
            username: member.username,
            userProfileImage: member.image,
            personType: "User",
          };
          return <UserCard {...memberDetails} />;
        })}
    </section>
  );
}
