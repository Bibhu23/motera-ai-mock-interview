import React, { useState } from "react";
import Gpi from "../Gpi";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Reuse the Login CSS for exact style
import bgImg from "../assets/moterabac.jfif"
export default function Signup() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
        experienceYears: "",
        skills: "",
        phone: "",
        linkedInUrl: "",
        resume: null,
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const handleResume = (e) => setForm({ ...form, resume: e.target.files[0] });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        try {
            const formData = new FormData();
            Object.keys(form).forEach((key) => form[key] && formData.append(key, form[key]));

            const res = await Gpi.post("/user/api/v1/register", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Signup failed");
        }
    };

    return (
        <div
            className="login-wrapper"
            style={{ backgroundImage: `url(${bgImg})` }}
        >
            <div className="login-card">
                <div className="logo">🤖</div>
                <h2>Motera AI Signup</h2>
                <p className="subtitle">Create your account to start AI-powered practice</p>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <span className="icon">👤</span>
                        <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
                    </div>

                    <div className="input-group">
                        <span className="icon">📧</span>
                        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
                    </div>

                    <div className="input-group">
                        <span className="icon">🔒</span>
                        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
                    </div>

                    <div className="input-group">
                        <span className="icon">🔑</span>
                        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} required />
                    </div>

                    <div className="input-group">
                        <span className="icon">💼</span>
                        <select name="role" value={form.role} onChange={handleChange} required>
                            <option value="">Select Role</option>
                            <option value="React Developer">React Developer</option>
                            <option value="Data Analyst">Data Analyst</option>
                            <option value="Backend Developer">Backend Developer</option>
                            <option value="Fullstack Developer">Fullstack Developer</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <span className="icon">⏳</span>
                        <input type="number" name="experienceYears" placeholder="Years of Experience" min="0" value={form.experienceYears} onChange={handleChange} required />
                    </div>

                    <div className="input-group">
                        <span className="icon">🛠️</span>
                        <input type="text" name="skills" placeholder="Skills (comma separated)" value={form.skills} onChange={handleChange} />
                    </div>

                    <div className="input-group">
                        <span className="icon">📱</span>
                        <input type="text" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} />
                    </div>

                    <div className="input-group">
                        <span className="icon">🔗</span>
                        <input type="url" name="linkedInUrl" placeholder="LinkedIn URL" value={form.linkedInUrl} onChange={handleChange} />
                    </div>

                    <div className="input-group">
                        <span className="icon">📄</span>
                        <input type="file" name="resume" onChange={handleResume} required />
                    </div>

                    <button type="submit" className="login-btn">Signup</button>
                </form>

                <p className="register">
                    Already Registered? <a href="/login">Login Here</a>
                </p>
            </div>
        </div>
    );
}
