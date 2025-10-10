import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LiveVideoInterviewPage.css";
import * as faceapi from "face-api.js/dist/face-api.min.js";

function LiveVideoInterviewPage() {
  const videoRef = useRef(null);
  const [question, setQuestion] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(5);
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

  const navigate = useNavigate();

  // ---------------- CAMERA READY EVENT ----------------
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const handlePlaying = () => {
      console.log("✅ Camera feed started");
      setCameraReady(true);
    };

    videoEl.addEventListener("playing", handlePlaying);

    return () => videoEl.removeEventListener("playing", handlePlaying);
  }, []);

  // ---------------- REQUEST PERMISSIONS ----------------
  const [faceMissingCount, setFaceMissingCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [timerActive, setTimerActive] = useState(false);

  // ---------------- REQUEST CAMERA & MICROPHONE ----------------
  const requestPermissions = async () => {
    console.log("Requesting camera and microphone permissions...");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: true,
      });

      console.log("✅ Permissions granted, media stream ready");

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        // Force video playback
        videoRef.current.onloadedmetadata = async () => {
          try {
            await videoRef.current.play();
            console.log("🎥 Video playback started immediately");
          } catch (playError) {
            console.warn("⚠️ Autoplay blocked, user interaction required");
          }
        };

        // Additional event listeners for better error handling
        videoRef.current.onerror = (error) => {
          console.error("Video element error:", error);
        };

        videoRef.current.onstalled = () => {
          console.warn("Video stream stalled, attempting to restart...");
          if (videoRef.current && videoRef.current.paused) {
            videoRef.current.play().catch(console.error);
          }
        };
      }

      setMediaStream(stream);
      setPermissionsGranted(true);
    } catch (err) {
      console.error("Permission error:", err);
      let errorMessage =
        "Please allow camera and microphone access to continue.";

      if (err.name === "NotAllowedError") {
        errorMessage =
          "Camera and microphone access was denied. Please refresh the page and allow access.";
      } else if (err.name === "NotFoundError") {
        errorMessage =
          "No camera or microphone found. Please check your device connections.";
      } else if (err.name === "NotReadableError") {
        errorMessage =
          "Camera or microphone is already in use by another application.";
      }

      alert(errorMessage);
    }
  };

  // ---------------- LOAD FACE API MODELS ----------------
  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      console.log("✅ Face-api models loaded");
    };
    loadModels();
  }, []);

  // ---------------- FACE DETECTION ----------------
  useEffect(() => {
    let localMissingCount = 0;

    let interval = setInterval(async () => {
      if (!videoRef.current) return;
      const detection = await faceapi.detectSingleFace(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions()
      );
      if (!detection) {
        localMissingCount++;
        if (localMissingCount >= 3) {
          alert("⚠️ Please stay in front of the camera!");
          localMissingCount = 0; // reset after alert
        }
      } else {
        localMissingCount = 0;
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [cameraReady, faceMissingCount]);

  // ---------------- TAB VISIBILITY DETECTION ----------------
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        alert("⚠️ Do not switch tabs during the interview!");
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // ---------------- DEVICE ORIENTATION DETECTION ----------------
  useEffect(() => {
    const handleOrientation = () => {
      if (window.screen.orientation.angle !== 0) {
        alert("⚠️ Keep your device upright during the interview!");
      }
    };
    window.addEventListener("orientationchange", handleOrientation);
    return () =>
      window.removeEventListener("orientationchange", handleOrientation);
  }, []);

  // ---------------- INTERVIEW QUESTIONS ----------------
  useEffect(() => {
    if (interviewStarted && questions.length > 0) {
      setQuestion(questions[questionIndex]?.question || "No question found");
    }
  }, [questionIndex, interviewStarted, questions]);

  const startInterview = async () => {
    if (!permissionsGranted) {
      alert("Please allow camera and microphone access first.");
      return;
    }

    try {
      const res = await fetch(
        `https://motera-backend.onrender.com/api/gemini/technical-based-on-resume?limit=${totalQuestions}`,
        { credentials: "include" }
      );
      const data = await res.json();

      if (!Array.isArray(data)) throw new Error("Invalid questions response");
      setQuestions(data);
      setInterviewStarted(true);
      setQuestionIndex(0);
      setShow(true);
    } catch (err) {
      console.error("Failed to fetch questions:", err);
      alert("Failed to load interview questions. Please try again.");
    }
  };

  // ---------------- RECORDING LOGIC ----------------
  const startRecording = () => {
    if (!mediaStream) {
      alert("No media stream available. Please allow camera and mic.");
      return;
    }

    const audioTracks = mediaStream.getAudioTracks();
    if (!audioTracks || audioTracks.length === 0) {
      alert("No microphone detected or permission denied.");
      return;
    }

    const audioStream = new MediaStream([audioTracks[0]]);
    let recorder;
    let localChunks = [];

    try {
      recorder = new MediaRecorder(audioStream, {
        mimeType: "audio/webm;codecs=opus",
      });
    } catch (err) {
      console.error("MediaRecorder not supported:", err);
      alert(
        "Recording is not supported in this browser. Use latest Chrome/Edge."
      );
      return;
    }

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) localChunks.push(e.data);
    };

    recorder.onstop = async () => {
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
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  // ---------------- UPLOAD & TRANSCRIBE ----------------
  const handleUpload = async (chunks) => {
    if (!chunks || chunks.length === 0) return;

    const blob = new Blob(chunks, { type: "audio/webm" });
    const formData = new FormData();
    formData.append("audio", blob, "answer.webm");
    formData.append("question", question);

    try {
      const res = await fetch("https://motera-backend.onrender.com/api/transcribe", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok || !data.transcript) {
        setFeedback({
          score: 0,
          feedback: data?.message || "Transcription error",
        });
        return;
      }

      const feedbackRes = await fetch("https://motera-backend.onrender.com/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, transcript: data.transcript }),
      });
      const feedbackData = await feedbackRes.json();

      if (!feedbackRes.ok) {
        setFeedback({
          score: 0,
          feedback: feedbackData?.message || "Feedback error",
        });
        return;
      }

      const numericScore = Number(feedbackData?.feedback?.score || 0);
      setFeedback(feedbackData.feedback);
      setScoreTotal((prev) => prev + numericScore);

      // Stop timer when feedback arrives
      setTimerActive(false);
    } catch (err) {
      console.error("handleUpload error:", err);
      setFeedback({
        score: 0,
        feedback: "Error analyzing answer. Please retry.",
      });
    }
  };

  const nextQuestion = async () => {
    setFeedback(null);
    setQuestionIndex((prev) => prev + 1);
    setTimerActive(true);

    if (questionIndex + 1 >= totalQuestions) {
      const maxScore = totalQuestions * 10;
      const pct = Math.round((scoreTotal / maxScore) * 100);
      const eligible = pct > 50;

      alert(
        `🎯 Interview finished! Overall correctness: ${pct}%.\n` +
        `Candidate is ${eligible ? "eligible ✅" : "not eligible ❌"
        } for HR round.`
      );

      await handleLiveVideoComplete(scoreTotal);
      navigate("/hrround");
      return;
    }
  };

  const restartCamera = async () => {
    console.log("🔄 Restarting camera...");
    setCameraReady(false);

    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setTimeout(() => {
      requestPermissions();
    }, 500);
    setIson(true);
  };

  // ----------- TIMER LOGIC -----------
  useEffect(() => {
    if (!interviewStarted) return;

    setTimeLeft(90);
    setTimerActive(true);

    const interval = setInterval(() => {
      if (!timerActive) return;

      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (recording) stopRecording();
          setTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [questionIndex, interviewStarted]);

  const handleLiveVideoComplete = async (finalScore) => {
    try {
      const maxScore = totalQuestions * 10;
      const scorePercent = Math.round((finalScore / maxScore) * 100);

      await fetch(
        "https://motera-backend.onrender.com/user/api/v1/submit-technical-score",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ technicalScore: scorePercent }),
        }
      );

      alert(`✅ Live Video (Technical) score saved: ${scorePercent}%`);

      await axios.get("https://motera-backend.onrender.com/user/api/v1/interview-rounds", {
        withCredentials: true,
      });
    } catch (err) {
      console.error("Failed to save technical score:", err);
      alert("Failed to save score. Try again!");
    }
  };

  return (
    <div className="myapp">
      <h1>Live Mock Interview</h1>

      {!ison && (
        <>
          {show && (
            <>
              {!cameraReady && permissionsGranted && (
                <div className="camera-status">
                  <button onClick={restartCamera} style={{ marginLeft: "10px" }}>
                    On Camera
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {!permissionsGranted && (
        <div className="permission-section">
          <h2>Camera & Microphone Access Required</h2>
          <p>Please allow camera and microphone access to continue.</p>
          <button onClick={requestPermissions}>Allow Access</button>
        </div>
      )}

      {permissionsGranted && !interviewStarted && (
        <div className="start-section">
          <h2>Ready to Start Mock Interview?</h2>
          <p>
            You will be asked {totalQuestions} technical questions based on your
            resume skills.
          </p>
          <button onClick={startInterview}>Start Mock Interview</button>
        </div>
      )}

      {interviewStarted && (
        <>
          <div className="appvide">
            <video
              id="interviewVideo"
              ref={videoRef}
              autoPlay
              muted
              playsInline
              style={{ backgroundColor: "black" }}
            />
          </div>

          <div className="question-section">
            <div className="timer">
              <strong>Time Left:</strong>{" "}
              {Math.floor(timeLeft / 60)}:
              {String(timeLeft % 60).padStart(2, "0")}
            </div>

            {ison && (
              <>
                <h2>
                  Question {questionIndex + 1} of {totalQuestions}:
                </h2>
                <p>{question}</p>
              </>
            )}

            {!recording && (
              <button onClick={startRecording}>Start Recording Answer</button>
            )}
            {recording && (
              <button onClick={stopRecording}>Stop & Submit Answer</button>
            )}
          </div>

          {feedback && (
            <div className="feedback-section">
              <h2>Feedback</h2>
              <p>
                <strong>Score:</strong> {feedback.score}/10
              </p>
              <p>
                <strong>Comments:</strong> {feedback.feedback}
              </p>

              {questionIndex + 1 < totalQuestions && (
                <button onClick={nextQuestion}>Next Question</button>
              )}

              {questionIndex + 1 >= totalQuestions && (
                <div>
                  <h2>Technical Round Completed</h2>
                  <p>
                    Total Score: {scoreTotal}/{totalQuestions * 10} (
                    {Math.round(
                      (scoreTotal / (totalQuestions * 10)) * 100
                    )}
                    %)
                  </p>
                  <p>
                    Eligibility:{" "}
                    {scoreTotal > (totalQuestions * 10) / 2
                      ? "Eligible ✅"
                      : "Not Eligible ❌"}
                  </p>

                  {scoreTotal > (totalQuestions * 10) / 2 ? (
                    <button
                      onClick={async () => {
                        await handleLiveVideoComplete(scoreTotal);
                        navigate("/hrround");
                      }}
                    >
                      Proceed to HR Round
                    </button>
                  ) : (
                    <button
                      onClick={async () => {
                        await handleLiveVideoComplete(scoreTotal);
                        alert("Candidate not eligible for HR round.");
                      }}
                    >
                      Finish Technical Round
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default LiveVideoInterviewPage;
