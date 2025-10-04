import React, { useContext, useState, useEffect } from "react";
import ExamPage from "../pages/ExamPage";
import { AppContext } from "../context/Appcontext";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

const Round2 = () => {
    const { login } = useContext(AppContext);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 mins for more questions
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [questions, setQuestions] = useState([]);
    const [questionCount, setQuestionCount] = useState(5); // Default 5 questions
    const [loading, setLoading] = useState(true);
    const [questionType, setQuestionType] = useState("mcq"); // "mcq" or "technical"
    const navigate = useNavigate();

    const TOTAL_QUESTIONS = questionCount;

    // Load questions based on resume skills
    useEffect(() => {
        const loadQuestions = async () => {
            try {
                setLoading(true);
                
                const endpoint = questionType === "mcq" 
                    ? "/api/gemini/mcq-based-on-resume" 
                    : "/api/gemini/technical-based-on-resume";
                
                const response = await axios.get(
                    `http://localhost:7656${endpoint}?limit=${questionCount}`,
                    { withCredentials: true }
                );
                
                setQuestions(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to load questions:", error);
                if (error.response?.status === 401) {
                    alert("Please login to continue");
                    navigate("/login");
                } else {
                    alert("Failed to load questions. Please try again.");
                }
                setLoading(false);
            }
        };

        if (login) {
            loadQuestions();
        }
    }, [questionCount, questionType, login, navigate]);

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
        // Calculate eligibility based on question count
        let requiredScore;
        if (questionCount === 5) {
            requiredScore = 3; // 3 out of 5 (60%)
        } else if (questionCount === 10) {
            requiredScore = 7; // 7 out of 10 (70%)
        } else if (questionCount === 15) {
            requiredScore = 10; // 10 out of 15 (67%)
        } else {
            requiredScore = Math.ceil(questionCount * 0.6); // 60% minimum
        }

        if (finalScore >= requiredScore) {
            navigate("/livevideo");
        } else {
            navigate("/");
        }
    };

    if (!login) return <Navigate to="/login" />;

    if (loading) {
        return (
            <div className="container-fluid bg-light min-vh-100 py-3">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card shadow-sm p-5 text-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <h5 className="mt-3">Loading questions based on your resume...</h5>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid bg-light min-vh-100 py-3">
            <div className="row">
                {/* Left side exam area */}
                <div className="col-md-8">
                    <div className="card shadow-sm p-3">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div>
                                <h5 className="mb-0">
                                    Round 2: {questionType === "mcq" ? "MCQ Questions" : "Technical Questions"}
                                </h5>
                                <small className="text-muted">Based on your resume skills</small>
                            </div>
                            <span className="badge bg-info fs-6">
                                Time Left: {formatTime(timeLeft)}
                            </span>
                        </div>
                        <hr />

                        {/* Question Selection */}
                        <div className="mb-3">
                            <div className="row">
                                <div className="col-md-6">
                                    <label className="form-label">Question Type:</label>
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
                                    <label className="form-label">Number of Questions:</label>
                                    <select 
                                        className="form-select" 
                                        value={questionCount} 
                                        onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                                    >
                                        <option value={5}>5 Questions</option>
                                        <option value={10}>10 Questions</option>
                                        <option value={15}>15 Questions</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Question Area */}
                        {questions.length > 0 && (
                            <div className="question-area">
                                <h6>Question {currentQuestion + 1} of {TOTAL_QUESTIONS}</h6>
                                <p className="question-text">{questions[currentQuestion]?.question}</p>
                                
                                {questionType === "mcq" && questions[currentQuestion]?.options && (
                                    <div className="options">
                                        {questions[currentQuestion].options.map((option, idx) => (
                                            <button
                                                key={idx}
                                                className={`btn btn-outline-primary w-100 mb-2 text-start ${
                                                    answers[currentQuestion]?.answer === option ? "active" : ""
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
                                
                                {questionType === "technical" && (
                                    <div className="technical-answer">
                                        <textarea 
                                            className="form-control" 
                                            rows="4" 
                                            placeholder="Type your answer here..."
                                            value={answers[currentQuestion]?.answer || ""}
                                            onChange={(e) => {
                                                setAnswers(prev => ({
                                                    ...prev,
                                                    [currentQuestion]: { answer: e.target.value, isCorrect: true }
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

                {/* Right side sidebar */}
                <div className="col-md-4">
                    <div className="card shadow-sm p-3 mb-3">
                        <h6>
                            Round 2 Progress
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
                        <hr />
                        <p className="small text-info">
                            <strong>Required Score:</strong> {
                                questionCount === 5 ? "3/5 (60%)" :
                                questionCount === 10 ? "7/10 (70%)" :
                                questionCount === 15 ? "10/15 (67%)" :
                                `${Math.ceil(questionCount * 0.6)}/${questionCount} (60%)`
                            }
                        </p>
                        <p className="small text-warning">
                            <strong>Current Score:</strong> {score}/{TOTAL_QUESTIONS}
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
