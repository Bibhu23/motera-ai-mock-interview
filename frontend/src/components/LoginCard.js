import React, { useContext, useState } from "react";
import { AppContext } from "../context/Appcontext";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { account } from "../appwrite";

export default function LoginCard() {
    const { setUser, setLogin } = useContext(AppContext);
    const navigate = useNavigate();
    const [loginForm, setLoginForm] = useState({ email: "", password: "" });

    const handleLogin = async (e) => {
        e.preventDefault();
        if (loginForm.email === "" || loginForm.password === "") {
            alert("Please fill all fields");
            return;
        }

        try {
            const res = await axios.post(
                "http://localhost:7656/user/api/v1/login",
                loginForm,
                { withCredentials: true }
            );

            if (res.data?.user) {
                setUser(res.data.user);
                setLogin(true);
                localStorage.setItem("isLoggedIn", "true");
                navigate("/");
            }
        } catch (err) {
            setLogin(false);
            alert("Login failed: " + (err.response?.data?.message || err.message));
        }
    };

    const handleGoogleLogin = () => {
        account.createOAuth2Session("google", "http://localhost:3000/");
    };

    return (
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
                        onChange={(e) =>
                            setLoginForm({
                                ...loginForm,
                                [e.target.name]: e.target.value,
                            })
                        }
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
                        onChange={(e) =>
                            setLoginForm({
                                ...loginForm,
                                [e.target.name]: e.target.value,
                            })
                        }
                        required
                    />
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
    );
}
