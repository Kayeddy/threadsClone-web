import mongoose from "mongoose";

let isConnected = false; // Variable to check the connection status

export const connectToDB = async () => {
  mongoose.set("strictQuery", true); // Prevent unknown field queries

  if (!process.env.MONGODB_URL)
    return console.log("Database (MongoDB) URL not found");
  if (isConnected) return console.log("Database is up and running!");

  try {
    await mongoose.connect(process.env.MONGODB_URL);
    isConnected = true;
    console.log("Connection to mongoDB successful");
  } catch (error) {
    console.log(
      `There was an error while connecting to the database. Error details:  ${error}`
    );
  }
};
