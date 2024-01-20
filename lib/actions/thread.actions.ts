"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import { connectToDB } from "../mongoose";
import { addUserThread } from "./user.actions";
import User from "../models/user.model";

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
    console.log("Thread author sent down to thread.action", threadAuthor);
    const createdThread = await Thread.create({
      threadContent,
      threadAuthor,
      threadCommunity: null,
    });

    // update user model
    await addUserThread({ userId: threadAuthor, createdThread });

    // update community model
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
