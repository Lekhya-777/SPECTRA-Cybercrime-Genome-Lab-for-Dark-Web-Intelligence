import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import ThreatMap from './ThreatMap';
import fetchMock from 'jest-fetch-mock';

// Enable fetch mocking
fetchMock.enableMocks();

// Mock canvas context for testing
HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
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
}));

// Mock requestAnimationFrame
window.requestAnimationFrame = jest.fn(callback => setTimeout(callback, 0));
window.cancelAnimationFrame = jest.fn(cb => clearTimeout(cb));

describe('ThreatMap Component', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  test('renders loading state initially', () => {
    render(<ThreatMap />);
    
    expect(screen.getByText(/LOADING THREAT NETWORK\.\.\./i)).toBeInTheDocument();
  });

  test('renders with mock data', async () => {
    // Mock the API response
    const mockData = {
      incidents: [
        {
          _id: '1',
          rawText: 'Fake banking message asking for OTP',
          platform: 'SMS',
          phone: '+1234567890',
          url: 'https://fake-bank.com',
          markers: ['bank', 'otp'],
          scamType: 'Banking Scam',
          threat_level: 'HIGH',
          createdAt: '2026-01-20T10:00:00Z'
        },
        {
          _id: '2',
          rawText: 'Investment scam promising high returns',
          platform: 'Email',
          phone: '+0987654321',
          url: 'https://fake-investment.com',
          markers: ['investment', 'profit'],
          scamType: 'Investment Scam',
          threat_level: 'CRITICAL',
          createdAt: '2026-01-20T11:00:00Z'
        }
      ],
      families: [
        {
          _id: 'f1',
          label: 'Banking OTP Fraud',
          scamType: 'Banking Scam',
          threat_level: 'HIGH',
          risk: 'HIGH',
          createdAt: '2026-01-19T10:00:00Z'
        }
      ]
    };

    fetchMock.mockResponseOnce(JSON.stringify(mockData));

    await act(async () => {
      render(<ThreatMap />);
    });

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText(/THREAT MAP — NETWORK VISUALIZATION/i)).toBeInTheDocument();
    });

    // Check if key sections are rendered
    expect(screen.getByText(/CONNECTION PATTERNS/i)).toBeInTheDocument();
    expect(screen.getByText(/LIVE INCIDENT FEED/i)).toBeInTheDocument();
    expect(screen.getByText(/RECENT ACTIVITY LOG/i)).toBeInTheDocument();
  });

  test('handles API error gracefully', async () => {
    // Mock API error
    fetchMock.mockRejectOnce(new Error('API Error'));

    await act(async () => {
      render(<ThreatMap />);
    });

    // Wait to see if error handling occurs
    await waitFor(() => {
      // Even with an error, the component should still render basic structure
      expect(screen.getByText(/THREAT MAP — NETWORK VISUALIZATION/i)).toBeInTheDocument();
    });
  });
});