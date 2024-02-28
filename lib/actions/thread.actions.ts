"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import { connectToDB } from "../mongoose";
import User from "../models/user.model";
import Community from "../models/community.model";
import { convertObjectIdToString } from "../utils";

interface ThreadCreationParams {
  threadContent: string;
  threadAuthor: string;
  threadCommunity: string | null;
  likes?: string[] | null;
  path: string;
}

interface ThreadCommentParams {
  threadId: string;
  CommentText: string;
  userId: string;
  path: string;
}

/**
 * Creates a new thread, optionally associating it with a community and updating related models.
 *
 * @param {ThreadCreationParams} params Parameters needed to create a thread, including content, author, and optional community.
 * @returns The created thread object.
 */
export async function createThread({
  threadContent,
  threadAuthor,
  threadCommunity,
  path,
}: ThreadCreationParams) {
  try {
    connectToDB();

    const communityIdObject = await Community.findOne(
      { id: threadCommunity },
      { _id: 1 }
    );

    const createdThread = await Thread.create({
      threadContent,
      threadAuthor,
      threadCommunity: communityIdObject, // Assign communityId if provided, or leave it null for personal account
    });

    console.log("Created Thread details in thread actions", createdThread);

    // Update User model
    await User.findByIdAndUpdate(threadAuthor, {
      $push: { threads: createdThread._id },
    });

    if (communityIdObject) {
      // Update Community model
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { threads: createdThread._id },
      });
    }

    revalidatePath(path);

    return createdThread; // Return the created thread for confirmation or further processing
  } catch (error) {
    console.error(`Error creating thread: ${error}`);
    throw new Error(`Could not create thread. Error details: ${error}`);
  }
}

/**
 * Fetches threads with optional pagination, focusing on top-level threads that don't belong to any communities.
 * Populates related data for thread author, community, and nested children threads.
 *
 * @param pageNumber - The current page number for pagination.
 * @param pageSize - The number of threads to display per page.
 * @returns An object containing paginated threads and a flag indicating the presence of a next page.
 */
export async function fetchThreads(
  pageNumber: number = 1,
  pageSize: number = 20
) {
  await connectToDB(); // Ensure database connection is established.

  const skipAmount = (pageNumber - 1) * pageSize;

  try {
    const queryCriteria = {
      $and: [
        { parentId: { $exists: false } }, // Checking for top-level threads.
        {
          $or: [
            { threadCommunity: null },
            { threadCommunity: { $exists: false } },
          ],
        }, // Checking threads that do not belong to any community.
      ],
    };
    const totalThreadsCount = await Thread.countDocuments(queryCriteria);
    const threads = await Thread.find(queryCriteria)
      .sort({ createdAt: -1 }) // Sorting by creation date, newest first.
      .skip(skipAmount)
      .limit(pageSize)
      .populate("threadAuthor", "name image") // Populating author of the thread.
      .populate("threadCommunity", "name image description") // Populating associated community.
      .populate({
        path: "children",
        populate: [
          {
            path: "threadAuthor",
            select: "name image",
          },
          {
            path: "children",
          },
        ],
      })
      .exec(); // Execute the populated query.

    const isNext = totalThreadsCount > skipAmount + threads.length;

    return { threads, isNext };
  } catch (error) {
    console.error(`Error fetching threads: ${error}`);
    throw new Error(`Couldn't fetch threads. Error details: ${error}`);
  }
}

/**
 * Fetches a single thread by its ID, including information about the thread author,
 * any child comments, and the authors of those comments. Also populates community information
 * if the thread is associated with a community.
 *
 * @param id - The ID of the thread to fetch.
 * @returns The fetched thread with populated author, children, children's authors, and community.
 */
export async function fetchThreadById(id: string) {
  await connectToDB();
  try {
    const fetchedThread = await Thread.findById(id)
      .populate("threadAuthor", "userId name image") // Simplify the selection for readability.
      .populate("threadCommunity", "name description") // Populate community information.
      .populate({
        path: "children",
        populate: {
          path: "threadAuthor",
          select: "userId name image", // Adjust to ensure consistent and necessary field selection.
        },
      })
      .populate({
        path: "children",
        populate: {
          path: "children", // Populate grandchildren (nested comments).
          populate: {
            path: "threadAuthor",
            select: "userId name image", // Similarly, adjust for grandchildren.
          },
        },
      })
      .exec();

    if (!fetchedThread) {
      throw new Error("Thread not found");
    }

    return fetchedThread;
  } catch (error) {
    console.error(`Error fetching thread by ID: ${error}`);
    throw new Error(
      `Couldn't fetch the specific thread. Error details: ${error}`
    );
  }
}

/**
 * Adds a comment to a specific thread. The comment itself is represented as a thread document,
 * linked to the parent thread via the parentId field.
 *
 * @param {ThreadCommentParams} params - Parameters including the ID of the thread to comment on,
 *                                       the comment text, the user ID of the commenter, and the path for revalidation.
 */
export async function commentThread({
  threadId,
  CommentText,
  userId,
  path,
}: ThreadCommentParams) {
  try {
    await connectToDB();

    // Ensure parent thread exists before attempting to add a comment
    const threadExists = await Thread.exists({ _id: threadId });
    if (!threadExists) {
      throw new Error("Thread not found");
    }

    // Create and save the new comment thread
    const savedCommentThread = await Thread.create({
      threadContent: CommentText,
      threadAuthor: userId,
      parentId: threadId,
    });

    // Push the comment thread ID to the parent thread's children array in a single operation to avoid race conditions
    await Thread.findByIdAndUpdate(threadId, {
      $push: { children: savedCommentThread._id },
    });

    if (typeof revalidatePath === "function") {
      revalidatePath(path);
    }

    return savedCommentThread; // Optionally return the saved comment thread for confirmation or further action
  } catch (error) {
    console.error(`Error posting comment: ${error}`);
    throw new Error(
      `There was an error posting your comment. Error details: ${error}`
    );
  }
}

/**
 * Recursively fetches all comments for a given thread, including nested comments.
 *
 * @param threadId - The ID of the thread for which to fetch comments.
 * @returns A promise that resolves to an array of all comments and their descendants.
 */
export async function fetchAllComments(threadId: string): Promise<any[]> {
  await connectToDB();
  try {
    // Directly fetching comments that are first-level replies to the specified threadId
    const commentsList = await Thread.find({ parentId: threadId })
      .populate({
        path: "threadAuthor",
        select: "name image userId",
      })
      .select("threadContent parentId") // Include threadContent and parentId in the selection
      .exec(); // Execute the query

    return commentsList; // Directly return the list of first-level comments without further processing
  } catch (error) {
    console.error(
      `Error fetching all comments for thread ${threadId}: ${error}`
    );
    throw new Error(`Failed to fetch comments. Error details: ${error}`);
  }
}

/**
 * Toggles the like status of a thread for a given user. If the user has already liked the thread, their like is removed. If not, their like is added.
 *
 * @param {string} threadId - The ID of the thread to be liked or unliked.
 * @param {string} userId - The ID of the user performing the like or unlike action.
 * @returns {Promise<Thread>} The updated thread document after the like or unlike operation.
 * @throws {Error} Throws an error if the thread cannot be found or if there is a database operation failure.
 */
export async function toggleLikeThread(
  threadId: string,
  userId: string,
  path: string
): Promise<typeof Thread> {
  await connectToDB(); // Make sure you're connected to your database

  try {
    const thread = await Thread.findById(threadId);

    if (!thread) {
      throw new Error("Thread not found");
    }

    // Determine if the user has liked the thread
    const userHasLiked = thread.likes.includes(userId);

    if (userHasLiked) {
      // If user has already liked the thread, remove their ID
      await Thread.findByIdAndUpdate(threadId, { $pull: { likes: userId } });
    } else {
      // If user hasn't liked the thread yet, add their ID
      await Thread.findByIdAndUpdate(threadId, {
        $addToSet: { likes: userId },
      });
    }

    // Optionally, re-fetch or return a status indicating the operation was successful
    const updatedThread = await Thread.findById(threadId);

    revalidatePath(path);

    return updatedThread;
  } catch (error) {
    console.error(`Error toggling like on thread: ${error}`);
    throw new Error(`Could not toggle like on thread. Error details: ${error}`);
  }
}

/**
 * Retrieves the list of likes (user IDs) from a Thread given the Thread ID.
 * @param {string} threadId - The ID of the Thread from which to retrieve the likes.
 * @returns {Promise<string[]>} A promise that resolves to an array of user IDs who liked the Thread.
 */
export async function getLikesFromThread(threadId: string): Promise<string[]> {
  await connectToDB(); // Make sure you're connected to your database

  try {
    // Find the Thread by its ID
    const thread = await Thread.findById(threadId).select("likes -_id"); // Select only the likes array, exclude the _id

    if (!thread) {
      throw new Error("Thread not found");
    }

    // Return the likes array
    return thread.likes;
  } catch (error) {
    console.error(`Error retrieving likes from thread: ${error}`);
    throw new Error(
      `Could not retrieve likes from thread. Error details: ${error}`
    );
  }
}

/**
 * Deletes a thread and all its descendant threads, updating related User and Community models.
 *
 * @param threadId - The ID of the thread to be deleted.
 * @param path - The path to revalidate, if applicable in the context of caching or UI updates.
 * @returns A promise resolved once the thread and its descendants are deleted, and related models are updated.
 */
export async function deleteThread(
  threadId: string,
  path: string
): Promise<void> {
  await connectToDB();

  try {
    // Ensure the thread exists before proceeding
    const threadToDelete = await Thread.findByIdAndDelete(threadId);
    if (!threadToDelete) {
      throw new Error("Thread to delete not found");
    }

    // Update the User model
    await User.updateMany(
      { threads: threadToDelete._id },
      { $pull: { threads: threadToDelete._id } }
    );

    // Update the Community model
    await Community.updateMany(
      { threads: threadToDelete._id },
      { $pull: { threads: threadToDelete._id } }
    );

    // Invoke the revalidatePath function
    if (typeof revalidatePath === "function") {
      revalidatePath(path);
    }
  } catch (error) {
    console.error(`Error deleting thread: ${error}`);
    throw new Error(`Failed to delete thread. Error details: ${error}`);
  }
}
