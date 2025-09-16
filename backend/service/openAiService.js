import axios from "axios";

export async function generatefuntion(role, difficulty = "easy") {
    try {
        const res = await axios.get("https://quizapi.io/api/v1/questions", {
            headers: { "X-Api-Key": process.env.QUIZ_API_KEY }, // ✅ use quiz_api key
            params: {
                limit: 5,
                difficulty: difficulty.toLowerCase(),
                tags: role // must match QuizAPI's valid tags (e.g. "Linux", "SQL", "Docker", "DevOps")
            },
        });

        if (!res.data || res.data.length === 0) {
            return [{ question: `No questions found for role/tag: ${role}`, options: [], answer: "" }];
        }

        // ✅ Format response with question, options, and answer
        return res.data.map(q => ({
            question: q.question,
            options: Object.values(q.answers).filter(opt => opt !== null),
            answer: q.correct_answer ? q.answers[q.correct_answer] : null
        }));
    } catch (err) {
        console.error("QuizAPI error:", err.response?.data || err.message);
        return [{ question: "Error fetching questions from QuizAPI", options: [], answer: "" }];
    }
}
