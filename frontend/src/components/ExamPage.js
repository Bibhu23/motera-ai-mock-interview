import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useInterviewSocket from "../hook/useSockethook";
import "./ExamPage.css";
export default function ExamPage() {
    const [question, setQuestion] = useState(null);
    const [qIndex, setQIndex] = useState(0);
    const [total, setTotal] = useState(0);
    const [result, setResult] = useState(null);
    const [summary, setSummary] = useState(null);
    const [correctCount, setCorrectCount] = useState(0); // NEW

    const navigate = useNavigate();

    const handleQuestion = useCallback(({ question, qIndex, total }) => {
        setQuestion(question);
        setQIndex(qIndex);
        setTotal(total);
        setResult(null);
    }, []);

    const handleAnswerResult = useCallback((res) => {
        setResult(res);
        if (res.isCorrect) setCorrectCount((prev) => prev + 1); // NEW
    }, []);

    const handleFinished = useCallback((sum) => {
        setSummary(sum);
    }, []);

    const { start, submitAnswer, next, prev, connected } = useInterviewSocket({
        url: process.env.REACT_APP_API_URL || "http://localhost:7656",
        onQuestion: handleQuestion,
        onAnswerResult: handleAnswerResult,
        onFinished: handleFinished,
    });

    useEffect(() => {
        if (connected) {
            setCorrectCount(0); // Reset on new exam
            start({ skills: ["javascript", "nodejs"], total: 5 });
        }
    }, [connected, start]);

    if (!connected) return <p>🔌 Connecting...</p>;
    if (summary) {
        const passed = summary.correct >= 6;
        return (
            <div className="summary-box">
                <h2>{passed ? "🎉 Passed!" : "❌ Not Qualified"}</h2>
                <p>Correct: {summary.correct}</p>
                <p>Wrong: {summary.wrong}</p>
                <p>Total: {summary.total}</p>
                {passed && (
                    <button className="btn btn-success" onClick={() => navigate("/round3")}>
                        Go to Next Round
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="exam-container">
            <p className="score-live">✅ Correct Answers: {correctCount}</p> {/* NEW */}
            <h2>Question {qIndex}/{total}</h2>

            {question && (
                <div className="question-box">
                    <p>{question.question}</p>
                    <div className="options">
                        {question.options?.map((opt, idx) => (
                            <button
                                key={idx}
                                onClick={() => submitAnswer({ qIndex, answer: opt })}
                                disabled={!!result}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {result && (
                <div className="result-box">
                    <p className={result.isCorrect ? "correct" : "wrong"}>
                        {result.isCorrect ? "✅ Correct!" : "❌ Wrong!"}
                    </p>
                    <p>Correct Answer: {result.correctAnswer}</p>
                    <p>{result.explanation}</p>
                    <div className="nav-buttons">
                        <button onClick={prev} disabled={qIndex <= 1}>Prev</button>
                        <button onClick={next} disabled={qIndex >= total}>Next</button>
                    </div>
                </div>
            )}
        </div>
    );
}