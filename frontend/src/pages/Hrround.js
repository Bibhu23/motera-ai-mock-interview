import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Hrround.css";

import { FaSadCry } from "react-icons/fa";

function HrInterviewPage() {
  const videoRef = useRef();
  const [question, setQuestion] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [scoreTotal, setScoreTotal] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [recording, setRecording] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [mediaStream, setMediaStream] = useState(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    if (interviewStarted && questions.length > 0) {
      setQuestion(questions[questionIndex]?.question || "No question found");
    }
  }, [questionIndex, interviewStarted, questions]);

  const requestPermissions = () => {
    console.log("Requesting camera and microphone permissions...");
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        console.log("Permissions granted, media stream ready");

        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          // ✅ force video to play
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play().catch((err) => {
              console.warn("Autoplay blocked:", err);
            });
          };
        }

        setMediaStream(stream);
        setPermissionsGranted(true);
      })
      .catch((err) => {
        console.error("Permission error:", err);
        alert(
          "Please allow camera and microphone access to continue with the interview."
        );
      });
  };

  const startInterview = async () => {
    if (!permissionsGranted) {
      alert("Please allow camera and microphone access first.");
      return;
    }

    try {
      // Use resume-based technical questions for the mock interview
      const res = await fetch(
        `http://localhost:7656/api/gemini/hr-base?limit=${totalQuestions}`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Invalid questions response");
      setQuestions(data);
      setInterviewStarted(true);
      setQuestionIndex(0);
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
      if (e.data && e.data.size > 0) {
        localChunks.push(e.data);
      }
    };
    recorder.onstop = async () => {
      console.log("🛑 Recorder stopped. Total chunks:", localChunks.length);
      setRecordedChunks(localChunks);
      await handleUpload(localChunks);
    };

    try {
      recorder.start();
      console.log("Recording Start");
    } catch (err) {
      console.error("Failed to start recording:", err);
      alert("Failed to start recording. Please retry.");
      return;
    }

    setMediaRecorder(recorder);
    setRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      console.log("Stopping Recorder......");
      setTimeout(() => {
        mediaRecorder.stop();
        setRecording(false);
      }, 300);
    }
  };

  // ---------------- UPLOAD & TRANSCRIBE ----------------
  const handleUpload = async (chunks) => {
    console.log("🎤 handleUpload triggered. Chunks received:", chunks?.length);

    // 🔒 Validate chunks
    if (!chunks || chunks.length === 0) {
      console.warn("⚠️ No recorded chunks found.");
      return;
    }

    // 🎧 Create a blob from recorded chunks
    const blob = new Blob(chunks, { type: "audio/webm" });

    // 🧩 Prepare FormData
    const formData = new FormData();
    formData.append("audio", blob, "answer.webm");
    formData.append("question", question || "No question provided");

    try {
      console.log("⏫ Uploading audio to /api/transcribe...");
      const res = await fetch("http://localhost:7656/api/transcribe", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      console.log("📜 Transcribe API response:", data);

      if (!res.ok) {
        console.error("❌ Transcribe API failed:", data);
        setFeedback({
          score: 0,
          feedback: data?.message || "Transcription error",
        });
        return;
      }

      if (!data.transcript || data.transcript.trim() === "") {
        console.warn("⚠️ Empty transcript received.");
        setFeedback({
          score: 0,
          feedback: "No speech detected or unclear audio.",
        });
        return;
      }

      console.log("💬 Transcript:", data.transcript);

      // 🎯 Send transcript for feedback
      console.log("🧠 Sending transcript to /api/feedback...");
      const feedbackRes = await fetch("http://localhost:7656/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          transcript: data.transcript,
        }),
      });

      const feedbackData = await feedbackRes.json();
      console.log("🤖 Feedback API response:", feedbackData);

      if (!feedbackRes.ok) {
        console.error("❌ Feedback API failed:", feedbackData);
        setFeedback({
          score: 0,
          feedback: feedbackData?.message || "Feedback error",
        });
        return;
      }

      // 🧾 Validate and update UI
      const numericScore = Number(feedbackData?.feedback?.score || 0);
      setFeedback(feedbackData.feedback);
      setScoreTotal((prev) => prev + numericScore);
    } catch (err) {
      console.error("💥 handleUpload error:", err);
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

  return (
    <div className="myapp">
      <h1>Live Mock Interview</h1>

      {!permissionsGranted && (
        <div className="permission-section">
          <h2>Camera & Microphone Access Required</h2>
          <p>
            Please allow camera and microphone access to continue with the
            interview.
          </p>
          <button onClick={requestPermissions}>Allow Access</button>
        </div>
      )}

      {permissionsGranted && !interviewStarted && (
        <div className="start-section">
          <h2>Ready to Start Mock Interview?</h2>
          <p>
            You will be asked {totalQuestions} technical questions based on your
            resume skills. Record your answers and get AI feedback.
          </p>
          <p>✅ Camera and microphone are ready</p>
          <p>📄 Questions will be personalized based on your uploaded resume</p>
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
            <h2>
              Question {questionIndex + 1} of {totalQuestions}:
            </h2>
            <p>{question}</p>
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

export default HrInterviewPage;
