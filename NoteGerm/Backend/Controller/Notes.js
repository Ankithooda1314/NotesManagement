import Notes from "../Model/Notes.js";
import cloudinary from "../Config/cloudinary.js";
import { incrementNotesCreated, incrementNotesUpdated, incrementNotesDeleted } from "../Controller/UserHelper.js";

// 🔹 Create Note
export const CreateNotes = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description)
      return res.status(400).json({ message: "Title & Description required" });

    let imageUrl = "", imageId = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: "notes" });
      imageUrl = result.secure_url;
      imageId = result.public_id;
    }

 

    const note = await Notes.create({
      user: req.user.id,
      title,
      description,
      imgUrl: imageUrl,
      imgId: imageId
    });

    // 🔹 Update UserStats
    await incrementNotesCreated(req.user.id);

    res.status(201).json({ success: true, message: "Note created successfully", note });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating note" });
  }
};

// 🔹 Get All Notes for a User
export const GetNotes = async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, notes });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching notes" });
  }
};

// 🔹 Get Single Note by ID
export const GetNoteById = async (req, res) => {
  try {
    const note = await Notes.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json({ success: true, note });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching note" });
  }
};

// 🔹 Update Note
export const UpdateNote = async (req, res) => {
  try {
    const { title, description } = req.body;

    const note = await Notes.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

  // 🔹 Handle image remove
if (req.body.removeImage === "true") {
  if (note.imgId) {
    await cloudinary.uploader.destroy(note.imgId);
  }
  note.imgUrl = "";
  note.imgId = "";
}

// 🔹 Update image if new file provided
if (req.file) {
  if (note.imgId) {
    await cloudinary.uploader.destroy(note.imgId);
  }

  const result = await cloudinary.uploader.upload(req.file.path, { folder: "notes" });
  note.imgUrl = result.secure_url;
  note.imgId = result.public_id;
}

    if (title) note.title = title;
    if (description) note.description = description;

    await note.save();

    // 🔹 Update UserStats
    await incrementNotesUpdated(req.user.id);

    res.json({ success: true, message: "Note updated", note });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating note" });
  }
};

// 🔹 Delete Note
export const DeleteNote = async (req, res) => {
  try {
    const note = await Notes.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    if (note.imgId) await cloudinary.uploader.destroy(note.imgId);

    await note.deleteOne();

    // 🔹 Update UserStats
    await incrementNotesDeleted(req.user.id);

    res.json({ success: true, message: "Note deleted successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error deleting note" });
  }
};
