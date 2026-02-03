import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple authentication - in real app would call API
    if (username && password) {
      // In a real app, you'd authenticate with backend
      // For now, we'll just store user info and redirect
      const userData = {
        username: username,
        name: username // Could be different in real app
      };
      login(userData);
      navigate('/dashboard'); // Redirect to dashboard after login
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0a0f1a 0%, #0c1422 100%)',
      color: 'white',
      fontFamily: 'var(--font-mono, monospace)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        padding: '30px',
        border: '2px solid rgba(0, 217, 255, 0.3)',
        borderRadius: '8px',
        background: 'rgba(0, 0, 0, 0.4)',
        boxShadow: '0 0 30px rgba(0, 217, 255, 0.2)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{
            fontSize: '2rem',
            margin: '0 0 10px 0',
            color: '#00d9ff',
            textShadow: '0 0 10px rgba(0, 217, 255, 0.5)',
            letterSpacing: '1px'
          }}>
            SPECTRA LOGIN
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#00ffb3', margin: 0 }}>
            Cybercrime Intelligence Platform
          </p>
        </div>
        
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.8rem',
              color: '#00d9ff',
              marginBottom: '5px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              USERNAME
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(0, 217, 255, 0.2)',
                borderRadius: '4px',
                color: 'white',
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
              placeholder="Enter your username"
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.8rem',
              color: '#00d9ff',
              marginBottom: '5px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(0, 217, 255, 0.2)',
                borderRadius: '4px',
                color: 'white',
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
              placeholder="Enter your password"
            />
          </div>
          
          <button 
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              background: 'linear-gradient(45deg, #00d9ff, #0099ff)',
              color: 'black',
              border: 'none',
              borderRadius: '4px',
              fontFamily: 'var(--font-mono, monospace)',
              fontWeight: 'bold',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: '0 0 15px rgba(0, 217, 255, 0.3)'
            }}
          >
            ACCESS INTELLIGENCE PLATFORM
          </button>
        </form>
        
        <div style={{ textAlign: 'center', paddingTop: '20px', borderTop: '1px solid rgba(0, 217, 255, 0.1)' }}>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>
            Law Enforcement Personnel Only
          </p>
        </div>
      </div>
    </div>
  );
}