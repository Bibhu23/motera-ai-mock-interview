import express from "express";
import authMiddleware from "../middleware/Auth.js";
import { submitResumeScore } from "../controller/round1.controller.js";

const router = express.Router();

router.post("/submit-resume-score", authMiddleware, submitResumeScore);

export default router;
