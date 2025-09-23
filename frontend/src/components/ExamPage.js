import React, { useEffect, useState, useCallback } from "react";
import useInterviewSocket from "../hook/useSockethook";

const LiveInterviewPage = ({ user }) => {
    const [question, setQuestion] = useState(null);
    const [qIndex, setQIndex] = useState(0);
    const [total, setTotal] = useState(10);
    const [answer, setAnswer] = useState("");
    const [analysis, setAnalysis] = useState(null);
    const [finishedSummary, setFinishedSummary] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);

    // Stable callbacks
    const handleQuestion = useCallback(({ question, qIndex, total }) => {
        setQuestion(question);
        setQIndex(qIndex);
        setTotal(total);
        setAnalysis(null);
        setAnswer("");
        setShowFeedback(false);
    }, []);

    const handleAnalysis = useCallback(({ qIndex, evaluation }) => {
        setAnalysis(evaluation);
        setShowFeedback(true); // show feedback when analysis arrives
    }, []);

    const handleFinished = useCallback(({ summary }) => {
        setFinishedSummary(summary);
    }, []);

    const { start, submitAnswer, connected } = useInterviewSocket({
        url: process.env.REACT_APP_API_URL || "http://localhost:7656",
        onQuestion: handleQuestion,
        onAnalysis: handleAnalysis,
        onFinished: handleFinished,
    });

    useEffect(() => {
        if (!connected || finishedSummary) return;

        const skills = user?.skills || ["javascript", "nodejs"];
        start({ userId: user?.id || "anon", skills, total: 10, preGenerate: true });
    }, [connected, user, start, finishedSummary]);

    const handleSubmit = () => {
        if (!question) return;
        submitAnswer({ qIndex, answer });
    };

    const handleNext = () => {
        submitAnswer.socketRef?.current?.emit("nextQuestion"); // emit nextQuestion event
        setShowFeedback(false);
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>Live Mock Interview</h2>
            <p>Socket: {connected ? "connected" : "disconnected"}</p>

            {finishedSummary ? (
                <div>
                    <h3>Finished</h3>
                    <p>Total: {finishedSummary.total}</p>
                    <p>Answered: {finishedSummary.answered}</p>
                    <p>Average Score: {finishedSummary.averageScore}</p>
                </div>
            ) : question ? (
                <>
                    <div>
                        <h3>Q{qIndex}: {question.question}</h3>
                        {question.options?.length > 0 ? (
                            question.options.map((o, i) => (
                                <div key={i}>
                                    <label>
                                        <input
                                            type="radio"
                                            name="opt"
                                            value={o}
                                            onChange={(e) => setAnswer(e.target.value)}
                                        /> {o}
                                    </label>
                                </div>
                            ))
                        ) : (
                            <textarea
                                rows={6}
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                style={{ width: "100%" }}
                            />
                        )}
                    </div>

                    {!showFeedback && (
                        <div style={{ marginTop: 12 }}>
                            <button onClick={handleSubmit}>Send Answer</button>
                        </div>
                    )}

                    {analysis && showFeedback && (
                        <div style={{ marginTop: 16, padding: 12, border: "1px solid #ddd" }}>
                            <h4>Feedback (score: {analysis.score})</h4>
                            <p>{analysis.feedback}</p>
                            <p><strong>Improve:</strong> {analysis.improvements}</p>
                            <button onClick={handleNext} style={{ marginTop: 8 }}>Next Question</button>
                        </div>
                    )}
                </>
            ) : (
                <p>Waiting for first question...</p>
            )}
        </div>
    );
};

export default LiveInterviewPage;