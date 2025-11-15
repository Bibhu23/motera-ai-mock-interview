import React, { useState, useEffect } from "react";
import Home from "./Home";
import LoginCard from "../components/LoginCard";
import "./Landing.css";

export default function Landing() {
    const [showLogin, setShowLogin] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check stored login status when page loads
        const loggedIn = localStorage.getItem("isLoggedIn") === "true";
        setIsLoggedIn(loggedIn);

        // If not logged in, trigger the login popup after 10s
        if (!loggedIn) {
            const timer = setTimeout(() => setShowLogin(true), 10000);
            return () => clearTimeout(timer);
        }
    }, []);

    // ✅ Optional: handle logout to re-show login popup
    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        setIsLoggedIn(false);
        setShowLogin(true);
    };

    // ✅ Optional: handle login success
    const handleLoginSuccess = () => {
        localStorage.setItem("isLoggedIn", "true");
        setIsLoggedIn(true);
        setShowLogin(false);
    };

    return (
        <div className="landing-container">
            <div className={`home-container ${showLogin ? "blurred" : ""}`}>
                {/* Pass logout handler to Home (optional, only if Home has a logout button) */}
                <Home onLogout={handleLogout} />
            </div>

            {/* Show login popup only when user isn't logged in */}
            {!isLoggedIn && showLogin && (
                <div className="login-popup">
                    <LoginCard onLoginSuccess={handleLoginSuccess} />
                </div>
            )}
        </div>
    );
}
