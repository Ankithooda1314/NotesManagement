import { UserSignup, UserLogin } from "../Controller/User.js";
import express from "express";
const router = express.Router();

router.post("/signup", UserSignup);
router.post("/login", UserLogin);



export default router;
