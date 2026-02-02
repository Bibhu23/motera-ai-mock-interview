import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/Appcontext";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Round2 = () => {
    const { backend } = useContext(AppContext)
    const { login } = useContext(AppContext);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [questions, setQuestions] = useState([]);
    const [questionCount, setQuestionCount] = useState(10);
    const [loading, setLoading] = useState(true);
    const [questionType, setQuestionType] = useState("mcq"); // mcq or technical
    const navigate = useNavigate();

    const TOTAL_QUESTIONS = questionCount;

    // Load questions based on resume skills
    useEffect(() => {
        const loadQuestions = async () => {
            try {
                setLoading(true);
                const endpoint =
                    questionType === "mcq"
                        ? "/api/gemini/mcq-based-on-resume"
                        : "/api/gemini/technical-based-on-resume";

                const response = await axios.get(
                    `${backend}${endpoint}?limit=${questionCount}`,
                    { withCredentials: true }
                );

                setQuestions(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to load questions:", error);
                toast.error("Failed to load questions. Please try again.");
                setLoading(false);
            }
        };

        if (login) loadQuestions();
    }, [questionCount, questionType, login]);

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
            setCurrentQuestion(currentQuestion + 1);
        } else {
            handleExamComplete(score + (isCorrect ? 1 : 0));
        }
    };

    // Complete exam: send score to backend & navigate
    const handleExamComplete = async (finalScore) => {
        try {
            // Convert to percentage
            const scorePercent = Math.round((finalScore / TOTAL_QUESTIONS) * 100);

            // 1️⃣ Send percentage score to backend
            await axios.post(
                `${backend}/user/api/v1/update-round`,
                { round: "Written Test", score: scorePercent },
                { withCredentials: true }
            );

            toast.success(`✅ Written Test score saved: ${scorePercent}%`);

            // 2️⃣ Navigate based on percentage (60% minimum)
            if (scorePercent >= 60) {
                navigate("/livevideo");
            } else {
                navigate("/");
            }
        } catch (err) {
            console.error("Failed to update score:", err.response?.data || err.message);
            toast.error("Failed to save score. Please try again!");
        }
    };

    if (!login) return <Navigate to="/login" />;

    if (loading) {
        return (
            <div className="container-fluid bg-light min-vh-100 py-3 d-flex justify-content-center align-items-center">
                <div className="card shadow-sm p-5 text-center">
                    <div className="spinner-border text-primary" role="status" />
                    <h5 className="mt-3">Loading questions based on your resume...</h5>
                </div>
                <ToastContainer position="top-right" autoClose={3000} />
            </div>
        );
    }

    return (
        <div className="container-fluid bg-light min-vh-100 py-3">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="row">
                {/* Left side: exam area */}
                <div className="col-md-8">
                    <div className="card shadow-sm p-3">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div>
                                <h5 className="mb-0">
                                    Round 2: {questionType === "mcq" ? "MCQ Questions" : "Technical Questions"}
                                </h5>
                                <small className="text-muted">Based on your resume skills</small>
                            </div>
                            <span className="badge bg-info fs-6">Time Left: {formatTime(timeLeft)}</span>
                        </div>
                        <hr />

                        {/* Question settings */}
                        <div className="mb-3 row">
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">
                                    Question Type:
                                </label>
                                <select
                                    className="form-select"
                                    value={questionType}
                                    onChange={(e) => setQuestionType(e.target.value)}
                                >
                                    <option value="mcq">MCQ Questions</option>
                                    <option value="technical">Technical Questions</option>
                                </select>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label fw-semibold">
                                    Number of Questions:
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value="10 Questions"
                                    disabled
                                />
                            </div>
                        </div>
                        {/* Question display */}
                        {questions.length > 0 && (
                            <div className="question-area">
                                <h6>
                                    Question {currentQuestion + 1} of {TOTAL_QUESTIONS}
                                </h6>
                                <p>{questions[currentQuestion]?.question}</p>

                                {/* MCQ */}
                                {questionType === "mcq" && questions[currentQuestion]?.options?.length > 0 && (
                                    <div className="options">
                                        {questions[currentQuestion].options.map((option, idx) => (
                                            <button
                                                key={idx}
                                                className={`btn btn-outline-primary w-100 mb-2 text-start ${answers[currentQuestion]?.answer === option ? "active" : ""
                                                    }`}
                                                onClick={() => {
                                                    const isCorrect = option === questions[currentQuestion]?.answer;
                                                    handleSaveAndNext(option, isCorrect);
                                                }}
                                            >
                                                {String.fromCharCode(65 + idx)}. {option}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Technical question */}
                                {questionType === "technical" && (
                                    <div className="technical-answer">
                                        <textarea
                                            className="form-control"
                                            rows="4"
                                            placeholder="Type your answer here..."
                                            value={answers[currentQuestion]?.answer || ""}
                                            onChange={(e) => {
                                                setAnswers((prev) => ({
                                                    ...prev,
                                                    [currentQuestion]: { answer: e.target.value, isCorrect: true },
                                                }));
                                            }}
                                        />
                                        <button
                                            className="btn btn-primary mt-2"
                                            onClick={() => {
                                                if (currentQuestion < TOTAL_QUESTIONS - 1) {
                                                    setCurrentQuestion(currentQuestion + 1);
                                                } else {
                                                    handleExamComplete(score);
                                                }
                                            }}
                                        >
                                            {currentQuestion < TOTAL_QUESTIONS - 1 ? "Next Question" : "Submit Test"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right side: Progress & Navigation */}
                <div className="col-12 col-md-4 mt-4 mt-md-0">
                    <div className="card shadow-sm h-100 sticky-md-top">
                        <div className="card-body">

                            {/* Progress Section */}
                            <h6 className="fw-bold text-center mb-3">Round 2 Progress</h6>

                            <div className="small">
                                <div className="d-flex justify-content-between">
                                    <span className="text-muted">Questions</span>
                                    <span className="fw-semibold">{TOTAL_QUESTIONS}</span>
                                </div>

                                <div className="d-flex justify-content-between text-success">
                                    <span>Answered</span>
                                    <span>{Object.keys(answers).length}</span>
                                </div>

                                <div className="d-flex justify-content-between text-danger">
                                    <span>Not Answered</span>
                                    <span>{TOTAL_QUESTIONS - Object.keys(answers).length}</span>
                                </div>

                                <div className="d-flex justify-content-between text-muted">
                                    <span>Not Visited</span>
                                    <span>{TOTAL_QUESTIONS - (currentQuestion + 1)}</span>
                                </div>
                            </div>

                            <hr />

                            <div className="small text-center">
                                <p className="mb-1 text-info fw-semibold">
                                    Required Score: 6 / {TOTAL_QUESTIONS} (60%)
                                </p>
                                <p className="mb-0 text-warning fw-semibold">
                                    Current Score: {score} / {TOTAL_QUESTIONS}
                                </p>
                            </div>

                            <hr />

                            {/* Jump to Question */}
                            <h6 className="fw-bold text-center mb-3">Jump to Question</h6>

                            <div className="d-flex flex-wrap justify-content-center gap-2">
                                {Array.from({ length: TOTAL_QUESTIONS }, (_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentQuestion(i)}
                                        className={`btn rounded-circle ${answers[i]
                                            ? "btn-success"
                                            : i === currentQuestion
                                                ? "btn-primary"
                                                : "btn-outline-secondary"
                                            }`}
                                        style={{ width: "48px", height: "48px" }}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>

                            <button
                                className="btn btn-primary w-100 mt-4 fw-semibold"
                                onClick={() => handleExamComplete(score)}
                            >
                                Submit Test
                            </button>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Round2;
