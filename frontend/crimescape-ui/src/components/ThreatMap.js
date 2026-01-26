import React, { useEffect, useState } from "react";

export default function ThreatMap() {
  const [artifacts, setArtifacts] = useState({ phones: [], urls: [] });

  useEffect(() => {
    const fetchArtifacts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/incidents/with-families");
        const data = await res.json();
        const families = data.families || [];
        
        const allPhones = [];
        const allUrls = [];
        
        families.forEach(f => {
          if (f.artifacts) {
            allPhones.push(...(f.artifacts.phones || []));
            allUrls.push(...(f.artifacts.urls || []));
          }
        });

        setArtifacts({
          phones: [...new Set(allPhones)],
          urls: [...new Set(allUrls)]
        });
      } catch (e) {
        console.error("Error fetching artifacts:", e);
      }
    };

    fetchArtifacts();
  }, []);

  return (
    <div style={{ padding: 20, height: '100%', overflowY: 'auto' }}>
      <h2 style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', marginBottom: 20 }}>
        THREAT MAP — INFRASTRUCTURE ARTIFACTS
      </h2>

      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontFamily: 'var(--font-mono)', color: '#00ffb3', marginBottom: 12, fontSize: 13 }}>
          📱 CONTACT NUMBERS ({artifacts.phones.length})
        </h3>
        <div style={{
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid var(--border-color)',
          borderRadius: 4,
          padding: 12,
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: '#00ffb3',
          lineHeight: 1.8,
          maxHeight: 300,
          overflowY: 'auto'
        }}>
          {artifacts.phones.length === 0 ? (
            <div style={{ color: 'var(--text-secondary)' }}>No phone numbers collected yet.</div>
          ) : (
            artifacts.phones.map((p, i) => (
              <div key={i} style={{ paddingBottom: 6, borderBottom: '1px solid rgba(0,217,255,0.1)' }}>
                {p}
              </div>
            ))
          )}
        </div>
      </div>

      <div>
        <h3 style={{ fontFamily: 'var(--font-mono)', color: '#0099ff', marginBottom: 12, fontSize: 13 }}>
          🔗 INFRASTRUCTURE DOMAINS ({artifacts.urls.length})
        </h3>
        <div style={{
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid var(--border-color)',
          borderRadius: 4,
          padding: 12,
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: '#0099ff',
          lineHeight: 1.8,
          maxHeight: 300,
          overflowY: 'auto',
          wordBreak: 'break-all'
        }}>
          {artifacts.urls.length === 0 ? (
            <div style={{ color: 'var(--text-secondary)' }}>No URLs collected yet.</div>
          ) : (
            artifacts.urls.map((u, i) => (
              <div key={i} style={{ paddingBottom: 6, borderBottom: '1px solid rgba(0,217,255,0.1)' }}>
                {u}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
