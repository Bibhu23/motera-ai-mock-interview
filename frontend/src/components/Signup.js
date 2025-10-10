import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Gpi from "../Gpi";
import "./Login.css";
import bgImg from "../assets/moterabac.jfif";
import { FcGoogle } from "react-icons/fc";

export default function Signup() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            Object.keys(form).forEach((key) => {
                if (form[key]) formData.append(key, form[key]);
            });

            await Gpi.post("/user/api/v1/register", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Signup failed");
        }
    };

    const handleGoogleSignup = () => {
        window.location.href = "https://motera-backend.onrender.com";
    };

    return (
        <div className="login-wrapper" style={{ backgroundImage: `url(${bgImg})` }}>
            <div className="login-card professional">
                <div className="logo">🤖</div>
                <h2>Sign Up</h2>
                <p className="subtitle">Create your account to start AI-powered practice</p>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit} className="signup-form">
                    <div className="input-group">
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>


                    <button type="submit" className="login-btn">
                        Create Account
                    </button>
                </form>

                <div className="divider">or</div>

                <button className="google-btn" onClick={handleGoogleSignup}>
                    <FcGoogle className="google-icon" />
                    <span>Continue with Google</span>
                </button>

                <p className="register">
                    Already have an account? <a href="/login">Sign In</a>
                </p>
            </div>
        </div>
    );
}
