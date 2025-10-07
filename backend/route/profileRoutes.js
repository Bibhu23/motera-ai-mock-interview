import express from "express";
import { getProfile, updateProfile } from "../controller/profileController.js";

const router = express.Router();

// Fetch user profile data
router.get("/", getProfile);

// Update user profile data
router.post("/update", updateProfile);

export default router;
