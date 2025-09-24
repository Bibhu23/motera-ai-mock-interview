import { useEffect, useState } from "react";
import Gpi from "../Gpi";
import "./ExamPage.css";

const SECTIONS = [
    { name: "Aptitude", key: "aptitude" },
    { name: "Reasoning", key: "reasoning" },
    { name: "Verbal Ability", key: "verbal" },
    { name: "Coding", key: "coding" },
];

function ExamPage() {
    const [currentSection, setCurrentSection] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [sectionQuestions, setSectionQuestions] = useState([[], [], [], []]);
    const [answers, setAnswers] = useState({});
    const [markedForReview, setMarkedForReview] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [results, setResults] = useState(null);
    const [timeLeft, setTimeLeft] = useState(300);
    const [loadingSection, setLoadingSection] = useState(false);
    const [showSummary, setShowSummary] = useState(false);
    const [summaryFor, setSummaryFor] = useState(null);

    // Fetch questions
    const fetchSectionQuestions = async (sectionIndex) => {
        try {
            setLoadingSection(true);
            const sectionKey = SECTIONS[sectionIndex].key;
            const res = await Gpi.get(`/api/gemini/questions/${sectionKey}?limit=5`);

            const qs = Array.isArray(res.data) ? res.data : res.data.questions || [];

            const normalized = qs.map((q) => ({
                question: q.question || "No question text",
                options: q.options || (q.answers ? Object.values(q.answers).filter(Boolean) : []) || [],
                answer: q.answer || q.correct_answer || q.correctAnswer || null,
            }));

            setSectionQuestions((prev) => {
                const copy = [...prev];
                copy[sectionIndex] = normalized;
                return copy;
            });

            setCurrentQuestion(0);
            setLoadingSection(false);
        } catch (err) {
            console.error("Error fetching questions:", err);
            setLoadingSection(false);
        }
    };

    useEffect(() => {
        fetchSectionQuestions(0);
    }, []);

    // Timer
    useEffect(() => {
        if (submitted) return;
        if (timeLeft <= 0) {
            handleNextSectionOrSubmit();
            return;
        }
        const t = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
        return () => clearTimeout(t);
    }, [timeLeft, submitted]);

    const handleChangeSection = (index) => {
        if (index === currentSection) return;
        setCurrentSection(index);
        setCurrentQuestion(0);
        setTimeLeft(300);
        fetchSectionQuestions(index);
    };

    const handleOptionChange = (secIdx, qIdx, opt) => {
        const key = `${secIdx}-${qIdx}`;
        setAnswers((prev) => ({ ...prev, [key]: opt }));
    };

    const toggleReview = (secIdx, qIdx) => {
        const key = `${secIdx}-${qIdx}`;
        setMarkedForReview((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handlePrev = () => {
        if (currentQuestion > 0) setCurrentQuestion((p) => p - 1);
    };

    const handleNext = () => {
        const qs = sectionQuestions[currentSection] || [];
        if (currentQuestion < qs.length - 1) {
            setCurrentQuestion((p) => p + 1);
        } else {
            handleNextSectionOrSubmit();
        }
    };

    const handleSkip = () => {
        handleNext();
    };

    const handleSubmitExam = () => {
        let correct = 0,
            incorrect = 0,
            skipped = 0;

        sectionQuestions.forEach((sec, si) => {
            sec.forEach((q, qi) => {
                const key = `${si}-${qi}`;
                if (!answers[key]) skipped++;
                else if (answers[key] === q.answer) correct++;
                else incorrect++;
            });
        });

        setResults({ correct, incorrect, skipped });
        setSubmitted(true);
    };

    const handleShowSummary = async (secIdx, qi) => {
        const qObj = (sectionQuestions[secIdx] || [])[qi];
        try {
            const textToSummarize = `${qObj.question}\nCorrect answer: ${qObj.answer}\nOptions: ${qObj.options?.join(
                " | "
            )}`;
            const res = await Gpi.post("/api/gemini/summarize", { text: textToSummarize });
            setSummaryFor({
                sectionIndex: secIdx,
                qIndex: qi,
                summary: res.data.summary,
            });
            setShowSummary(true);
        } catch (err) {
            console.error("Summarize error:", err);
            setSummaryFor({
                sectionIndex: secIdx,
                qIndex: qi,
                summary: "Could not generate summary.",
            });
            setShowSummary(true);
        }
    };

    const formatTime = (sec) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    const handleNextSectionOrSubmit = () => {
        if (currentSection < SECTIONS.length - 1) {
            const nextSection = currentSection + 1;
            setCurrentSection(nextSection);
            setCurrentQuestion(0);
            setTimeLeft(300);
            fetchSectionQuestions(nextSection);
        } else {
            handleSubmitExam();
        }
    };

    // Results view
    if (submitted && results) {
        return (
            <div className="results">
                <h2>Exam Finished!</h2>
                <p>✅ Correct: {results.correct}</p>
                <p>❌ Incorrect: {results.incorrect}</p>
                <p>⏭️ Skipped: {results.skipped}</p>

                <h3>Review Questions</h3>
                {sectionQuestions.map((sec, si) => (
                    <div key={si}>
                        <h4>{SECTIONS[si].name}</h4>
                        {sec.map((q, qi) => {
                            const key = `${si}-${qi}`;
                            return (
                                <div key={qi} className="review-card">
                                    <p>
                                        <strong>Q{qi + 1}:</strong> {q.question}
                                    </p>
                                    <p>Your Answer: {answers[key] || "Skipped"}</p>
                                    <p>Correct Answer: {q.answer}</p>
                                    <button onClick={() => handleShowSummary(si, qi)}>View Summary</button>
                                </div>
                            );
                        })}
                    </div>
                ))}

                {showSummary && summaryFor && (
                    <div className="summary-modal">
                        <div className="summary-card">
                            <h4>Summary for Question</h4>
                            <p>{summaryFor.summary}</p>
                            <button onClick={() => setShowSummary(false)}>Close</button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Current question view (one at a time)
    const qs = sectionQuestions[currentSection] || [];
    const q = qs[currentQuestion];
    const currentKey = `${currentSection}-${currentQuestion}`;
    const currentAnswer = answers[currentKey];

    return (
        <div className="exam-container">
            <div className="exam-header">
                <div style={{ display: "flex", gap: 8 }}>
                    {SECTIONS.map((s, idx) => (
                        <div
                            key={s.key}
                            className={`section-tab ${idx === currentSection ? "active" : ""}`}
                            onClick={() => handleChangeSection(idx)}
                            style={{ cursor: "pointer" }}
                        >
                            {s.name}
                        </div>
                    ))}
                </div>
                <div>
                    <p>⏳ Time Left: {formatTime(timeLeft)}</p>
                </div>
            </div>

            {loadingSection ? (
                <p>Loading questions...</p>
            ) : q ? (
                <div className="question-card">
                    <p>
                        <strong>
                            Q{currentQuestion + 1}: {q.question}
                        </strong>
                    </p>

                    <ul className="options">
                        {q.options?.map((opt, idx) => (
                            <li key={idx}>
                                <label>
                                    <input
                                        type="radio"
                                        name={`q-${currentSection}-${currentQuestion}`}
                                        value={opt}
                                        checked={currentAnswer === opt}
                                        onChange={() => handleOptionChange(currentSection, currentQuestion, opt)}
                                    />
                                    <span style={{ marginLeft: 8 }}>{opt}</span>
                                </label>
                            </li>
                        ))}
                    </ul>

                    <div className="controls" style={{ display: "flex", gap: 8, marginTop: 12 }}>
                        <button onClick={handlePrev} disabled={currentQuestion === 0}>
                            Previous
                        </button>

                        <button onClick={handleSkip}>Skip</button>

                        <button onClick={toggleReview.bind(null, currentSection, currentQuestion)}>
                            {markedForReview[currentKey] ? "Unmark Review" : "Mark for Review"}
                        </button>

                        <div style={{ marginLeft: "auto" }}>
                            <button
                                onClick={handleNext}
                                style={{
                                    background: "#3498db",
                                    color: "#fff",
                                    border: "none",
                                    padding: "8px 12px",
                                    borderRadius: 6,
                                    cursor: "pointer",
                                }}
                            >
                                {currentQuestion < qs.length - 1
                                    ? "Next"
                                    : currentSection < SECTIONS.length - 1
                                        ? "Next Section"
                                        : "Submit"}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <p>No questions available for this section.</p>
            )}
        </div>
    );
}

export default ExamPage;
