import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Auth.css";

export default function SignIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.email.includes("@")) newErrors.email = "Invalid email format";
    if (!formData.password) newErrors.password = "Password is required";
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store user info in localStorage (for demo purposes)
      localStorage.setItem("user", JSON.stringify({
        email: formData.email,
        rememberMe: formData.rememberMe
      }));
      
      navigate("/intelligence");
    } catch (err) {
      setErrors({ submit: "Sign in failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-side">
          <div className="auth-side-content">
            <h2>Welcome Back</h2>
            <p>Access your fraud intelligence dashboard and continue building your network.</p>
            <div className="auth-features">
              <div className="feature">
                <span className="feature-icon">🎯</span>
                <span>Intelligent Detection</span>
              </div>
              <div className="feature">
                <span className="feature-icon">📊</span>
                <span>Live Analytics</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🔗</span>
                <span>Family Linking</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🌐</span>
                <span>Global Network</span>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-box">
          <div className="auth-header">
            <h1>Sign In</h1>
            <p>Access your CyberSprint intelligence account</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {errors.submit && (
              <div className="auth-error">
                <span className="error-icon">⚠</span>
                <p>{errors.submit}</p>
              </div>
            )}

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
                className={errors.email ? "error" : ""}
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={loading}
                  className={errors.password ? "error" : ""}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <span>Remember me</span>
              </label>
              <Link to="#" className="forgot-password">Forgot password?</Link>
            </div>

            <button
              type="submit"
              className="btn btn-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Signing in...
                </>
              ) : (
                <>Sign In →</>
              )}
            </button>

            <div className="auth-divider">
              <span>OR</span>
            </div>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/")}
            >
              Continue as Guest
            </button>

            <div className="auth-footer">
              <p>Don't have an account? <Link to="/register">Create one</Link></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
