import React from "react";

function DashboardNavbar({ user }) {
    return (
        <div className="Das-navbar">
            <h3>Dashboard</h3>
            <div className="user-info">
                <span>{user.name}</span>
                <img src={user.avatar || "https://via.placeholder.com/40"} alt="avatar" />
            </div>
        </div>
    );
}

export default DashboardNavbar;
