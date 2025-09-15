import React from "react";
import Sidebar from "../components/Sidebar"
import './Dashboard.css'
import DashboardNavbar from "./DashboardNavbar"
function Dashboard() {
    const user = { name: "Biswa", avatar: "" };
    return (
        <div className="dashboard">
            <Sidebar />
            <div className="main">
                <DashboardNavbar user={user} />
            </div>
            <div className="dashboard-content">
                <div className="card">📋 Interviews Taken: 3</div>
                <div className="card">⭐ Avg Score: 85%</div>
                <div className="card">⏱ Last Interview: 2 days ago</div>

            </div>
        </div>
    )
}
export default Dashboard