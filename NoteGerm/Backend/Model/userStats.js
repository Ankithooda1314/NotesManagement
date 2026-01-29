import mongoose from "mongoose";

const userStatsSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    totalNotes: { type: Number, default: 0 },
    notesCreated: { type: Number, default: 0 },
    notesUpdated: { type: Number, default: 0 },
    notesDeleted: { type: Number, default: 0 },
    lastLogin: { type: Date },
  },
  { timestamps: true } 
);

const UserStats = mongoose.model("UserStats", userStatsSchema);
export default UserStats;
