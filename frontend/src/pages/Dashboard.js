// npm install chart.js
// npm install chartjs-plugin-datalabels use for cal %

import React, { useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import "./Dashboard.css";
import DashboardNavbar from "./DashboardNavbar";
import { Chart } from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";


function Dashboard() {
    const user = { name: "Bibhu", avatar: "" };

    const barChartRef = useRef(null);
    const pieChartRef = useRef(null);
    const resultsChartRef = useRef(null);

    useEffect(() => {
        // === BAR CHART (with X and Y axis) ===
        const barCtx = barChartRef.current.getContext("2d");
        if (Chart.getChart(barCtx)) {
            Chart.getChart(barCtx).destroy();
        }

        new Chart(barCtx, {
            type: "bar",
            data: {
                labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
                datasets: [
                    {
                        label: "Interviews Scheduled",
                        data: [5, 8, 3, 6, 4],
                        backgroundColor: "rgba(75, 192, 192, 0.6)",
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: "top" },
                    title: { display: true, text: "Weekly Interview Analytics" },
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: "Days of the Week",
                        },
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: "Number of Interviews",
                        },
                    },
                },
            },
        });

        // === PIE CHART (Circle) ===
        const pieCtx = pieChartRef.current.getContext("2d");
        if (Chart.getChart(pieCtx)) {
            Chart.getChart(pieCtx).destroy();
        }

        new Chart(pieCtx, {
            type: "doughnut",
            data: {
                labels: ["Passed", "Failed", "Pending"],
                datasets: [
                    {
                        label: "Interview Results",
                        data: [12, 5, 3],
                        backgroundColor: [
                            "rgba(54, 162, 235, 0.6)",
                            "rgba(255, 99, 132, 0.6)",
                            "rgba(255, 206, 86, 0.6)",
                        ],
                        borderColor: [
                            "rgba(54, 162, 235, 1)",
                            "rgba(255, 99, 132, 1)",
                            "rgba(255, 206, 86, 1)",
                        ],
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: "bottom" },
                    title: { display: true, text: "Interview Results Distribution" },
                    datalabels: {
                        color: "#fff",
                        font: {
                            weight: "bold",
                            size: 14,
                        },
                        formatter: (value, context) => {
                            let sum = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                            let percentage = ((value / sum) * 100).toFixed(1) + "%";
                            return percentage;
                        },
                    },
                },
            },
            plugins: [ChartDataLabels], // ← attach plugin here
        });

        // === INTERVIEW RESULTS CHART (X-Y axes) ===
        const resultsCtx = resultsChartRef.current.getContext("2d");
        if (Chart.getChart(resultsCtx)) Chart.getChart(resultsCtx).destroy();

        new Chart(resultsCtx, {
            type: "bar", // or "line" if you prefer
            data: {
                labels: ["Mon", "Tue", "Wed", "Thu", "Fri"], // X-axis
                datasets: [
                    {
                        label: "Passed",
                        data: [5, 3, 4, 6, 2],
                        backgroundColor: "rgba(54, 162, 235, 0.6)",
                        borderColor: "rgba(54, 162, 235, 1)",
                        borderWidth: 1,
                    },
                    {
                        label: "Failed",
                        data: [2, 1, 3, 2, 2],
                        backgroundColor: "rgba(255, 99, 132, 0.6)",
                        borderColor: "rgba(255, 99, 132, 1)",
                        borderWidth: 1,
                    },
                    {
                        label: "Pending",
                        data: [1, 2, 0, 1, 1],
                        backgroundColor: "rgba(255, 206, 86, 0.6)",
                        borderColor: "rgba(255, 206, 86, 1)",
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: "top" },
                    title: { display: true, text: "Interview Results Over Days" },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: "Number of Candidates" },
                    },
                    x: {
                        title: { display: true, text: "Days of the Week" },
                    },
                },
            },
        });


    }, []);
    return (
        <div className="dashboard">
            <Sidebar />

            <div className="main">
                <DashboardNavbar user={user} />

                <div className="dashboard-content">
                    <div className="card">
                        <div>📋 Interviews Taken</div>
                        <h1>3</h1>
                    </div>
                    <div className="card">
                        <div>⭐ Avg Score</div>
                        <h1>85%</h1>
                    </div>
                    <div className="card">
                        <div>⏱ Last Interview</div>
                        <h1>2 days ago</h1>
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
