import React from 'react';
import { render, screen, act } from '@testing-library/react';
import IntelligenceGraph from './IntelligenceGraph';

// Mock canvas context for testing
HTMLCanvasElement.prototype.getContext = jest.fn(() => {
  return {
    fillRect: jest.fn(),
    clearRect: jest.fn(),
    getImageData: jest.fn(() => ({
      data: new Array(4)
    })),
    putImageData: jest.fn(),
    createImageData: jest.fn(() => []),
    setTransform: jest.fn(),
    drawImage: jest.fn(),
    save: jest.fn(),
    fillText: jest.fn(),
    restore: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    closePath: jest.fn(),
    stroke: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
    translate: jest.fn(),
    scale: jest.fn(),
    rotate: jest.fn(),
    measureText: jest.fn(() => ({ width: 0 })),
    transform: jest.fn(),
    rect: jest.fn(),
    clip: jest.fn(),
    createLinearGradient: jest.fn(() => ({
      addColorStop: jest.fn()
    })),
    createRadialGradient: jest.fn(() => ({
      addColorStop: jest.fn()
    })),
    createPattern: jest.fn(() => ({})),
    strokeRect: jest.fn(),
    strokeText: jest.fn(),
    lineJoin: 'round',
    lineCap: 'round',
    lineWidth: 1,
    fillStyle: '#000',
    strokeStyle: '#000',
    font: '10px sans-serif',
    textAlign: 'left',
    textBaseline: 'alphabetic',
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowBlur: 0,
    shadowColor: 'transparent',
    globalAlpha: 1,
    globalCompositeOperation: 'source-over',
    mozImageSmoothingEnabled: true,
    webkitImageSmoothingEnabled: true,
    msImageSmoothingEnabled: true
  };
});

// Mock requestAnimationFrame
window.requestAnimationFrame = jest.fn(callback => {
  setTimeout(callback, 0);
  return 1;
});
window.cancelAnimationFrame = jest.fn();

describe('IntelligenceGraph Component', () => {
  const mockNodes = [
    {
      id: 'node1',
      x: 100,
      y: 100,
      type: 'incident',
      label: 'Test Incident',
      color: '#00d9ff'
    },
    {
      id: 'node2',
      x: 200,
      y: 200,
      type: 'family',
      label: 'Test Family',
      color: '#8b5cf6'
    }
  ];

  const mockEdges = [
    {
      from: 'node1',
      to: 'node2'
    }
  ];

  const mockOnNodeClick = jest.fn();

  test('renders without crashing', async () => {
    await act(async () => {
      render(
        <IntelligenceGraph
          nodes={mockNodes}
          edges={mockEdges}
          incidents={[]}
          families={[]}
          onNodeClick={mockOnNodeClick}
          selectedNode={null}
        />
      );
    });

    expect(screen.getByRole('button', { name: /Zoom In/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Zoom Out/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reset/i })).toBeInTheDocument();
  });

  test('displays entity and link counts', async () => {
    await act(async () => {
      render(
        <IntelligenceGraph
          nodes={mockNodes}
          edges={mockEdges}
          incidents={[]}
          families={[]}
          onNodeClick={mockOnNodeClick}
          selectedNode={null}
        />
      );
    });

    expect(screen.getByText(/2 Entities \| 1 Links/i)).toBeInTheDocument();
  });

  test('renders with empty data', async () => {
    await act(async () => {
      render(
        <IntelligenceGraph
          nodes={[]}
          edges={[]}
          incidents={[]}
          families={[]}
          onNodeClick={mockOnNodeClick}
          selectedNode={null}
        />
      );
    });

    expect(screen.getByText(/0 Entities \| 0 Links/i)).toBeInTheDocument();
  });
});