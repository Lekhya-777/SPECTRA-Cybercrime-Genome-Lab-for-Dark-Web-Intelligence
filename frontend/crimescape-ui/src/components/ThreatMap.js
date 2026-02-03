import React, { useEffect, useRef, useState } from "react";

export default function ThreatMap() {
  const canvasRef = useRef(null);
  const [networkData, setNetworkData] = useState({ nodes: [], links: [] });
  const [selectedNode, setSelectedNode] = useState(null);
  const [liveIncidents, setLiveIncidents] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const fetchNetworkData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/incidents/with-families");
        const data = await res.json();
        const incidents = data.incidents || [];
        const families = data.families || [];
        
        // Process incidents and families to create a network map
        const nodes = [];
        const links = [];
        const nodeMap = new Map(); // To avoid duplicates

        // Create nodes for incidents
        incidents.forEach(incident => {
          const nodeId = `incident-${incident._id}`;
          if (!nodeMap.has(nodeId)) {
            nodes.push({
              id: nodeId,
              type: 'incident',
              label: incident.rawText.substring(0, 30) + (incident.rawText.length > 30 ? '...' : ''),
              rawText: incident.rawText,
              phone: incident.phone || 'N/A',
              url: incident.url || 'N/A',
              scamType: incident.scamType || 'Unknown',
              threat_level: incident.threat_level || 'HIGH',
              createdAt: incident.createdAt,
              x: 0, // Will be set by layout algorithm
              y: 0
            });
            nodeMap.set(nodeId, nodes.length - 1);
          }
        });

        // Create nodes for fraud families
        families.forEach(family => {
          const familyId = `family-${family._id}`;
          if (!nodeMap.has(familyId)) {
            nodes.push({
              id: familyId,
              type: 'family',
              label: family.label,
              scamType: family.scamType,
              threat_level: family.threat_level || 'HIGH',
              risk: family.risk || 'MEDIUM',
              createdAt: family.createdAt,
              x: 0, // Will be set by layout algorithm
              y: 0
            });
            nodeMap.set(familyId, nodes.length - 1);
          }
        });

        // Create links based on phone numbers (similar cases)
        const phoneGroups = {};
        incidents.forEach(incident => {
          if (incident.phone && incident.phone.trim() !== '' && incident.phone.trim() !== 'N/A') {
            if (!phoneGroups[incident.phone]) {
              phoneGroups[incident.phone] = [];
            }
            phoneGroups[incident.phone].push(incident);
          }
        });

        // Create links for incidents sharing the same phone number
        Object.entries(phoneGroups).forEach(([phone, incidentsWithPhone]) => {
          if (incidentsWithPhone.length > 1) {
            // Connect all incidents with the same phone number
            for (let i = 0; i < incidentsWithPhone.length - 1; i++) {
              for (let j = i + 1; j < incidentsWithPhone.length; j++) {
                const sourceId = `incident-${incidentsWithPhone[i]._id}`;
                const targetId = `incident-${incidentsWithPhone[j]._id}`;
                
                // Check if link already exists
                const linkExists = links.some(link => 
                  (link.source === sourceId && link.target === targetId) ||
                  (link.source === targetId && link.target === sourceId)
                );
                
                if (!linkExists) {
                  links.push({
                    source: sourceId,
                    target: targetId,
                    type: 'shared-phone',
                    phone: phone
                  });
                }
              }
            }
          }
        });

        // Create links based on similar messaging patterns (shared markers/phrases)
        const markerGroups = {};
        incidents.forEach(incident => {
          if (incident.markers && Array.isArray(incident.markers)) {
            incident.markers.forEach(marker => {
              if (!markerGroups[marker]) {
                markerGroups[marker] = [];
              }
              markerGroups[marker].push(incident);
            });
          }
        });

        // Create links for incidents sharing the same markers
        Object.entries(markerGroups).forEach(([marker, incidentsWithMarker]) => {
          if (incidentsWithMarker.length > 1) {
            // Connect all incidents with the same marker
            for (let i = 0; i < incidentsWithMarker.length - 1; i++) {
              for (let j = i + 1; j < incidentsWithMarker.length; j++) {
                const sourceId = `incident-${incidentsWithMarker[i]._id}`;
                const targetId = `incident-${incidentsWithMarker[j]._id}`;
                
                // Check if link already exists
                const linkExists = links.some(link => 
                  (link.source === sourceId && link.target === targetId) ||
                  (link.source === targetId && link.target === sourceId)
                );
                
                if (!linkExists) {
                  links.push({
                    source: sourceId,
                    target: targetId,
                    type: 'shared-marker',
                    marker: marker
                  });
                }
              }
            }
          }
        });

        // Create links between incidents and their families
        incidents.forEach(incident => {
          if (incident.familyId) {
            const incidentId = `incident-${incident._id}`;
            const familyId = `family-${incident.familyId._id || incident.familyId}`;
            
            // Check if link already exists
            const linkExists = links.some(link => 
              link.source === incidentId && link.target === familyId
            );
            
            if (!linkExists) {
              links.push({
                source: incidentId,
                target: familyId,
                type: 'belongs-to-family'
              });
            }
          }
        });

        setNetworkData({ nodes, links });
        
        // Update live incidents list with recent incidents
        const sortedIncidents = [...incidents].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setLiveIncidents(sortedIncidents.slice(0, 10)); // Show 10 most recent
        
        // Generate recent activity log
        const activity = sortedIncidents.slice(0, 5).map(incident => ({
          id: incident._id,
          message: incident.rawText.substring(0, 50) + (incident.rawText.length > 50 ? '...' : ''),
          type: incident.scamType,
          threat: incident.threat_level,
          timestamp: new Date(incident.createdAt).toLocaleTimeString(),
          platform: incident.platform || 'Unknown'
        }));
        setRecentActivity(activity);
      } catch (e) {
        console.error("Error fetching network data:", e);
      }
    };

    fetchNetworkData();
    
    // Refresh data every 15 seconds for live updates
    const interval = setInterval(fetchNetworkData, 15000);
    return () => clearInterval(interval);
  }, []);

  // Simplified layout algorithm to reduce visual clutter
  useEffect(() => {
    if (networkData.nodes.length === 0 || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Don't run animation in test environment
    if (typeof window !== 'undefined' && window.Cypress) return;
    if (process.env.NODE_ENV === 'test') return;

    // Layout algorithm: Arrange nodes in a clean, organized way with reduced visual clutter
    const layoutNodes = () => {
      const padding = 80; // Increased padding
      const sectionPadding = 20; // Padding between sections
      
      // Group nodes by type
      const families = networkData.nodes.filter(node => node.type === 'family');
      const incidents = networkData.nodes.filter(node => node.type === 'incident');
      
      // Calculate available space for each section
      const availableWidth = canvas.width - 2 * padding;
      const availableHeight = canvas.height - 2 * padding;
      
      // Layout families in the top section
      if (families.length > 0) {
        const familyCols = Math.min(families.length, 5); // Max 5 columns for families
        const familyRows = Math.ceil(families.length / familyCols);
        const familyCellWidth = availableWidth / familyCols;
        const familyCellHeight = (availableHeight * 0.3) / familyRows; // Use 30% for families
        
        families.forEach((node, index) => {
          const col = index % familyCols;
          const row = Math.floor(index / familyCols);
          
          node.x = padding + col * familyCellWidth + familyCellWidth / 2;
          node.y = padding + row * familyCellHeight + familyCellHeight / 2;
        });
      }
      
      // Layout incidents in the bottom section
      if (incidents.length > 0) {
        const incidentCols = Math.min(incidents.length, 6); // Max 6 columns for incidents
        const incidentRows = Math.ceil(incidents.length / incidentCols);
        const incidentCellWidth = availableWidth / incidentCols;
        const incidentCellHeight = (availableHeight * 0.6) / incidentRows; // Use 60% for incidents
        
        incidents.forEach((node, index) => {
          const col = index % incidentCols;
          const row = Math.floor(index / incidentCols);
          
          node.x = padding + col * incidentCellWidth + incidentCellWidth / 2;
          node.y = padding + (availableHeight * 0.35) + row * incidentCellHeight + incidentCellHeight / 2; // Start after families + some spacing
        });
      }
    };

    // Initial layout
    layoutNodes();

    // Animation loop for smooth rendering
    let animationFrame;
    const animate = () => {
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background grid
      ctx.strokeStyle = "rgba(100, 150, 255, 0.03)"; // Reduced opacity
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // Draw links with reduced opacity and only certain types
      networkData.links.forEach(link => {
        const sourceNode = networkData.nodes.find(n => n.id === link.source);
        const targetNode = networkData.nodes.find(n => n.id === link.target);
        
        if (sourceNode && targetNode) {
          // Only draw family-to-incident links to reduce visual clutter
          if (link.type === 'belongs-to-family') {
            // Draw with brighter opacity
            ctx.globalAlpha = 0.7; // Brighter opacity for visibility
            
            // Different colors for different link types
            let strokeStyle = "rgba(100, 150, 255, 0.7)";
            if (link.type === 'shared-phone') {
              strokeStyle = "rgba(255, 107, 107, 0.7)"; // Brighter red for shared phone
            } else if (link.type === 'shared-marker') {
              strokeStyle = "rgba(255, 209, 102, 0.7)"; // Brighter yellow for shared marker
            } else if (link.type === 'belongs-to-family') {
              strokeStyle = "rgba(0, 217, 255, 0.7)"; // Brighter cyan for family links
            }
            
            ctx.beginPath();
            ctx.moveTo(sourceNode.x, sourceNode.y);
            ctx.lineTo(targetNode.x, targetNode.y);
            ctx.strokeStyle = strokeStyle;
            ctx.lineWidth = 1.5; // Slightly thicker lines
            ctx.stroke();
            
            ctx.globalAlpha = 1.0; // Reset alpha
          }
        }
      });
      
      // Draw nodes
      networkData.nodes.forEach(node => {
        const isSelected = selectedNode && selectedNode.id === node.id;
        const isIncident = node.type === 'incident';
        const isFamily = node.type === 'family';
        
        // Different colors for different node types
        let fillColor = "#00d9ff"; // Default cyan
        if (isIncident) {
          if (node.threat_level === 'CRITICAL') fillColor = "#dc2626"; // Red
          else if (node.threat_level === 'HIGH') fillColor = "#f87171"; // Light red
          else if (node.threat_level === 'MEDIUM') fillColor = "#fbbf24"; // Amber
          else fillColor = "#4ade80"; // Green
        } else if (isFamily) {
          fillColor = "#8b5cf6"; // Purple for families
        }
        
        // Draw node
        ctx.beginPath();
        const radius = isFamily ? 12 : 8;
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = fillColor;
        ctx.fill();
        
        // Add glow effect for high threat nodes
        if (node.threat_level === 'CRITICAL' || node.threat_level === 'HIGH') {
          ctx.shadowColor = fillColor;
          ctx.shadowBlur = 8; // Reduced glow
          ctx.fill();
          ctx.shadowBlur = 0;
        }
        
        // Draw selection highlight
        if (isSelected) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius + 4, 0, Math.PI * 2);
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        
        // Draw node label
        ctx.font = "8px monospace";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
          node.label.substring(0, 8) + (node.label.length > 8 ? ".." : ""), 
          node.x, 
          node.y + radius + 10
        );
      });
      
      // Continue animation
      animationFrame = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Handle canvas click
    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Find clicked node
      const clickedNode = networkData.nodes.find(node => {
        const distance = Math.sqrt(Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2));
        return distance <= 12; // Radius threshold
      });
      
      setSelectedNode(clickedNode || null);
    };
    
    canvas.addEventListener('click', handleClick);
    
    return () => {
      cancelAnimationFrame(animationFrame);
      canvas.removeEventListener('click', handleClick);
    };
  }, [networkData, selectedNode]); // Added selectedNode to dependency array

  // Group nodes by type for better visualization
  const groupedNodes = networkData.nodes.reduce((groups, node) => {
    if (!groups[node.type]) {
      groups[node.type] = [];
    }
    groups[node.type].push(node);
    return groups;
  }, {});

  // Group links by type
  const groupedLinks = networkData.links.reduce((groups, link) => {
    if (!groups[link.type]) {
      groups[link.type] = [];
    }
    groups[link.type].push(link);
    return groups;
  }, {});

  return (
    <div style={{ padding: 20, height: '100%', overflowY: 'auto', color: 'white', position: 'relative' }}>
      <h2 style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', marginBottom: 20 }}>
        THREAT MAP — NETWORK VISUALIZATION
      </h2>

      {/* Network Canvas */}
      <div style={{ 
        position: 'relative', 
        height: '400px', 
        marginBottom: 24, 
        border: '1px solid rgba(0, 217, 255, 0.3)',
        borderRadius: '4px',
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
      }}>
        <canvas 
          ref={canvasRef} 
          style={{ 
            width: '100%', 
            height: '100%',
            display: 'block'
          }}
        />
        {networkData.nodes.length === 0 && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'rgba(255, 255, 255, 0.6)',
            fontFamily: 'monospace',
            fontSize: '14px'
          }}>
            LOADING THREAT NETWORK...
          </div>
        )}
      </div>

      {/* Network Legend */}
      <div style={{ 
        display: 'flex', 
        gap: 20, 
        marginBottom: 24,
        flexWrap: 'wrap'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5
        }}>
          <div style={{ width: 10, height: 10, backgroundColor: '#dc2626', borderRadius: '50%' }}></div>
          <span style={{ fontSize: 11, color: '#aaa' }}>CRITICAL</span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5
        }}>
          <div style={{ width: 10, height: 10, backgroundColor: '#f87171', borderRadius: '50%' }}></div>
          <span style={{ fontSize: 11, color: '#aaa' }}>HIGH</span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5
        }}>
          <div style={{ width: 10, height: 10, backgroundColor: '#fbbf24', borderRadius: '50%' }}></div>
          <span style={{ fontSize: 11, color: '#aaa' }}>MEDIUM</span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5
        }}>
          <div style={{ width: 10, height: 10, backgroundColor: '#4ade80', borderRadius: '50%' }}></div>
          <span style={{ fontSize: 11, color: '#aaa' }}>LOW</span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5
        }}>
          <div style={{ width: 10, height: 10, backgroundColor: '#8b5cf6', borderRadius: '50%' }}></div>
          <span style={{ fontSize: 11, color: '#aaa' }}>FAMILY</span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5
        }}>
          <div style={{ width: 2, height: 2, backgroundColor: 'rgba(255, 107, 107, 0.5)', opacity: 0.7 }}></div>
          <span style={{ fontSize: 11, color: '#aaa' }}>SHARED PHONE</span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5
        }}>
          <div style={{ width: 2, height: 2, backgroundColor: 'rgba(255, 209, 102, 0.5)', opacity: 0.7 }}></div>
          <span style={{ fontSize: 11, color: '#aaa' }}>SHARED MARKER</span>
        </div>
      </div>

      {/* Selected Node Info */}
      {selectedNode && (
        <div style={{
          marginBottom: 24,
          padding: 12,
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid var(--border-color)',
          borderRadius: 4
        }}>
          <h3 style={{ fontFamily: 'var(--font-mono)', color: '#00d9ff', marginBottom: 10 }}>
            SELECTED NODE DETAILS
          </h3>
          <div style={{ fontSize: 11, lineHeight: 1.6 }}>
            <div><strong>Type:</strong> {selectedNode.type}</div>
            <div><strong>Label:</strong> {selectedNode.label}</div>
            {selectedNode.phone && selectedNode.phone !== 'N/A' && (
              <div><strong>Phone:</strong> {selectedNode.phone}</div>
            )}
            {selectedNode.url && selectedNode.url !== 'N/A' && (
              <div><strong>URL:</strong> {selectedNode.url}</div>
            )}
            {selectedNode.scamType && (
              <div><strong>Scam Type:</strong> {selectedNode.scamType}</div>
            )}
            {selectedNode.threat_level && (
              <div><strong>Threat Level:</strong> {selectedNode.threat_level}</div>
            )}
            {selectedNode.rawText && (
              <div style={{ marginTop: 8 }}>
                <strong>Full Text:</strong><br/>
                <span style={{ color: '#aaa', fontSize: 10, wordWrap: 'break-word' }}>
                  {selectedNode.rawText}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Live Incident Feed */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontFamily: 'var(--font-mono)', color: '#00ffb3', marginBottom: 12, fontSize: 13 }}>
          🚨 LIVE INCIDENT FEED ({liveIncidents.length})
        </h3>
        <div style={{
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid var(--border-color)',
          borderRadius: 4,
          padding: 12,
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: '#00ffb3',
          maxHeight: 250,
          overflowY: 'auto'
        }}>
          {liveIncidents.length === 0 ? (
            <div style={{ color: 'var(--text-secondary)' }}>No live incidents detected...</div>
          ) : (
            liveIncidents.map((incident, i) => {
              let threatColor = '#00d9ff'; // Default
              if (incident.threat_level === 'CRITICAL') threatColor = '#dc2626';
              else if (incident.threat_level === 'HIGH') threatColor = '#f87171';
              else if (incident.threat_level === 'MEDIUM') threatColor = '#fbbf24';
              
              return (
                <div 
                  key={i} 
                  style={{ 
                    marginBottom: 8, 
                    paddingBottom: 8, 
                    borderBottom: '1px solid rgba(0,217,255,0.1)',
                    animation: 'pulse 1.5s infinite'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ color: threatColor, fontWeight: 'bold' }}>
                      {incident.scamType || 'Unknown'}
                    </div>
                    <div style={{ fontSize: 8, color: '#aaa' }}>
                      {new Date(incident.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                  <div style={{ color: '#aaa', fontSize: 9, marginTop: 3 }}>
                    Platform: {incident.platform || 'Unknown'} | Phone: {incident.phone || 'N/A'}
                  </div>
                  <div style={{ color: '#ddd', fontSize: 9, marginTop: 3, wordBreak: 'break-word' }}>
                    "{incident.rawText.substring(0, 80)}{incident.rawText.length > 80 ? '...' : ''}"
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Recent Activity Log */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontFamily: 'var(--font-mono)', color: '#0099ff', marginBottom: 12, fontSize: 13 }}>
          📊 RECENT ACTIVITY LOG ({recentActivity.length})
        </h3>
        <div style={{
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid var(--border-color)',
          borderRadius: 4,
          padding: 12,
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: '#0099ff',
          maxHeight: 200,
          overflowY: 'auto'
        }}>
          {recentActivity.length === 0 ? (
            <div style={{ color: 'var(--text-secondary)' }}>No recent activity...</div>
          ) : (
            recentActivity.map((activity, i) => {
              let threatColor = '#00d9ff'; // Default
              if (activity.threat === 'CRITICAL') threatColor = '#dc2626';
              else if (activity.threat === 'HIGH') threatColor = '#f87171';
              else if (activity.threat === 'MEDIUM') threatColor = '#fbbf24';
              
              return (
                <div key={i} style={{ marginBottom: 6, display: 'flex', gap: 8 }}>
                  <div style={{ color: threatColor, minWidth: 70 }}>{activity.timestamp}</div>
                  <div style={{ color: '#00d9ff' }}>{activity.type}</div>
                  <div style={{ color: '#aaa', flex: 1 }}>via {activity.platform}</div>
                  <div style={{ color: '#ddd', fontSize: 9 }}>"{activity.message}"</div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Network Statistics */}
      <div style={{ marginBottom: 24, display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        <div style={{
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid var(--border-color)',
          borderRadius: 4,
          padding: 12,
          minWidth: 150
        }}>
          <div style={{ fontSize: 14, color: '#00ffb3' }}>{networkData.nodes.length}</div>
          <div style={{ fontSize: 11, color: '#aaa' }}>Total Entities</div>
        </div>
        <div style={{
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid var(--border-color)',
          borderRadius: 4,
          padding: 12,
          minWidth: 150
        }}>
          <div style={{ fontSize: 14, color: '#0099ff' }}>{networkData.links.length}</div>
          <div style={{ fontSize: 11, color: '#aaa' }}>Connections</div>
        </div>
        <div style={{
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid var(--border-color)',
          borderRadius: 4,
          padding: 12,
          minWidth: 150
        }}>
          <div style={{ fontSize: 14, color: '#ff6b6b' }}>{groupedLinks['shared-phone']?.length || 0}</div>
          <div style={{ fontSize: 11, color: '#aaa' }}>Shared Phone Links</div>
        </div>
        <div style={{
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid var(--border-color)',
          borderRadius: 4,
          padding: 12,
          minWidth: 150
        }}>
          <div style={{ fontSize: 14, color: '#ffd166' }}>{groupedLinks['shared-marker']?.length || 0}</div>
          <div style={{ fontSize: 11, color: '#aaa' }}>Shared Marker Links</div>
        </div>
      </div>

      {/* Connection Patterns */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontFamily: 'var(--font-mono)', color: '#00ffb3', marginBottom: 12, fontSize: 13 }}>
          🔗 CONNECTION PATTERNS
        </h3>
        <div style={{
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid var(--border-color)',
          borderRadius: 4,
          padding: 12,
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: '#00ffb3',
          maxHeight: 300,
          overflowY: 'auto'
        }}>
          {networkData.links.length === 0 ? (
            <div style={{ color: 'var(--text-secondary)' }}>Analyzing threat connections...</div>
          ) : (
            <div>
              {/* Shared Phone Connections */}
              {groupedLinks['shared-phone'] && groupedLinks['shared-phone'].length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ color: '#ff6b6b', marginBottom: 8 }}>📞 SHARED PHONE NUMBERS</h4>
                  {groupedLinks['shared-phone'].slice(0, 5).map((link, i) => (
                    <div key={`phone-${i}`} style={{ marginBottom: 5, fontSize: 10 }}>
                      <span style={{ color: '#ff6b6b' }}>🔗 {link.phone}</span>
                    </div>
                  ))}
                  {groupedLinks['shared-phone'].length > 5 && (
                    <div style={{ color: '#aaa', fontSize: 10 }}>
                      + {groupedLinks['shared-phone'].length - 5} more...
                    </div>
                  )}
                </div>
              )}

              {/* Shared Marker Connections */}
              {groupedLinks['shared-marker'] && groupedLinks['shared-marker'].length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ color: '#ffd166', marginBottom: 8 }}>🏷️ SHARED MARKERS</h4>
                  {groupedLinks['shared-marker'].slice(0, 5).map((link, i) => (
                    <div key={`marker-${i}`} style={{ marginBottom: 5, fontSize: 10 }}>
                      <span style={{ color: '#ffd166' }}>🔗 {link.marker}</span>
                    </div>
                  ))}
                  {groupedLinks['shared-marker'].length > 5 && (
                    <div style={{ color: '#aaa', fontSize: 10 }}>
                      + {groupedLinks['shared-marker'].length - 5} more...
                    </div>
                  )}
                </div>
              )}

              {/* Family Connections */}
              {groupedLinks['belongs-to-family'] && groupedLinks['belongs-to-family'].length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ color: '#00d9ff', marginBottom: 8 }}>👪 FRAUD FAMILY LINKS</h4>
                  <div style={{ fontSize: 10, color: '#00d9ff' }}>
                    {groupedLinks['belongs-to-family'].length} incident-family connections
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Incidents List */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontFamily: 'var(--font-mono)', color: '#00ffb3', marginBottom: 12, fontSize: 13 }}>
          📋 INCIDENTS ({groupedNodes.incident?.length || 0})
        </h3>
        <div style={{
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid var(--border-color)',
          borderRadius: 4,
          padding: 12,
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: '#00ffb3',
          maxHeight: 300,
          overflowY: 'auto'
        }}>
          {groupedNodes.incident && groupedNodes.incident.length > 0 ? (
            groupedNodes.incident.slice(0, 10).map((incident, i) => (
              <div key={i} style={{ marginBottom: 8, paddingBottom: 8, borderBottom: '1px solid rgba(0,217,255,0.1)' }}>
                <div style={{ color: '#00d9ff', fontWeight: 'bold' }}>{incident.label}</div>
                <div style={{ color: '#aaa', fontSize: 9 }}>
                  Phone: {incident.phone} | Type: {incident.scamType} | {new Date(incident.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))
          ) : (
            <div style={{ color: 'var(--text-secondary)' }}>No incidents found.</div>
          )}
        </div>
      </div>

      {/* Fraud Families List */}
      <div>
        <h3 style={{ fontFamily: 'var(--font-mono)', color: '#0099ff', marginBottom: 12, fontSize: 13 }}>
          🏠 FRAUD FAMILIES ({groupedNodes.family?.length || 0})
        </h3>
        <div style={{
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid var(--border-color)',
          borderRadius: 4,
          padding: 12,
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: '#0099ff',
          maxHeight: 300,
          overflowY: 'auto'
        }}>
          {groupedNodes.family && groupedNodes.family.length > 0 ? (
            groupedNodes.family.slice(0, 10).map((family, i) => (
              <div key={i} style={{ marginBottom: 8, paddingBottom: 8, borderBottom: '1px solid rgba(0,217,255,0.1)' }}>
                <div style={{ color: '#00d9ff', fontWeight: 'bold' }}>{family.label}</div>
                <div style={{ color: '#aaa', fontSize: 9 }}>
                  Type: {family.scamType} | Risk: {family.risk} | {new Date(family.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))
          ) : (
            <div style={{ color: 'var(--text-secondary)' }}>No fraud families found.</div>
          )}
        </div>
      </div>
    </div>
  );
}