import express from "express";
import { getProfile, updateProfile } from "../controller/profileController.js";
import { upload } from "../middleware/upload.js";
import authMiddleware from "../middleware/Auth.js";

const router = express.Router();

//find userId to display user specific profile

// Fetch user profile data
///user/api/v1/profile/getProfile

// Update user profile data
router.post(
  "/update",
  authMiddleware,
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "certifications", maxCount: 5 },
  ]),
  updateProfile
); //user/api/v1/profile/update
router.get("/getProfile", authMiddleware, getProfile);
export default router;