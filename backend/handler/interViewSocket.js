import { getGeminiQuestions, generateFromPrompt, evaluateAnswer } from "../service/GeminiService.js";
import Interview from "../model/Interview.js"; // optional persistence

/**
 * Initialize interview socket handlers
 * @param {import("socket.io").Server} io
 */
export function initInterviewSocket(io) {
    // In-memory session map; use DB for production
    const sessions = new Map();

    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);

        let sessionStarted = false; // prevent duplicate API calls

        // startInterview: { userId, skills, total }
        socket.on("startInterview", async (payload) => {
            if (sessionStarted) return;
            sessionStarted = true;

            try {
                const { userId = "anon", skills = [], total = 10, preGenerate = false } = payload || {};
                const session = {
                    id: `${userId}:${Date.now()}`,   // ✅ fixed template string
                    userId,
                    skills,
                    total: Math.max(1, Math.min(50, total)),
                    current: 0,
                    questions: [],
                    answers: [],
                };
                sessions.set(socket.id, session);

                // Optionally pre-generate all questions
                if (preGenerate) {
                    for (let i = 1; i <= session.total; i++) {
                        const prompt = createQuestionPrompt(session.skills, i, session.total);
                        const raw = await generateFromPrompt(prompt);
                        const q = tryParseJSON(raw) || { id: `q-${i}`, question: raw, type: "open" }; // ✅ fixed
                        session.questions.push(q);
                    }
                }

                // send first question
                await pushNextQuestion(socket);
            } catch (err) {
                console.error("startInterview error:", err);
                socket.emit("error", { message: "Could not start interview" });
            }
        });

        // submitAnswer: { qIndex, answer }
        socket.on("submitAnswer", async ({ qIndex, answer }) => {
            try {
                const session = sessions.get(socket.id);
                if (!session) return socket.emit("error", { message: "Session not found" });

                const qObj = session.questions[qIndex - 1];
                if (!qObj) return socket.emit("error", { message: "Question not found" });

                // create evaluation prompt and call Gemini
                const evalPrompt = createEvaluationPrompt(qObj.question, answer, { skills: session.skills });
                const rawEval = await evaluateAnswer(evalPrompt);
                const evalObj = tryParseJSON(rawEval) || { score: null, feedback: rawEval };

                session.answers.push({ qIndex, answer, evaluation: evalObj, at: new Date() });

                // Optionally persist to DB
                // await Interview.findByIdAndUpdate(session.dbId, { $push: { answers: { qIndex, answer, evaluation: evalObj } } });

                // emit feedback to client
                socket.emit("analysis", { qIndex, evaluation: evalObj });
            } catch (err) {
                console.error("submitAnswer error:", err);
                socket.emit("error", { message: "Error processing answer" });
            }
        });

        // nextQuestion: client requests next question after feedback
        socket.on("nextQuestion", async () => {
            try {
                await pushNextQuestion(socket);
            } catch (err) {
                console.error("nextQuestion error:", err);
                socket.emit("error", { message: "Could not fetch next question" });
            }
        });

        socket.on("disconnect", () => {
            sessions.delete(socket.id);
            console.log("Socket disconnected:", socket.id);
        });

        // ----------------- Helper functions -----------------
        async function pushNextQuestion(socketRef) {
            const session = sessions.get(socketRef.id);
            if (!session) return;

            const nextIdx = session.current + 1;

            if (nextIdx > session.total) {
                const avg = computeAverage(session.answers);
                const summary = { total: session.total, answered: session.answers.length, averageScore: avg };
                socketRef.emit("finished", { summary });
                sessions.delete(socketRef.id);
                return;
            }

            let q = session.questions[nextIdx - 1];
            if (!q) {
                const prompt = createQuestionPrompt(session.skills, nextIdx, session.total);
                const raw = await generateFromPrompt(prompt);
                q = tryParseJSON(raw) || { id: `q-${nextIdx}`, question: raw, type: "open", options: [] }; // ✅ fixed
                session.questions.push(q);
            }

            session.current = nextIdx;
            socketRef.emit("question", { question: q, qIndex: nextIdx, total: session.total });
        }

        function computeAverage(answers) {
            if (!answers || answers.length === 0) return 0;
            const sum = answers.reduce((s, a) => s + (Number(a.evaluation?.score) || 0), 0);
            return Number((sum / answers.length).toFixed(2));
        }
    });
}

// ---- Prompt helpers ----
function createQuestionPrompt(skills, qIndex, total) {
    const skillText = (skills && skills.length) ? skills.join(", ") : "general software engineering";
    return `You are an interview question generator.
Return EXACT JSON ONLY with this schema:
{ "id":"q-${qIndex}", "question":"<text>", "type":"open"|"mcq", "options": [ ... ] }
Generate a concise medium-difficulty question (${qIndex}/${total}) focused on these skills: ${skillText}
Keep the question <= 30 words.`;
}

function createEvaluationPrompt(question, userAnswer, meta = {}) {
    return `You are an expert interviewer. Evaluate the candidate answer and respond in EXACT JSON ONLY:
{ "score": <0-5 integer>, "feedback": "<one-two sentence feedback>", "improvements": "<one sentence>" }
Question: ${question}
Candidate Answer: ${userAnswer}
Context: ${JSON.stringify(meta)}`;
}

function tryParseJSON(raw) {
    if (!raw || typeof raw !== "string") return null;
    const m = raw.match(/\{[\s\S]*\}|\[[\s\S]*\]/); // ✅ fixed regex (* instead of missing)
    if (!m) return null;
    try {
        return JSON.parse(m[0]);
    } catch {
        return null;
    }
}
