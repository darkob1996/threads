import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URL) return console.log("MongoDB URL not found!");

  if (isConnected) return console.log("Already connected to MongoDB!");

  try {
    const DB = process.env.MONGODB_URL.replace(
      "<PASSWORD>",
      process.env.MONGODB_PASSWORD
    );

    mongoose.connect(DB);

    isConnected = true;

    console.log("Connected to MongoDB");
  } catch (err) {
    console.log(err);
  }
};
