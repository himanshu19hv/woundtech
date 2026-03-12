import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CliniciansPage from './CliniciansPage';
import client from '../../api/client';
import React from 'react';

// Mock the client
vi.mock('../../api/client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('CliniciansPage', () => {
  const mockClinicians = [
    { id: 1, name: 'Dr. Smith', specialization: 'Cardiology', email: 'smith@example.com', phone: '123' },
    { id: 2, name: 'Dr. Jones', specialization: 'Neurology', email: 'jones@example.com', phone: '456' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders CliniciansPage and fetches clinicians', async () => {
    client.get.mockResolvedValue({ data: mockClinicians });

    render(<CliniciansPage />);

    expect(screen.getByText(/Medical Staff/i)).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Dr. Smith')).toBeInTheDocument();
      expect(screen.getByText('Dr. Jones')).toBeInTheDocument();
    });
  });

  it('filters clinicians based on search input', async () => {
    client.get.mockResolvedValue({ data: mockClinicians });

    const { getByPlaceholderText } = render(<CliniciansPage />);

    await waitFor(() => expect(screen.getByText('Dr. Smith')).toBeInTheDocument());

    const searchInput = getByPlaceholderText(/Search staff.../i);
  });
});
