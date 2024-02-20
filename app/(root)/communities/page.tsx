import CommunityCard from "@/components/cards/CommunityCard";
import { fetchCommunities } from "@/lib/actions/community.actions";

export default async function Communities() {
  const fetchCommunitiesParams = {
    searchString: "",
    pageNumber: 1,
    pageSize: 25,
  };

  const fetchedCommunities = (await fetchCommunities(fetchCommunitiesParams))
    .communities;

  return (
    <section>
      <h1 className="head-text mb-10"> Communities </h1>
      {/** Seaerchbar */}
      <div className="mt-14 flex flex-col gap-9">
        {fetchedCommunities.length === 0 ? (
          <p className="no-result">No communties available</p>
        ) : (
          <>
            {fetchedCommunities.map((community) => {
              const communityCardProps = {
                id: community._id,
                name: community.name,
                alias: community.alias,
                imgUrl: community.image,
                createdBy: community.createdBy,
                members: community.members,
              };

              return (
                <CommunityCard key={community.id} {...communityCardProps} />
              );
            })}
          </>
        )}
      </div>
    </section>
  );
}
