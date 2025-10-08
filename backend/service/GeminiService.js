import axios from "axios";

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
// it basically call the gemini API and return the text response

async function callGemini(prompt) {
    if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not set");
    const body = { contents: [{ parts: [{ text: prompt }] }] };

    try {
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
    } catch (error) {
        throw new Error("Gemini API error: " + (error.response?.data || error.message));

    }

    
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
        const prompt = `
You are a senior technical interviewer evaluating a candidate's answer.

Question: "${question}"
Candidate's Answer: "${answer}"

Your job:
1. Analyze the answer based on correctness, clarity, and completeness.
2. Provide constructive, professional feedback.
3. Return ONLY a JSON object in the following exact format — no extra text.

{
  "score": <number between 1 and 10>,
  "feedback": "<short, specific explanation of strengths and areas for improvement>"
}

Guidelines:
- 10 = perfect answer, 5 = partially correct, 1 = mostly incorrect.
- Keep feedback under 3 sentences.
- Do NOT include any text outside the JSON object.
`;


        const raw = await callGemini(prompt);
        // Try parse JSON block
        const jsonMatch = raw?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            try { return JSON.parse(jsonMatch[0]); } catch { }
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

// Generate MCQ questions based on resume skills
export async function getMCQQuestionsBasedOnResume(skills = [], limit = 5,experienceYears) {
    const skillsText = skills.length > 0 ? skills.join(", ") : "general programming";
 const prompt = `
You are an expert technical interviewer. Generate exactly ${limit} unique multiple-choice questions 
based on the following candidate skills and experience:

Skills: ${skillsText}
Experience: ${experienceYears} years

Rules:
- If experience is between 0 to 1 → easy level
- If experience is between 1 to 5 → medium to high level
- If experience is greater than 5 → high to very high level
- Each question must be different and relevant to the given skills.
- Each question must have exactly 4 answer options.
- Each question must include the correct answer and a clear explanation.

Return ONLY a valid JSON array in this exact format:
[
  {
    "question": "What is the main purpose of React hooks?",
    "options": ["State management", "Styling components", "Database queries", "API calls"],
    "answer": "State management",
    "explanation": "React hooks allow functional components to use state and other React features."
  }
]
Do not include any text or notes outside the JSON.
`;

    let raw;
    for (let attempt = 0; attempt < 3; attempt++) {
        try {
            raw = await callGemini(prompt);
            break;
        } catch (err) {
            const isLast = attempt === 2;
            if (isLast) {
                console.error("getMCQQuestionsBasedOnResume failed:", err.response?.data || err.message);
                raw = null;
                break;
            }
            await new Promise(r => setTimeout(r, 500 * Math.pow(2, attempt)));
        }
    }
    //converting into json 
    const jsonMatch = raw?.match(/\[[\s\S]*\]/);
    //parsing json data
    if (jsonMatch) {
        try { return JSON.parse(jsonMatch[0]); } catch { /* fallthrough */ }
    }

    // Fallback questions based on common skills
    const fallback = [
        {
            question: "What is the main purpose of React hooks?",
            options: ["State management", "Styling components", "Database queries", "API calls"],
            answer: "State management",
            explanation: "React hooks allow functional components to use state and other React features."
        },
        {
            question: "Which method is used to add elements to the end of an array in JavaScript?",
            options: ["push()", "pop()", "shift()", "unshift()"],
            answer: "push()",
            explanation: "The push() method adds one or more elements to the end of an array."
        },
        {
            question: "What does SQL stand for?",
            options: ["Structured Query Language", "Simple Query Language", "Standard Query Language", "System Query Language"],
            answer: "Structured Query Language",
            explanation: "SQL stands for Structured Query Language, used for managing relational databases."
        },
        {
            question: "Which HTTP method is used to create new resources?",
            options: ["GET", "POST", "PUT", "DELETE"],
            answer: "POST",
            explanation: "POST is used to create new resources on the server."
        },
        {
            question: "What is the purpose of Node.js?",
            options: ["Frontend development", "Backend development", "Database management", "Mobile development"],
            answer: "Backend development",
            explanation: "Node.js is a JavaScript runtime for building server-side applications."
        }
    ];
    return fallback.slice(0, limit);
}

// Generate technical questions based on resume skills
// Safe Gemini call with retries
async function safeCallGemini(prompt, maxAttempts = 3) {
    const baseDelay = 500; // milliseconds
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
            return await callGemini(prompt);
        } catch (err) {
            const isLast = attempt === maxAttempts - 1;
            const status = err.response?.status;

            // Don't retry for client errors
            if (status && status >= 400 && status < 500) throw err;

            if (isLast) throw err;

            const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 200;
            console.warn(`⚠️ Attempt ${attempt + 1} failed. Retrying in ${Math.round(delay)}ms...`);
            await new Promise(r => setTimeout(r, delay));
        }
    }
}

// Main function: get technical questions with optional feedback
export async function getTechnicalQuestionsBasedOnResume(skills = [], limit = 10,experienceYears) {
    const skillsText = skills.length > 0 ? skills.join(", ") : "general programming";

 const prompt = `
You are an expert technical interviewer for software engineering candidates.

Generate exactly ${limit} unique technical interview questions based on the following details:
- Candidate skills: ${skillsText}
- Experience: ${experienceYears} years

Guidelines:
- If experienceYears is between 0–1 → generate beginner/easy-level questions focused on basic concepts and syntax.
- If experienceYears is between 1–5 → generate intermediate to advanced questions focusing on architecture, debugging, and optimization.
- If experienceYears is greater than 5 → generate advanced to expert-level questions focusing on scalability, design patterns, and system design.

Each question must be practical, implementation-oriented, and different every time even for the same user (avoid repetition).

Return ONLY a valid JSON array in this exact format:
[
  {
    "question": "Explain how you would implement authentication in a Node.js application.",
    "feedback": "Use JWT for stateless auth or sessions for persistent logins. Emphasize password hashing and middleware."
  },
  {
    "question": "Describe the difference between SQL and NoSQL databases.",
    "feedback": "SQL uses structured schemas, while NoSQL stores flexible documents or key-value data. Choose based on use case."
  }
]

Do not include any explanations, introductions, or text outside the JSON array.
`;


    let raw;
    try {
        console.log(`🧠 Calling Gemini to generate technical questions...`);
        raw = await safeCallGemini(prompt);
    } catch (err) {
        console.error("🚨 Gemini call failed:", err.response?.data || err.message);
        raw = null;
    }

    // Try parsing JSON from Gemini response
    const jsonMatch = raw?.match(/\[[\s\S]*\]/);
    let questions;
    if (jsonMatch) {
        try {
            questions = JSON.parse(jsonMatch[0]);
        } catch {
            console.warn("⚠️ Failed to parse Gemini response as JSON");
        }
    }

    // Fallback technical questions with feedback
    if (!questions) {
        questions = [
            { question: "Explain how you would implement authentication in a Node.js application.", feedback: "Consider using JWT, bcrypt for passwords, and middleware to protect routes." },
            { question: "Describe the difference between SQL and NoSQL databases.", feedback: "SQL = relational, structured; NoSQL = non-relational, flexible schema." },
            { question: "How would you optimize a slow React component?", feedback: "Use memoization, React.memo, and avoid unnecessary re-renders." },
            { question: "Explain the concept of closures in JavaScript.", feedback: "Closures allow functions to access variables from their outer scope even after the outer function has returned." },
            { question: "How would you handle errors in an Express.js application?", feedback: "Use middleware for centralized error handling and proper status codes." },
            { question: "Describe the REST API principles.", feedback: "Use proper HTTP methods, statelessness, and resource-based endpoints." },
            { question: "How would you implement file upload functionality securely?", feedback: "Validate file types, use size limits, and store safely outside public directories." },
            { question: "Explain the concept of middleware in web applications.", feedback: "Middleware functions process requests before reaching route handlers or responses." },
            { question: "How would you test a React component?", feedback: "Use unit testing with Jest and React Testing Library for rendering, events, and state." },
            { question: "Describe the process of deploying a Node.js application.", feedback: "Include build, environment setup, process manager (like PM2), and monitoring." }
        ];
    }

    // Return only up to the requested limit
    return questions.slice(0, limit);
}


// Generate open-ended, general technical interview questions (no options)
export async function getOpenEndedQuestions(topic = "general technical", limit = 15) {
    const prompt = `Generate ${limit} open-ended technical interview questions for ${topic}.
Return ONLY a valid JSON array with this exact shape:
[
  { "question": "..." },
  { "question": "..." }
]
Do not include answers, options, `;
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

export async function getHrQuestionsBased(limit = 10) {
    // Construct a prompt that asks for scenario-based HR questions
    const prompt = `You are an experienced HR interviewer.
Generate ${limit} scenario-based HR interview questions for candidates.
Return ONLY a valid JSON array with this exact shape:
[
  { "question": "Why should we hire you?" },
  { "question": "Tell me about a time you faced a conflict at work and how you handled it." },
  { "question": "Where do you see yourself in 5 years?" }
]
Include questions that cover:
1. Conflict resolution
2. Teamwork and collaboration
3. Leadership potential
4. Problem-solving in real work scenarios
5. Adaptability and learning
Provide short feedback for each question to help candidates improve.
Do not include answers. Return only JSON.`;

    let raw;
    const baseDelay = 500; // for retry backoff

    // Retry logic in case of transient API failures
    for (let attempt = 0; attempt < 3; attempt++) {
        try {
            console.log(`🧠 Attempt ${attempt + 1}/3 to get HR questions...`);
            raw = await callGemini(prompt);
            break;
        } catch (err) {
            const isLast = attempt === 2;
            if (isLast) {
                console.error("🚨 getHrQuestions failed:", err.response?.data || err.message);
                raw = null;
                break;
            }
            // Exponential backoff + jitter
            const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 200;
            console.warn(`⚠️ Attempt ${attempt + 1} failed. Retrying in ${Math.round(delay)}ms...`);
            await new Promise(r => setTimeout(r, delay));
        }
    }

    // Try to parse JSON array from response
    const jsonMatch = raw?.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
        try {
            return JSON.parse(jsonMatch[0]);
        } catch {

            console.warn("⚠️ Failed to parse Gemini response as JSON");
        }
    }

    // Fallback HR questions if AI fails
    const fallback = [
        { question: "Why should we hire you?" },
        { question: "Tell me about a time you faced a conflict at work and how you handled it." },
        { question: "Where do you see yourself in 5 years?" },
        { question: "Describe a situation where you had to work under pressure." },
        { question: "Give an example of a time you took initiative to solve a problem." },
        { question: "Tell me about a mistake you made and what you learned from it." },
        { question: "How do you handle feedback or criticism?" },
        { question: "Describe a time you worked effectively as part of a team." },
        { question: "Tell me about a project you led successfully." },
        { question: "How do you prioritize tasks when faced with multiple deadlines?" }
    ];

    return fallback.slice(0, limit);
}
