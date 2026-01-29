import express from "express";
import { CreateNotes, GetNotes, GetNoteById, UpdateNote, DeleteNote } from "../Controller/Notes.js";
import upload from "../Middleware/multer.js";
import isAuth from "../Middleware/isAuth.js";
import { GetUserStats } from "../Controller/UserHelper.js";

const router = express.Router();

router.post("/notes", isAuth, upload.single("image"), CreateNotes);
router.get("/notes", isAuth, GetNotes);
router.get("/notes/:id", isAuth, GetNoteById);
router.put("/notes/:id", isAuth, upload.single("image"), UpdateNote);
router.delete("/notes/:id", isAuth, DeleteNote);

//ye all hai dekho
router.get("/allStats",isAuth,GetUserStats);

export default router;
