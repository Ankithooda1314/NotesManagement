import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true },
    description: { type: String, required: true },
    imgUrl: { type: String },
  },
  { timestamps: true }
);

const Notes = mongoose.model("Notes", noteSchema);
export default Notes;
