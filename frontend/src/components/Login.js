import React, { useContext, useState } from "react";
import { AppContext } from "../context/Appcontext";
import "./Login.css";
import bgImg from "../assets/moterabac.jfif";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import { account } from "../appwrite";

export default function Login() {
    const { setUser, setLogin } = useContext(AppContext);
    const navigate = useNavigate();
    const [loginForm, setLoginForm] = useState({
        email: "",
        password: "",
    });

    const handleLogin = async (e) => {
        e.preventDefault();
        if (loginForm.email === "" || loginForm.password === "") {
            alert("Please fill all the fields");
            return;
        }
        try {
            const res = await axios.post("http://localhost:7656/user/api/v1/login", loginForm, { withCredentials: true });

            if (res.data && res.data.user) {
                setUser(res.data.user);
            }
            console.log("Login successful", res.data);
            setLogin(true);
            navigate("/");
        } catch (err) {
            setLogin(false);
            alert("Login failed: " + (err.response?.data?.message || err.message));
        }
    };

    const handleLoginChange = (e) => {
        setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
    };

    const handleGoogleLogin = () => {
        account.createOAuth2Session(
            "google",
            "http://localhost:3000/",     // ✅ success redirect → home page
            // "http://localhost:3000/login" // ✅ failure redirect → login page
        );
    };


    return (
        <div className="login-wrapper" style={{ backgroundImage: `url(${bgImg})` }}>
            <Link to="/" className="back-home">
                <FaArrowLeft /> Back to Home
            </Link>
            <div className="login-card">
                <div className="logo">🤖</div>
                <h2>Motera AI Mock Interview</h2>
                <p className="subtitle">Boost your skills with AI-driven practice</p>

                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <span className="icon">📧</span>
                        <input
                            type="email"
                            name="email"
                            placeholder="mail@abc.com"
                            value={loginForm.email}
                            onChange={handleLoginChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <span className="icon">🔒</span>
                        <input
                            type="password"
                            name="password"
                            placeholder="****"
                            value={loginForm.password}
                            onChange={handleLoginChange}
                            required
                        />
                    </div>

                    <div className="options">
                        <label>
                            <input type="checkbox" /> Remember Me
                        </label>
                        <a href="#">Forgot Password?</a>
                    </div>

                    <button type="submit" className="login-btn">
                        Login
                    </button>
                </form>

                <div className="divider">or</div>

                <button className="google-btn" onClick={handleGoogleLogin}>
                    <FcGoogle className="google-icon" />
                    <span>Continue with Google</span>
                </button>

                <p className="register">
                    Not Registered Yet? <Link to="/signup">register</Link>
                </p>
            </div>
        </div>
    );


}
