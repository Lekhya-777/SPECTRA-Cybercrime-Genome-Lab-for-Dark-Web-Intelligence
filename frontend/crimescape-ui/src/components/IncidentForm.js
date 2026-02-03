import React, { useState } from "react";

export default function IncidentForm() {
  const [formData, setFormData] = useState({
    rawText: "",
    platform: "SMS",
    phone: "",
    url: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/incidents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: `Incident submitted successfully! Detected as "${data.incident.scamType}" with ${data.confidence}% confidence.`,
        });
        // Reset form
        setFormData({
          rawText: "",
          platform: "SMS",
          phone: "",
          url: ""
        });
      } else {
        setMessage({
          type: "error",
          text: `Error: ${data.error || "Failed to submit incident"}`,
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: `Network error: ${error.message}`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ 
      padding: 20, 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #0a0f1a 0%, #0c1422 100%)',
      color: 'white',
      fontFamily: 'var(--font-mono, monospace)'
    }}>
      <div style={{ 
        fontFamily: 'var(--font-mono)', 
        color: 'var(--accent-primary)', 
        marginBottom: 20,
        fontSize: '1.2em'
      }}>
        Incident Submission — Add New Cases
      </div>

      <div style={{ 
        flex: 1, 
        background: 'rgba(0,0,0,0.6)', 
        border: '1px solid var(--border-color)', 
        padding: 20, 
        borderRadius: '4px',
        overflowY: 'auto'
      }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: '#00d9ff',
              fontSize: '0.9em'
            }}>
              INCIDENT DETAILS *
            </label>
            <textarea
              name="rawText"
              value={formData.rawText}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Paste the suspicious message, email, or communication here..."
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(0, 217, 255, 0.2)',
                borderRadius: '4px',
                color: 'white',
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.9em',
                resize: 'vertical'
              }}
            />
            <div style={{ fontSize: '0.8em', color: '#666', marginTop: '4px' }}>
              Enter the exact text of the suspicious communication
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: '#00d9ff',
                fontSize: '0.9em'
              }}>
                PLATFORM
              </label>
              <select
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(0, 217, 255, 0.2)',
                  borderRadius: '4px',
                  color: 'white',
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.9em'
                }}
              >
                <option value="SMS">SMS</option>
                <option value="Email">Email</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Telegram">Telegram</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Facebook">Facebook</option>
                <option value="Twitter">Twitter</option>
                <option value="Instagram">Instagram</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: '#00d9ff',
                fontSize: '0.9em'
              }}>
                PHONE NUMBER
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1234567890"
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(0, 217, 255, 0.2)',
                  borderRadius: '4px',
                  color: 'white',
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.9em'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: '#00d9ff',
              fontSize: '0.9em'
            }}>
              SUSPICIOUS URL
            </label>
            <input
              type="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="https://suspicious-domain.com"
              style={{
                width: '100%',
                padding: '10px',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(0, 217, 255, 0.2)',
                borderRadius: '4px',
                color: 'white',
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.9em'
              }}
            />
            <div style={{ fontSize: '0.8em', color: '#666', marginTop: '4px' }}>
              If applicable, enter the malicious URL
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: '12px 20px',
                background: submitting ? 'rgba(0, 217, 255, 0.3)' : 'linear-gradient(45deg, #00d9ff, #0099ff)',
                color: 'black',
                border: '1px solid rgba(0, 217, 255, 0.3)',
                borderRadius: '4px',
                cursor: submitting ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-mono)',
                fontWeight: 'bold',
                fontSize: '1em',
                alignSelf: 'flex-start'
              }}
            >
              {submitting ? 'SUBMITTING...' : 'SUBMIT INCIDENT'}
            </button>
          </div>

          {message && (
            <div style={{
              padding: '12px',
              borderRadius: '4px',
              background: message.type === 'success' ? 'rgba(0, 255, 156, 0.1)' : 'rgba(255, 107, 107, 0.1)',
              border: `1px solid ${message.type === 'success' ? 'rgba(0, 255, 156, 0.3)' : 'rgba(255, 107, 107, 0.3)'}`,
              color: message.type === 'success' ? '#00ff9c' : '#ff6b6b',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.9em'
            }}>
              {message.text}
            </div>
          )}
        </form>
      </div>

      <div style={{ 
        marginTop: '15px', 
        padding: '10px', 
        background: 'rgba(0, 0, 0, 0.4)', 
        border: '1px solid rgba(0, 217, 255, 0.2)',
        borderRadius: '4px',
        fontSize: '0.9em'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>New incidents will appear in ShadowFeed</div>
          <div>DNA analysis engine will classify & link to families</div>
        </div>
      </div>
    </div>
  );
}