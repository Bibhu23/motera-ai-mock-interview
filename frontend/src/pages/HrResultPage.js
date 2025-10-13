// HrResultPage.js
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function HrResultPage() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { totalScore = 0, totalQuestions = 3 } = state || {};

    const maxScore = totalQuestions * 10;
    const percentage = Math.round((totalScore / maxScore) * 100);
    const eligibility = totalScore > maxScore / 2 ? "Eligible ✅" : "Not Eligible ❌";

    return (
        <div className="myapp">
            <h1>HR Round Completed 🎯</h1>
            <p>Total Score: {totalScore}/{maxScore} ({percentage}%)</p>
            <p>Eligibility: {eligibility}</p>
            <button onClick={() => navigate("/dashboard")}>Go to Dashboard</button>
        </div>
    );
}

export default HrResultPage;
