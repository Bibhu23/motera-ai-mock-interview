import express from "express";
import { uploadResumeController } from "../controller/resume.controller.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post("/upload-resume", upload.single("resume"), uploadResumeController);

export default router;
