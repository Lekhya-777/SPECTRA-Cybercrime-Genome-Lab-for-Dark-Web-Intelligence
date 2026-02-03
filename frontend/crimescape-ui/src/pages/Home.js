import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const [hoveredLink, setHoveredLink] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If user is authenticated, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0a0f1a 0%, #0c1422 100%)',
      color: 'white',
      fontFamily: 'var(--font-mono, monospace)',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center'
    }}>
      {/* Header Navigation */}
      <header className="system-status" style={{ 
        width: '100%', 
        padding: '15px 20px', 
        borderBottom: '1px solid rgba(0, 217, 255, 0.3)',
        marginBottom: '30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div 
            style={{ 
              fontFamily: "var(--font-mono)", 
              fontWeight: 800, 
              color: "#00ff9c",
              cursor: "pointer",
              transition: "all 0.2s ease",
              padding: "4px 8px",
              borderRadius: "4px"
            }}
            onClick={() => {
              if(isAuthenticated) {
                navigate('/dashboard');
              } else {
                navigate('/signin');
              }
            }}
          >
            SPECTRA
          </div>
          <div style={{ color: "var(--text-secondary)", fontSize: 12 }}>| System Status: <strong style={{ color: "#4ade80" }}>SECURE</strong></div>
        </div>
        <nav style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div 
            style={{ 
              color: '#00d9ff', 
              textDecoration: 'none',
              fontSize: '14px',
              padding: '6px 12px',
              borderRadius: '4px',
              transition: 'background-color 0.2s',
              border: '1px solid rgba(0, 217, 255, 0.3)',
              whiteSpace: 'nowrap',
              backgroundColor: hoveredLink === 'dashboard' ? 'rgba(0, 217, 255, 0.1)' : 'transparent',
              cursor: 'not-allowed',
              opacity: 0.5
            }}
            onMouseEnter={() => setHoveredLink('dashboard')}
            onMouseLeave={() => setHoveredLink(null)}
            title="Login required to access"
          >
            Dashboard
          </div>
          <div 
            style={{ 
              color: '#00d9ff', 
              textDecoration: 'none',
              fontSize: '14px',
              padding: '6px 12px',
              borderRadius: '4px',
              transition: 'background-color 0.2s',
              border: '1px solid rgba(0, 217, 255, 0.3)',
              whiteSpace: 'nowrap',
              backgroundColor: hoveredLink === 'shadow-feed' ? 'rgba(0, 217, 255, 0.1)' : 'transparent',
              cursor: 'not-allowed',
              opacity: 0.5
            }}
            onMouseEnter={() => setHoveredLink('shadow-feed')}
            onMouseLeave={() => setHoveredLink(null)}
            title="Login required to access"
          >
            Shadow Feed
          </div>
          <div 
            style={{ 
              color: '#00d9ff', 
              textDecoration: 'none',
              fontSize: '14px',
              padding: '6px 12px',
              borderRadius: '4px',
              transition: 'background-color 0.2s',
              border: '1px solid rgba(0, 217, 255, 0.3)',
              whiteSpace: 'nowrap',
              backgroundColor: hoveredLink === 'case-families' ? 'rgba(0, 217, 255, 0.1)' : 'transparent',
              cursor: 'not-allowed',
              opacity: 0.5
            }}
            onMouseEnter={() => setHoveredLink('case-families')}
            onMouseLeave={() => setHoveredLink(null)}
            title="Login required to access"
          >
            Case Families
          </div>
          <div 
            style={{ 
              color: '#00d9ff', 
              textDecoration: 'none',
              fontSize: '14px',
              padding: '6px 12px',
              borderRadius: '4px',
              transition: 'background-color 0.2s',
              border: '1px solid rgba(0, 217, 255, 0.3)',
              whiteSpace: 'nowrap',
              backgroundColor: hoveredLink === 'threat-map' ? 'rgba(0, 217, 255, 0.1)' : 'transparent',
              cursor: 'not-allowed',
              opacity: 0.5
            }}
            onMouseEnter={() => setHoveredLink('threat-map')}
            onMouseLeave={() => setHoveredLink(null)}
            title="Login required to access"
          >
            Threat Map
          </div>
          <div 
            style={{ 
              color: '#00d9ff', 
              textDecoration: 'none',
              fontSize: '14px',
              padding: '6px 12px',
              borderRadius: '4px',
              transition: 'background-color 0.2s',
              border: '1px solid rgba(0, 217, 255, 0.3)',
              whiteSpace: 'nowrap',
              backgroundColor: hoveredLink === 'reports' ? 'rgba(0, 217, 255, 0.1)' : 'transparent',
              cursor: 'not-allowed',
              opacity: 0.5
            }}
            onMouseEnter={() => setHoveredLink('reports')}
            onMouseLeave={() => setHoveredLink(null)}
            title="Login required to access"
          >
            Reports
          </div>
          <div 
            style={{ 
              color: '#00d9ff', 
              textDecoration: 'none',
              fontSize: '14px',
              padding: '6px 12px',
              borderRadius: '4px',
              transition: 'background-color 0.2s',
              border: '1px solid rgba(0, 217, 255, 0.3)',
              whiteSpace: 'nowrap',
              backgroundColor: hoveredLink === 'test-dashboard' ? 'rgba(0, 217, 255, 0.1)' : 'transparent',
              cursor: 'not-allowed',
              opacity: 0.5
            }}
            onMouseEnter={() => setHoveredLink('test-dashboard')}
            onMouseLeave={() => setHoveredLink(null)}
            title="Login required to access"
          >
            Test Dashboard
          </div>
        </nav>
      </header>

      <div style={{ maxWidth: '800px', width: '100%' }}>
        <div style={{
          marginBottom: '40px',
          padding: '30px',
          border: '2px solid rgba(0, 217, 255, 0.3)',
          borderRadius: '8px',
          background: 'rgba(0, 0, 0, 0.3)'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            margin: '0 0 10px 0',
            color: '#00d9ff',
            textShadow: '0 0 20px rgba(0, 217, 255, 0.5)',
            letterSpacing: '2px'
          }}>
            SPECTRA
          </h1>
          <h2 style={{
            fontSize: '1.5rem',
            margin: '0 0 20px 0',
            color: '#00ffb3',
            fontWeight: 'normal'
          }}>
            The Cybercrime Genome Lab for Dark Web Intelligence and Law Enforcement
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <div style={{
            padding: '20px',
            border: '1px solid rgba(0, 217, 255, 0.2)',
            borderRadius: '6px',
            background: 'rgba(0, 0, 0, 0.2)',
            textAlign: 'left'
          }}>
            <h3 style={{ color: '#00d9ff', margin: '0 0 10px 0', fontSize: '1.1rem' }}>Intelligence Engine</h3>
            <p style={{ margin: '0', color: '#aaa', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Advanced DNA marker extraction identifies emotional triggers, keywords, and patterns. 
              Automatic scam classification and lineage linking with confidence scoring.
            </p>
          </div>
          
          <div style={{
            padding: '20px',
            border: '1px solid rgba(0, 217, 255, 0.2)',
            borderRadius: '6px',
            background: 'rgba(0, 0, 0, 0.2)',
            textAlign: 'left'
          }}>
            <h3 style={{ color: '#00d9ff', margin: '0 0 10px 0', fontSize: '1.1rem' }}>Network Visualization</h3>
            <p style={{ margin: '0', color: '#aaa', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Interactive threat mapping with real-time network graphs. 
              Visual analysis of scam evolution and fraud family relationships.
            </p>
          </div>
          
          <div style={{
            padding: '20px',
            border: '1px solid rgba(0, 217, 255, 0.2)',
            borderRadius: '6px',
            background: 'rgba(0, 0, 0, 0.2)',
            textAlign: 'left'
          }}>
            <h3 style={{ color: '#00d9ff', margin: '0 0 10px 0', fontSize: '1.1rem' }}>Dark Web Monitoring</h3>
            <p style={{ margin: '0', color: '#aaa', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Continuous surveillance of underground marketplaces and illicit networks. 
              Automated detection of emerging threats and criminal infrastructure.
            </p>
          </div>
        </div>

        <div style={{
          marginBottom: '40px',
          padding: '20px',
          border: '1px solid rgba(0, 217, 255, 0.2)',
          borderRadius: '6px',
          background: 'rgba(0, 0, 0, 0.2)'
        }}>
          <h3 style={{ color: '#00ffb3', margin: '0 0 15px 0', fontSize: '1.2rem' }}>Access Control</h3>
          <p style={{ margin: '0 0 20px 0', color: '#aaa', fontSize: '0.9rem', lineHeight: '1.6' }}>
            Secure authentication required for intelligence access
          </p>
          <Link to="/signin" style={{
            display: 'inline-block',
            padding: '12px 30px',
            background: 'linear-gradient(45deg, #00d9ff, #0099ff)',
            color: 'black',
            textDecoration: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            fontSize: '1rem',
            border: 'none',
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
            boxShadow: '0 0 15px rgba(0, 217, 255, 0.3)'
          }}>
            LOGIN
          </Link>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '30px',
          flexWrap: 'wrap',
          fontSize: '0.8rem',
          color: '#666'
        }}>
          <div>🛡️ Law Enforcement Only</div>
          <div>🔒 Secure Access</div>
          <div>📊 Intelligence Grade</div>
          <div>⚡ Real-time Analysis</div>
        </div>
      </div>
    </div>
  );
}