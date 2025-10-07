import express from "express";
import multer from "multer";
import fs from "fs";
import { transcribeFile } from "../service/Deepgram.service.js";
import { getFeedback } from "../service/GeminiService.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/transcribe", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    console.log(req.file);


    // Validate mimetype
    if (!req.file.mimetype.startsWith("audio/") && !req.file.mimetype.startsWith("video/")) {
      fs.unlinkSync(req.file.path); // clean up
      return res.status(400).json({ error: "Unsupported file type. Upload audio or video." });
    }

    // Transcribe using Deepgram
    const transcript = await transcribeFile(req.file);

    // Clean up file after transcription
    fs.unlinkSync(req.file.path);

    res.json({ success: true, transcript });
  } catch (err) {
    console.error("Transcription error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Feedback endpoint
router.post("/feedback", express.json(), async (req, res) => {
  const { question, transcript } = req.body;
  if (!question || !transcript)
    return res.status(400).json({ error: "Question and transcript required" });

  try {
    const feedback = await getFeedback(question, transcript);
    res.json({ feedback });
  } catch (err) {
    console.error("Feedback error:", err);
    res.status(500).json({ error: "Feedback generation failed", details: err.message });
  }
});
export default router;