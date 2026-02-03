import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';

export default function AuraHeader() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

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
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "15px", color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>
        {isAuthenticated && user ? (
          <>
            <span>User: {user.username || user.name || 'Analyst_01'}</span>
            <button 
              onClick={handleLogout}
              style={{
                background: 'rgba(255, 107, 107, 0.2)',
                color: '#ff6b6b',
                border: '1px solid rgba(255, 107, 107, 0.3)',
                padding: '4px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px'
              }}
            >
              LOGOUT
            </button>
          </>
        ) : (
          <span>User: Guest</span>
        )}
      </div>
    </header>
  );
}