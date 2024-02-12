import mongoose from "mongoose";

/**
 * Represents a community within the application, which can contain multiple threads
 * and have multiple members. Each community is uniquely identified by its name and alias.
 */
const communitySchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true, unique: true },
  alias: { type: String, required: true, unique: true },
  image: { type: String },
  description: { type: String },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  threads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
    },
  ],
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

// Indexes for efficient querying
communitySchema.index({ name: 1 }); // Index on 'name' for quick lookup by name
communitySchema.index({ image: 1 }); // Index on 'alias' for quick lookup by alias

const Community =
  mongoose.models.Community || mongoose.model("Community", communitySchema);

export default Community;
