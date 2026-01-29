import express from "express";

import userRoutes from "./userRoutes.js";
import notesRoutes from "./notesRoutes.js"

const router = express.Router();

router.use("/user", userRoutes);

router.use("/notes",notesRoutes)

export default router;