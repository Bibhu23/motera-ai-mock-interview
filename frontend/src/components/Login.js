import React, { useContext, useState } from "react";
import Gpi from "../Gpi";
import { AppContext } from "../context/Appcontext";
import "./Login.css"; // Import the CSS file
import bgImg from "../assets/moterabac.jfif"
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export default function Login() {
    const { setUser,setLogin } = useContext(AppContext);
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
            const res = await Gpi.post("/user/api/v1/login", loginForm, {
                withCredentials: true,
            });

            if (res.data && res.data.user) {
                setUser(res.data.user);
            }
            console.log("Login successful", res.data);
            setLogin(true);
            navigate("/")
        } catch (err) {
              setLogin(false);
            alert("Login failed: " + (err.response?.data?.message || err.message));
          
        }
    };

    const handleLoginChange = (e) => {
        setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
    };

    return (
        <div
            className="login-wrapper"
            style={{ backgroundImage: `url(${bgImg})` }}
        >
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

                <p className="register">
                    Not Registered Yet? <Link to="/signup">register</Link>
                </p>
            </div>
        </div>
    );
}
