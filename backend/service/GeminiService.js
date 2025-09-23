import axios from "axios";

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

async function callGemini(prompt) {
    if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not set");
    const body = { contents: [{ parts: [{ text: prompt }] }] };

    const res = await axios.post(GEMINI_URL, body, {
        headers: {
            "Content-Type": "application/json",

            "X-goog-api-key": process.env.GEMINI_API_KEY,
        },
        timeout: 20000,
    });

    const text = res.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return text?.trim();
}


// returns raw JSON string or text
export async function generateFromPrompt(prompt) {
    const raw = await callGemini(prompt);
    // try to extract JSON block if present
    const jsonBlock = raw?.match(/\{[\s\S]\}|\[[\s\S]\]/);
    return jsonBlock ? jsonBlock[0] : raw;
}

export async function evaluateAnswer(prompt) {
    const raw = await callGemini(prompt);
    const jsonBlock = raw?.match(/\{[\s\S]\}|\[[\s\S]\]/);
    return jsonBlock ? jsonBlock[0] : raw;
}

// small helper for backwards-compatible endpoint you had
export async function getGeminiQuestions(section, limit = 5) {
    const prompt = `Generate ${limit} ${section} multiple-choice questions in JSON array format like:
[
  {"question":"...","options":["a","b","c","d"],"answer":"..."}
]`;
    const raw = await callGemini(prompt);
    const jsonMatch = raw?.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
        try { return JSON.parse(jsonMatch[0]); } catch { }
    }
    return [{ question: raw, options: [], answer: null }];
}
