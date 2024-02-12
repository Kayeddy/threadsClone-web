import mongoose from "mongoose";

/**
 * Represents a thread or post in the application. Threads can be standalone or
 * part of a community, and can also be comments on other threads, forming a nested structure.
 */
const threadSchema = new mongoose.Schema({
  threadContent: { type: String, required: true },
  threadAuthor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  threadCommunity: { type: mongoose.Schema.Types.ObjectId, ref: "Community" },
  createdAt: { type: Date, default: Date.now },
  parentId: { type: String }, // Indicates if this thread is a comment on another thread
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
    },
  ],
});

// Index for efficient querying and sorting by creation date
threadSchema.index({ createdAt: -1 }); // Index on 'createdAt' for quick retrieval of recent threads

const Thread = mongoose.models.Thread || mongoose.model("Thread", threadSchema);

export default Thread;
