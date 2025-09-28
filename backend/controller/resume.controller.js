import { parseResume } from "../service/resumeParserService.js";
import fs from "fs";
import { scoreResume } from "../utils/scoringEngine.js";

export const uploadResumeController = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const parsedData = await parseResume(req.file.path);
        fs.unlinkSync(req.file.path);

        // ✅ Set role statically (defined by your company)
        const role = "MERN Full Stack Developer";

        const { score, matchedSkills, feedback } = scoreResume(parsedData, role);

        res.json({ score, matchedSkills, feedback, parsedData, role });
    } catch (err) {
        res.status(500).json({ error: err.message || "Internal Server Error" });
    }
};
