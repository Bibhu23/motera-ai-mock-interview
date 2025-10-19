import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand Section */}
        <div className="footer-section brand">
          <h3 className="brand-name">Motera AI</h3>
          <p className="brand-desc">
            Empowering developers, analysts, and businesses with AI-driven
            innovation, talent discovery, and skill intelligence.
          </p>
          <div className="social-icons">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaLinkedinIn /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h5>Quick Links</h5>
          <ul>
            <li><a href="/features">Features</a></li>
            <li><a href="/features#works">How It Works</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms & Conditions</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h5>Contact</h5>
          <ul className="contact-list">
            <li><FaEnvelope /> support@moterai.com</li>
            <li><FaPhoneAlt /> +91 123 456 7890</li>
            <li><FaMapMarkerAlt /> 123 AI Street, Tech City, India</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} <strong>Motera AI</strong> — All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
