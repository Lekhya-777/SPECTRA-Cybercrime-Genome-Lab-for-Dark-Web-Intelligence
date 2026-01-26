import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function SidebarAura({ activeView }) {
  const location = useLocation();
  
  const items = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/shadow-feed", label: "Shadow Feed" },
    { path: "/case-families", label: "Case Families" },
    { path: "/threat-map", label: "Threat Map" },
    { path: "/reports", label: "Reports" }
  ];

  return (
    <div style={{ padding: 20 }}>
      <h3 style={{ fontFamily: "var(--font-mono)", color: "var(--accent-primary)", marginBottom: 16 }}>MENU</h3>
      <nav style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map(i => (
          <Link 
            key={i.path}
            to={i.path}
            style={{ textDecoration: "none" }}
          >
            <div 
              className="marker-tag" 
              style={{ 
                cursor: "pointer", 
                padding: "8px 10px",
                background: location.pathname === i.path ? "rgba(0, 217, 255, 0.3)" : "rgba(0, 217, 255, 0.1)",
                borderColor: location.pathname === i.path ? "rgba(0, 217, 255, 0.6)" : "rgba(0, 217, 255, 0.3)",
                transition: "all 0.2s ease",
                color: "var(--text-primary)"
              }}
            >
              {i.label}
            </div>
          </Link>
        ))}
      </nav>

      <div style={{ marginTop: 24 }}>
        <h4 style={{ fontFamily: "var(--font-mono)", color: "var(--accent-primary)", marginBottom: 8 }}>Quick Actions</h4>
        <button 
          className="btn-submit" 
          style={{ width: "100%" }}
          onClick={() => alert("🚨 TAKEDOWN PROTOCOL INITIATED\n\nTarget families flagged for law enforcement action.\n\n✓ Incident reports compiled\n✓ Evidence packaged\n✓ Agencies notified")}
        >
          Initiate Takedown
        </button>
      </div>
    </div>
  );
}
