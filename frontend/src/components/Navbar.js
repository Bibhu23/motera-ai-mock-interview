import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AppContext } from "../context/Appcontext";
import { FaBars, FaTimes } from "react-icons/fa";
import motera_logo from "../components/motera_logo.png";
import "./Nvabar.css";

function Navbar() {
  const { credit, login, logoutUser } = useContext(AppContext);
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      {/* Logo Section */}
      <div className="navbar-logo">
        <Link to="/">
          <img src={motera_logo} alt="Motera Logo" />
        </Link>
      </div>

      {/* Hamburger for Mobile */}
      <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
      </div>

      {/* Navigation Links */}
      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        <li>
          <Link
            to="/"
            className={location.pathname === "/" ? "active" : ""}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/features"
            className={location.pathname === "/features" ? "active" : ""}
            onClick={() => setMenuOpen(false)}
          >
            Features
          </Link>
        </li>
        <li>
          <a
            href="/features#works"
            className={location.hash === "#works" ? "active" : ""}
            onClick={() => setMenuOpen(false)}
          >
            How It Works
          </a>
        </li>
        <li>
          <a
            href="/features#feedback"
            className={location.hash === "#feedback" ? "active" : ""}
            onClick={() => setMenuOpen(false)}
          >
            Success Stories
          </a>
        </li>

        {login ? (
          <li>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </li>
        ) : (
          <li>
            <Link
              to="/login"
              className={location.pathname === "/login" ? "active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              Sign In
            </Link>
          </li>
        )}

        <li>
          <Link
            to="/signup"
            className="trial-btn"
            onClick={() => setMenuOpen(false)}
          >
            🚀 Start Free Trial
          </Link>
        </li>
      </ul>

      {/* Credits Display */}
      {login && (
        <div className="credits-pill">
          Credits: <strong>{credit}</strong>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
