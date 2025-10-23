import React, { useRef, useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LiveVideoInterviewPage.css";
import * as faceapi from "face-api.js";
import { AppContext } from "../context/Appcontext";

function LiveVideoInterviewPage() {
  const { backend } = useContext(AppContext);
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const timerRef = useRef(null);

  // Core state
  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [question, setQuestion] = useState("");
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [scoreTotal, setScoreTotal] = useState(0);

  // Media & recording
  const [mediaStream, setMediaStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [recording, setRecording] = useState(false);
  const [hasRecordedMap, setHasRecordedMap] = useState({});

  // UI / timers
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [readingTimeLeft, setReadingTimeLeft] = useState(15);
  const [readingTimeOver, setReadingTimeOver] = useState(false);
  const [recordingTime, setRecordingTime] = useState(90);
  const [forceRecord, setForceRecord] = useState(false);

  // Feedback from backend
  const [feedback, setFeedback] = useState(null);

  // ---------------- Camera ready event ----------------
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;
    const onPlaying = () => setCameraReady(true);
    videoEl.addEventListener("playing", onPlaying);
    return () => videoEl.removeEventListener("playing", onPlaying);
  }, []);

  // ---------------- Load face-api (kept minimal) ----------------
  useEffect(() => {
    const load = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      } catch (e) {
        console.warn("face-api models not loaded", e);
      }
    };
    load();
  }, []);

  // ---------------- Basic face detection (alerts user) ----------------
  useEffect(() => {
    let missing = 0;
    const id = setInterval(async () => {
      if (!videoRef.current) return;
      try {
        const d = await faceapi.detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        );
        if (!d) {
          missing++;
          if (missing >= 3) {
            alert("⚠️ Please stay in front of the camera!");
            missing = 0;
          }
        } else {
          missing = 0;
        }
      } catch {
        /* ignore detection errors */
      }
    }, 2000);
    return () => clearInterval(id);
  }, [cameraReady]);

  // ---------------- Visibility & orientation ----------------
  useEffect(() => {
    const onVis = () => {
      if (document.hidden) alert("⚠️ Do not switch tabs during the interview!");
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);
  useEffect(() => {
    const onOri = () => {
      if (window.screen.orientation && window.screen.orientation.angle !== 0)
        alert("⚠️ Keep your device upright during the interview!");
    };
    window.addEventListener("orientationchange", onOri);
    return () => window.removeEventListener("orientationchange", onOri);
  }, []);

  // ---------------- Permissions ----------------
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
      console.error("Permission error", err);
      alert("Please allow camera and microphone access to continue.");
    }
  };

  // ---------------- Start interview (fetch questions) ----------------
  const startInterview = async () => {
    if (!permissionsGranted) {
      alert("Please allow camera and microphone access first.");
      return;
    }
    try {
      const res = await fetch(`${backend}/api/gemini/technical-based-on-resume?limit=${totalQuestions}`, { credentials: "include" });
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Invalid questions response");
      setQuestions(data);
      setInterviewStarted(true);
      setQuestionIndex(0);
      setHasRecordedMap({});
    } catch (err) {
      console.error("Failed to fetch questions:", err);
      alert("Failed to load interview questions. Please try again.");
    }
  };

  // Update current question when index changes
  useEffect(() => {
    if (interviewStarted && questions.length > 0) {
      setQuestion(questions[questionIndex]?.question || "No question found");
      // reset reading timer per question
      setReadingTimeLeft(15);
      setReadingTimeOver(false);
      setForceRecord(false);
      setFeedback(null);
    }
  }, [questionIndex, interviewStarted, questions]);

  // ---------------- Recording logic (single start per question) ----------------
  const startRecording = () => {
    if (hasRecordedMap[questionIndex]) return;
    if (!mediaStream) {
      alert("No media stream available. Please allow camera and mic.");
      return;
    }
    // only allow after reading time
    if (!readingTimeOver) return;

    setHasRecordedMap((p) => ({ ...p, [questionIndex]: true }));
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
      console.error("MediaRecorder error", err);
      alert("Recording not supported in this browser.");
      return;
    }

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) localChunks.push(e.data);
    };
    recorder.onstop = async () => {
      clearInterval(timerRef.current);
      setRecording(false);
      if (!localChunks.length) {
        setFeedback({ score: 0, feedback: "No valid audio recorded." });
        return;
      }
      setRecordedChunks(localChunks);
      await handleUpload(localChunks);
    };

    recorder.start();
    setMediaRecorder(recorder);
    setRecording(true);
    // recording countdown handled below
  };

  const stopRecording = () => {
    if (!recording) return;
    if (mediaRecorder) mediaRecorder.stop();
    setRecording(false);
  };

  // ---------------- Upload & feedback ----------------
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
      const fbRes = await fetch(`${backend}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, transcript: data.transcript }),
      });
      const fbData = await fbRes.json();
      if (!fbRes.ok) {
        setFeedback({ score: 0, feedback: fbData?.message || "Feedback error" });
        return;
      }
      const numericScore = Number(fbData?.feedback?.score || 0);
      setFeedback(fbData.feedback);
      setScoreTotal((s) => s + numericScore);
    } catch (err) {
      console.error("handleUpload error", err);
      setFeedback({ score: 0, feedback: "Error analyzing answer. Please retry." });
    }
  };

  // ---------------- Next question / finish ----------------
  const nextQuestion = () => {
    setFeedback(null);
    if (questionIndex + 1 < totalQuestions) {
      setQuestionIndex((p) => p + 1);
    } else {
      const maxScore = totalQuestions * 10;
      const pct = Math.round((scoreTotal / maxScore) * 100);
      const eligible = pct > 50;
      navigate("/technical-result", { state: { totalScore: scoreTotal, totalQuestions, eligible } });
    }
  };

  // ---------------- Camera restart ----------------
  const restartCamera = async () => {
    setCameraReady(false);
    if (mediaStream) mediaStream.getTracks().forEach((t) => t.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    setTimeout(requestPermissions, 500);
  };

  // ---------------- Timers ----------------
  useEffect(() => {
    if (!interviewStarted || questions.length === 0) return;
    setReadingTimeLeft(15);
    setReadingTimeOver(false);
    setForceRecord(false);
    const t = setInterval(() => {
      setReadingTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(t);
          setReadingTimeOver(true);
          setForceRecord(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [questionIndex, interviewStarted, questions]);

  useEffect(() => {
    if (!recording) {
      clearInterval(timerRef.current);
      return;
    }
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
    return () => clearInterval(timerRef.current);
  }, [recording]);

  return (
    <div className="myapp">
      <h1>Live Mock Interview</h1>

      {/* Permissions */}
      {!permissionsGranted && (
        <div className="permission-section">
          <h2>Camera & Microphone Access Required</h2>
          <p>Please allow camera and microphone access to continue.</p>
          <button onClick={requestPermissions}>Allow Access</button>
        </div>
      )}

      {/* Start */}
      {permissionsGranted && !interviewStarted && (
        <div className="start-section">
          <h2>Ready to Start Mock Interview?</h2>
          <p>You will be asked {totalQuestions} technical questions based on your resume skills.</p>
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

              {!recording ? (
                <button
                  onClick={startRecording}
                  disabled={!!hasRecordedMap[questionIndex] || !readingTimeOver}
                  title={!readingTimeOver ? `Reading Time Left: ${readingTimeLeft}s` : undefined}
                >
                  {!readingTimeOver ? `Reading Time Left: ${readingTimeLeft}s` : "Start Recording Answer"}
                </button>
              ) : (
                <button onClick={stopRecording}>Stop & Submit Answer</button>
              )}
            </div>

            {feedback && (
              <div className="feedback-section">
                <h2>Feedback</h2>
                <p><strong>Score:</strong> {feedback.score}/10</p>
                <p><strong>Comments:</strong> {feedback.feedback}</p>

                {questionIndex + 1 < totalQuestions ? (
                  <button onClick={nextQuestion}>Next Question</button>
                ) : (
                  <div className="final-feedback">
                    <h2>Technical Round Completed</h2>
                    <button className="view-result-btn" onClick={() => {
                      const maxScore = totalQuestions * 10;
                      const pct = Math.round((scoreTotal / maxScore) * 100);
                      const eligible = pct > 50;
                      navigate("/technical-result", { state: { totalScore: scoreTotal, totalQuestions, eligible } });
                    }}>
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

export default LiveVideoInterviewPage;
