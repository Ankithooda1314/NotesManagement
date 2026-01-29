 import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDb from "./Config/db.js";
import cors from "cors";
import  "./Config/Cloudinary.js";

import router from "./Route/index.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

// MongoDB connect
connectDb();

app.get("/", (req, res) => {
  res.send("Server running");
});

app.use("/api",router)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

