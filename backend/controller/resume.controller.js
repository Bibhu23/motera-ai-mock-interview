import fs from 'fs'
import { parseResume } from "../service/resumeParserService.js";

// Controller to handle resume upload
export const uploadResumeController = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // Convert file to base64
        const fileBuffer = fs.readFileSync(req.file.path);
        const base64File = fileBuffer.toString("base64");

        // Parse resume via ResumeParser
        const parsedData = await parseResume(base64File);

        // Delete temporary file
        fs.unlinkSync(req.file.path);

        // Example scoring logic (job-specific keywords)
        const keywords = ["React", "JavaScript", "Node.js", "Python", "SQL"];
        let score = 0;
        const text = parsedData.text || ""; // ResumeParser returns parsed text

        keywords.forEach((kw) => {
            if (text.toLowerCase().includes(kw.toLowerCase())) score += 10;
        });

        res.json({ score, parsedData });

    } catch (err) {
        console.error("Upload failed:", err.response?.data || err.message);
        res.status(500).json({
            error: err.response?.data || err.message || "Internal Server Error",
        });
    }
};
