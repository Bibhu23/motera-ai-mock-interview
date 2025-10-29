import React, { useState, useContext } from "react";
import './Sidebar.css';
import {
  FaTachometerAlt,
  FaUserGraduate,
  FaCogs,
  FaSignOutAlt,
  FaBars,
  FaUser,
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../context/Appcontext";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setLogin, setUser } = useContext(AppContext);
  const [collapsed, setCollapsed] = useState(false);

  // Logout function
  const handleLogout = () => {
    setLogin(false);
    setUser(null);
    navigate("/login");
  };

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

        <li className={location.pathname === "/profile" ? "active" : ""}>
          <Link to="/profile">
            <FaUser /> <span>Profile</span>
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

        {/* Logout */}
        <li>
          <button className="sidebar-logout" onClick={handleLogout}>
            <FaSignOutAlt /> <span>Logout</span>
          </button>
        </li>
      </ul>
    </aside>
  );
}
