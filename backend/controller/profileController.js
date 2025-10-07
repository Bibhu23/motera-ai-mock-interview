import User from "../model/userModel.js";

// GET /user/api/v1/profile/get
export const getProfile = async (req, res) => {
    try {
        const { userId } = req.query; // or from token later
        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({
            name: user.name,
            email: user.email,
            resumeUrl: user.resumeUrl || "",
            experience: user.experience || "",
            education: user.education || "",
            skills: user.skills || [],
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

// POST /user/api/v1/profile/update
export const updateProfile = async (req, res) => {
    try {
        const { userId, name, email, experience, education, skills, resumeUrl } = req.body;

        const user = await User.findByIdAndUpdate(
            userId,
            { name, email, experience, education, skills, resumeUrl },
            { new: true }
        );

        res.json({ message: "Profile updated successfully", user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};
