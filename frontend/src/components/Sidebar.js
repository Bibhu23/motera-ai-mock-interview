import React, { useState } from "react";
import {
  FaTachometerAlt,
  FaChartBar,
  FaUserGraduate,
  FaCogs,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Header */}
      <div className="sidebar-header">
        <h2 className="sidebar-logo">⚡ Motera AI</h2>
        <button
          className="sidebar-toggle"
          onClick={() => setCollapsed(!collapsed)}
        >
          <FaBars />
        </button>
      </div>

      {/* Links */}
      <ul className="sidebar-menu">
        <li className={location.pathname === "/dashboard" ? "active" : ""}>
          <Link to="/dashboard">
            <FaTachometerAlt /> <span>Dashboard</span>
          </Link>
        </li>

        <li className={location.pathname === "/performance" ? "active" : ""}>
          <Link to="/performance">
            <FaChartBar /> <span>Performance</span>
          </Link>
        </li>

        <li className={location.pathname === "/rounds" ? "active" : ""}>
          <Link to="/rounds">
            <FaUserGraduate /> <span>Rounds</span>
          </Link>
        </li>

        <li className={location.pathname === "/settings" ? "active" : ""}>
          <Link to="/settings">
            <FaCogs /> <span>Settings</span>
          </Link>
        </li>

        <li>
          <Link to="/logout">
            <FaSignOutAlt /> <span>Logout</span>
          </Link>
        </li>
      </ul>
    </aside>
  );
}
