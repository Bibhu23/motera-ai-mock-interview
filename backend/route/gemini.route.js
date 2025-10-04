import express from "express";

import { getGeminiQuestions, getOpenEndedQuestions } from "../service/GeminiService.js";

const router = express.Router();

router.get("/questions/:section", async (req, res) => {
    try {
        const { section } = req.params;
        const limit = parseInt(req.query.limit) || 5;
        const questions = await getGeminiQuestions(section, limit);
        res.json(questions);
    } catch (err) {
        res.status(500).json({ error: "Failed to generate questions" });
    }
});

// New route: open-ended interview questions (no MCQ), aligned to skills
router.get("/open-ended", async (req, res) => {
    try {
        const { topic = "general technical" } = req.query;
        const limit = parseInt(req.query.limit) || 15;
        const questions = await getOpenEndedQuestions(String(topic), limit);
        res.json(questions);
    } catch (err) {
        console.error("/open-ended error:", err.message);
        res.status(500).json({ error: "Failed to generate open-ended questions" });
    }
});

export default router;