import React, { useEffect, useState } from "react";

export default function InvestigationView() {
  const [families, setFamilies] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchFamiliesLocal = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/incidents/with-families");
        const data = await res.json();
        setFamilies(data.families || []);
        if (!selected && data.families && data.families.length) setSelected(data.families[0]);
      } catch (e) {
        console.error(e);
      }
    };
    fetchFamiliesLocal();
    const id = setInterval(fetchFamiliesLocal, 10000);
    return () => clearInterval(id);
  }, [selected]);

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)' }}>Case File</h3>
        <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Live</div>
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 12 }}>
        <div style={{ width: 140, maxHeight: 420, overflowY: 'auto' }}>
          {families.map(f => (
            <div key={f._id} onClick={() => setSelected(f)} className="marker-tag" style={{ marginBottom: 8, cursor: 'pointer' }}>
              {f.label} <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{f.scamType}</div>
            </div>
          ))}
        </div>

        <div style={{ flex: 1, maxHeight: 420, overflowY: 'auto' }}>
          {!selected ? (
            <div style={{ color: 'var(--text-secondary)' }}>Select a family to inspect</div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800 }}>{selected.label}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{selected.scamType}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{selected.risk || selected.threat_level}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 11 }}>Risk</div>
                </div>
              </div>

              <div className="detail-section">
                <div className="section-title">AI Brief</div>
                <div style={{ fontSize: 13, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                  {selected.insights && selected.insights.length ? (
                    selected.insights.map((s,i) => <div key={i} style={{ marginBottom: 6 }}>{s}</div>)
                  ) : (
                    <div style={{ color: 'var(--text-secondary)' }}>No insights available.</div>
                  )}
                </div>
              </div>

              <div className="detail-section">
                <div className="section-title">Evidence</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div><strong>URLs:</strong> {(selected.artifacts?.urls || []).slice(0,5).join(', ') || '—'}</div>
                  <div><strong>Phones:</strong> {(selected.artifacts?.phones || []).slice(0,5).join(', ') || '—'}</div>
                  <div><strong>Phrases:</strong> {(selected.artifacts?.phrases || []).slice(0,5).map(p=>p.substring(0,40)).join(' • ') || '—'}</div>
                </div>
              </div>

              <div className="detail-section">
                <div className="section-title">Suggested Actions</div>
                <ul style={{ color: 'var(--text-secondary)', paddingLeft: 16 }}>
                  {(selected.actions || []).map((a,i) => <li key={i}>{a}</li>)}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
