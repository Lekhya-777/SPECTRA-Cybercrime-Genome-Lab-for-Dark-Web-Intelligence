import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import AuraHeader from "../components/AuraHeader";

export default function Home() {
  return (
    <div className="app-container">
      <AuraHeader />
      <div className="home-container">
        <div className="home-content">
          <div className="home-hero">
            <h1 style={{ fontSize: "3.5em", marginBottom: "20px" }}>SPECTRA</h1>
            <p style={{ fontSize: "1.3em", color: "var(--accent-secondary)", marginBottom: "40px" }}>
              The Cybercrime Genome Lab — Dark Web Threat Intelligence for Law Enforcement
            </p>
          </div>

          <div className="home-grid">
            <Link to="/dashboard" className="home-card">
              <div className="card-icon">📊</div>
              <h3>Dashboard</h3>
              <p>Real-time system statistics and threat overview</p>
            </Link>

            <Link to="/shadow-feed" className="home-card">
              <div className="card-icon">📡</div>
              <h3>Shadow Feed</h3>
              <p>Live incident stream and dark web monitoring</p>
            </Link>

            <Link to="/case-families" className="home-card">
              <div className="card-icon">👥</div>
              <h3>Case Families</h3>
              <p>Fraud family clustering and investigation details</p>
            </Link>

            <Link to="/threat-map" className="home-card">
              <div className="card-icon">🗺️</div>
              <h3>Threat Map</h3>
              <p>Aggregated infrastructure and contact networks</p>
            </Link>

            <Link to="/reports" className="home-card">
              <div className="card-icon">📋</div>
              <h3>Reports</h3>
              <p>Case file generation and intelligence export</p>
            </Link>
          </div>

          <div className="home-footer">
            <p style={{ color: "rgba(0, 217, 255, 0.6)" }}>
              🟢 System Status: OPERATIONAL | 🟢 Intelligence Engine: ACTIVE
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
