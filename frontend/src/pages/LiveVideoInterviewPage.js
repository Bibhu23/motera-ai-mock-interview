import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LiveVideoInterviewPage.css";

function LiveVideoInterviewPage() {
  const videoRef = useRef(null);
  const [question, setQuestion] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(15);
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
  useEffect(() => {
    requestPermissions();
  }, []);

  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [mediaStream]);

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
        `http://localhost:7656/api/gemini/technical-based-on-resume?limit=${totalQuestions}`,
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
      const res = await fetch("http://localhost:7656/api/transcribe", {
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

      const feedbackRes = await fetch("http://localhost:7656/api/feedback", {
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
    } catch (err) {
      console.error("handleUpload error:", err);
      setFeedback({
        score: 0,
        feedback: "Error analyzing answer. Please retry.",
      });
    }
  };

  const nextQuestion = () => {
    setFeedback(null);
    if (questionIndex + 1 >= totalQuestions) {
      const maxScore = totalQuestions * 10;
      const pct = Math.round((scoreTotal / maxScore) * 100);
      alert(`Interview finished! Overall correctness: ${pct}%`);
      navigate("/dashboard");
      return;
    }
    setQuestionIndex((prev) => prev + 1);
  };

  const restartCamera = async () => {
    console.log("🔄 Restarting camera...");
    setCameraReady(false);

    // Stop existing stream
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
    }

    // Clear video element
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    // Wait a moment then restart
    setTimeout(() => {
      requestPermissions();
    }, 500);
    setIson(true);
  };

  return (
    <div className="myapp">
      <h1>Live Mock Interview</h1>

    {!ison && <> ( { show && <>({!cameraReady && permissionsGranted && (
        <div className="camera-status">
          <button onClick={restartCamera} style={{ marginLeft: "10px" }}>
            On Camera
          </button>
        </div>
      )})
      </>} )</>}

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
              <button onClick={nextQuestion}>
                {questionIndex + 1 >= totalQuestions
                  ? "Finish Interview"
                  : "Next Question"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default LiveVideoInterviewPage;
