import UserStats from "../Model/userStats.js";


// Note create
export const incrementNotesCreated = async (userId) => {
  await UserStats.findOneAndUpdate(
    { user: userId },
    { $inc: { totalNotes: 1, notesCreated: 1 }, $set: { lastLogin: new Date() } },
    { upsert: true, new: true }
  );
};

// Note update
export const incrementNotesUpdated = async (userId) => {
  await UserStats.findOneAndUpdate(
    { user: userId },
    { $inc: { notesUpdated: 1 } },
    { upsert: true, new: true }
  );
};

// Note delete
export const incrementNotesDeleted = async (userId) => {
  await UserStats.findOneAndUpdate(
    { user: userId },
    { $inc: { totalNotes: -1, notesDeleted: 1 } },
    { new: true }
  );
};




// 🔹 Fetch stats for logged-in user
export const GetUserStats = async (req, res) => {
  try {
    const stats = await UserStats.findOne({ user: req.user.id });
    if (!stats) {
      return res.json({
        success: true,
        stats: {
          totalNotes: 0,
          notesCreated: 0,
          notesUpdated: 0,
          notesDeleted: 0,
          lastLogin: null
        }
      });
    }
    res.json({ success: true, stats });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching user stats" });
  }
};


