import React, { useRef, useEffect } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useNavigate } from "react-router-dom";
import './Home.css';

const Home = () => {
    const steps = [
        {
            title: "Choose a Role or Job Detail",
            description: "AI will generate potential interview questions based on the role you choose. Select your target role for the best results.",
            icon: "🎯",
        },
        {
            title: "Start Your Mock Interview",
            description: "After your questions are generated, start your mock interview to experience a realistic video-based session.",
            icon: "🎬",
        },
        {
            title: "Get AI-Based Feedback",
            description: "See your score, video and feedback once your mock interview is complete. Now you’re ready for the real one!",
            icon: "📊",
        },
    ];

    const rounds = [
        {
            title: "Resume Shortlist",
            description: "Your resume is reviewed and shortlisted for the next stage.",
            icon: "📄",
        },
        {
            title: "Written Test",
            description: "Questions from Aptitude, Reasoning, Verbal Ability, and Coding.",
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

    const displayData = rounds; // Change to steps to show steps
    const navigate = useNavigate();
    const videoRef = useRef(null);

    // Auto-play video on mount
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(err => {
                console.log("Autoplay prevented:", err);
            });
        }
    }, []);

    // Navigate after video ends
    const handleVideoEnd = () => {
        navigate("/round1"); // Change this to your target route
    };

    return (
        <>
            {/* Top Section with Lottie */}
            <div className="container">
                <div className="img-container">
                    <DotLottieReact
                        src="https://lottie.host/652926b0-8315-4d63-ab82-8af4dc065ed7/W2LLtNlv56.lottie"
                        loop
                        autoplay
                    />
                </div>
                <div className="text">
                    <h1>Motera AI Platform</h1>
                    <p>Start Your Interview Journey By Click Start</p>
                    <button className="button" onClick={() => navigate("/round1")}>
                        Start
                    </button>
                </div>
            </div>

            {/* Steps / Rounds Section */}
            <div className="step-container">
                <h2 className="step-text">
                    {displayData === steps ? "Unlock Your Interview Success in 3 Steps!" : "Unlock Your Interview Success in 4 Rounds!"}
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
                    <video
                        ref={videoRef}
                        controls
                        width="600"
                        onEnded={handleVideoEnd} // Auto-navigate after video finishes
                        autoPlay
                    >
                        <source src="/motera_video.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            </div>
        </>
    );
};

export default Home;
