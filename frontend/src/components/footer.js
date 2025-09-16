import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* About Section */}
        <div className="footer-section about">
          <h5>Motera AI</h5>
          <p>
            Motera AI is your go-to platform for AI-driven solutions, talent discovery,
            and skill development. Empowering developers, analysts, and businesses with cutting-edge technology.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section links">
          <h5>Quick Links</h5>
          <ul>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms & Conditions</a></li>
          </ul>
        </div>
        <div className="footer-section follow">
          <h5>Follow Us</h5>
          <ul className="list-unstyled">
            <li>
              <a href="#" className="social-icon text-white">
                <FaFacebook size={24} className="me-3" style={{ color: "#1877F2" }} />
                Facebook
              </a>
            </li>
            <li>
              <a href="#" className="social-icon text-white">
                <FaTwitter size={24} className="me-3" style={{ color: "#1DA1F2" }} />
                Twitter
              </a>
            </li>
            <li>
              <a href="#" className="social-icon text-white">
                <FaInstagram size={24} className="me-3" style={{ color: "#E1306C" }} />
                Instagram
              </a>
            </li>
            <li>
              <a href="#" className="social-icon text-white">
                <FaLinkedin size={24} className="me-3" style={{ color: "#0077B5" }} />
                LinkedIn
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-section contact">
          <h5>Contact</h5>
          <p>Email: support@moterai.com</p>
          <p>Phone: +91 123 456 7890</p>
          <p>Address: 123 AI Street, Tech City, India</p>
          <div className="social">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">FB</a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">TW</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">IN</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} Motera AI. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
