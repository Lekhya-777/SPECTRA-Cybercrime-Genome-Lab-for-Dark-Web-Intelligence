import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: "/", label: "🏠 Home" },
    { path: "/intelligence", label: "🔍 Intelligence Hub" },
    { path: "/logs", label: "📊 Incident Logs" },
    { path: "/contact", label: "📧 Contact" }
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo/Brand */}
        <Link to="/" className="navbar-brand">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">CyberSprint</span>
        </Link>

        {/* Mobile menu button */}
        <button 
          className={`mobile-menu-btn ${mobileMenuOpen ? "active" : ""}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation Links */}
        <div className={`navbar-menu ${mobileMenuOpen ? "active" : ""}`}>
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${isActive(link.path) ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="navbar-auth">
          <Link to="/signin" className="btn btn-signin">
            Sign In
          </Link>
          <Link to="/register" className="btn btn-cta">
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}
