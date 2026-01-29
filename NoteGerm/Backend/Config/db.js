//mongodb+srv://rahulverma:rahul@cluster0.fpxfh.mongodb.net/Notes

// import mongoose from "mongoose";

// const connectDb = async () => {
//   try {
//     await mongoose.connect("mongodb://localhost:27017");
//     console.log("MongoDB connected");
//   } catch (err) {
//     console.error("MongoDB connection error:", err);
//     process.exit(1);
//   }
// };

// export default connectDb;



import mongoose from "mongoose";

const connectDb = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI not found in environment variables");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected ✅");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

export default connectDb;

