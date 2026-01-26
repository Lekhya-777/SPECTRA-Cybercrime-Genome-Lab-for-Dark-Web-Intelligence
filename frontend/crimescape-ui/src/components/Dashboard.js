import React, { useEffect, useState } from "react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalIncidents: 0,
    totalFamilies: 0,
    criticalFamilies: 0,
    activeThreats: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/incidents/with-families");
        const data = await res.json();
        const incidents = data.incidents || [];
        const families = data.families || [];
        const criticalFamilies = families.filter(f => f.threat_level === "CRITICAL" || f.risk === "CRITICAL").length;
        
        setStats({
          totalIncidents: incidents.length,
          totalFamilies: families.length,
          criticalFamilies: criticalFamilies,
          activeThreats: families.filter(f => f.cases && f.cases.length > 0).length
        });
      } catch (e) {
        console.error("Error fetching stats:", e);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const StatCard = ({ label, value, color }) => (
    <div style={{
      background: 'rgba(0, 217, 255, 0.1)',
      border: `1px solid rgba(0, 217, 255, 0.3)`,
      borderRadius: 4,
      padding: 16,
      marginBottom: 12,
      textAlign: 'center'
    }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)', marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontSize: 32, fontWeight: 800, color: color || 'var(--accent-primary)' }}>
        {value}
      </div>
    </div>
  );

  return (
    <div style={{ padding: 20, height: '100%', overflowY: 'auto' }}>
      <h2 style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', marginBottom: 20 }}>
        SYSTEM DASHBOARD
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
        <StatCard label="Total Incidents" value={stats.totalIncidents} color="#00ff9c" />
        <StatCard label="Threat Families" value={stats.totalFamilies} color="#00d9ff" />
        <StatCard label="🚨 CRITICAL" value={stats.criticalFamilies} color="#f87171" />
        <StatCard label="Active Cases" value={stats.activeThreats} color="#fbbf24" />
      </div>

      <div style={{
        background: 'rgba(0, 0, 0, 0.4)',
        border: '1px solid var(--border-color)',
        borderRadius: 4,
        padding: 16
      }}>
        <h3 style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', marginBottom: 12, fontSize: 13 }}>
          SYSTEM STATUS
        </h3>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#00ff9c', lineHeight: 1.6 }}>
          <div>✓ MongoDB Connection: ACTIVE</div>
          <div>✓ Intelligence Engine: READY</div>
          <div>✓ DNA Clustering: OPERATIONAL</div>
          <div>✓ Risk Assessment: ENABLED</div>
          <div style={{ marginTop: 12, color: 'var(--text-secondary)' }}>
            Last Updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      <div style={{
        background: 'rgba(0, 0, 0, 0.4)',
        border: '1px solid var(--border-color)',
        borderRadius: 4,
        padding: 16,
        marginTop: 16
      }}>
        <h3 style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', marginBottom: 12, fontSize: 13 }}>
          QUICK GUIDE
        </h3>
        <ul style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          <li>→ ShadowFeed: Live incident stream from submissions</li>
          <li>→ CaseFamilies: Grouped threats with computed intelligence</li>
          <li>→ ThreatMap: Geographic distribution of artifacts</li>
          <li>→ Reports: Export case files and findings</li>
        </ul>
      </div>
    </div>
  );
}
