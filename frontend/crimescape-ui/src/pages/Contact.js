import React, { useState } from "react";
import "../styles/Contact.css";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      // For now, we'll just show a success message
      // In a real app, this would POST to a backend endpoint
      console.log("Contact form submitted:", formData);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-wrapper">
        {/* Left side - Info */}
        <div className="contact-info">
          <h1>Get in Touch</h1>
          <p className="subtitle">Have questions or feedback about CyberSprint? We'd love to hear from you!</p>

          <div className="info-items">
            <div className="info-item">
              <div className="info-icon">📧</div>
              <div className="info-content">
                <h3>Email</h3>
                <p>Send us your inquiries anytime</p>
                <a href="mailto:support@cybersprint.io">support@cybersprint.io</a>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">⏰</div>
              <div className="info-content">
                <h3>Response Time</h3>
                <p>We typically respond within 24 hours</p>
                <span>24/7 Monitoring Available</span>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">🌍</div>
              <div className="info-content">
                <h3>Global Coverage</h3>
                <p>Supporting fraud prevention worldwide</p>
                <span>Multi-language Support</span>
              </div>
            </div>
          </div>

          <div className="social-links">
            <a href="https://twitter.com" className="social-link" title="Twitter" rel="noreferrer" target="_blank">𝕏</a>
            <a href="https://linkedin.com" className="social-link" title="LinkedIn" rel="noreferrer" target="_blank">in</a>
            <a href="https://github.com" className="social-link" title="GitHub" rel="noreferrer" target="_blank">⚙</a>
            <a href="https://discord.com" className="social-link" title="Discord" rel="noreferrer" target="_blank">◇</a>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="contact-form-wrapper">
          <form className="contact-form" onSubmit={handleSubmit}>
            {submitted && (
              <div className="success-message">
                <span className="success-icon">✓</span>
                <h3>Message Sent!</h3>
                <p>Thank you for reaching out. We'll get back to you soon.</p>
              </div>
            )}

            {error && (
              <div className="error-message">
                <span className="error-icon">⚠</span>
                <p>{error}</p>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="How can we help?"
                disabled={loading}
              />
            </div>

            <div className="form-group form-group-full">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us more about your inquiry, feedback, or partnership opportunity..."
                rows="6"
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Sending...
                </>
              ) : (
                <>Send Message →</>
              )}
            </button>

            <p className="form-footer">
              We respect your privacy. Your information will only be used to respond to your inquiry.
            </p>
          </form>
        </div>
      </div>

      {/* Additional info section */}
      <div className="contact-faqs">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h3>Is CyberSprint free to use?</h3>
            <p>Yes! CyberSprint is open-source and available for everyone to use at no cost.</p>
          </div>
          <div className="faq-item">
            <h3>How do I report a scam?</h3>
            <p>Simply fill out the incident form on the intelligence hub with details about the fraud attempt.</p>
          </div>
          <div className="faq-item">
            <h3>Can I contribute to the project?</h3>
            <p>Absolutely! We welcome contributions. Check out our GitHub repository for more details.</p>
          </div>
          <div className="faq-item">
            <h3>How is my data protected?</h3>
            <p>All incident data is encrypted and stored securely. We never share personal information.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
