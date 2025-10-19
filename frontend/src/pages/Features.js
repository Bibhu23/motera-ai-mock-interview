import React from "react";
import { Link } from "react-router-dom";
import "./Feature.css";

function Features() {
  const features = [
    { icon: "🤖", title: "AI-Powered Mock Interviews", desc: "Practice real-world interview scenarios with instant AI feedback." },
    { icon: "🎯", title: "Customized Question Sets", desc: "Get interview questions tailored to your domain and skill level." },
    { icon: "📊", title: "Instant Feedback & Analytics", desc: "Receive detailed reports on confidence, clarity, and correctness." },
    { icon: "🎤", title: "Video & Voice Practice", desc: "Simulate live interviews with voice and video features." },
    { icon: "📈", title: "Progress Tracking", desc: "Track your improvement over time with performance history." },
    { icon: "📄", title: "Resume-Based Questioning", desc: "Upload your resume and get AI-generated questions based on it." },
  ];

  const points = [
    { icon: "⚡", title: "10x Faster Learning", desc: "Accelerate your interview skills with AI-powered insights and targeted practice." },
    { icon: "🏢", title: "Industry Experts", desc: "Access to questions and scenarios from top companies and hiring managers." },
    { icon: "🎓", title: "Certification Ready", desc: "Prepare for technical certifications and advanced role interviews." },
    { icon: "🧠", title: "Smart Evaluation", desc: "AI evaluates answers for clarity, tone, and technical accuracy." },
  ];

  const steps = [
    { number: "01", icon: "📝", title: "Set Your Goal", desc: "Define your dream role and skill level so the platform can tailor your practice." },
    { number: "02", icon: "⚡", title: "Engage with AI", desc: "Experience dynamic AI-powered interviews that adapt to your responses." },
    { number: "03", icon: "🔍", title: "Analyze & Improve", desc: "Get detailed feedback, identify weak areas, and monitor progress." },
  ];

  const feedbacks = [
    { name: "Alice Johnson", image: "https://randomuser.me/api/portraits/women/44.jpg", rating: 5, comment: "Motera helped me prepare in a structured way. The AI feedback is so accurate!" },
    { name: "David Smith", image: "https://randomuser.me/api/portraits/men/32.jpg", rating: 4, comment: "The personalized mock interviews made me confident for real interviews." },
    { name: "Emma Williams", image: "https://randomuser.me/api/portraits/women/68.jpg", rating: 5, comment: "Tracking progress over time kept me motivated and focused!" },
    { name: "Michael Brown", image: "https://randomuser.me/api/portraits/men/76.jpg", rating: 5, comment: "The best AI interview platform I’ve ever used — feels real and smart." },
  ];

  const renderStars = (count) =>
    Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={i < count ? "text-warning" : "text-muted"}>
        ★
      </span>
    ));

  return (
    <section className="features-wrapper" id="features">
      {/* ========== Platform Features ========== */}
      <div className="features-section text-center fade-up">
        <div className="section-label">⚡ Platform Features</div>
        <h2 className="section-title">Everything You Need to Succeed</h2>
        <p className="section-sub">
          From AI coaching to tailored practice, Motera gives you the smartest way to prepare and ace your interviews.
        </p>

        <div className="container">
          <div className="row">
            {features.map((f, i) => (
              <div className="col-md-4 mb-4" key={i}>
                <div className="glass-card feature-card">
                  <div className="icon">{f.icon}</div>
                  <h5>{f.title}</h5>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========== Why We're Different ========== */}
      <div className="features-section text-center fade-up">
        <div className="section-label">💡 Why We’re Different</div>
        <h2 className="section-title">Beyond Ordinary Mock Interviews</h2>
        <p className="section-sub">
          Motera uses AI insights, adaptive questioning, and expert-designed sessions to give you an edge.
        </p>

        <div className="container">
          <div className="row justify-content-center">
            {points.map((p, i) => (
              <div className="col-md-3 mb-4" key={i}>
                <div className="glass-card point-card">
                  <div className="icon">{p.icon}</div>
                  <h5>{p.title}</h5>
                  <p>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========== How It Works ========== */}
      <div className="features-section text-center fade-up" id="works">
        <div className="section-label">🚀 How It Works</div>
        <h2 className="section-title">Simple 3-Step Process</h2>
        <p className="section-sub">
          Get started in minutes and experience the power of AI-driven mock interviews.
        </p>

        <div className="container">
          <div className="row justify-content-center">
            {steps.map((s, i) => (
              <div className="col-md-4 mb-4" key={i}>
                <div className="glass-card step-card position-relative">
                  <div className="step-number">{s.number}</div>
                  <div className="icon">{s.icon}</div>
                  <h5>{s.title}</h5>
                  <p>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========== User Feedback ========== */}
      <div className="features-section text-center fade-up" id="feedback">
        <div className="section-label">⭐ Testimonials</div>
        <h2 className="section-title">What Our Users Say</h2>
        <p className="section-sub">Real feedback from candidates who transformed their interview skills.</p>

        <div className="container">
          <div className="row">
            {feedbacks.map((fb, i) => (
              <div className="col-md-3 mb-4" key={i}>
                <div className="glass-card feedback-card">
                  <img src={fb.image} alt={fb.name} className="avatar" />
                  <h5>{fb.name}</h5>
                  <div className="stars">{renderStars(fb.rating)}</div>
                  <p>{fb.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========== Call To Action ========== */}
      <div className="features-section text-center fade-up">
        <h2 className="section-title">Take Your Career to the Next Level</h2>
        <p className="section-sub">Join thousands mastering interviews with Motera.</p>

        <div className="d-flex flex-wrap justify-content-center gap-4">
          <Link to="/signup" className="glass-card cta-card">
            🚀 <h5>Start Free Trial</h5>
            <p>No credit card required — cancel anytime.</p>
          </Link>
          <Link to="/" className="glass-card cta-card">
            🎬 <h5>Watch Demo</h5>
            <p>See how AI can elevate your preparation.</p>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Features;
