import React from "react";

function DashboardNavbar({ user }) {
    return (
        <div className="Das-navbar">
            <h3>Dashboard</h3>
            <div className="user-info">
                <span>{user.name}</span>
                <img style={{ width: "10px" }} src={user.avatar || "https://img.icons8.com/?size=100&id=nSR7D8Yb2tjC&format=png&color=000000"} alt="avatar" />
            </div>
        </div>
    );
}

export default DashboardNavbar;
