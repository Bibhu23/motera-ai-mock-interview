// controllers/hrController.js
import User from "../model/userModel.js";

export const getInterviewRounds = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        const rounds = [
            { round: "Resume", status: user.resumeScore != null ? "Completed" : "Pending", score: user.resumeScore, date: user.resumeDate },
            { round: "Technical", status: user.technicalScore != null ? "Completed" : "Pending", score: user.technicalScore, date: user.technicalDate },
            { round: "Written", status: user.writtenScore != null ? "Completed" : "Pending", score: user.writtenScore, date: user.writtenDate },
            { round: "HR", status: user.hrStatus !== "Pending" ? "Completed" : "Pending", score: user.hrScore, date: user.hrDate },
        ];
        res.json({ rounds });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch rounds" });
    }
};


export const submitHRScore = async (req, res) => {
    try {
        const { hrStatus, hrScore } = req.body; // hrStatus: 'Pass' or 'Fail'
        const userId = req.user.id;

        console.log("Controller: HR data received =", { hrStatus, hrScore });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        // Update HR info
        user.hrStatus = hrStatus;       // 'Pass' or 'Fail'
        if (hrScore !== undefined) user.hrScore = hrScore;
        user.hrDate = new Date();

        await user.save();

        console.log("Controller: HR round updated successfully");
        res.status(200).json({ message: "HR round updated", hrStatus, hrScore });
    } catch (err) {
        console.error("Controller: Error updating HR round", err);
        res.status(500).json({ error: "Server error" });
    }
};
