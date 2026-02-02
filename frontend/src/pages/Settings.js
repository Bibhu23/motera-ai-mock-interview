import React, { useState, useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../context/Appcontext";

export default function Settings() {
    const { login } = useContext(AppContext);

    // 🔐 Account
    const [fullName, setFullName] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // 🎨 Appearance
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "light"
    );

    // 🎯 Interview Preferences
    const [role, setRole] = useState("Frontend");
    const [difficulty, setDifficulty] = useState("Intermediate");
    const [timer, setTimer] = useState(60);

    // 🔔 Notifications
    const [emailNotify, setEmailNotify] = useState(true);


    /* -------------------- THEME EFFECT -------------------- */
    useEffect(() => {
        if (!login) return;
        document.body.classList.toggle("dark", theme === "dark");
        localStorage.setItem("theme", theme);
    }, [theme]);

    /* -------------------- SAVE SETTINGS -------------------- */
    const handleSave = (e) => {
        e.preventDefault();

        if (newPassword && newPassword !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        const settingsData = {
            fullName,
            theme,
            role,
            difficulty,
            timer,
            emailNotify,
        };

        console.log("Saved Settings:", settingsData);
        alert("Settings saved successfully ✅");
    };

    return (
        <div className="container py-4">
            <h3 className="mb-4 fw-bold">⚙️ Settings</h3>

            <form onSubmit={handleSave}>
                {/* ================= ACCOUNT ================= */}
                <div className="card mb-4">
                    <div className="card-header fw-semibold">Account Settings</div>
                    <div className="card-body row g-3">
                        <div className="col-md-6">
                            <label className="form-label">Full Name</label>
                            <input
                                className="form-control"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">New Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Confirm Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* ================= APPEARANCE ================= */}
                <div className="card mb-4">
                    <div className="card-header fw-semibold">Appearance</div>
                    <div className="card-body">
                        <select
                            className="form-select w-50"
                            value={theme}
                            onChange={(e) => setTheme(e.target.value)}
                        >
                            <option value="light">Light Mode</option>
                            <option value="dark">Dark Mode</option>
                        </select>
                    </div>
                </div>

                {/* ================= INTERVIEW PREF ================= */}
                <div className="card mb-4">
                    <div className="card-header fw-semibold">
                        Interview Preferences
                    </div>
                    <div className="card-body row g-3">
                        <div className="col-md-4">
                            <label className="form-label">Preferred Role</label>
                            <select
                                className="form-select"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option>Frontend</option>
                                <option>Backend</option>
                                <option>Full Stack</option>
                                <option>Java</option>
                                <option>Python</option>
                            </select>
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">Difficulty</label>
                            <select
                                className="form-select"
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                            >
                                <option>Beginner</option>
                                <option>Intermediate</option>
                                <option>Advanced</option>
                            </select>
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">Time per Question</label>
                            <select
                                className="form-select"
                                value={timer}
                                onChange={(e) => setTimer(Number(e.target.value))}
                            >
                                <option value={30}>30 seconds</option>
                                <option value={60}>60 seconds</option>
                                <option value={90}>90 seconds</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* ================= NOTIFICATIONS ================= */}
                <div className="card mb-4">
                    <div className="card-header fw-semibold">Notifications</div>
                    <div className="card-body form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={emailNotify}
                            onChange={() => setEmailNotify(!emailNotify)}
                        />
                        <label className="form-check-label ms-2">
                            Email interview reminders
                        </label>
                    </div>
                </div>

                {/* ================= SAVE ================= */}
                <button className="btn btn-primary px-4">
                    Save Settings
                </button>
            </form>
        </div>
    );
}
