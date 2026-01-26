import React, { useState, useEffect } from "react";
import "../styles/Logs.css";

export default function Logs() {
  const [incidents, setIncidents] = useState([]);
  const [filteredIncidents, setFilteredIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/incidents");
      const data = await response.json();
      setIncidents(data);
      setFilteredIncidents(data);
    } catch (err) {
      console.error("Failed to fetch incidents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = incidents;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        incident =>
          incident.rawText.toLowerCase().includes(searchTerm.toLowerCase()) ||
          incident.scamType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          incident.platform.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by scam type
    if (filterType !== "all") {
      filtered = filtered.filter(incident => incident.scamType === filterType);
    }

    // Sort
    if (sortBy === "recent") {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "oldest") {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === "critical") {
      filtered.sort((a, b) => {
        const levels = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
        return (levels[b.threat_level] || 0) - (levels[a.threat_level] || 0);
      });
    }

    setFilteredIncidents(filtered);
  }, [incidents, searchTerm, filterType, sortBy]);

  const getThreatColor = (level) => {
    const colors = {
      LOW: "#4ade80",
      MEDIUM: "#fbbf24",
      HIGH: "#f87171",
      CRITICAL: "#dc2626"
    };
    return colors[level] || "#6366f1";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div className="logs-container">
      <div className="logs-header">
        <h1>📊 Incident Logs</h1>
        <p>All detected scams and fraud incidents</p>
      </div>

      <div className="logs-controls">
        <div className="control-group">
          <input
            type="text"
            placeholder="🔍 Search by message, type, or platform..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="control-group">
          <label>Filter by Type:</label>
          <select 
            className="filter-select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="Job Scam">Job Scam</option>
            <option value="Courier Fraud">Courier Fraud</option>
            <option value="Investment Scam">Investment Scam</option>
            <option value="Digital Arrest">Digital Arrest</option>
            <option value="Banking Scam">Banking Scam</option>
            <option value="Tech Support Scam">Tech Support Scam</option>
            <option value="Romance Scam">Romance Scam</option>
            <option value="Lottery Scam">Lottery Scam</option>
            <option value="Phishing">Phishing</option>
          </select>
        </div>

        <div className="control-group">
          <label>Sort by:</label>
          <select 
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="recent">Most Recent</option>
            <option value="oldest">Oldest First</option>
            <option value="critical">Threat Level</option>
          </select>
        </div>

        <button className="btn btn-refresh" onClick={fetchIncidents}>
          ⟳ Refresh
        </button>
      </div>

      <div className="logs-stats">
        <div className="stats-item">
          <span className="stats-label">Total Incidents:</span>
          <span className="stats-value">{incidents.length}</span>
        </div>
        <div className="stats-item">
          <span className="stats-label">Showing:</span>
          <span className="stats-value">{filteredIncidents.length}</span>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading incidents...</div>
      ) : filteredIncidents.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <p>No incidents found. Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="incidents-table">
          <div className="table-header">
            <div className="col-time">Date/Time</div>
            <div className="col-type">Scam Type</div>
            <div className="col-platform">Platform</div>
            <div className="col-message">Message</div>
            <div className="col-threat">Threat</div>
            <div className="col-confidence">Confidence</div>
          </div>

          {filteredIncidents.map((incident) => (
            <div key={incident._id} className="table-row">
              <div className="col-time">{formatDate(incident.createdAt)}</div>
              <div className="col-type">{incident.scamType}</div>
              <div className="col-platform">
                <span className="platform-badge">{incident.platform}</span>
              </div>
              <div className="col-message">
                <span className="message-preview">
                  {incident.rawText.substring(0, 60)}...
                </span>
              </div>
              <div className="col-threat">
                <span 
                  className="threat-badge"
                  style={{ borderLeftColor: getThreatColor(incident.threat_level) }}
                >
                  {incident.threat_level}
                </span>
              </div>
              <div className="col-confidence">
                {(incident.confidence * 100).toFixed(0)}%
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
