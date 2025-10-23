import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowRight, FaArrowLeft, FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import "./HrResultPage.css";

function HrResultPage() {
    const { state } = useLocation();
    const navigate = useNavigate();

    const { totalScore = 0, totalQuestions = 3, eligible = null } = state || {};
    const maxScore = totalQuestions * 10;
    const percentage = Math.round((totalScore / maxScore) * 100);
    const isEligible = eligible !== null ? eligible : totalScore > maxScore / 2;

    // 🌟 Calculate star rating (out of 3)
    const stars = (percentage / 100) * 3;
    const fullStars = Math.floor(stars);
    const hasHalfStar = stars - fullStars >= 0.5;
    const emptyStars = 3 - fullStars - (hasHalfStar ? 1 : 0);

    const motivationalText = isEligible
        ? "🚀 Great job! You're moving to the next round!"
        : "📈 Keep practicing — you’re getting there!";

    return (
        <div className="result-container">
            <div className="result-card">
                <h1 className="result-title">Interview Result 🎯</h1>

                {/* ⭐ Dynamic Star Rating */}
                <div className="stars">
                    {[...Array(fullStars)].map((_, i) => (
                        <FaStar key={`full-${i}`} className="star full" />
                    ))}
                    {hasHalfStar && <FaStarHalfAlt className="star half" />}
                    {[...Array(emptyStars)].map((_, i) => (
                        <FaRegStar key={`empty-${i}`} className="star empty" />
                    ))}
                </div>

                <p className="result-text">
                    <strong>Score:</strong> {totalScore}/{maxScore} ({percentage}%)
                </p>

                <p className="result-text">
                    <strong>Eligibility:</strong> {isEligible ? "Eligible ✅" : "Not Eligible ❌"}
                </p>

                <p className="motivation-text">{motivationalText}</p>

                {isEligible ? (
                    <button
                        className="hr-button success"
                        onClick={() => navigate("/dashboard")}
                    >
                        Go to HR Round <FaArrowRight className="btn-icon" />
                    </button>
                ) : (
                    <button
                        className="hr-button danger"
                        onClick={() => navigate("/")}
                    >
                        <FaArrowLeft className="btn-icon" /> Back to Home
                    </button>
                )}
            </div>
        </div>
    );
}

export default HrResultPage;
