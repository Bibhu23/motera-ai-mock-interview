import React, { useRef, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [dotLottie, setDotLottie] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);

  const steps = [
    {
      title: "Choose a Role or Job Detail",
      description:
        "AI generates potential interview questions tailored to your role. Select your dream position to start practicing smart.",
      icon: "🎯",
    },
    {
      title: "Start Mock Interview",
      description:
        "Experience a real-time, AI-powered video interview simulation that mirrors real company interviews.",
      icon: "🎬",
    },
    {
      title: "Get AI Feedback",
      description:
        "Instant, personalized feedback and scoring help you identify your strengths and areas for improvement.",
      icon: "📊",
    },
  ];

  const rounds = [
    { title: "Resume Shortlist", description: "Your resume is analyzed by AI for key skills.", icon: "📄" },
    { title: "Written Test", description: "Solve aptitude, reasoning, and coding questions.", icon: "📝" },
    { title: "Technical Interview", description: "Real-time technical rounds powered by AI.", icon: "💻" },
    { title: "HR Round", description: "Simulate HR interviews for culture-fit and soft skills.", icon: "🤝" },
  ];

  const faqs = [
    { q: "What is Motera AI?", a: "Motera AI is an AI-driven mock interview platform that simulates real hiring rounds and provides actionable feedback." },
    { q: "Is it free to use?", a: "Yes! You can take free interviews with optional premium insights for deeper analytics." },
    { q: "Do I need a webcam?", a: "Yes. Video-based interviews require a webcam and mic for the best experience." },
    { q: "What job roles are supported?", a: "We support multiple domains including Software Engineer, Analyst, Designer, and more." },
  ];

  const handleMouseEnter = () => dotLottie && dotLottie.play();
  const handleMouseLeave = () => dotLottie && dotLottie.pause();

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero-section">
        <motion.div
          className="hero-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Ace Your Next Interview with <span>AI-Powered Mock Sessions</span></h1>
          <p>
            Practice real interview rounds, get AI feedback, and transform your preparation into confidence.
          </p>
          <div className="cta-buttons">
            <button onClick={() => navigate("/round1")}>Start Mock Interview</button>
            <button onClick={() => navigate("/dashboard")}>Dashboard</button>
          </div>
        </motion.div>

        <div
          className="hero-animation"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <DotLottieReact
            src="https://lottie.host/652926b0-8315-4d63-ab82-8af4dc065ed7/W2LLtNlv56.lottie"
            loop
            autoplay={false}
            dotLottieRefCallback={setDotLottie}
          />
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="highlights">
        {[
          { number: "50K+", text: "Successful Interviews" },
          { number: "95%", text: "Success Rate" },
          { number: "200+", text: "Job Roles Covered" },
          { number: "24/7", text: "AI Assistance" },
        ].map((item, i) => (
          <motion.div
            key={i}
            className="highlight-card"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <h3>{item.number}</h3>
            <p>{item.text}</p>
          </motion.div>
        ))}
      </section>

      {/* FEATURES */}
      <section className="features">
        <h2>Why Choose <span>Motera AI?</span></h2>
        <div className="features-grid">
          {[
            { icon: "🎙️", title: "Real Interview Simulation", text: "Face realistic AI-driven interview scenarios." },
            { icon: "🤖", title: "AI Feedback", text: "Instant insights to boost performance." },
            { icon: "📊", title: "Performance Report", text: "Detailed analytics for improvement." },
            { icon: "🔁", title: "Unlimited Practice", text: "Practice anytime, anywhere, limitlessly." },
          ].map((f, i) => (
            <div key={i} className="feature-card">
              <span className="icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STEPS */}
      <section className="steps">
        <h2>4 Rounds to Success 🚀</h2>
        <div className="step-grid">
          {rounds.map((r, i) => (
            <div className="step" key={i}>
              <div className="step-icon">{r.icon}</div>
              <h3>{r.title}</h3>
              <p>{r.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="faq">
        <h2>Frequently Asked Questions</h2>
        {faqs.map((item, i) => (
          <div
            key={i}
            className={`faq-item ${openIndex === i ? "open" : ""}`}
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          >
            <div className="faq-question">
              <span>{item.q}</span>
              <span>{openIndex === i ? "−" : "+"}</span>
            </div>
            {openIndex === i && <p className="faq-answer">{item.a}</p>}
          </div>
        ))}
      </section>
    </>
  );
};

export default Home;