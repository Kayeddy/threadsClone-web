import mongoose from "mongoose";

/**
 * Represents a user of the application. Users can create threads, join communities,
 * and have a list of threads they've participated in.
 */
const userSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  image: { type: String },
  bio: { type: String },
  tagged: [
    {
      thread: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Thread",
        required: true,
      },
      taggedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
  ],
  threads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
    },
  ],
  onboarded: {
    type: Boolean,
    default: false,
  },
  communities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
    },
  ],
});

// Indexes for efficient querying and data management
userSchema.index({ userId: 1 }); // Index on 'userId' for quick user identification
userSchema.index({ image: 1 }); // Index on 'userId' for quick user image retrieval
userSchema.index({ username: 1 }, { unique: true }); // Unique index on 'username'

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
