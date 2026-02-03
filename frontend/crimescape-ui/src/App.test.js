import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import fetchMock from 'jest-fetch-mock';

// Enable fetch mocking
fetchMock.enableMocks();

// Mock the components that use canvas since jsdom doesn't support it
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

// Mock the route components to avoid loading the full app
jest.mock('./components/Dashboard', () => () => <div data-testid="dashboard">Dashboard Content</div>);
jest.mock('./components/ShadowFeed', () => () => <div data-testid="shadowfeed">ShadowFeed Content</div>);
jest.mock('./components/InvestigationView', () => () => <div data-testid="investigation">Investigation Content</div>);
jest.mock('./components/ThreatMap', () => () => <div data-testid="threatmap">ThreatMap Content</div>);
jest.mock('./components/Reports', () => () => <div data-testid="reports">Reports Content</div>);
jest.mock('./pages/Home', () => () => <div data-testid="home">Home Content</div>);
jest.mock('./components/AuraHeader', () => () => <div data-testid="header">Header Content</div>);
jest.mock('./components/SidebarAura', () => () => <div data-testid="sidebar">Sidebar Content</div>);

describe('App Component', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  test('renders the main application structure', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
      );
    });

    // Check if the main navigation elements are present
    await waitFor(() => {
      expect(document.querySelector('[data-testid="header"]')).toBeInTheDocument();
    });
  });
});