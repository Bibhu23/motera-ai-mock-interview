import React from "react";
import { Link } from "react-router";

function Sidebar() {
    return (
        <div className="sidebar">
            <h2>My App</h2>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/profile">Profile</Link></li>
                <li><Link to="/result">Results</Link></li>
                <li><Link to="/setting">Settings</Link></li>
                <li><Link to="/logout">Logout</Link></li>
            </ul>
        </div>
    );
}

export default Sidebar;
