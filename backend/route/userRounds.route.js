import express from "express";
import authMiddleware from "../middleware/Auth.js";
import User from "../model/userModel.js";

const router = express.Router();

router.get("/interview-rounds", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        const rounds = [
            { round: "Resume Shortlist", score: user.resumeScore, date: user.resumeDate, status: user.resumeScore !== null ? "Completed" : "Pending" },
            { round: "Written Test", score: user.writtenScore, date: user.writtenDate, status: user.writtenScore !== null ? "Completed" : "Pending" },
            { round: "Technical Interview", score: user.technicalScore, date: user.technicalDate, status: user.technicalScore !== null ? "Completed" : "Pending" },
            { round: "HR Round", score: null, date: user.hrDate, status: user.hrStatus }
        ];

        res.json({ rounds });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch interview rounds" });
    }
});
router.post("/update-round", authMiddleware, async (req, res) => {
    try {
        const { round, score } = req.body;

        if (!round || score == null)
            return res.status(400).json({ error: "Round and score are required" });

        const update = {};
        const now = new Date();

        switch (round) {
            case "Resume Shortlist":
                update.resumeScore = score;
                update.resumeDate = now;
                break;
            case "Written Test":
                update.writtenScore = score;
                update.writtenDate = now;
                break;
            case "Technical Interview":
                update.technicalScore = score;
                update.technicalDate = now;
                break;
            case "HR Round":
                update.hrStatus = score > 0 ? "Completed" : "Pending";
                update.hrDate = now;
                break;
            default:
                return res.status(400).json({ error: "Invalid round name" });
        }

        const user = await User.findByIdAndUpdate(req.user.id, update, { new: true });
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json({ message: `${round} updated successfully`, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update round" });
    }
});

export default router;
