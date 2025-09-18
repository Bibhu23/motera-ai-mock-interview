import express from "express";
import { getGeminiQuestions } from "../service/GeminiService.js";

const router = express.Router();

router.get("/questions/:section", async (req, res) => {
    try {
        const { section } = req.params;
        const limit = parseInt(req.query.limit) || 5;
        const questions = await getGeminiQuestions(section, limit);
        res.json(questions);
    } catch (err) {
        console.error("Error in /questions route:", err.message);
        res.status(500).json({ error: err.message });
    }
});

export default router;
