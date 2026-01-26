import React, { useState, useEffect } from "react";

export default function SystemStatus({ status }) {
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(p => !p);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const statusConfig = {
    initializing: {
      color: "#fbbf24",
      text: "INITIALIZING",
      icon: "⚙️"
    },
    active: {
      color: "#4ade80",
      text: "ACTIVE",
      icon: "🟢"
    },
    alert: {
      color: "#f87171",
      text: "ALERT",
      icon: "⚠️"
    }
  };

  const config = statusConfig[status] || statusConfig.initializing;

  return (
    <div className="system-status" style={{ borderLeftColor: config.color }}>
      <div className={`status-indicator ${pulse ? "pulse" : ""}`} style={{ color: config.color }}>
        {config.icon}
      </div>
      <div className="status-text">
        <span className="status-label">{config.text}</span>
        <span className="status-detail">CRIMESCAPE-DNA</span>
      </div>
    </div>
  );
}
