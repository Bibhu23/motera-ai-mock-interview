// routes/hr.route.js
import express from "express";
import { getInterviewRounds, submitHRScore } from "../controller/hrController.js";
import authMiddleware from "../middleware/Auth.js";

const router = express.Router();

router.get("/interview-rounds", authMiddleware, getInterviewRounds);
// POST HR round result
router.post("/submit-hr-score", authMiddleware, submitHRScore);

export default router;
