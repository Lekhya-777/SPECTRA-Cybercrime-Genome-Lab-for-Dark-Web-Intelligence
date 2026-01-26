import React, { useEffect, useRef, useState } from "react";

export default function ShadowFeed() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const elRef = useRef();

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/incidents");
        const data = await res.json();
        setIncidents(Array.isArray(data) ? data.reverse() : []);
      } catch (e) {
        console.error("Error fetching incidents:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
    const interval = setInterval(fetchIncidents, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (elRef.current) {
      elRef.current.scrollTop = elRef.current.scrollHeight;
    }
  }, [incidents]);

  return (
    <div style={{ padding: 20, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', marginBottom: 12 }}>
        ShadowFeed — Live Incident Stream ({incidents.length} total)
      </div>
      <div ref={elRef} style={{ flex: 1, background: 'rgba(0,0,0,0.6)', border: '1px solid var(--border-color)', padding: 12, overflowY: 'auto', fontFamily: 'Courier New, monospace', fontSize: 12, color: '#00ffb3' }}>
        {loading ? (
          <div style={{ color: 'var(--text-secondary)' }}>Loading incidents...</div>
        ) : incidents.length === 0 ? (
          <div style={{ color: 'var(--text-secondary)' }}>No incidents yet. Submit one to begin monitoring.</div>
        ) : (
          incidents.map((inc, i) => (
            <div key={i} style={{ padding: '6px 0', borderBottom: '1px solid rgba(0,217,255,0.02)', fontSize: 11 }}>
              <div style={{ color: '#00ffb3' }}>
                [{new Date(inc.createdAt).toLocaleTimeString()}] <strong>{inc.scamType}</strong> — {inc.platform}
              </div>
              <div style={{ color: '#00ff99', marginLeft: 20, fontSize: 10 }}>
                📱 {inc.phone || '—'} | 🔗 {inc.url ? inc.url.substring(0,40) : '—'}
              </div>
              <div style={{ color: '#0099ff', marginLeft: 20, fontSize: 10, marginTop: 2 }}>
                💬 {inc.rawText.substring(0, 60)}...
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
