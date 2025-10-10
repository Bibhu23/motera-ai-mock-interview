// round3.controller.js
import User from "../model/userModel.js";

export const getInterviewRounds = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        const rounds = [
            { round: "Resume", status: user.resumeScore != null ? "Completed" : "Pending", score: user.resumeScore, date: user.resumeDate },
            { round: "Technical", status: user.technicalScore != null ? "Completed" : "Pending", score: user.technicalScore, date: user.technicalDate },
            { round: "Written", status: user.writtenScore != null ? "Completed" : "Pending", score: user.writtenScore, date: user.writtenDate },
            { round: "HR", status: user.hrStatus !== "Pending" ? "Completed" : "Pending", score: null, date: user.hrDate },
        ];

        res.json({ rounds });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch rounds" });
    }
};

export const submitTechnicalScore = async (req, res) => {
    try {
        const { technicalScore } = req.body;
        const userId = req.user.id;

        console.log("Controller: technicalScore received =", technicalScore);

        // Fetch user
        const user = await User.findById(userId);
        console.log("Controller: User fetched from DB =", user);

        if (!user) return res.status(404).json({ error: "User not found" });

        // Update score and date
        user.technicalScore = technicalScore; // <-- assign the new score
        user.technicalDate = new Date();

        await user.save(); // <-- save the updated user

        console.log("Controller: Technical score updated successfully");

        res.status(200).json({ message: "Technical score updated", technicalScore });
    } catch (err) {
        console.error("Controller: Error updating technical score", err);
        res.status(500).json({ error: "Server error" });
    }
};
