"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import { connectToDB } from "../mongoose";
import User from "../models/user.model";
import Community from "../models/community.model";

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

export async function createThread({
  threadContent,
  threadAuthor,
  threadCommunity, // The ID of the community the thread belongs to, if any
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
      threadCommunity: communityIdObject,
    });

    // update User model
    await User.findByIdAndUpdate(threadAuthor, {
      $push: { threads: createdThread._id },
    });

    // update Community model
    if (communityIdObject) {
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { threads: createdThread._id },
      });
    }

    revalidatePath(path);
  } catch (error) {
    throw new Error(
      `There was an error posting your thread. Error details => ${error}`
    );
  }
}

export async function fetchThreads(pageNumber = 1, pageSize = 20) {
  connectToDB();

  // Calculate the number of threads to jump over in order to implement pagination
  const skipAmount = (pageNumber - 1) * pageSize;

  try {
    // Get the total number of threads, also for pagination purposes
    const totalThreadsCount = await Thread.countDocuments({
      parentId: { $in: [null, undefined] },
    });

    // Fetch posts that have no parents (top-level threads)
    const getThreadsQuery = Thread.find({
      parentId: { $in: [null, undefined] },
    })
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({ path: "threadAuthor", model: User })
      .populate({
        path: "threadCommunity",
        model: Community,
      })
      .populate({
        path: "children",
        populate: {
          path: "threadAuthor",
          model: User,
          select: "_id name parentId image",
        },
      });

    const obtainedThreads = await getThreadsQuery.exec();

    const isNext = totalThreadsCount > skipAmount + obtainedThreads.length;

    return { obtainedThreads, isNext };
  } catch (error) {
    throw new Error(`Couldn't fetch threads. Error details => ${error}`);
  }
}

export async function fetchThreadById(id: string) {
  connectToDB();
  try {
    // TODO: Populate community
    const fetchedThread = await Thread.findById(id)
      .populate({
        path: "threadAuthor",
        model: User,
        select: "_id userId name image",
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "threadAuthor",
            model: User,
            select: "_id userId name parentId image",
          },
          {
            path: "children",
            model: "Thread",
            populate: {
              path: "threadAuthor",
              model: User,
              select: "_id userId name parentId image",
            },
          },
        ],
      })
      .exec();

    return fetchedThread;
  } catch (error) {
    throw new Error(
      `Couldn't fetch the specific thread. Error details => ${error}`
    );
  }
}

export async function fetchThreadsByCommunity(
  communityId: string,
  pageNumber = 1,
  pageSize = 20
) {
  connectToDB();

  // Calculate the number of threads to jump over in order to implement pagination
  const skipAmount = (pageNumber - 1) * pageSize;

  try {
    // Get the total number of threads for the specified community, also for pagination purposes
    const totalThreadsCount = await Thread.countDocuments({
      parentId: { $in: [null, undefined] },
      threadCommunity: communityId,
    });

    // Fetch posts that have no parents (top-level threads) for the specified community
    const getThreadsQuery = Thread.find({
      parentId: { $in: [null, undefined] },
      threadCommunity: communityId,
    })
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({ path: "threadAuthor", model: User })
      .populate({
        path: "threadCommunity",
        model: Community,
      })
      .populate({
        path: "children",
        populate: {
          path: "threadAuthor",
          model: User,
          select: "_id name parentId image",
        },
      });

    const obtainedThreads = await getThreadsQuery.exec();

    const isNext = totalThreadsCount > skipAmount + obtainedThreads.length;

    return { obtainedThreads, isNext };
  } catch (error) {
    throw new Error(
      `Couldn't fetch threads for the specified community. Error details => ${error}`
    );
  }
}

export async function commentThread({
  threadId,
  CommentText,
  userId,
  path,
}: ThreadCommentParams) {
  console.log("User id from actions", userId);
  try {
    connectToDB();

    const threadToComment = await Thread.findById(threadId); // Find the parent thread (the thread the user is trying to comment)

    if (!threadToComment) throw new Error("Thread not found");

    // Create the new thread as a comment
    const createCommentThread = new Thread({
      threadContent: CommentText,
      threadAuthor: userId,
      parentId: threadId,
    });

    // save the new thread (comment) to database
    const savedCommentThread = await createCommentThread.save();

    // Update the parent Thread (original post that was commented)
    threadToComment.children.push(savedCommentThread._id);

    // Save the new changes in the orignal thread's collection
    await threadToComment.save();

    revalidatePath(path);
  } catch (error) {
    throw new Error(
      `There was an error posting your comment. Error details => ${error}`
    );
  }
}

export async function fetchAllComments(threadId: string): Promise<any[]> {
  try {
    connectToDB();
    const commentsList = await Thread.find({ parentId: threadId });
    const descendantThreads = [];

    for (const comment of commentsList) {
      const descendants = await fetchAllComments(comment._id);
      descendantThreads.push(comment, ...descendants);
    }

    return descendantThreads;
  } catch (error) {
    throw new Error(`Failed to delete thread. Error details => ${error}`);
  }
}

export async function deleteThread(
  threadId: string,
  path: string
): Promise<void> {
  try {
    connectToDB();

    // Find the thread to be deleted (the main thread)
    const mainThread = await Thread.findById(threadId).populate(
      "threadAuthor threadCommunity"
    );

    if (!mainThread) {
      throw new Error("Thread to delete not found");
    }

    // Fetch all child threads and their descendants recursively
    const descendantThreads = await fetchAllComments(threadId);

    // Get all descendant thread IDs including the main thread ID and child thread IDs
    const descendantThreadIds = [
      threadId,
      ...descendantThreads.map((thread) => thread._id),
    ];

    // Extract the authorIds and communityIds to update User and Community models respectively
    const uniqueAuthorIds = new Set(
      [
        ...descendantThreads.map((thread) =>
          thread.threadAuthor?._id?.toString()
        ), // Use optional chaining to handle possible undefined values
        mainThread.threadAuthor?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    const uniqueCommunityIds = new Set(
      [
        ...descendantThreads.map((thread) =>
          thread.threadCommunity?._id?.toString()
        ), // Use optional chaining to handle possible undefined values
        mainThread.threadCommunity?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    // Recursively delete child threads and their descendants
    await Thread.deleteMany({ _id: { $in: descendantThreadIds } });

    // Update User model
    await User.updateMany(
      { _id: { $in: Array.from(uniqueAuthorIds) } },
      { $pull: { threads: { $in: descendantThreadIds } } }
    );

    // Update Community model
    await Community.updateMany(
      { _id: { $in: Array.from(uniqueCommunityIds) } },
      { $pull: { threads: { $in: descendantThreadIds } } }
    );

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete thread. Error details => ${error}`);
  }
}
