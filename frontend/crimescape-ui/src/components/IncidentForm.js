import React, { useState } from "react";

export default function IncidentForm({ onIncidentSubmitted }) {
  const [formData, setFormData] = useState({
    rawText: "",
    platform: "WhatsApp",
    phone: "",
    url: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastResponse, setLastResponse] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.rawText.trim()) {
      alert("Enter suspicious text to analyze");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:5000/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      console.log("Response:", data);

      if (data.error) {
        alert("Analysis Error: " + data.error);
      } else {
        setLastResponse(data);
        // Reset form
        setFormData({
          rawText: "",
          platform: "WhatsApp",
          phone: "",
          url: ""
        });
        // Notify parent to refetch data
        onIncidentSubmitted(data);
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("Failed to analyze: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="incident-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h3>🎯 ADD INCIDENT</h3>
        <span className="form-status">{isSubmitting ? "Analyzing..." : "Ready"}</span>
      </div>

      <div className="form-group">
        <label>Suspicious Message</label>
        <textarea
          name="rawText"
          placeholder="Paste the suspicious message or scam text here..."
          value={formData.rawText}
          onChange={handleInputChange}
          disabled={isSubmitting}
          rows={6}
        />
        <span className="char-count">{formData.rawText.length} characters</span>
      </div>

      <div className="form-group">
        <label>Platform</label>
        <select
          name="platform"
          value={formData.platform}
          onChange={handleInputChange}
          disabled={isSubmitting}
        >
          <option>WhatsApp</option>
          <option>SMS</option>
          <option>Email</option>
          <option>Telegram</option>
          <option>Call</option>
          <option>Instagram</option>
          <option>LinkedIn</option>
          <option>Other</option>
        </select>
      </div>

      <div className="form-group">
        <label>Phone Number (optional)</label>
        <input
          type="text"
          name="phone"
          placeholder="e.g., +91-XXXXXXXXXX"
          value={formData.phone}
          onChange={handleInputChange}
          disabled={isSubmitting}
        />
      </div>

      <div className="form-group">
        <label>URL/Link (optional)</label>
        <input
          type="text"
          name="url"
          placeholder="e.g., https://suspicious-site.com"
          value={formData.url}
          onChange={handleInputChange}
          disabled={isSubmitting}
        />
      </div>

      <button
        type="submit"
        className="btn-submit"
        disabled={isSubmitting || !formData.rawText.trim()}
      >
        {isSubmitting ? (
          <>
            <span className="spinner"></span> Analyzing...
          </>
        ) : (
          <>🔍 ANALYZE & LINK</>
        )}
      </button>

      {lastResponse && (
        <div className={`response-notification ${lastResponse.linked ? "linked" : "new"}`}>
          <div className="response-header">
            {lastResponse.linked ? "✓ Lineage Detected" : "⚡ New Family Created"}
          </div>
          <div className="response-body">
            <p><strong>Type:</strong> {lastResponse.incident?.scamType}</p>
            <p><strong>Confidence:</strong> {lastResponse.confidence}%</p>
            <p><strong>Family:</strong> {lastResponse.family?.label}</p>
          </div>
        </div>
      )}
    </form>
  );
}
