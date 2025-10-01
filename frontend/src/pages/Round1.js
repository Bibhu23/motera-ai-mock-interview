import React, { useState, useContext } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { AppContext } from "../context/Appcontext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Round1 = () => {
  const [resume, setResume] = useState(null);
  const [score, setScore] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const { login, credit, setCredit, consumeCredit } = useContext(AppContext);

  const handleUpload = (e) => {
    setResume(e.target.files[0]);
    setScore(null);
  };

  const handleSubmit = async () => {
    if (!resume) {
      toast.warning("⚠️ Please upload a resume!");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resume);

    try {
      setUploading(true);
      setProgress(0);

      const response = await axios.post(
        "http://localhost:7656/api/upload-resume",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percent);
          },
        }
      );

      setUploading(false);

      const { score, creditBalance } = response.data;
      setScore(score);
      setCredit(creditBalance); // update frontend

      // ✅ Now consumeCredit works
      await consumeCredit();

      if (score > 50) {
        toast.success(`✅ Score: ${score} - Eligible for Round 2!`);
        navigate("/round2");
      } else {
        toast.info(`❌ Score: ${score} - Not eligible for Round 2.`);
      }
    } catch (err) {
      setUploading(false);
      console.error("Upload failed:", err.response?.data || err.message);
      toast.error("❌ Sorry, your free trial has ended!");
    }
  };

  return login ? (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", backgroundColor: "#FFF2F5" }}
    >
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="col-lg-6 col-md-8 col-sm-10">
        <div
          className="card shadow-lg d-flex justify-content-center align-items-center p-4"
          style={{
            aspectRatio: "1 / 1",
            width: "100%",
            maxWidth: "500px",
            minHeight: "400px",
            backgroundColor: "#FFF2F5",
          }}
        >
          <h2 className="text-center mb-3" style={{ color: "#0dcaf0" }}>
            Round 1: Resume Shortlist
          </h2>
          <p className="text-center text-muted mb-4">
            Drop your resume here or choose a file.<br />
            <small>PDF & DOCX only. Max 2MB file size.</small><br />
            <small>Privacy guaranteed</small>
          </p>

          <div className="mb-3 w-75">
            <input
              className="form-control form-control-lg"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleUpload}
            />
          </div>

          {uploading && (
            <div className="mb-3 w-75">
              <div className="progress" style={{ height: "20px" }}>
                <div
                  className="progress-bar progress-bar-striped progress-bar-animated"
                  role="progressbar"
                  style={{ width: `${progress}%` }}
                  aria-valuenow={progress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  {progress}%
                </div>
              </div>
            </div>
          )}

          <button
            className="btn btn-primary btn-lg w-50 mt-3"
            onClick={handleSubmit}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload Your Resume"}
          </button>

          {score !== null && (
            <div className="mt-3 text-center">
              <h5>
                Your ATS Score: <span className="fw-bold">{score}</span>
              </h5>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/login" />
  );
};

export default Round1;
