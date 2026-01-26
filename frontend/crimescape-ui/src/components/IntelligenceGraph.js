import React, { useEffect, useRef, useState } from "react";

export default function IntelligenceGraph({
  nodes,
  edges,
  incidents,
  families,
  onNodeClick,
  selectedNode
}) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  // Use refs to avoid re-triggering useEffect
  const zoomRef = useRef(1);
  const panRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  
  // State for UI display only
  const [zoomDisplay, setZoomDisplay] = useState(1);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Resize canvas
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const animate = () => {
      // Clear canvas
      ctx.fillStyle = "rgba(8, 17, 32, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Apply zoom and pan transformations
      ctx.save();
      ctx.translate(panRef.current.x, panRef.current.y);
      ctx.scale(zoomRef.current, zoomRef.current);

      // Draw edges
      edges.forEach(edge => {
        const fromNode = nodes.find(n => n.id === edge.from);
        const toNode = nodes.find(n => n.id === edge.to);
        if (fromNode && toNode) {
          ctx.beginPath();
          ctx.moveTo(fromNode.x, fromNode.y);
          ctx.lineTo(toNode.x, toNode.y);
          ctx.strokeStyle = "rgba(100, 150, 255, 0.3)";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      // Draw nodes
      nodes.forEach((node, idx) => {
        const pulse = Math.sin(Date.now() / 1000 + idx * 0.5) * 0.3 + 0.7;
        const radius = node.type === "family" ? 18 * pulse : 10 * pulse;

        if (node.glow) {
          const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius * 3);
          gradient.addColorStop(0, node.color + "44");
          gradient.addColorStop(1, node.color + "00");
          ctx.fillStyle = gradient;
          ctx.fillRect(node.x - radius * 3, node.y - radius * 3, radius * 6, radius * 6);
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        if (selectedNode?.id === node.id) {
          ctx.strokeStyle = "#00ffff";
          ctx.lineWidth = 3;
          ctx.stroke();
        }

        ctx.font = node.type === "family" ? "bold 12px monospace" : "10px monospace";
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(node.label, node.x, node.y);
      });

      ctx.restore();
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Mouse interaction
    const handleCanvasClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left - panRef.current.x) / zoomRef.current;
      const mouseY = (e.clientY - rect.top - panRef.current.y) / zoomRef.current;

      const clicked = nodes.find(node => {
        const dist = Math.hypot(node.x - mouseX, node.y - mouseY);
        return dist < 25;
      });

      if (clicked) onNodeClick(clicked.id);
    };

    const handleMouseWheel = (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.max(0.1, Math.min(5, zoomRef.current * zoomFactor));

      panRef.current = {
        x: mouseX - (mouseX - panRef.current.x) * (newZoom / zoomRef.current),
        y: mouseY - (mouseY - panRef.current.y) * (newZoom / zoomRef.current)
      };
      zoomRef.current = newZoom;
      setZoomDisplay(newZoom);
    };

    const handleMouseDown = (e) => {
      if (e.button === 2 || e.shiftKey) {
        isDraggingRef.current = true;
        dragStartRef.current = { x: e.clientX - panRef.current.x, y: e.clientY - panRef.current.y };
      }
    };

    const handleMouseMove = (e) => {
      if (isDraggingRef.current) {
        panRef.current = {
          x: e.clientX - dragStartRef.current.x,
          y: e.clientY - dragStartRef.current.y
        };
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    canvas.addEventListener("click", handleCanvasClick);
    canvas.addEventListener("wheel", handleMouseWheel, { passive: false });
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("contextmenu", e => e.preventDefault());

    return () => {
      canvas.removeEventListener("click", handleCanvasClick);
      canvas.removeEventListener("wheel", handleMouseWheel);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, edges, selectedNode, onNodeClick]);

  return (
    <div className="intelligence-graph">
      <canvas ref={canvasRef} className="graph-canvas" />
      
      <div className="graph-controls">
        <button 
          className="graph-btn"
          onClick={() => {
            zoomRef.current = Math.min(5, zoomRef.current * 1.2);
            setZoomDisplay(zoomRef.current);
          }}
          title="Zoom In (or scroll up)"
        >
          🔍 +
        </button>
        <button 
          className="graph-btn"
          onClick={() => {
            zoomRef.current = Math.max(0.1, zoomRef.current * 0.8);
            setZoomDisplay(zoomRef.current);
          }}
          title="Zoom Out (or scroll down)"
        >
          🔍 -
        </button>
        <button 
          className="graph-btn"
          onClick={() => {
            zoomRef.current = 1;
            panRef.current = { x: 0, y: 0 };
            setZoomDisplay(1);
          }}
          title="Reset zoom & pan"
        >
          ⊙ Reset
        </button>
        <div className="zoom-display">{(zoomDisplay * 100).toFixed(0)}%</div>
      </div>

      <div className="graph-info">
        <span className="info-badge">
          {nodes.length} Entities | {edges.length} Links
        </span>
        <span className="info-badge" style={{ fontSize: "9px", color: "#aaa" }}>
          Scroll: Zoom | Shift+Drag: Pan
        </span>
      </div>
    </div>
  );
}
