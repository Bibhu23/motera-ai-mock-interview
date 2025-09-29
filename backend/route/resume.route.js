import express from "express";
import { uploadResumeController } from "../controller/resume.controller.js";
import { upload } from "../middleware/upload.js";
import authMiddleware from "../middleware/Auth.js";
const router = express.Router();

router.post("/upload-resume", authMiddleware, upload.single("resume"), uploadResumeController);

export default router;