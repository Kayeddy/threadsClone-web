import mongoose from "mongoose";

const threadSchema = new mongoose.Schema({
  threadContent: { type: String, required: true },
  threadAuthor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  threadCommunity: { type: mongoose.Schema.Types.ObjectId, ref: "Community" },
  createdAt: { type: Date, default: Date.now },
  parentId: { type: String }, //In case this thread is a comment
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread", // This self reference indicates that a children of a thread can have multiple other threads as children (nested comments)
    },
  ],
});

const Thread = mongoose.models.Thread || mongoose.model("Thread", threadSchema);

export default Thread;
