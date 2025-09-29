import { getGeminiQuestions } from "../service/GeminiService.js"; // adjust path if needed
import User from "../model/userModel.js";
export default function initInterviewSocket(io) {
    const sessions = new Map();

    io.on("connection", (socket) => {
        console.log("✅ Socket connected:", socket.id);

        // 🎯 Start interview
        socket.on("startInterview", async ({ userId, total = 10 }) => {
            const session = {
                id: ` ${userId}:${Date.now()}`,
                userId,

                total,
                current: 0,
                questions: [],
                answers: [],
            };
            sessions.set(socket.id, session);

            try {
                // ✅ Generate all questions once using Gemini
                let skills = [];
                if (userId && userId !== "anon") {
                    const user = await User.findById(userId);
                    skills = user?.skills?.length ? user.skills : ["general"];
                } else {
                    skills = ["general"];
                }
                const section = Array.isArray(skills) ? skills[0] : "general";
                session.questions = await getGeminiQuestions(section, total);


                console.log(
                    `📚 Generated ${session.questions.length} questions for ${userId}`
                );
                // send first question
                await pushNextQuestion(socket);
            } catch (err) {
                console.error("⚠️ Failed to generate questions:", err.message);
                socket.emit("error", {
                    message: "Failed to generate questions, please try again.",
                });
            }
        });

        // 🎯 Submit answer
        socket.on("submitAnswer", ({ qIndex, answer }) => {
            const session = sessions.get(socket.id);
            if (!session) return;

            const qObj = session.questions[qIndex - 1];
            if (!qObj) return;

            const isCorrect = qObj.answer === answer;
            const result = {
                isCorrect,
                correctAnswer: qObj.answer,
                explanation: qObj.explanation || "No explanation provided",
                score: isCorrect ? 1 : 0,
            };

            session.answers.push({ qIndex, answer, result });

            socket.emit("answerResult", result);
        });

        // 🎯 Navigation
        socket.on("next", () => pushNextQuestion(socket));
        socket.on("prev", () => pushPrevQuestion(socket));

        // 🎯 Disconnect
        socket.on("disconnect", () => {
            sessions.delete(socket.id);
            console.log("❌ Socket disconnected:", socket.id);
        });

        // -------------------------------
        // 🔹 Helper functions
        // -------------------------------

        async function pushNextQuestion(socketRef) {
            const session = sessions.get(socketRef.id);
            if (!session) return;

            const nextIdx = session.current + 1;
            if (nextIdx > session.total) {
                const correct = session.answers.filter(
                    (a) => a.result.isCorrect
                ).length;
                const wrong = session.answers.length - correct;
                const summary = { total: session.total, correct, wrong };
                socketRef.emit("finished", summary);
                sessions.delete(socketRef.id);
                return;
            }

            const q = session.questions[nextIdx - 1];

            session.current = nextIdx;

            socketRef.emit("question", {
                question: q,
                qIndex: nextIdx,
                total: session.total,
            });
        }

        async function pushPrevQuestion(socketRef) {
            const session = sessions.get(socketRef.id);
            if (!session) return;

            const prevIdx = session.current - 1;
            if (prevIdx < 1) return;

            session.current = prevIdx;
            const q = session.questions[prevIdx - 1];

            socketRef.emit("question", {
                question: q,
                qIndex: prevIdx,
                total: session.total,
            });
        }
    });
}