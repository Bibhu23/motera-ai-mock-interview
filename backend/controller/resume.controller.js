import fs from "fs";
import { parseResume } from "../service/resumeParserService.js";
import { handlePayment } from "../middleware/PaymentController.js";
import User from "../model/userModel.js";

// Controller to handle resume upload
export const uploadResumeController = async (req, res) => {
    try {
        // 1️⃣ Check if a file was uploaded
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // 2️⃣ Get userId from JWT (set by authMiddleware)
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized: User not found" });
        }

        // 3️⃣ Deduct credit
        const creditBalance = await handlePayment(userId);

        const fileBuffer = fs.readFileSync(req.file.path);
        const base64File = fileBuffer.toString("base64");

        const parsedData = await parseResume(req.file.path);
        console.log("full Parsed Resume Data:", parsedData);
        if (parsedData.parsed?.skills && userId) {
            await User.findByIdAndUpdate(userId, { skills: parsedData.parsed.skills });
        }

        // 5️⃣ Delete temporary file
        fs.unlinkSync(req.file.path);


        // 6️⃣ Calculate ATS score (keyword-based)
        const keywords = ["React", "JavaScript", "Node.js", "Python", "SQL", "Java", "EXPRESS.JS", "MONGODB", "MY SQL"];
        let score = 0;
        const text = (parsedData.normalized_text || "").toLowerCase();

        keywords.forEach((kw) => {
            if (text.toLowerCase().includes(kw.toLowerCase())) score += 10;
        });

        // 7️⃣ Return response
        res.json({ score, parsedData, creditBalance });
    } catch (err) {
        console.error("Upload failed:", err.message || err);
        res.status(500).json({ error: err.message || "Internal Server Error" });
    }
};
