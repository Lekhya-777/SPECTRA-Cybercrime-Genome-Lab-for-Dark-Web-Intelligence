import React, { useState, useEffect } from 'react';

export default function TestDashboard() {
  const [tests, setTests] = useState([
    {
      id: 1,
      name: 'ShadowFeed Component Test',
      status: 'passed',
      duration: '120ms',
      timestamp: new Date().toLocaleTimeString()
    },
    {
      id: 2,
      name: 'ThreatMap Component Test',
      status: 'passed',
      duration: '245ms',
      timestamp: new Date().toLocaleTimeString()
    },
    {
      id: 3,
      name: 'Dashboard Component Test',
      status: 'passed',
      duration: '98ms',
      timestamp: new Date().toLocaleTimeString()
    },
    {
      id: 4,
      name: 'IntelligenceGraph Component Test',
      status: 'failed',
      duration: '312ms',
      timestamp: new Date().toLocaleTimeString(),
      error: 'Canvas context not properly initialized'
    },
    {
      id: 5,
      name: 'API Integration Test',
      status: 'passed',
      duration: '456ms',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);

  const [running, setRunning] = useState(false);

  const runTests = () => {
    setRunning(true);
    
    // Simulate running tests
    setTimeout(() => {
      setTests(prevTests => 
        prevTests.map(test => ({
          ...test,
          timestamp: new Date().toLocaleTimeString()
        }))
      );
      setRunning(false);
    }, 1500);
  };

  useEffect(() => {
    // Simulate periodic test runs
    const interval = setInterval(runTests, 10000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'passed': return '#00ff9c';
      case 'failed': return '#ff6b6b';
      case 'pending': return '#ffd166';
      default: return '#aaa';
    }
  };

  const getStatusBg = (status) => {
    switch(status) {
      case 'passed': return 'rgba(0, 255, 156, 0.1)';
      case 'failed': return 'rgba(255, 107, 107, 0.1)';
      case 'pending': return 'rgba(255, 209, 102, 0.1)';
      default: return 'rgba(170, 170, 170, 0.1)';
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
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 20 
      }}>
        <div style={{ 
          fontFamily: 'var(--font-mono)', 
          color: 'var(--accent-primary)', 
          fontSize: '1.2em' 
        }}>
          Test Dashboard — Live Test Runner ({tests.length} tests)
        </div>
        <button 
          onClick={runTests}
          disabled={running}
          style={{
            padding: '8px 16px',
            background: running ? 'rgba(0, 217, 255, 0.3)' : 'linear-gradient(45deg, #00d9ff, #0099ff)',
            color: 'black',
            border: '1px solid rgba(0, 217, 255, 0.3)',
            borderRadius: '4px',
            cursor: running ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--font-mono)',
            fontWeight: 'bold'
          }}
        >
          {running ? 'Running...' : 'Run Tests'}
        </button>
      </div>
      
      <div style={{ 
        flex: 1, 
        background: 'rgba(0,0,0,0.6)', 
        border: '1px solid var(--border-color)', 
        padding: 15, 
        overflowY: 'auto',
        borderRadius: '4px'
      }}>
        {tests.map((test) => (
          <div 
            key={test.id} 
            style={{ 
              padding: '12px', 
              margin: '8px 0', 
              borderRadius: '4px',
              background: getStatusBg(test.status),
              border: `1px solid ${getStatusColor(test.status)}`,
              fontFamily: 'Courier New, monospace',
              fontSize: '12px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: getStatusColor(test.status), fontWeight: 'bold' }}>
                  {test.status.toUpperCase()}
                </span>
                <span style={{ color: '#00d9ff' }}>{test.name}</span>
              </div>
              <div style={{ color: '#aaa', fontSize: '10px' }}>
                {test.duration} | {test.timestamp}
              </div>
            </div>
            
            {test.error && (
              <div style={{ 
                color: '#ff6b6b', 
                marginTop: '6px', 
                paddingLeft: '20px',
                fontStyle: 'italic' 
              }}>
                Error: {test.error}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div style={{ 
        marginTop: '15px', 
        padding: '10px', 
        background: 'rgba(0, 0, 0, 0.4)', 
        border: '1px solid rgba(0, 217, 255, 0.2)',
        borderRadius: '4px',
        fontSize: '12px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>Total: {tests.length} tests</div>
          <div style={{ color: '#00ff9c' }}>
            Passed: {tests.filter(t => t.status === 'passed').length}
          </div>
          <div style={{ color: '#ff6b6b' }}>
            Failed: {tests.filter(t => t.status === 'failed').length}
          </div>
          <div>Success Rate: {Math.round((tests.filter(t => t.status === 'passed').length / tests.length) * 100)}%</div>
        </div>
      </div>
    </div>
  );
}