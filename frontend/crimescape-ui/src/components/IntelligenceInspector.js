import React from "react";

export default function IntelligenceInspector({
  selectedNode,
  incidents,
  families
}) {
  const getNodeDetails = () => {
    if (!selectedNode) return null;

    if (selectedNode.type === "family") {
      const family = families.find(f => f._id === selectedNode.id.replace("family-", ""));
      if (!family) return null;

      return {
        type: "family",
        data: family,
        incidents: incidents.filter(inc => inc.familyId?._id === family._id)
      };
    } else {
      const incident = incidents.find(inc => inc._id === selectedNode.id.replace("incident-", ""));
      return {
        type: "incident",
        data: incident
      };
    }
  };

  const details = getNodeDetails();

  const getThreatBadgeColor = (level) => {
    const colors = {
      LOW: "#4ade80",
      MEDIUM: "#fbbf24",
      HIGH: "#f87171",
      CRITICAL: "#dc2626"
    };
    return colors[level] || "#6366f1";
  };

  return (
    <div className="intelligence-inspector">
      <div className="inspector-header">
        <h3>🔎 INTELLIGENCE</h3>
        <span className="inspector-status">
          {selectedNode ? "SELECTED" : "IDLE"}
        </span>
      </div>

      {!selectedNode ? (
        <div className="inspector-empty">
          <div className="empty-icon">⚙️</div>
          <p>Click a node to view details</p>
          <small>Family clusters and incidents</small>
        </div>
      ) : (
        <div className="inspector-content">
          {details?.type === "family" ? (
            <>
              {/* Family Details */}
              <div className="detail-section">
                <div className="section-title">📁 FRAUD FAMILY</div>
                <div className="detail-item">
                  <span className="label">Name:</span>
                  <span className="value">{details.data.label}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Type:</span>
                  <span className="value">{details.data.scamType}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Threat Level:</span>
                  <span
                    className="threat-badge"
                    style={{
                      borderLeftColor: getThreatBadgeColor(details.data.threat_level)
                    }}
                  >
                    {details.data.threat_level}
                  </span>
                </div>
              </div>

              <div className="detail-section">
                <div className="section-title">📊 LINEAGE STATS</div>
                <div className="detail-item">
                  <span className="label">Cases Linked:</span>
                  <span className="value badge">{details.data.cases.length}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Core Markers:</span>
                  <div className="markers-list">
                    {details.data.coreMarkers?.slice(0, 6).map(marker => (
                      <span key={marker} className="marker-tag">
                        {marker}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {details.data.description && (
                <div className="detail-section">
                  <div className="section-title">📝 DESCRIPTION</div>
                  <p className="description-text">{details.data.description}</p>
                </div>
              )}

              <div className="detail-section">
                <div className="section-title">🔗 LINKED INCIDENTS</div>
                <div className="incidents-list">
                  {details.incidents.slice(0, 5).map(inc => (
                    <div key={inc._id} className="incident-item">
                      <div className="incident-header">
                        <span className="platform-badge">{inc.platform}</span>
                        <span className="confidence">
                          {(inc.confidence * 100).toFixed(0)}% match
                        </span>
                      </div>
                      <p className="incident-text">
                        {inc.rawText.substring(0, 80)}...
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Incident Details */}
              <div className="detail-section">
                <div className="section-title">📌 INCIDENT</div>
                <div className="detail-item">
                  <span className="label">Type:</span>
                  <span className="value">{details.data?.scamType}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Platform:</span>
                  <span className="value">{details.data?.platform}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Threat Level:</span>
                  <span
                    className="threat-badge"
                    style={{
                      borderLeftColor: getThreatBadgeColor(details.data?.threat_level)
                    }}
                  >
                    {details.data?.threat_level}
                  </span>
                </div>
              </div>

              <div className="detail-section">
                <div className="section-title">💬 MESSAGE</div>
                <div className="message-box">
                  {details.data?.rawText}
                </div>
              </div>

              <div className="detail-section">
                <div className="section-title">🧬 DNA MARKERS</div>
                <div className="markers-list">
                  {details.data?.markers?.map(marker => (
                    <span key={marker} className="marker-tag">
                      {marker}
                    </span>
                  ))}
                </div>
              </div>

              {details.data?.phone && (
                <div className="detail-section">
                  <div className="section-title">📱 CONTACT</div>
                  <div className="detail-item">
                    <span className="label">Phone:</span>
                    <span className="value">{details.data.phone}</span>
                  </div>
                </div>
              )}

              {details.data?.url && (
                <div className="detail-section">
                  <div className="section-title">🔗 URL</div>
                  <div className="url-box">{details.data.url}</div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
