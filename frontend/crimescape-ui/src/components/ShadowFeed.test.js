import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import ShadowFeed from './ShadowFeed';
import fetchMock from 'jest-fetch-mock';

// Enable fetch mocking
fetchMock.enableMocks();

describe('ShadowFeed Component', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  test('renders loading state initially', () => {
    render(<ShadowFeed />);
    
    expect(screen.getByText(/Loading incidents\.\.\./i)).toBeInTheDocument();
  });

  test('renders with mock incident data', async () => {
    // Mock the API response
    const mockIncidents = [
      {
        _id: '1',
        rawText: 'Fake banking message asking for OTP',
        platform: 'SMS',
        phone: '+1234567890',
        url: 'https://fake-bank.com',
        scamType: 'Banking Scam',
        createdAt: '2026-01-20T10:00:00Z'
      },
      {
        _id: '2',
        rawText: 'Investment scam promising high returns',
        platform: 'Email',
        phone: '+0987654321',
        url: 'https://fake-investment.com',
        scamType: 'Investment Scam',
        createdAt: '2026-01-20T11:00:00Z'
      }
    ];

    fetchMock.mockResponseOnce(JSON.stringify(mockIncidents));

    await act(async () => {
      render(<ShadowFeed />);
    });

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText(/ShadowFeed — Live Incident Stream/i)).toBeInTheDocument();
    });

    // Check if incidents are displayed by looking for the scam types in the strong tag specifically
    expect(screen.getByText('Banking Scam')).toBeInTheDocument();
    expect(screen.getByText('Investment Scam')).toBeInTheDocument();
    
    // Check if incident details are shown - using more flexible queries
    expect(screen.getByText(/1234567890/)).toBeInTheDocument();
    expect(screen.getByText(/fake-bank\.com/)).toBeInTheDocument();
  });

  test('displays message when no incidents are available', async () => {
    // Mock empty response
    fetchMock.mockResponseOnce(JSON.stringify([]));

    await act(async () => {
      render(<ShadowFeed />);
    });

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText(/No incidents yet\. Submit one to begin monitoring\./i)).toBeInTheDocument();
    });
  });

  test('handles API error gracefully', async () => {
    // Mock API error
    fetchMock.mockRejectOnce(new Error('API Error'));

    await act(async () => {
      render(<ShadowFeed />);
    });

    // Wait to see if error handling occurs
    await waitFor(() => {
      // Component should still render with basic structure
      expect(screen.getByText(/ShadowFeed — Live Incident Stream/i)).toBeInTheDocument();
    });
  });
});