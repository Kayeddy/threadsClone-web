import CommunityCard from "@/components/cards/CommunityCard";
import { fetchCommunities } from "@/lib/actions/community.actions";

/**
 * Fetches communities based on predefined parameters and displays them.
 * If no communities are found, displays a message indicating so.
 * Includes error handling for the fetch operation.
 *
 * @returns {Promise<JSX.Element>} A section element containing a list of CommunityCards or a message.
 */
export default async function Communities() {
  const fetchCommunitiesParams = {
    searchString: "",
    pageNumber: 1,
    pageSize: 25,
  };

  let fetchedCommunities;

  try {
    const response = await fetchCommunities(fetchCommunitiesParams);
    fetchedCommunities = response.communities ?? [];
  } catch (error) {
    console.error("Error fetching communities:", error);
    return <p>Failed to load communities.</p>;
  }

  return (
    <section>
      <h1 className="head-text mb-10">Communities</h1>
      <div className="mt-14 flex flex-col gap-9">
        {fetchedCommunities.length === 0 ? (
          <p className="no-result">No communities available</p>
        ) : (
          fetchedCommunities.map((community) => {
            // Manually constructing props for clarity and to ensure only necessary data is passed
            const communityCardProps = {
              id: community._id,
              name: community.name,
              alias: community.alias,
              imgUrl: community.image,
              createdBy: community.createdBy,
              members: community.members,
            };

            return (
              <CommunityCard key={community._id} {...communityCardProps} />
            );
          })
        )}
      </div>
    </section>
  );
}
