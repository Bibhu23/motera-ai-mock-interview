import React, { useState, useContext, useEffect } from "react";
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
  const [creditChecked, setCreditChecked] = useState(false);
  const navigate = useNavigate();
  const { login, credit, setCredit, consumeCredit } = useContext(AppContext);

  // Check credits when component loads
  useEffect(() => {
    const checkCredits = async () => {
      if (login) {
        try {
          const response = await axios.get(
            "http://localhost:7656/user/api/v1/credit",
            { withCredentials: true }
          );
          
          if (!response.data.success || response.data.creditBalance <= 0) {
            toast.error("Not enough credits to start Round 1. Please purchase credits first.");
            navigate("/buycredit");
            return;
          }
          
          setCreditChecked(true);
        } catch (error) {
          console.error("Failed to check credits:", error);
          toast.error("Failed to verify credits. Please try again.");
        }
      }
    };

    checkCredits();
  }, [login, navigate]);

  const handleUpload = (e) => {
    setResume(e.target.files[0]);
    setScore(null);
  };

  const handleSubmit = async () => {
    if (!resume) {
      toast.warning("⚠️ Please upload a resume!");
      return;
    }

    if (!creditChecked) {
      toast.error("Please wait while we verify your credits...");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resume);

    try {
      setUploading(true);
      setProgress(0);

      // First deduct credit
      const creditResult = await consumeCredit();
      if (!creditResult.success) {
        toast.error(creditResult.message || "Failed to deduct credit");
        setUploading(false);
        return;
      }

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

      const { score } = response.data;
      setScore(score);

      if (score > 50) {
        toast.success(`✅ Score: ${score} - Eligible for Round 2!`);
        navigate("/round2");
      } else {
        toast.info(`❌ Score: ${score} - Not eligible for Round 2.`);
      }
    } catch (err) {
      setUploading(false);
      console.error("Upload failed:", err.response?.data || err.message);
      toast.error("❌ Upload failed. Please try again!");
    }
  };

  if (!login) return <Navigate to="/login" />;

  if (!creditChecked) {
    return (
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
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <h5 className="mt-3">Verifying credits...</h5>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
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
            <small>Privacy guaranteed</small><br />
            <small className="text-warning">⚠️ 1 credit will be deducted when you upload</small>
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
  );
};

export default Round1;
