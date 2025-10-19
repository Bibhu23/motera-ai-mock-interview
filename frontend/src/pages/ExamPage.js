import { React, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useInterviewSocket from "../hook/useSockethook";
import { AppContext } from "../context/Appcontext";
import "./ExamPage.css";

export default function ExamPage() {
  const { backend } = React.useContext(AppContext);
  const [question, setQuestion] = useState(null);
  const [qIndex, setQIndex] = useState(0);
  const [total, setTotal] = useState(0);
  const [result, setResult] = useState(null);
  const [summary, setSummary] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);

  const navigate = useNavigate();

  // Update question from server
  const handleQuestion = useCallback(({ question, qIndex, total }) => {
    setQuestion(question);
    setQIndex(qIndex);
    setTotal(total);
    setResult(null);
  }, []);

  // Handle server answer result
  const handleAnswerResult = useCallback((res) => {
    setResult(res);
    if (res.isCorrect) setCorrectCount((prev) => prev + 1);
  }, []);

  const handleFinished = useCallback((sum) => {
    setSummary(sum);
  }, []);

  const { start, submitAnswer, next, prev, finish, connected } =
    useInterviewSocket({
      url: process.env.REACT_APP_API_URL || `${backend}`,
      onQuestion: handleQuestion,
      onAnswerResult: handleAnswerResult,
      onFinished: handleFinished,
    });

  useEffect(() => {
    if (connected) {
      setCorrectCount(0);
      start({ skills: ["javascript", "nodejs"], total: 5 });
    }
  }, [connected, start]);

  if (!connected) return <p className="exam-container">🔌 Connecting...</p>;

  if (summary) {
    const passed = summary.correct >= 3;
    return (
      <div className="summary-box">
        <h2>{passed ? "🎉 Passed!" : "❌ Not Qualified"}</h2>
        <p>Correct: {summary.correct}</p>
        <p>Wrong: {summary.wrong}</p>
        <p>Total: {summary.total}</p>
        <button
          className={passed ? "btn-success" : "btn-danger"}
          onClick={() => navigate(passed ? "/livevideo" : "/")}
        >
          {passed ? "Go to Live Video Interview" : "Back to Home"}
        </button>
      </div>
    );
  }

  return (
    <div className="exam-container">
      <p className="score-live">✅ Correct Answers: {correctCount}</p>
      <h2>
        Question {qIndex + 1}/{total}
      </h2>
      <div className="progress-bar">
        <div style={{ width: `${((qIndex + 1) / total) * 100}%` }}></div>
      </div>

      {question && (
        <div className="question-box">
          <p>{question.question}</p>
          <div className="options">
            {question.options?.map((opt, idx) => (
              <button
                key={idx}
                className={`option-card ${
                  result?.selected === opt ? "selected" : ""
                }`}
                onClick={() => submitAnswer({ qIndex, answer: opt })}
                disabled={!!result}
              >
                <div className="circle"></div>
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
            <button onClick={prev} disabled={qIndex === 0}>
              Prev
            </button>

            {qIndex < total - 1 ? (
              <button onClick={next}>Save & Next</button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => {
                  finish();
                  if (correctCount >= 3) {
                    navigate("/livevideo");
                  } else {
                    navigate("/");
                  }
                }}
              >
                Finish Test
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
