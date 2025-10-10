import express from "express";
import authMiddleware from "../middleware/Auth.js";
import { getInterviewRounds, submitTechnicalScore } from "../controller/round3.controller.js";

const router = express.Router();

router.get("/interview-rounds", authMiddleware, getInterviewRounds);
router.post("/submit-technical-score", authMiddleware, submitTechnicalScore); // 🔹 Add this

export default router;
