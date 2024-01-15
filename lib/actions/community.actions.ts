"use server";

import { FilterQuery, SortOrder } from "mongoose";

import Community from "../models/community.model";
import Thread from "../models/thread.model";
import User from "../models/user.model";

import { connectToDB } from "../mongoose";

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

export async function createCommunity({
  id,
  name,
  alias,
  image,
  description,
  createdByUserId,
}: CreateCommunityProps) {
  try {
    connectToDB();

    // Find the user with the provided unique id
    const communityCreatorId = await User.findOne({ id: createdByUserId });

    if (!communityCreatorId) {
      throw new Error("User not found"); // Handle the case if the user with the id is not found
    }

    const newCommunity = new Community({
      id,
      name,
      alias,
      image,
      description,
      createdBy: communityCreatorId._id, // Use the mongoose ID of the user
    });

    const createdCommunity = await newCommunity.save();

    // Update User model
    communityCreatorId.communities.push(createdCommunity._id);
    await communityCreatorId.save();

    return createdCommunity;
  } catch (error) {
    // Handle any errors
    throw new Error(`Could not create community. Error details => ${error}`);
  }
}

export async function fetchCommunityDetails(communityId: string) {
  try {
    connectToDB();

    const communityDetails = await Community.findOne({ communityId }).populate([
      "createdBy",
      {
        path: "members",
        model: User,
        select: "name username image _id userId",
      },
    ]);

    return communityDetails;
  } catch (error) {
    throw new Error(
      `Could not fetch community details. Error details => ${error}`
    );
  }
}

export async function fetchCommunityPosts(communityId: string) {
  try {
    connectToDB();

    const communityPosts = await Community.findById(communityId).populate({
      path: "threads",
      model: Thread,
      populate: [
        {
          path: "threadAuthor",
          model: User,
          select: "name image userId", // Select the "name" and "_id" fields from the "User" model
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

    return communityPosts;
  } catch (error) {
    // Handle any errors
    throw new Error(
      `Could not fetch community posts. Error details => ${error}`
    );
  }
}

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

export async function addMemberToCommunity(
  communityId: string,
  memberId: string
) {
  try {
    connectToDB();

    // Find the community by its unique id
    const targetCommunity = await Community.findOne({ id: communityId });

    if (!targetCommunity) {
      throw new Error("Community not found");
    }

    // Find the user by their unique id
    const userToAdd = await User.findOne({ id: memberId });

    if (!userToAdd) {
      throw new Error("User not found");
    }

    // Check if the user is already a member of the community
    if (targetCommunity.members.includes(userToAdd._id)) {
      throw new Error("User is already a member of the community");
    }

    // Add the user's _id to the members array in the community
    targetCommunity.members.push(userToAdd._id);
    await targetCommunity.save();

    // Add the community's _id to the communities array in the user
    userToAdd.communities.push(targetCommunity._id);
    await userToAdd.save();

    return targetCommunity;
  } catch (error) {
    // Handle any errors
    throw new Error(
      `Could not add member to community. Error details => ${error}`
    );
  }
}

export async function removeUserFromCommunity(
  userId: string,
  communityId: string
) {
  try {
    connectToDB();

    const userIdObject = await User.findOne({ id: userId }, { _id: 1 });
    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    if (!userIdObject) {
      throw new Error("User not found");
    }

    if (!communityIdObject) {
      throw new Error("Community not found");
    }

    // Remove the user's _id from the members array in the community
    await Community.updateOne(
      { _id: communityIdObject._id },
      { $pull: { members: userIdObject._id } }
    );

    // Remove the community's _id from the communities array in the user
    await User.updateOne(
      { _id: userIdObject._id },
      { $pull: { communities: communityIdObject._id } }
    );

    return { success: true };
  } catch (error) {
    // Handle any errors
    throw new Error(
      `Could not remove user from community. Error details => ${error}`
    );
  }
}

export async function updateCommunityInfo({
  communityId,
  name,
  alias,
  image,
}: updateCommunityInfoProps) {
  try {
    connectToDB();

    // Find the community by its _id and update the information
    const targetCommunity = await Community.findOneAndUpdate(
      { id: communityId },
      { name, alias, image }
    );

    if (!targetCommunity) {
      throw new Error("Community not found");
    }

    return targetCommunity;
  } catch (error) {
    // Handle any errors
    throw new Error(`Could not update community. Error details => ${error}`);
  }
}

export async function deleteCommunity(communityId: string) {
  try {
    connectToDB();

    // Find the community by its ID and delete it
    const targetCommunity = await Community.findOneAndDelete({
      id: communityId,
    });

    if (!targetCommunity) {
      throw new Error("Community not found");
    }

    // Delete all threads associated with the community
    await Thread.deleteMany({ community: communityId });

    // Find all users who are part of the community
    const targetCommunityUsers = await User.find({ communities: communityId });

    // Remove the community from the 'communities' array for each user
    const updateUserPromises = targetCommunityUsers.map((user) => {
      user.communities.pull(communityId);
      return user.save();
    });

    await Promise.all(updateUserPromises);

    return targetCommunity;
  } catch (error) {
    throw new Error(`Could not delete community. Error details => ${error}`);
  }
}
