import { useState, useEffect, useCallback } from "react";
import useInterviewSocket from "../hook/useSockethook";
import "./ExamPage.css";
export default function ExamPage() {
    const [question, setQuestion] = useState(null);
    const [qIndex, setQIndex] = useState(0);
    const [total, setTotal] = useState(0);
    const [result, setResult] = useState(null);
    const [summary, setSummary] = useState(null);



    const handleQuestion = useCallback(({ question, qIndex, total }) => {
        setQuestion(question);
        setQIndex(qIndex);
        setTotal(total);
        setResult(null);
    }, []);

    const handleAnswerResult = useCallback((res) => {
        setResult(res);
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
            start({ skills: ["javascript", "nodejs"], total: 5 });
        }
    }, [connected, start]);

    if (!connected) return <p>🔌 Connecting...</p>;
    if (summary) {
        return (
            <div>
                <h2>✅ Quiz Finished</h2>
                <p>Correct: {summary.correct}</p>
                <p>Wrong: {summary.wrong}</p>
                <p>Total: {summary.total}</p>
            </div>
        );
    }

    return (
        <div className="exam-container">
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