import express from "express";
import fs from "fs";
import path from "path";
import { createClient } from "@deepgram/sdk";
import { getAudioBuffer } from "../utils/audioHelper.js";

const router = express.Router();
const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

const audioDir = path.join("public", "audio");

// POST /api/speak
router.post("/", async (req, res) => {
    try {
        const { text, voice = "female" } = req.body;

        if (!text) {
            return res.status(400).json({ error: "Text is required" });
        }

        // Choose voice model dynamically
        const model = voice === "male" ? "aura-2-orion-en" : "aura-2-thalia-en";

        const response = await deepgram.speak.request(
            { text },
            {
                model,
                encoding: "linear16",
                container: "wav",
            }
        );

        const stream = await response.getStream();
        const buffer = await getAudioBuffer(stream);

        // Save file
        const fileName = `speech_${Date.now()}.wav`;
        const filePath = path.join(audioDir, fileName);
        fs.writeFileSync(filePath, buffer);

        res.json({ audioUrl: `/audio/${fileName}` });
    } catch (err) {
        console.error("❌ TTS error:", err);
        res.status(500).json({ error: "Failed to generate speech" });
    }
});

export default router;
