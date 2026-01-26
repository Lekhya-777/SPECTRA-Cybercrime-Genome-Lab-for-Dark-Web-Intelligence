import React from "react";
import { useNavigate } from "react-router-dom";

export default function AuraHeader() {
  const navigate = useNavigate();

  return (
    <header className="system-status" style={{ borderLeftColor: "#00d9ff" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div 
          onClick={() => navigate("/")}
          style={{ 
            fontFamily: "var(--font-mono)", 
            fontWeight: 800, 
            color: "#00ff9c",
            cursor: "pointer",
            transition: "all 0.2s ease",
            padding: "4px 8px",
            borderRadius: "4px"
          }}
          onMouseEnter={(e) => e.target.style.color = "#00d9ff"}
          onMouseLeave={(e) => e.target.style.color = "#00ff9c"}
        >
          SPECTRA
        </div>
        <div style={{ color: "var(--text-secondary)", fontSize: 12 }}>| System Status: <strong style={{ color: "#4ade80" }}>SECURE</strong></div>
      </div>
      <div style={{ marginLeft: "auto", color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>
        User: Analyst_01
      </div>
    </header>
  );
}
