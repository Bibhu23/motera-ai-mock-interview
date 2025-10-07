import { createClient } from "@deepgram/sdk";
import fs from "fs";

export async function transcribeFile(file) {
  const apiKey = process.env.DEEPGRAM_API_KEY;
  if (!apiKey) throw new Error("DEEPGRAM_API_KEY not set");

  if (!file.mimetype.startsWith("audio/") && !file.mimetype.startsWith("video/")) {
    throw new Error("Unsupported file type");
  }

  try {
    const deepgram = createClient(apiKey);
    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
      fs.createReadStream(file.path),
      { model: "nova-3", smart_format: true, punctuate: true, diarize: false }
    );
    if (error) throw new Error(error.message);

    return result?.results?.channels?.[0]?.alternatives?.[0]?.transcript || "";
  } catch (err) {
    console.error("Deepgram transcription error:", err.message);
    throw err;
  }
}