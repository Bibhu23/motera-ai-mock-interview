import User from "../model/userModel.js";

export const submitResumeScore = async (req, res) => {
    try {
        const userId = req.user.id;
        const { score } = req.body; // score from resume analysis API

        if (score == null) return res.status(400).json({ error: "Score is required" });

        const user = await User.findByIdAndUpdate(
            userId,
            { resumeScore: score, resumeDate: new Date() },
            { new: true }
        );

        if (!user) return res.status(404).json({ error: "User not found" });

        res.json({ message: "Resume score updated successfully", user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update resume score" });
    }
};
