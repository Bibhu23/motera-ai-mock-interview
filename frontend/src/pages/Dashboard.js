import React, { useEffect, useRef, useState, useContext } from "react";
import { Chart } from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { AppContext } from "../context/Appcontext";
import { Navigate } from "react-router-dom";
import "./Dashboard.css";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";


export default function Dashboard() {
    const { backend } = useContext(AppContext);
    const { login } = useContext(AppContext);
    const barChartRef = useRef(null);
    const pieChartRef = useRef(null);
    const [interviewRounds, setInterviewRounds] = useState([]);
    const [darkMode, setDarkMode] = useState(() => {
        // Load saved preference from localStorage
        return localStorage.getItem("theme") === "dark";
    });

    // Apply theme to <body>
    useEffect(() => {
        if (darkMode) {
            document.body.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.body.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);

    async function fetchRounds() {
        try {
            const res = await axios.get(`${backend}/user/api/v1/interview-rounds`, { withCredentials: true });
            setInterviewRounds(res.data.rounds || []);
        } catch (err) {
            console.error("Failed to fetch rounds:", err.response?.data || err.message);
        }
    }

    useEffect(() => {
        fetchRounds();
    }, []);

    const totalRounds = interviewRounds.length;
    const completedRounds = interviewRounds.filter(r => r.status === "Completed").length;
    const avgScore =
        completedRounds > 0
            ? Math.round(
                interviewRounds
                    .filter(r => r.score !== null && r.score !== undefined)
                    .reduce((sum, r) => sum + r.score, 0) / completedRounds
            )
            : 0;

    useEffect(() => {
        if (!interviewRounds.length) return;

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
                            r.status === "Completed"
                                ? "rgba(54,162,235,0.6)"
                                : "rgba(200,200,200,0.3)"
                        ),
                        borderColor: interviewRounds.map(r =>
                            r.status === "Completed"
                                ? "rgba(54,162,235,1)"
                                : "rgba(200,200,200,0.5)"
                        ),
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: "top" },
                    title: { display: true, text: "Scores per Interview Round" },
                },
                scales: { y: { beginAtZero: true } },
            },
        });

        const pieCtx = pieChartRef.current.getContext("2d");
        if (Chart.getChart(pieCtx)) Chart.getChart(pieCtx).destroy();

        const statusCounts = {
            Completed: completedRounds,
            Pending: totalRounds - completedRounds,
        };

        new Chart(pieCtx, {
            type: "doughnut",
            data: {
                labels: ["Completed", "Pending"],
                datasets: [
                    {
                        data: [statusCounts.Completed, statusCounts.Pending],
                        backgroundColor: [
                            "rgba(54,162,235,0.6)",
                            "rgba(255,206,86,0.6)",
                        ],
                    },
                ],
            },
            options: {
                plugins: {
                    legend: { position: "bottom" },
                    title: { display: true, text: "Overall Progress" },
                    datalabels: {
                        color: "#fff",
                        font: { weight: "bold" },
                        formatter: (val, ctx) => {
                            const sum = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                            return ((val / sum) * 100).toFixed(1) + "%";
                        },
                    },
                },
            },
            plugins: [ChartDataLabels],
        });
    }, [interviewRounds]);

    if (!login) return <Navigate to="/login" />;

    return (
        <div className="dashboard">
            <Sidebar />
            <div className="main">
                <Link to="/" className="back-home">
                    <FaArrowLeft style={{ marginRight: "6px" }} /> Back to Home
                </Link>

                {/* Theme Toggle */}
                <div className="theme-toggle">
                    <button onClick={() => setDarkMode(!darkMode)}>
                        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
                    </button>
                </div>

                {/* Cards */}
                <div className="dashboard-content">
                    {interviewRounds.map((r, idx) => (
                        <div className="card" key={idx}>
                            <div className="d-flex justify-content-between align-items-center">
                                <strong>{r.round}</strong>
                                <span
                                    className={`badge ${r.status === "Completed" ? "bg-success" : "bg-warning"}`}
                                >
                                    {r.status}
                                </span>
                            </div>
                            <h1>{r.score !== null ? `${r.score}%` : "Pending"}</h1>
                            <p>{r.date ? new Date(r.date).toLocaleDateString() : "-"}</p>
                        </div>
                    ))}

                    {/* Summary Cards */}
                    <div className="card summary">
                        <div>Progress</div>
                        <h1>{totalRounds ? Math.round((completedRounds / totalRounds) * 100) : 0}%</h1>
                        <p>{completedRounds} of {totalRounds} rounds done</p>
                    </div>

                    <div className="card summary">
                        <div>Average Score</div>
                        <h1>{avgScore}%</h1>
                    </div>
                </div>

                {/* Charts */}
                <div className="chart-row">
                    <div className="chart-box">
                        <canvas ref={barChartRef}></canvas>
                    </div>
                    <div className="chart-box">
                        <canvas ref={pieChartRef}></canvas>
                    </div>
                </div>
            </div>
        </div>
    );
}
