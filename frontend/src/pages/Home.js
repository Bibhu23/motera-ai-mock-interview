import React, { useRef, useEffect, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const steps = [
    {
      title: "Choose a Role or Job Detail",
      description:
        "AI will generate potential interview questions based on the role you choose. Select your target role for the best results.",
      icon: "🎯",
    },
    {
      title: "Start Your Mock Interview",
      description:
        "After your questions are generated, start your mock interview to experience a realistic video-based session.",
      icon: "🎬",
    },
    {
      title: "Get AI-Based Feedback",
      description:
        "See your score, video and feedback once your mock interview is complete. Now you’re ready for the real one!",
      icon: "📊",
    },
  ];

  const rounds = [
    {
      title: "Resume Shortlist",
      description:
        "Your resume is reviewed and shortlisted for the next stage.",
      icon: "📄",
    },
    {
      title: "Written Test",
      description:
        "Questions from Aptitude, Reasoning, Verbal Ability, and Coding.",
      icon: "📝",
    },
    {
      title: "Technical Interview",
      description: "Face-to-face or video interview with technical questions.",
      icon: "💻",
    },
    {
      title: "HR Round",
      description: "Evaluate communication, culture fit, and final selection.",
      icon: "🤝",
    },
  ];

  const faqs = [
    {
      q: "What is Motera AI?",
      a: "Motera AI is a mock interview platform powered by AI that simulates real hiring rounds and provides instant feedback.",
    },
    {
      q: "Is it free to use?",
      a: "Yes, you can start with free mock interviews. Premium features may include advanced analytics and unlimited attempts.",
    },
    {
      q: "Do I need a webcam?",
      a: "Yes, for video-based mock interviews, a webcam and microphone are recommended.",
    },
    {
      q: "What job roles are supported?",
      a: "Currently we support Software Engineer, Web Developer, Data Analyst, and many more. More roles are being added regularly.",
    },
    {
      q: "Will my recordings be safe?",
      a: "Yes, your data is private. Recordings are automatically deleted after a set period as per our Privacy Policy.",
    },
  ];

  const displayData = rounds;
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [openIndex, setOpenIndex] = useState(null);
  //for stoping autoplay video it only run when the mouse only hover
  const [dotLottie, setDotLottie] = useState(null);

  const handleMouseEnter = () => {
    if (dotLottie) dotLottie.play();
  };

  const handleMouseLeave = () => {
    if (dotLottie) dotLottie.pause();
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.log("Autoplay prevented:", err);
      });
    }
  }, []);

  const handleVideoEnd = () => {
    navigate("/round1");
  };

  return (
    <>
      {/* Hero Section */}
      <div className="container hero-section">
        <div
          className="img-container"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <DotLottieReact
            src="https://lottie.host/652926b0-8315-4d63-ab82-8af4dc065ed7/W2LLtNlv56.lottie"
            loop
            autoplay={false} // Don't play automatically
            dotLottieRefCallback={setDotLottie} // Capture the Lottie instance
          />
        </div>
        <div className="text">
          <h1>Ace Your Next Interview with AI-Powered Mock Sessions</h1>
          <p>
            Practice real interview rounds, get instant AI feedback, and land
            your dream job.
          </p>
          <div className="cta-buttons">
            <button className="button" onClick={() => navigate("/round1")}>
              Start Mock Interview
            </button>
            <button
              className="button secondary"
              onClick={() => window.scrollTo({ top: 800, behavior: "smooth" })}
            >
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <div className="highlights-container">
        <div className="highlight-card card-1">
          <h3>50K+</h3>
          <p>Successful Interviews</p>
        </div>
        <div className="highlight-card card-2">
          <h3>95%</h3>
          <p>Success Rate</p>
        </div>
        <div className="highlight-card card-3">
          <h3>200+</h3>
          <p>Job Roles Covered</p>
        </div>
        <div className="highlight-card card-4">
          <h3>24/7</h3>
          <p>AI Assistance</p>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <h2>Why Choose Motera AI?</h2>
        <div className="features-grid">
          <div className="feature-card">
            🎙️ <h3>Real Interview Simulation</h3>
            <p>Experience realistic hiring rounds with AI-driven scenarios.</p>
          </div>
          <div className="feature-card">
            🤖 <h3>AI-Powered Feedback</h3>
            <p>Get instant insights into your strengths and weaknesses.</p>
          </div>
          <div className="feature-card">
            📊 <h3>Detailed Performance Report</h3>
            <p>Receive scores and actionable feedback after each interview.</p>
          </div>
          <div className="feature-card">
            🔁 <h3>Unlimited Practice</h3>
            <p>Practice as many times as you want, anytime, anywhere.</p>
          </div>
        </div>
      </div>

      {/* Steps / Rounds Section */}
      <div className="step-container">
        <h2 className="step-text">
          {displayData === steps
            ? "Unlock Your Interview Success in 3 Steps!"
            : "Unlock Your Interview Success in 4 Rounds!"}
        </h2>
        <div className="step-distance">
          {displayData.map((item, index) => (
            <div className="step-style" key={index}>
              <div className="step-number">{index + 1}</div>
              <div className="round-icon">{item.icon}</div>
              <h3 className="step-title">{item.title}</h3>
              <p className="step-desc">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="video-container">
          <h2 className="video-title">Demo: 4 Interview Rounds in Action</h2>
          <video ref={videoRef} controls width="600" onEnded={handleVideoEnd}>
            <source src="/motera_video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <p className="video-caption">
            Watch how our AI simulates the complete interview process.
          </p>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="testimonial-section">
        <h2>What Our Users Say</h2>
        <div className="testimonial-grid">
          <div className="testimonial-card">
            <p>
              “Motera AI helped me crack my Infosys interview by preparing me
              for real HR questions!”
            </p>
            <span>- Ananya, Software Engineer</span>
          </div>
          <div className="testimonial-card">
            <p>
              “I practiced coding + HR rounds here and felt super confident in
              my TCS interview.”
            </p>
            <span>- Rohit, Developer</span>
          </div>
          <div className="testimonial-card">
            <p>
              “The AI feedback gave me insights I never got from friends or
              college mock sessions.”
            </p>
            <span>- Priya, Data Analyst</span>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="faq-container">
        <h2 className="faq-title">Frequently Asked Questions</h2>
        <div className="faq-list">
          {faqs.map((item, index) => (
            <div
              key={index}
              className={`faq-item ${openIndex === index ? "open" : ""}`}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <div className="faq-question">
                <span>{item.q}</span>
                <span>{openIndex === index ? "−" : "+"}</span>
              </div>
              {openIndex === index && (
                <div className="faq-answer">{item.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
