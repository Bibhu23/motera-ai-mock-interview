import React from "react";
import bgImg from "../assets/moterabac.jfif";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import LoginCard from "../components/LoginCard";
import "./Login.css";

export default function Login() {
    return (
        <div
            className="login-wrapper"
            style={{ backgroundImage: `url(${bgImg})` }}
        >
            <Link to="/" className="back-home">
                <FaArrowLeft /> Back to Home
            </Link>
            <LoginCard />
        </div>
    );
}
