import express from "express";

import { getGeminiQuestions, getOpenEndedQuestions, getMCQQuestionsBasedOnResume, getTechnicalQuestionsBasedOnResume, getHrQuestionsBased } from "../service/GeminiService.js";
import User from "../model/userModel.js";
import Profile from "../model/profileModel.js"
import authMiddleware from "../middleware/Auth.js";

const router = express.Router();

router.get("/questions/:section", async (req, res) => {
    try {
        const { section } = req.params;
        const limit = parseInt(req.query.limit) || 5;
        const questions = await getGeminiQuestions(section, limit);
        res.json(questions);
    } catch (err) {
        console.log("/questions error:", err.message);

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

// Route: Generate MCQ questions based on user's resume skills
router.get("/mcq-based-on-resume", authMiddleware, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized: User not found" });
        }

        const limit = parseInt(req.query.limit) || 15;

        // Get user's skills from database
        const user = await User.findById(userId);
        const skills = user?.skills || [];
        const profile = await Profile.findOne({ userId });
        const experienceYears = profile?.experience || 0;
        console.log("User skills:", skills, "Experience Years:", experienceYears);

        const questions = await getMCQQuestionsBasedOnResume(skills, limit,experienceYears);
        res.json(questions);
    } catch (err) {
        console.error("/mcq-based-on-resume error:", err.message);
        res.status(500).json({ error: "Failed to generate MCQ questions based on resume" });
    }
});

// Route: Generate technical questions based on user's resume skills
router.get("/technical-based-on-resume", authMiddleware, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized: User not found" });
        }

        const limit = parseInt(req.query.limit) || 10;

        // Get user's skills from database
        const user = await User.findById(userId);
        const skills = user?.skills || [];
        const experienceYears = user?.experienceYears || 0;
        console.log("User experience years:", experienceYears);
        console.log("User skills:", skills);
        

        const questions = await getTechnicalQuestionsBasedOnResume(skills, limit,experienceYears);
        res.json(questions);
    } catch (err) {
        console.error("/technical-based-on-resume error:", err.message);
        res.status(500).json({ error: "Failed to generate technical questions based on resume" });
    }
});
router.get("/hr-base", authMiddleware, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized: User not found" });
        }
        const limit = parseInt(req.query.limit) || 10;
        const questions = await getHrQuestionsBased(limit);
        res.json(questions);

    } catch (error) {
        console.error("/hr-based qs error:", error.message);
        res.status(500).json({ error: "Failed to generate technical questions based on resume", error });
    }
}
);
export default router