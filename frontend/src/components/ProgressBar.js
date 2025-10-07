import React from "react";

const ProgressBar = ({ percentage }) => {
    return (
        <div className="progress-bar-container">
            <div
                className="progress-bar-fill"
                style={{ width: `${percentage}%`, backgroundColor: "#4CAF50" }}
            ></div>
            <span className="progress-text">{percentage}%</span>
        </div>
    );
};

export default ProgressBar;
