import axios from "axios";

export async function getGeminiQuestions(section, limit = 5) {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not set");
    }

    const prompt = `Generate ${limit} ${section} multiple-choice questions in JSON format like this:
[
  { "question": "What is 2+2?", "options": ["2","3","4","5"], "answer": "4" }
]`;

    try {
        const response = await axios.post(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
            {
                contents: [
                    {
                        parts: [{ text: prompt }],
                    },
                ],
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-goog-api-key": process.env.GEMINI_API_KEY,
                },
            }
        );

        const data = response.data;
        const text =
            data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "[]";

        try {
            return JSON.parse(text);
        } catch {
            return [{ question: text, options: [], answer: null }];
        }
    } catch (err) {
        console.error("Gemini API error:", err.response?.data || err.message);
        throw new Error("Failed to fetch questions from Gemini API");
    }
}
