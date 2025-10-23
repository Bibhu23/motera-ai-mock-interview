import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LiveVideoInterviewPage.css";
import * as faceapi from "face-api.js";
import { AppContext } from "../context/Appcontext";

function HrInterviewPage() {
  const { backend } = React.useContext(AppContext);
  const videoRef = useRef(null);
  const [question, setQuestion] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(3);
  const [scoreTotal, setScoreTotal] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [recording, setRecording] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [mediaStream, setMediaStream] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [show, setShow] = useState(false);
  const [ison, setIson] = useState(false);
  const [readingTimeLeft, setReadingTimeLeft] = useState(15);
  const [readingTimeOver, setReadingTimeOver] = useState(false);
  const [recordingTime, setRecordingTime] = useState(90);
  const [forceRecord, setForceRecord] = useState(false);
  const [hasRecordedMap, setHasRecordedMap] = useState({});
  const timerRef = useRef(null);

  const navigate = useNavigate();

  // Camera ready
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;
    const handlePlaying = () => setCameraReady(true);
    videoEl.addEventListener("playing", handlePlaying);
    return () => videoEl.removeEventListener("playing", handlePlaying);
  }, []);

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
    };
    loadModels();
  }, []);

  // Face detection (simple)
  useEffect(() => {
    let localMissingCount = 0;
    const interval = setInterval(async () => {
      if (!videoRef.current) return;
      try {
        const detection = await faceapi.detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        );
        if (!detection) {
          localMissingCount++;
          if (localMissingCount >= 3) {
            alert("⚠️ Please stay in front of the camera!");
            localMissingCount = 0;
          }
        } else {
          localMissingCount = 0;
        }
      } catch {
        /* ignore detection errors */
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [cameraReady]);

  // Visibility/orientation handlers
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) alert("⚠️ Do not switch tabs during the interview!");
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);
  useEffect(() => {
    const handleOrientation = () => {
      if (window.screen.orientation && window.screen.orientation.angle !== 0)
        alert("⚠️ Keep your device upright during the interview!");
    };
    window.addEventListener("orientationchange", handleOrientation);
    return () => window.removeEventListener("orientationchange", handleOrientation);
  }, []);

  // Set current question when interview starts or index changes
  useEffect(() => {
    if (interviewStarted && questions.length > 0) {
      setQuestion(questions[questionIndex]?.question || "No question found");
    }
  }, [questionIndex, interviewStarted, questions]);

  // Request camera/mic
  const requestPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
        audio: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = async () => {
          try { await videoRef.current.play(); } catch { }
        };
      }
      setMediaStream(stream);
      setPermissionsGranted(true);
    } catch (err) {
      console.error("Permission error:", err);
      alert("Please allow camera and microphone access to continue.");
    }
  };

  // Start interview (HR questions endpoint)
  const startInterview = async () => {
    if (!permissionsGranted) {
      alert("Please allow camera and microphone access first.");
      return;
    }
    try {
      const res = await fetch(`${backend}/api/gemini/hr-base?limit=${totalQuestions}`, { credentials: "include" });
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Invalid questions response");
      setQuestions(data);
      setInterviewStarted(true);
      setQuestionIndex(0);
      setShow(true);
      setHasRecordedMap({});
    } catch (err) {
      console.error("Failed to fetch questions:", err);
      alert("Failed to load interview questions. Please try again.");
    }
  };

  // Recording logic (per-question single start)
  const startRecording = () => {
    if (hasRecordedMap[questionIndex]) return;
    if (!mediaStream) {
      alert("No media stream available. Please allow camera and mic.");
      return;
    }

    setHasRecordedMap((prev) => ({ ...prev, [questionIndex]: true }));
    setRecordedChunks([]);
    const audioTracks = mediaStream.getAudioTracks();
    if (!audioTracks || audioTracks.length === 0) {
      alert("No microphone detected.");
      return;
    }
    const audioStream = new MediaStream([audioTracks[0]]);
    let localChunks = [];
    let recorder;
    try {
      recorder = new MediaRecorder(audioStream, { mimeType: "audio/webm;codecs=opus" });
    } catch (err) {
      console.error("MediaRecorder error:", err);
      alert("Recording not supported in this browser.");
      return;
    }

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) localChunks.push(e.data);
    };
    recorder.onstop = async () => {
      clearInterval(timerRef.current);
      setRecording(false);
      if (!localChunks || localChunks.length === 0) {
        setFeedback({ score: 0, feedback: "No valid audio recorded." });
        return;
      }
      setRecordedChunks(localChunks);
      await handleUpload(localChunks);
    };

    recorder.start();
    setMediaRecorder(recorder);
    setRecording(true);
  };

  const stopRecording = () => {
    if (!recording) return;
    if (mediaRecorder) mediaRecorder.stop();
    setRecording(false);
  };

  // Upload & feedback
  const handleUpload = async (chunks) => {
    if (!chunks || chunks.length === 0) return;
    const blob = new Blob(chunks, { type: "audio/webm" });
    const formData = new FormData();
    formData.append("audio", blob, "answer.webm");
    formData.append("question", question || "");

    try {
      const res = await fetch(`${backend}/api/transcribe`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok || !data.transcript) {
        setFeedback({ score: 0, feedback: data?.message || "Transcription error" });
        return;
      }

      const feedbackRes = await fetch(`${backend}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, transcript: data.transcript }),
      });
      const feedbackData = await feedbackRes.json();
      if (!feedbackRes.ok) {
        setFeedback({ score: 0, feedback: feedbackData?.message || "Feedback error" });
        return;
      }

      const numericScore = Number(feedbackData?.feedback?.score || 0);
      setFeedback(feedbackData.feedback);
      setScoreTotal((prev) => prev + numericScore);
    } catch (err) {
      console.error("handleUpload error:", err);
      setFeedback({ score: 0, feedback: "Error analyzing answer. Please retry." });
    }
  };

  // Next question or finish – for HR show result button at end
  const nextQuestion = () => {
    setFeedback(null);
    if (questionIndex + 1 < totalQuestions) {
      setQuestionIndex((prev) => prev + 1);
      setRecording(false);
    } else {
      // navigate to HR result page
      navigate("/hr-result", { state: { totalScore: scoreTotal, totalQuestions } });
    }
  };

  const restartCamera = async () => {
    setCameraReady(false);
    if (mediaStream) mediaStream.getTracks().forEach((t) => t.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    setTimeout(() => requestPermissions(), 500);
    setIson(true);
  };

  // Reading timer per question
  useEffect(() => {
    if (interviewStarted && questions.length > 0) {
      setReadingTimeLeft(15);
      setReadingTimeOver(false);
      setForceRecord(false);

      const timer = setInterval(() => {
        setReadingTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setReadingTimeOver(true);
            setForceRecord(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [questionIndex, interviewStarted, questions]);

  // Recording countdown
  useEffect(() => {
    if (recording) {
      setRecordingTime(90);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [recording]);

  return (
    <div className="myapp">
      <h1>Live Mock Interview (HR)</h1>

      {/* Permission */}
      {!ison && !permissionsGranted && (
        <div className="permission-section">
          <h2>Camera & Microphone Access Required</h2>
          <p>Please allow camera and microphone access to continue.</p>
          <button onClick={requestPermissions}>Allow Access</button>
        </div>
      )}

      {/* Start interview */}
      {permissionsGranted && !interviewStarted && (
        <div className="start-section">
          <h2>Ready to Start HR Mock Interview?</h2>
          <p>You will be asked {totalQuestions} HR questions.</p>
          <button onClick={startInterview}>Start Mock Interview</button>
        </div>
      )}

      {/* Interview */}
      {interviewStarted && (
        <div className="interview-container">
          <div className="video-wrapper">
            <video id="interviewVideo" ref={videoRef} autoPlay muted playsInline />
            {!cameraReady && (
              <div className="camera-status">
                <p>Camera not ready</p>
                <button onClick={restartCamera}>Restart Camera</button>
              </div>
            )}
          </div>

          <div className="question-controls">
            <div className="question-section">
              <div className="timer">
                {recording ? (
                  <span className={recordingTime <= 5 ? "pulse-red" : ""}>
                    Recording Time Left: {Math.floor(recordingTime / 60)}:
                    {String(recordingTime % 60).padStart(2, "0")}
                  </span>
                ) : (
                  <span>{forceRecord ? "Time's up!" : ""}</span>
                )}
              </div>

              <h2>Question {questionIndex + 1} of {totalQuestions}:</h2>
              <p>{question}</p>

              {/* Start / Stop Recording Buttons */}
              {!recording ? (
                <button
                  onClick={startRecording}
                  disabled={!!hasRecordedMap[questionIndex] || !readingTimeOver}
                  title={!readingTimeOver ? `Reading Time Left: ${readingTimeLeft}s` : undefined}
                >
                  {!readingTimeOver ? `Reading Time Left: ${readingTimeLeft}s` : "Start Recording Answer"}
                </button>
              ) : (
                <button onClick={stopRecording} disabled={!recording}>
                  Stop & Submit Answer
                </button>
              )}
            </div>

            {/* Feedback */}
            {feedback && (
              <div className="feedback-section">
                <h2>Feedback</h2>
                <p><strong>Score:</strong> {feedback.score}/10</p>
                <p><strong>Comments:</strong> {feedback.feedback}</p>

                {questionIndex + 1 < totalQuestions && (
                  <button onClick={nextQuestion}>Next Question</button>
                )}

                {questionIndex + 1 >= totalQuestions && (
                  <div className="final-feedback">
                    <h2>HR Round Completed</h2>
                    {/* Only view result button at the end */}
                    <button
                      className="view-result-btn"
                      onClick={() => navigate("/hr-result", { state: { totalScore: scoreTotal, totalQuestions } })}
                    >
                      View Result
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default HrInterviewPage;
