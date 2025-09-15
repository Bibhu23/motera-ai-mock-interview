import React from "react";
import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="container mt-5">
            <h1>Motera AI Interview Platform</h1>
            <p>Practice real-world interviews powered by AI.</p>
            <Link to="/signup" className="btn btn-primary me-2">Signup</Link>
        </div>
    )
}
export default Home;
