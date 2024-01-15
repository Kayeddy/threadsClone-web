import mongoose from "mongoose";

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

{
  /*
    Whenever the application just starts the mongoose models is not going to exist in the database, therefore, 
    the schema will be created from the second condition after the OR conditional. However, after the schema 
    has been created and recognized, it will then fall back to using the models we provided internally.
*/
}
const Community =
  mongoose.models.Community || mongoose.model("Community", communitySchema);

export default Community;
