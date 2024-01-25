import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  image: { type: String },
  bio: { type: String },
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

{
  /*
    Whenever the application just starts the mongoose models is not going to exist in the database, therefore, 
    the schema will be created from the second condition after the OR conditional. However, after the schema 
    has been created and recognized, it will then fall back to using the models we provided internally.
*/
}
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
