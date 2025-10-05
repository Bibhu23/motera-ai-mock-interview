// npm install chart.js chartjs-plugin-datalabels axios
import React, { useEffect, useRef, useState, useContext } from "react";
import Sidebar from "../components/Sidebar";
import DashboardNavbar from "./DashboardNavbar";
import "./Dashboard.css";
import { Chart } from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { AppContext } from "../context/Appcontext";
import { Navigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
    const { login } = useContext(AppContext);
    const barChartRef = useRef(null);
    const pieChartRef = useRef(null);
    const resultsChartRef = useRef(null);
    const [interviewRounds, setInterviewRounds] = useState([]);

    // Fetch rounds dynamically from backend
    useEffect(() => {
        async function fetchRounds() {
            try {
                const res = await axios.get("http://localhost:7656/user/api/v1/interview-rounds", { withCredentials: true });
                setInterviewRounds(res.data.rounds);
            } catch (err) {
                console.error("Failed to fetch rounds:", err.response?.data || err.message);
            }
        }

        fetchRounds();
    }, []);

    // Compute progress & average
    const totalRounds = interviewRounds.length;
    const completedRounds = interviewRounds.filter(r => r.status === "Completed").length;
    const avgScore = interviewRounds.filter(r => r.score !== null && r.score !== undefined).length > 0
        ? Math.round(interviewRounds.filter(r => r.score !== null && r.score !== undefined).reduce((sum, r) => sum + r.score, 0) / completedRounds)
        : 0;

    // Charts
    useEffect(() => {
        if (!interviewRounds.length) return;

        // === Bar Chart ===
        const barCtx = barChartRef.current.getContext("2d");
        if (Chart.getChart(barCtx)) Chart.getChart(barCtx).destroy();

        new Chart(barCtx, {
            type: "bar",
            data: {
                labels: interviewRounds.map(r => r.round),
                datasets: [
                    {
                        label: "Score",
                        data: interviewRounds.map(r => r.score || 0),
                        backgroundColor: interviewRounds.map(r =>
                            r.status === "Completed" ? "rgba(54, 162, 235, 0.6)" : "rgba(200,200,200,0.3)"
                        ),
                        borderColor: interviewRounds.map(r =>
                            r.status === "Completed" ? "rgba(54, 162, 235, 1)" : "rgba(200,200,200,0.5)"
                        ),
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: "top" },
                    title: { display: true, text: "Scores per Interview Round" }
                },
                scales: {
                    y: { beginAtZero: true, title: { display: true, text: "Score" } }
                }
            }
        });

        // === Pie Chart ===
        const pieCtx = pieChartRef.current.getContext("2d");
        if (Chart.getChart(pieCtx)) Chart.getChart(pieCtx).destroy();

        const statusCounts = {
            Completed: completedRounds,
            Pending: totalRounds - completedRounds
        };

        new Chart(pieCtx, {
            type: "doughnut",
            data: {
                labels: ["Completed", "Pending"],
                datasets: [
                    {
                        data: [statusCounts.Completed, statusCounts.Pending],
                        backgroundColor: ["rgba(54, 162, 235, 0.6)", "rgba(255, 206, 86, 0.6)"],
                        borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)"],
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: "bottom" },
                    title: { display: true, text: "Interview Status Distribution" },
                    datalabels: {
                        color: "#fff",
                        font: { weight: "bold", size: 14 },
                        formatter: (value, context) => {
                            const sum = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                            return ((value / sum) * 100).toFixed(1) + "%";
                        }
                    }
                }
            },
            plugins: [ChartDataLabels]
        });

        // === Results Chart (Bar) ===
        const resultsCtx = resultsChartRef.current.getContext("2d");
        if (Chart.getChart(resultsCtx)) Chart.getChart(resultsCtx).destroy();

        new Chart(resultsCtx, {
            type: "bar",
            data: {
                labels: interviewRounds.map(r => r.round),
                datasets: [
                    {
                        label: "Score",
                        data: interviewRounds.map(r => r.score || 0),
                        backgroundColor: "rgba(75, 192, 192, 0.6)",
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: "Interview Results" }
                },
                scales: {
                    y: { beginAtZero: true, title: { display: true, text: "Score" } }
                }
            }
        });

    }, [interviewRounds]);

    if (!login) return <Navigate to="/login" />;

    return (
        <div className="dashboard">
            <Sidebar />
            <div className="main">
                <DashboardNavbar user={{ name: "Bibhu", avatar: "" }} />

                {/* Cards */}
                <div className="dashboard-content">
                    {interviewRounds.map((r, idx) => (
                        <div className="card" key={idx}>
                            <div>{r.round}</div>
                            <h1>{r.score !== null ? r.score + "%" : "Pending"}</h1>
                            <p>{r.date ? new Date(r.date).toLocaleDateString() : "-"}</p>
                        </div>
                    ))}

                    <div className="card">
                        <div>Overall Progress</div>
                        <h1>{Math.round((completedRounds / totalRounds) * 100)}%</h1>
                        <p>{completedRounds} of {totalRounds} rounds completed</p>
                    </div>

                    <div className="card">
                        <div>Average Score</div>
                        <h1>{avgScore}%</h1>
                    </div>
                </div>

                {/* Charts */}
                <div className="bar-chart-container">
                    <canvas ref={barChartRef}></canvas>
                </div>

                <div className="chart-row">
                    <div className="pie-chart-container">
                        <canvas ref={pieChartRef}></canvas>
                    </div>
                    <div className="line-chart-container">
                        <canvas ref={resultsChartRef}></canvas>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
