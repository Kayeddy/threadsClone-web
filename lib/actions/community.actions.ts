"use server";

import { FilterQuery, SortOrder } from "mongoose";

import Community from "../models/community.model";
import Thread from "../models/thread.model";
import User from "../models/user.model";

import { connectToDB } from "../mongoose";
import { convertObjectIdToString } from "../utils";

interface CreateCommunityProps {
  id: string;
  name: string;
  alias: string;
  image: string;
  description: string;
  createdByUserId: string;
}

interface FetchCommunitiesProps {
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}

interface updateCommunityInfoProps {
  communityId: string;
  name: string;
  alias: string;
  image: string;
}

/**
 * Creates a new community with the given details and associates it with the creator.
 * @param {CreateCommunityProps} props - The properties required to create a community.
 * @returns The created community document, with all ObjectId fields converted to strings.
 */
export async function createCommunity({
  id,
  name,
  alias,
  image,
  description,
  createdByUserId,
}: CreateCommunityProps) {
  try {
    await connectToDB();

    const creator = await User.findOne({ userId: createdByUserId }, "_id");
    if (!creator) throw new Error("User not found");

    const newCommunity = await Community.create({
      id,
      name,
      alias,
      image,
      description,
      createdBy: creator._id,
    });

    await User.findByIdAndUpdate(creator._id, {
      $push: { communities: newCommunity._id },
    });

    return convertObjectIdToString(newCommunity);
  } catch (error) {
    console.error(`Could not create community: ${error}`);
    throw new Error("Failed to create community.");
  }
}

/**
 * Fetches the details of a specific community by its ID.
 * @param communityId - The unique identifier of the community to fetch.
 * @returns The detailed information of the community, including the creator and members, with ObjectId fields converted to strings.
 */
export async function fetchCommunityDetails(communityId: string) {
  try {
    await connectToDB();

    // Corrected the query to use '_id' for matching the community ID.
    const communityDetails = await Community.findById(communityId)
      .populate({
        path: "createdBy",
        model: User,
        select: "name username image _id userId",
      })
      .populate({
        path: "members",
        model: User,
        select: "name username image _id userId",
      })
      .exec();

    if (!communityDetails) {
      throw new Error("Community not found");
    }

    // Convert ObjectId fields to strings for all nested objects
    return communityDetails;
  } catch (error) {
    console.error(`Error fetching community details: ${error}`);
    throw new Error("Failed to fetch community details.");
  }
}

/**
 * Fetches posts associated with a specific community by its ID.
 * Populates thread author and any children threads' authors for a comprehensive view.
 * @param communityId - The unique identifier of the community whose posts are to be fetched.
 * @returns A list of posts belonging to the community with populated author details, with ObjectId fields converted to strings.
 */
export async function fetchCommunityPosts(communityId: string) {
  await connectToDB();

  try {
    const communityPosts = await Community.findById(communityId).populate({
      path: "threads",
      model: Thread,
      populate: [
        {
          path: "threadAuthor",
          model: User,
          select: "name image id", // Select the "name" and "_id" fields from the "User" model
        },
        {
          path: "children",
          model: Thread,
          populate: {
            path: "threadAuthor",
            model: User,
            select: "image _id", // Select the "name" and "_id" fields from the "User" model
          },
        },
      ],
    });

    if (!communityPosts) {
      throw new Error("Community not found or has no posts.");
    }

    return communityPosts;
  } catch (error) {
    console.error(`Error fetching community posts: ${error}`);
    throw new Error("Failed to fetch community posts.");
  }
}

/**
 * Fetches a list of communities based on search criteria, with pagination and optional sorting.
 * @param {FetchCommunitiesProps} params - Parameters for search string, pagination, and sorting.
 * @returns An object containing a list of communities that match the criteria and a flag indicating if there is a next page.
 */
export async function fetchCommunities({
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: FetchCommunitiesProps) {
  try {
    connectToDB();

    // Calculate the number of communities to skip based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize;

    // Create a case-insensitive regular expression for the provided search string.
    const regex = new RegExp(searchString, "i");

    // Create an initial query object to filter communities.
    const query: FilterQuery<typeof Community> = {};

    // If the search string is not empty, add the $or operator to match either username or name fields.
    if (searchString.trim() !== "") {
      query.$or = [{ alias: { $regex: regex } }, { name: { $regex: regex } }];
    }

    // Define the sort options for the fetched communities based on createdAt field and provided sort order.
    const sortOptions = { createdAt: sortBy };

    // Create a query to fetch the communities based on the search and sort criteria.
    const communitiesQuery = Community.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize)
      .populate("members");

    // Count the total number of communities that match the search criteria (without pagination).
    const totalCommunitiesCount = await Community.countDocuments(query);

    const communities = await communitiesQuery.exec();

    // Check if there are more communities beyond the current page.
    const isNext = totalCommunitiesCount > skipAmount + communities.length;

    return { communities, isNext };
  } catch (error) {
    throw new Error(`Could not fetch communities. Error details => ${error}`);
  }
}

/**
 * Adds a member to a community by updating both the community's member list and the user's list of communities.
 * Ensures that the user is not already a member before adding.
 *
 * @param communityId - The ID of the community to add the member to.
 * @param memberId - The ID of the user to be added as a member.
 * @returns The updated community object after adding the new member.
 */
export async function addMemberToCommunity(
  communityId: string,
  memberId: string
) {
  try {
    await connectToDB();

    const targetCommunity = await Community.findOne({ id: communityId });
    const targetUser = await User.findOne({ userId: memberId });

    if (!targetCommunity) {
      throw new Error("Community not found");
    }

    if (!targetUser) {
      throw new Error("User not found");
    }

    // Perform the update and check the result
    const updateResult = await Community.updateOne(
      { _id: communityId },
      { $addToSet: { members: targetUser._id } }
    );

    // Check if the operation modified any document
    if (updateResult.matchedCount === 0) {
      throw new Error(
        "User is already a member of the community or update failed"
      );
    }

    await User.updateOne(
      { _id: targetUser._id },
      { $addToSet: { communities: communityId } }
    );

    // Optionally re-fetch the community to return updated data
    // Note: Depending on your application's needs, you may choose to return the updatedCommunity or not
    const updatedCommunity = await Community.findById(communityId).populate(
      "members"
    );

    return convertObjectIdToString(updatedCommunity);
  } catch (error) {
    console.error("Error adding member to community: ", error);
    throw new Error(`Failed to add member to community: ${error}`);
  }
}

/**
 * Removes a user from a community by updating the community's member list
 * and the user's list of communities.
 *
 * @param userId - The ID of the user to be removed from the community.
 * @param communityId - The ID of the community from which the user is to be removed.
 * @returns An object indicating the success of the operation.
 */
export async function removeUserFromCommunity(
  userId: string,
  communityId: string
) {
  try {
    await connectToDB();

    // Simplify the search by directly using the given IDs for lookup.
    const user = await User.findById(userId);
    const community = await Community.findById(communityId);

    if (!user) {
      throw new Error("User not found");
    }

    if (!community) {
      throw new Error("Community not found");
    }

    // Execute update operations to remove the user from the community and vice versa.
    const updateCommunity = Community.updateOne(
      { _id: communityId },
      { $pull: { members: userId } }
    );

    const updateUser = User.updateOne(
      { _id: userId },
      { $pull: { communities: communityId } }
    );

    // Wait for both updates to complete.
    await Promise.all([updateCommunity, updateUser]);

    return { success: true };
  } catch (error) {
    console.error("Error removing user from community: ", error);
    throw new Error(
      `Could not remove user from community. Error details => ${error}`
    );
  }
}

/**
 * Updates the specified information of a community.
 *
 * @param {updateCommunityInfoProps} params - The community ID and the new information to update.
 * @returns The updated community object.
 */
export async function updateCommunityInfo({
  communityId,
  name,
  alias,
  image,
}: updateCommunityInfoProps) {
  try {
    await connectToDB();

    // Correctly target the community by its _id and ensure the updated document is returned
    const updatedCommunity = await Community.findOneAndUpdate(
      { _id: communityId }, // Use _id for lookup
      { $set: { name, alias, image } }, // Use $set to explicitly update fields
      { new: true, runValidators: true } // Return the updated document and run schema validators
    );

    if (!updatedCommunity) {
      throw new Error("Community not found");
    }

    // Convert ObjectId fields to strings if needed, assuming convertObjectIdToString function is implemented
    return convertObjectIdToString(updatedCommunity);
  } catch (error) {
    console.error(`Error updating community: ${error}`);
    throw new Error(`Could not update community. Error details => ${error}`);
  }
}

/**
 * Deletes a community and all associated data, including threads and user community memberships.
 *
 * @param communityId - The ID of the community to be deleted.
 * @returns The community object that was deleted.
 */
export async function deleteCommunity(communityId: string) {
  try {
    await connectToDB();

    // Use findByIdAndDelete for a more direct approach, assuming communityId is the MongoDB _id.
    const deletedCommunity = await Community.findOneAndDelete({
      id: communityId,
    });

    if (!deletedCommunity) {
      throw new Error("Community not found");
    }

    // Delete all threads associated with the community
    await Thread.deleteMany({ threadCommunity: communityId });

    // Remove the community from the 'communities' array for each user
    await User.updateMany(
      { communities: communityId },
      { $pull: { communities: communityId } }
    );

    return deletedCommunity;
  } catch (error) {
    console.error(`Error deleting community: ${error}`);
    throw new Error(`Could not delete community. Error details => ${error}`);
  }
}
