import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Round1 = () => {
    const [resume, setResume] = useState(null);
    const [score, setScore] = useState(null);
    const navigate = useNavigate();

    const handleUpload = (e) => {
        setResume(e.target.files[0]);
    };

    const handleSubmit = async () => {
        if (!resume) {
            alert("Please upload a resume!");
            return;
        }

        const formData = new FormData();
        formData.append("resume", resume); // Must match multer key in backend

        try {
            const response = await axios.post(
                "http://localhost:7656/api/upload-resume",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            const { score } = response.data;
            setScore(score);

            if (score > 50) {
                alert(`Score: ${score} ✅ Eligible for Round 2!`);
                navigate("/round2");
            } else {
                alert(`Score: ${score} ❌ Not eligible for Round 2.`);
            }

        } catch (err) {
            console.error("Upload failed:", err.response?.data || err.message);
            alert("Failed to upload resume. Please try again.");
        }
    };

    return (
        <div className="container text-center py-5">
            <h2>Round 1: Resume Shortlist</h2>
            <p>Please upload your resume to check ATS compatibility.</p>

            <input type="file" accept=".pdf,.doc,.docx" onChange={handleUpload} />
            <br />
            <button className="btn btn-primary mt-3" onClick={handleSubmit}>
                Submit Resume
            </button>

            {score !== null && (
                <p className="mt-3">Your ATS Score: <strong>{score}</strong></p>
            )}
        </div>
    );
};

export default Round1;
