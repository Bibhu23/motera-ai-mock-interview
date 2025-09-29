import React from "react";
import ExamPage from "../components/ExamPage";
const Round2 = () => {
    return (
        <div className="container text-center py-5">
            <h2>Round 2: Written Test</h2>
            <p>Here candidates will solve Aptitude, Reasoning, Verbal, and Coding questions.</p>
            <div>
                <ExamPage />

            </div>
        </div>
    );
};

export default Round2;