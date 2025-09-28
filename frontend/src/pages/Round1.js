import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Round1.css";

const Round1 = () => {
    const [resume, setResume] = useState(null);
    const [score, setScore] = useState(null);
    const [responseData, setResponseData] = useState(null);
    const [loading, setLoading] = useState(false); // pending button
    const navigate = useNavigate();

    const handleUpload = (e) => setResume(e.target.files[0]);

    const handleSubmit = async () => {
        if (!resume) {
            alert("Please upload a resume!");
            return;
        }

        const formData = new FormData();
        formData.append("resume", resume);

        try {
            setLoading(true); // set pending
            const response = await axios.post(
                "http://localhost:7656/api/upload-resume",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            const { score } = response.data;
            setScore(score);
            setResponseData(response.data);

            if (score > 50) {
                // Passed
                alert("🎉 Congratulations! Your resume passed the ATS check.");
                navigate("/round2");

            } else {
                // Failed
                alert("Sorry, your resume did not pass the ATS check.");
                navigate("/"); // redirect to home page
            }
        } catch (err) {
            console.error("Upload failed:", err.response?.data || err.message);
            alert("Failed to upload resume. Please try again.");
        } finally {
            setLoading(false); // reset button
        }
    };


    return (
        <div className="round1-container">
            <h2>Free tool to help you check if your resume is optimized for applicant tracking systems (ATS).</h2>

            <div className="card">
                <h4 className="card-title">Resume</h4>

                <label className="drop-zone">
                    <input type="file" accept=".pdf,.doc,.docx" onChange={handleUpload} hidden />
                    <div className="drop-content">
                        <span className="upload-icon">⬆️</span>
                        <p><strong>Drop or Click</strong></p>
                        <small>You need a PDF resume to check ATS-friendly</small>
                    </div>
                </label>

                {resume && (
                    <div className="success-box">
                        ✅ <span>Success! File uploaded: {resume.name}</span>
                    </div>
                )}

                <button
                    className="check-btn"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? "Checking..." : "Check ATS"}
                </button>

                {score !== null && (
                    <div className="result-box">
                        <p>Your ATS Score:</p>
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${score}%` }}
                            >
                                {score}%
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Round1;
