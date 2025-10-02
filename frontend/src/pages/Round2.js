import React, { useContext, useState, useEffect } from "react";
import ExamPage from "../pages/ExamPage";
import { AppContext } from "../context/Appcontext";
import { Navigate, useNavigate } from "react-router-dom";

const Round2 = () => {
    const { login } = useContext(AppContext);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 mins
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const navigate = useNavigate();

    const TOTAL_QUESTIONS = 5;

    // Timer
    useEffect(() => {
        if (timeLeft <= 0) {
            handleExamComplete(score);
            return;
        }
        const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
        return () => clearInterval(interval);
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const m = String(Math.floor(seconds / 60)).padStart(2, "0");
        const s = String(seconds % 60).padStart(2, "0");
        return `00:${m}:${s}`;
    };

    // Save answer & move to next question
    const handleSaveAndNext = (selectedAnswer, isCorrect) => {
        setAnswers((prev) => ({
            ...prev,
            [currentQuestion]: { answer: selectedAnswer, isCorrect },
        }));

        if (isCorrect && !answers[currentQuestion]?.isCorrect) {
            setScore((prev) => prev + 1);
        }

        if (currentQuestion < TOTAL_QUESTIONS - 1) {
            setCurrentQuestion(currentQuestion + 1); // Move question
        } else {
            handleExamComplete(score);
        }
    };

    const handleExamComplete = (finalScore) => {
        if (finalScore >= 3) navigate("/livevideo");
        else navigate("/");
    };

    if (!login) return <Navigate to="/login" />;

    return (
        <div className="container-fluid bg-light min-vh-100 py-3">
            <div className="row">
                {/* Left side exam area */}
                <div className="col-md-8">
                    <div className="card shadow-sm p-3">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="mb-0">Reading Comprehension</h5>
                            <span className="badge bg-info fs-6">
                                Time Left: {formatTime(timeLeft)}
                            </span>
                        </div>
                        <hr />

                        {/* Question Area */}
                        <ExamPage
                            currentQuestion={currentQuestion}
                            onAnswerSelect={handleSaveAndNext}
                            selectedAnswer={answers[currentQuestion]?.answer}
                        />
                    </div>
                </div>

                {/* Right side sidebar */}
                <div className="col-md-4">
                    <div className="card shadow-sm p-3 mb-3">
                        <h6>
                            Candidate: <span className="fw-bold">Spitting Cobra</span>
                        </h6>
                        <p className="small text-muted mb-1">Questions: {TOTAL_QUESTIONS}</p>
                        <p className="small text-success mb-1">
                            Answered: {Object.keys(answers).length}
                        </p>
                        <p className="small text-danger mb-1">
                            Not Answered: {TOTAL_QUESTIONS - Object.keys(answers).length}
                        </p>
                        <p className="small text-muted">
                            Not Visited: {TOTAL_QUESTIONS - (currentQuestion + 1)}
                        </p>
                    </div>

                    <div className="card shadow-sm p-3">
                        <h6>Questions</h6>
                        <div className="d-flex flex-wrap gap-2 mt-2">
                            {Array.from({ length: TOTAL_QUESTIONS }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentQuestion(i)}
                                    className={`btn rounded-circle ${answers[i]
                                            ? "btn-success"
                                            : i === currentQuestion
                                                ? "btn-primary"
                                                : "btn-outline-danger"
                                        }`}
                                    style={{ width: "40px", height: "40px" }}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <button
                            className="btn btn-primary w-100 mt-3"
                            onClick={() => handleExamComplete(score)}
                        >
                            Submit Test
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Round2;
