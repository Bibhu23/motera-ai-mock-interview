import axios from "axios";

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

async function callGemini(prompt) {
    if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not set");
    const body = { contents: [{ parts: [{ text: prompt }] }] };

    const res = await axios.post(GEMINI_URL, body, {
        headers: {
            "Content-Type": "application/json",

            // Use API key header (not Bearer) per Gemini API
            "X-goog-api-key": process.env.GEMINI_API_KEY,
        },
        timeout: 40000,
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
export async function getFeedback(question, answer) {
    try {
        const prompt = `You are an experienced technical interviewer.
Question: "${question}"
Candidate answer: "${answer}"
Evaluate concisely and return JSON only: {"score": number, "feedback": "text"}. Score must be 1-10.`;

        const raw = await callGemini(prompt);
        // Try parse JSON block
        const jsonMatch = raw?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            try { return JSON.parse(jsonMatch[0]); } catch {}
        }
        return { score: 0, feedback: raw || "No feedback generated" };
    } catch (err) {
        console.error("Gemini feedback error:", err.response?.data || err.message);
        return { score: 0, feedback: "Error analyzing answer" };
    }
}
// small helper for backwards-compatible endpoint you had
export async function getGeminiQuestions(section, limit = 5) {
    const prompt = `Generate ${limit} ${section} multiple-choice questions in JSON array format like:
[
  {
    "question":"...",
    "options":["a","b","c","d"],
    "answer":"...",
    "explanation":"..."  // include explanation
  }
]`;
    // retry a few times in case of transient 5xx
    let raw;
    for (let attempt = 0; attempt < 3; attempt++) {
        try {
            raw = await callGemini(prompt);
            break;
        } catch (err) {
            const isLast = attempt === 2;
            if (isLast) throw err;
            await new Promise(r => setTimeout(r, 500 * Math.pow(2, attempt)));
        }
    }
    const jsonMatch = raw?.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
        try { return JSON.parse(jsonMatch[0]); } catch { }
    }
    return [{ question: raw, options: [], answer: null, explanation: "No explanation provided" }];
}

// Generate open-ended, general technical interview questions (no options)
export async function getOpenEndedQuestions(topic = "general technical", limit = 15) {
    const prompt = `Generate ${limit} open-ended technical interview questions for ${topic}.
Return ONLY a valid JSON array with this exact shape:
[
  { "question": "..." },
  { "question": "..." }
]
Do not include answers, options, or explanations.`;
    // retry up to 3 times for transient failures (e.g., 503/timeouts)
    let raw;
    for (let attempt = 0; attempt < 3; attempt++) {
        try {
            raw = await callGemini(prompt);
            break;
        } catch (err) {
            const isLast = attempt === 2;
            if (isLast) {
                console.error("getOpenEndedQuestions failed:", err.response?.data || err.message);
                raw = null;
                break;
            }
            await new Promise(r => setTimeout(r, 500 * Math.pow(2, attempt)));
        }
    }
    // Parse JSON array if present
    const jsonMatch = raw?.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
        try { return JSON.parse(jsonMatch[0]); } catch { /* fallthrough */ }
    }
    // Fallback: curated general technical open-ended questions
    const fallback = [
        { question: "Explain how JavaScript's event loop works and where microtasks fit in." },
        { question: "Describe a time you optimized a slow API. What did you change and why?" },
        { question: "How would you design a scalable logging system for a microservices platform?" },
        { question: "What are common causes of memory leaks in Node.js and how do you detect them?" },
        { question: "Compare SQL and NoSQL databases and when you would choose each." },
        { question: "Walk through how HTTPS works end-to-end during a typical request." },
        { question: "How do you structure unit, integration, and E2E tests in a CI pipeline?" },
        { question: "Explain CAP theorem and its trade-offs in distributed systems." },
        { question: "How would you implement authentication and authorization for a REST API?" },
        { question: "Describe approaches to handle file uploads securely at scale." },
        { question: "What is idempotency? Give examples of idempotent API design." },
        { question: "How would you profile and improve frontend performance for a React app?" },
        { question: "Explain how you would handle retries and backoff for flaky external APIs." },
        { question: "How do you structure feature flags and rollbacks in production?" },
        { question: "Describe your approach to database migrations in zero-downtime deploys." }
    ];
    return fallback.slice(0, limit);
}