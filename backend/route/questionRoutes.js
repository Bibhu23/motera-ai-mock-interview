import express from "express";
import { generatefuntion } from "../service/openAiService.js";

const questionRouter = express.Router();

// GET /api/questions/generate?role=React Developer&difficulty=Easy
questionRouter.get("/generate", async (req, res) => {
    try {
        const { role, difficulty = "Easy" } = req.query;

        if (!role) {
            return res.status(400).json({ message: "Missing required parameter: role" });
        }

        // generatefuntion should return an array of questions
        const questions = await generatefuntion(role, difficulty);

        // always return object with "questions" key
        res.json({ questions });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to generate questions" });
    }
});

export default questionRouter;
