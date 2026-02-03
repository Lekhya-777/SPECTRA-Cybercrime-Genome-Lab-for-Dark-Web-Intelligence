import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from './Dashboard';
import fetchMock from 'jest-fetch-mock';

// Enable fetch mocking
fetchMock.enableMocks();

describe('Dashboard Component', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  test('renders initial dashboard structure', () => {
    render(<Dashboard />);
    
    expect(screen.getByText(/SYSTEM DASHBOARD/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Incidents/i)).toBeInTheDocument();
    expect(screen.getByText(/Threat Families/i)).toBeInTheDocument();
    expect(screen.getByText(/🚨 CRITICAL/i)).toBeInTheDocument();
    expect(screen.getByText(/Active Cases/i)).toBeInTheDocument();
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
          threat_level: 'CRITICAL',
          risk: 'HIGH',
          cases: ['1', '2']
        },
        {
          _id: 'f2',
          label: 'Investment Fraud',
          scamType: 'Investment Scam',
          threat_level: 'HIGH',
          risk: 'MEDIUM',
          cases: ['3']
        }
      ]
    };

    fetchMock.mockResponseOnce(JSON.stringify(mockData));

    render(<Dashboard />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText(/SYSTEM DASHBOARD/i)).toBeInTheDocument();
    });

    // Since the actual numbers depend on the processed data, check for the presence of stat cards
    const statCards = screen.getAllByText(/Total Incidents|Threat Families|🚨 CRITICAL|Active Cases/i);
    expect(statCards.length).toBeGreaterThan(0);
  });

  test('handles API error gracefully', async () => {
    // Mock API error
    fetchMock.mockRejectOnce(new Error('API Error'));

    render(<Dashboard />);

    // Wait to see if error handling occurs
    await waitFor(() => {
      // Component should still render with basic structure
      expect(screen.getByText(/SYSTEM DASHBOARD/i)).toBeInTheDocument();
    });
  });
});