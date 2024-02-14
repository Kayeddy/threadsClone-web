"use server"; //This indicates that we're going to use server actions (when specific code should be rendered only on the server)

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Thread from "../models/thread.model";
import { FilterQuery, SortOrder } from "mongoose";
import Community from "../models/community.model";
import { convertObjectIdToString } from "../utils";

interface UpdateUserParams {
  userId: string;
  name: string;
  username: string;
  bio: string;
  image: string;
  path: string;
}

interface FetchAllUsersParams {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}

/**
 * Fetches a list of users based on search criteria, excluding the current user,
 * with support for pagination and sorting.
 *
 * @param {FetchAllUsersParams} params Parameters for user search and pagination.
 * @returns An object containing the list of retrieved users and a flag indicating the presence of a next page.
 */
export async function fetchAllUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: FetchAllUsersParams) {
  await connectToDB();

  try {
    const pageSkipAmount = (pageNumber - 1) * pageSize;
    const regex = new RegExp(searchString, "i");

    // Enhanced filter to exclude current user and include search functionality
    const filterQuery = {
      _id: { $ne: userId }, // Exclude the current user from the results
      ...(searchString && {
        // Conditionally add search criteria if searchString is provided
        $or: [
          { username: { $regex: regex, $options: "i" } }, // Case-insensitive search
          { name: { $regex: regex, $options: "i" } },
        ],
      }),
    };

    // Determining sort order
    const sortOptions = { createdAt: sortBy === "desc" ? -1 : 1 };

    // Execute the query with filter, sorting, pagination, and count total matching documents
    const [retrievedUsers, totalUsersCount] = await Promise.all([
      User.find(filterQuery)
        // @ts-ignore
        .sort(sortOptions)
        .skip(pageSkipAmount)
        .limit(pageSize),
      User.countDocuments(filterQuery),
    ]);

    // Calculate if more users exist beyond the current page
    const isNextPageRequired =
      totalUsersCount > pageSkipAmount + retrievedUsers.length;

    return { retrievedUsers, isNextPageRequired };
  } catch (error) {
    console.error(`Error fetching users: ${error}`);
    throw new Error(
      `Failed to fetch users from database. Error details: ${error}`
    );
  }
}

/**
 * Fetches data for a specific user, including the communities they are part of.
 *
 * @param userId - The unique identifier of the user whose data is being fetched.
 * @returns The user document with populated community information.
 */
export async function fetchUserData(userId: string) {
  connectToDB();

  try {
    const user = await User.findOne({ userId: userId }).populate({
      path: "communities",
      model: Community,
    });

    if (!user) {
      return null;
    }

    return user; // Directly returning the user object.
  } catch (error) {
    console.error(`Error fetching user data: ${error}`);
    throw new Error(`Failed to fetch user data. Error details: ${error}`);
  }
}

/**
 * Fetches data for a specific user by their MongoDB ObjectId, with an option to populate related communities.
 *
 * @param userId - The MongoDB ObjectId of the user to fetch.
 * @returns The user document, optionally with populated community information.
 */
export async function fetchUserDataByDBId(userId: string) {
  await connectToDB();

  try {
    const user = await User.findById(userId) // Simplified to use findById for direct _id querying.
      /*
      Uncomment below if community data population is needed. Ensure your User model
      correctly references communities for this to work as expected.
      .populate({
        path: "communities",
        // Assuming 'communities' is correctly set up in your User schema to reference Community documents.
      })
      */
      .exec(); // Execute the query.

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error(`Error fetching user by DB ID: ${error}`);
    throw new Error(`Failed to fetch user data. Error details: ${error}`);
  }
}

/**
 * Updates the user's profile information. If the specified user doesn't exist and `upsert` is true,
 * a new user document will be created. The function also supports revalidating specific paths to update cached data.
 *
 * @param {UpdateUserParams} params Parameters containing user details and the path for potential revalidation.
 * @returns A promise that resolves once the user is updated.
 */
export async function updateUser({
  userId,
  name,
  username,
  bio,
  image,
  path,
}: UpdateUserParams): Promise<void> {
  await connectToDB();

  try {
    // Verify if user exists before attempting an update or upsert
    const userExists = await User.exists({ userId: userId });

    if (!userExists) {
      // If user does not exist then create user
      await User.create({
        userId: userId,
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      });
    } else {
      // Perform the update operation
      await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            username: username.toLowerCase(),
            name,
            bio,
            image,
            onboarded: true,
          },
        },
        { new: true, runValidators: true }
      );
    }

    // Conditionally revalidate data associated with a specific path
    if (path === "/profile/edit" && typeof revalidatePath === "function") {
      revalidatePath(path);
    }
  } catch (error) {
    console.error(`Error updating user: ${error}`);
    throw new Error(
      `There was an error while trying to update the user. Error details: ${error}`
    );
  }
}

/**
 * Adds a newly created thread to the user's list of threads.
 *
 * @param {Object} params - Parameters including the userId and the createdThread.
 * @param {string} params.userId - The ID of the user to whom the thread will be added.
 * @param {Object} params.createdThread - The created thread object.
 */
export async function addUserThread({
  userId,
  createdThread,
}: {
  userId: string;
  createdThread: {
    threadAuthor: string;
    threadContent: string;
    threadCommunity: any; // Consider specifying a more precise type if possible
    _id: any; // Typically, this would be a string or ObjectId type
  };
}) {
  try {
    await connectToDB();

    const updateResult = await User.findByIdAndUpdate(
      userId,
      { $push: { threads: createdThread._id } },
      { new: true, runValidators: true } // Ensure the updated document is returned and validators are run
    );

    // Optionally, check the update result to ensure the operation was successful
    if (!updateResult) {
      throw new Error(`User with ID ${userId} not found.`);
    }
  } catch (error) {
    console.error(`Error adding thread to user ${userId}:`, error);
    throw new Error(`Failed to add thread to user. Error details: ${error}`);
  }
}

/**
 * Fetches threads created by a specific user, including community details and child threads.
 *
 * @param userId - The ID of the user whose threads are being fetched.
 * @returns A promise resolving to the user's threads with populated community and child thread information.
 */
export async function fetchProfileThreads(userId: string) {
  await connectToDB();

  try {
    // Directly fetching threads authored by the user to streamline the query
    const threads = await Thread.find({ threadAuthor: userId })
      .populate({
        path: "threadCommunity",
        select: "name id image", // Assuming 'id' is needed, though '_id' is automatically included
      })
      .populate({
        path: "children",
        populate: { path: "threadAuthor", select: "name image userId" },
      });

    if (!threads) {
      throw new Error("No threads found for this user.");
    }

    return threads;
  } catch (error) {
    console.error(
      `Error fetching profile threads for user ${userId}: ${error}`
    );
    throw new Error(
      `There was an error fetching user threads. Error details: ${error}`
    );
  }
}

/**
 * Fetches comments made by other users on threads created by the specified user.
 *
 * @param userId - The ID of the user whose activity is being fetched.
 * @returns An array of comments excluding those authored by the user.
 */
export async function getUserActivity(userId: string) {
  await connectToDB();

  try {
    // Directly aggregate to fetch comment threads excluding those authored by the user
    const userComments = await Thread.aggregate([
      // Match threads authored by the user to get comments on these threads
      { $match: { threadAuthor: userId } },
      // Lookup to join with the same collection to fetch child comments
      {
        $lookup: {
          from: "threads", // Ensure this matches your collection name in MongoDB
          localField: "children",
          foreignField: "_id",
          as: "comments",
        },
      },
      // Unwind the comments for further filtering
      { $unwind: "$comments" },
      // Match to filter out comments authored by the user
      { $match: { "comments.threadAuthor": { $ne: userId } } },
      // Project necessary fields
      {
        $project: {
          _id: "$comments._id",
          threadContent: "$comments.threadContent",
          threadAuthor: "$comments.threadAuthor",
          // Add other fields as necessary
        },
      },
      // Optionally, add a lookup stage to populate the threadAuthor details
      {
        $lookup: {
          from: "users", // Ensure this matches your user collection name in MongoDB
          localField: "threadAuthor",
          foreignField: "_id",
          as: "authorDetails",
        },
      },
      {
        $unwind: "$authorDetails",
      },
      {
        $project: {
          _id: 1,
          threadContent: 1,
          threadAuthor: { $arrayElemAt: ["$authorDetails", 0] }, // Adjust based on your needs
        },
      },
    ]);

    return userComments;
  } catch (error) {
    console.error(`Error fetching user activity: ${error}`);
    throw new Error(
      `There was an error fetching user activity. Error details: ${error}`
    );
  }
}
