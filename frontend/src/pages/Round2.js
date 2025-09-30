import React from "react";
import ExamPage from "../components/ExamPage";
import { useContext } from "react";
import { AppContext } from "../context/Appcontext";
import { Navigate } from "react-router-dom";
import Login from "../components/Login";
const Round2 = () => {
    const {login} = useContext(AppContext);
    return (
        login ?(
        <div className="container text-center py-5">
            <h2>Round 2: Written Test</h2>
            <p>Here candidates will solve Aptitude, Reasoning, Verbal, and Coding questions.</p>
            <div>
                <ExamPage />

            </div>
        </div>
        ):(<Navigate to="/login" />)
    );
};

export default Round2;