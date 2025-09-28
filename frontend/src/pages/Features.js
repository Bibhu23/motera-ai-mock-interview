import React from "react";
import { Link } from "react-router-dom";

function Features() {
    const features = [
        { icon: "🤖", title: "AI-Powered Mock Interviews", desc: "Practice real-world interview scenarios with instant AI feedback." },
        { icon: "🎯", title: "Customized Question Sets", desc: "Get interview questions tailored to your domain and skill level." },
        { icon: "📊", title: "Instant Feedback & Analytics", desc: "Receive detailed reports on confidence, clarity, and correctness." },
        { icon: "🎤", title: "Video & Voice Practice", desc: "Simulate live interviews with voice and video features." },
        { icon: "📈", title: "Progress Tracking", desc: "Track your improvement over time with performance history." },
        { icon: "📄", title: "Resume-Based Questioning", desc: "Upload your resume and get AI-generated questions based on it." }
    ];

    const points = [
        {
            icon: "⚡",
            title: "10x Faster Learning",
            desc: "Accelerate your interview skills with AI-powered insights and targeted practice."
        },
        {
            icon: "🏢",
            title: "Industry Experts",
            desc: "Access to questions and scenarios from top companies and hiring managers."
        },
        {
            icon: "📈",
            title: "Progress Tracking",
            desc: "Monitor your improvement with detailed analytics and performance metrics."
        },
        {
            icon: "🎓",
            title: "Certification Ready",
            desc: "Prepare for technical certifications and advanced role interviews."
        }
    ];
    const steps = [
        {
            number: "01",
            icon: "📝",
            title: "Set Your Goal",
            desc: "Define your dream role and skill level so the platform can tailor your practice exactly to your needs."
        },
        {
            number: "02",
            icon: "⚡",
            title: "Engage with AI",
            desc: "Experience dynamic AI-powered interviews that adapt to your answers in real-time for a realistic experience."
        },
        {
            number: "03",
            icon: "🔍",
            title: "Analyze & Improve",
            desc: "Get deep insights on your performance, identify strengths and weaknesses, and track improvement over time."
        }
    ];

    const feedbacks = [
        {
            name: "Alice Johnson",
            image: "https://randomuser.me/api/portraits/women/44.jpg",
            rating: 5,
            comment: "Motera helped me prepare in a structured way. The AI feedback is so accurate!"
        },
        {
            name: "David Smith",
            image: "https://randomuser.me/api/portraits/men/32.jpg",
            rating: 4,
            comment: "The personalized mock interviews made me feel confident and ready for real interviews."
        },
        {
            name: "Emma Williams",
            image: "https://randomuser.me/api/portraits/women/68.jpg",
            rating: 5,
            comment: "I loved tracking my progress over time. Seeing improvement kept me motivated!"
        },
        {
            name: "Michael Brown",
            image: "https://randomuser.me/api/portraits/men/76.jpg",
            rating: 5,
            comment: "The best platform for interview prep. Covers everything from technical to behavioral questions."
        }
    ];
    const renderStars = (count) => {
        let stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <span key={i} className={i < count ? "text-warning" : "text-muted"}>★</span>
            );
        }
        return stars;
    };


    return (
        <section className="py-5 bg-light" id="features">

            {/* ====== First Section: Features ====== */}
            <div className="features-section mb-5">
                <div className="d-inline-flex align-items-center justify-content-center mb-2 border rounded-pill">
                    <span style={{ fontSize: "20px", marginRight: "8px" }}>⚡</span>
                    <span className="text-uppercase fw-semibold text-primary">Platform Features</span>
                </div>
                <h2 className="fw-bold text-center mb-5">Everything You Need to Succeed</h2>
                <p className="text-muted text-center mb-5" style={{ fontSize: "18px" }}>
                    From AI-powered coaching to tailored practice, Motera gives you
                    the smartest way to prepare and excel in every interview round.
                </p>

                <div className="container">
                    <div className="row">
                        {features.map((feature, index) => (
                            <div className="col-md-4 mb-4" key={index}>
                                <div className="card h-100 shadow-sm border-0 text-center p-3">
                                    <div style={{ fontSize: "40px" }}>{feature.icon}</div>
                                    <h5 className="mt-3">{feature.title}</h5>
                                    <p className="text-muted">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ====== Second Section: Why We're Different (same style as features) ====== */}
            <div className="features-section">
                {/* Badge without border */}
                <div className="d-inline-flex align-items-center justify-content-center mb-2 rounded-pill">
                    <span style={{ fontSize: "20px", marginRight: "8px" }}>💡</span>
                    <span className="text-uppercase fw-semibold text-primary">Why We're Different</span>
                </div>

                <h2 className="fw-bold text-center mb-5">We’re Not Just Another Mock Interview Tool</h2>
                <p className="text-muted text-center mb-5" style={{ fontSize: "18px" }}>
                    Motera goes beyond traditional preparation with AI-powered coaching, personalized sessions, and actionable insights that set you apart.
                </p>

                <div className="container">
                    <div className="row flex-nowrap justify-content-center">
                        {points.map((point, index) => (
                            <div className="col-md-3 mb-4 text-center" key={index}>
                                <div className="card h-100 shadow-sm border-0 p-3">
                                    <div style={{ fontSize: "40px" }}>{point.icon}</div>
                                    <h5 className="mt-3">{point.title}</h5>
                                    <p className="text-muted">{point.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* ====== How It Works Section ====== */}
            <div className="features-section mb-5" id="works">
                <div className="d-inline-flex align-items-center justify-content-center mb-2 border rounded-pill px-3 py-1">
                    <span style={{ fontSize: "20px", marginRight: "8px" }}>⚡</span>
                    <span className="text-uppercase fw-semibold text-primary">How It Works</span>
                </div>

                <h2 className="fw-bold text-center mb-5">Step-by-Step Process</h2>
                <p className="text-muted text-center mb-5" style={{ fontSize: "18px" }}>
                    Follow these simple steps to get started and make the most of our platform.
                </p>

                <div className="container">
                    <div className="row justify-content-center">
                        {steps.map((step, index) => (
                            <div className="col-md-4 mb-4" key={index}>
                                <div className="card h-100 shadow-sm border-0 text-center p-4 position-relative">
                                    {/* Step Number Circle */}
                                    <div
                                        className="position-absolute top-0 start-50 translate-middle bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                                        style={{
                                            width: "50px",
                                            height: "50px",
                                            fontSize: "20px",
                                            top: "-25px",
                                        }}
                                    >
                                        {step.number}
                                    </div>

                                    {/* Icon */}
                                    <div className="mb-3" style={{ fontSize: "40px" }}>{step.icon}</div>

                                    {/* Title & Description */}
                                    <h5 className="mt-2">{step.title}</h5>
                                    <p className="text-muted">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>


            {/* ----------- Feedback Section Styled like Features ---------- */}
            <div className="features-section py-5" id="feedback">
                {/* Badge */}
                <div className="d-inline-flex align-items-center justify-content-center mb-2 rounded-pill">
                    <span style={{ fontSize: "20px", marginRight: "8px" }}>⭐</span>
                    <span className="text-uppercase fw-semibold text-primary">What People Are Saying</span>
                </div>

                <h2 className="fw-bold text-center mb-5">Hear From Our Users</h2>
                <p className="text-muted text-center mb-5" style={{ fontSize: "18px" }}>
                    Users who accelerated their interview preparation with Motera share their experiences.
                </p>

                <div className="container">
                    <div className="row">
                        {feedbacks.map((fb, index) => (
                            <div className="col-md-3 mb-4" key={index}>
                                <div className="card h-100 shadow-sm border-0 text-center p-4">
                                    <img
                                        src={fb.image}
                                        alt={fb.name}
                                        className="rounded-circle mb-3 mx-auto"
                                        style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                    />
                                    <h5 className="fw-semibold">{fb.name}</h5>
                                    <div className="mb-2" style={{ fontSize: "16px" }}>
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <span key={i} className={i < fb.rating ? "text-warning" : "text-muted"}>★</span>
                                        ))}
                                    </div>
                                    <p className="text-muted">{fb.comment}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* ====== CTA Section ====== */}
            <div className="features-section py-5 text-center bg-light">
                <div className="container">
                    {/* Heading */}
                    <h2 className="fw-bold mb-3">Take Your Interview Skills to the Next Level</h2>

                    {/* Subtext */}
                    <p className="text-muted mb-5" style={{ fontSize: "18px" }}>
                        Join thousands of professionals who have improved their confidence and performance with Motera AI Mock Interviews.
                    </p>

                    {/* Cards Row */}
                    <div className="row justify-content-center g-4">
                        {/* Start Free Trial Card */}
                        <div className="col-md-6">
                            <Link
                                to="/signup"
                                className="card h-100 shadow-sm border-0 p-4 text-decoration-none text-dark d-flex flex-column align-items-center justify-content-center"
                            >
                                <div style={{ fontSize: "50px", marginBottom: "15px" }}>🚀</div>
                                <h5 className="fw-semibold mb-2">Start Free Trial</h5>
                                <p className="text-muted" style={{ fontSize: "14px" }}>
                                    No credit card required. Free 7-day trial. Cancel anytime.
                                </p>
                            </Link>
                        </div>

                        {/* Watch Demo Card */}
                        <div className="col-md-6">
                            <Link
                                to="/demo"
                                className="card h-100 shadow-sm border-0 p-4 text-decoration-none text-dark d-flex flex-column align-items-center justify-content-center"
                            >
                                <div style={{ fontSize: "50px", marginBottom: "15px" }}>🎬</div>
                                <h5 className="fw-semibold mb-2">Watch Demo</h5>
                                <p className="text-muted" style={{ fontSize: "14px" }}>
                                    See how Motera transforms your interview preparation.
                                </p>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Features;
