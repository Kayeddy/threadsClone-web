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
      community: communityIdObject, // Assign communityId if provided, or leave it null for personal account
    });

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
 * Fetches threads with optional pagination, focusing on top-level threads.
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
    const queryCriteria = { parentId: { $exists: false } }; // Simplified to target top-level threads.

    const totalThreadsCount = await Thread.countDocuments(queryCriteria);
    const threads = await Thread.find(queryCriteria)
      .sort({ createdAt: -1 }) // Ensure sorting is explicitly defined for consistency.
      .skip(skipAmount)
      .limit(pageSize)
      .populate("threadAuthor", "name image") // Simplify population with direct field selection.
      .populate("threadCommunity", "name image description")
      .populate({
        path: "children",
        populate: { path: "threadAuthor", select: "name image" },
      })
      .exec(); // Execute the query.

    const isNext = totalThreadsCount > skipAmount + threads.length;

    // Consider converting ObjectId to string if necessary for the client-side.
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

    // Optionally convert ObjectId fields to strings for the entire document structure
    // Assuming convertObjectIdToString is adjusted to handle deep structures safely
    return convertObjectIdToString(fetchedThread);
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

    // Assuming revalidatePath is a custom function for cache invalidation or similar purposes
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
    const commentsList = await Thread.find({ parentId: threadId });
    let descendantThreads = [];

    // Use parallel promises to fetch descendants to improve performance
    const descendantPromises = commentsList.map(async (comment) => {
      const descendants = await fetchAllComments(comment._id);
      return [comment, ...descendants];
    });

    // Await all recursive calls to complete and flatten the results
    descendantThreads = (await Promise.all(descendantPromises)).flat();

    return descendantThreads;
  } catch (error) {
    console.error(
      `Error fetching all comments for thread ${threadId}: ${error}`
    );
    throw new Error(`Failed to fetch comments. Error details: ${error}`);
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
    // Ensure the main thread exists before proceeding
    const mainThreadExists = await Thread.exists({ _id: threadId });
    if (!mainThreadExists) {
      throw new Error("Thread to delete not found");
    }

    // Fetch all child threads and their descendants recursively
    const descendantThreads = await fetchAllComments(threadId);

    // Prepare an array of all thread IDs to delete (including the main thread)
    const threadIdsToDelete = [
      threadId,
      ...descendantThreads.map((thread) => thread._id),
    ];

    // Perform the deletion of all threads in one operation
    await Thread.deleteMany({ _id: { $in: threadIdsToDelete } });

    // Construct sets of unique author and community IDs from the threads
    const uniqueAuthorIds = new Set(
      descendantThreads.map((thread) => thread.threadAuthor.toString())
    );
    const uniqueCommunityIds = new Set(
      descendantThreads
        .filter((thread) => thread.threadCommunity)
        .map((thread) => thread.threadCommunity.toString())
    );

    // Update User and Community models to remove references to the deleted threads
    await User.updateMany(
      { _id: { $in: Array.from(uniqueAuthorIds) } },
      { $pull: { threads: { $in: threadIdsToDelete } } }
    );
    await Community.updateMany(
      { _id: { $in: Array.from(uniqueCommunityIds) } },
      { $pull: { threads: { $in: threadIdsToDelete } } }
    );

    // Invoke the revalidatePath function if it's part of your cache invalidation strategy or similar
    if (typeof revalidatePath === "function") {
      revalidatePath(path);
    }
  } catch (error) {
    console.error(`Error deleting thread: ${error}`);
    throw new Error(`Failed to delete thread. Error details: ${error}`);
  }
}
