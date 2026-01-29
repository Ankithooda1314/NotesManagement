//mongodb+srv://rahulverma:rahul@cluster0.fpxfh.mongodb.net/Notes

import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017");
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

export default connectDb;
