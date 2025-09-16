import express from "express";
import { generatefuntion } from "../service/openAiService.js";

const questionRouter = express.Router();

// GET /api/questions/generate?role=React&difficulty=easy
questionRouter.get("/generate", async (req, res) => {
    try {
        const { role, difficulty = "easy" } = req.query;

        if (!role) {
            return res.status(400).json({ message: "Missing required parameter: role" });
        }

        const questions = await generatefuntion(role, difficulty);
        res.json({ questions });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to generate questions" });
    }
});

export default questionRouter;
