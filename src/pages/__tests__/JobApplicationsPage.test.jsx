import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import JobApplicationsPage from '../JobApplicationsPage';
import * as jobService from '../../services/jobService';

// Mock the jobService
jest.mock('../../services/jobService');

describe('JobApplicationsPage', () => {
  const mockApplications = [
    {
      id: 1,
      job: {
        id: 101,
        title: 'Frontend Developer',
        company: {
          name: 'Tech Corp',
        },
        location: 'Remote',
      },
      status: 'applied',
      applied_at: '2025-08-01T12:00:00Z',
      cover_letter: 'I am excited to apply for this position.',
      resume: '/resumes/resume1.pdf',
    },
    {
      id: 2,
      job: {
        id: 102,
        title: 'Backend Engineer',
        company: {
          name: 'Dev Solutions',
        },
        location: 'New York, NY',
      },
      status: 'interview',
      applied_at: '2025-07-28T09:30:00Z',
      cover_letter: 'I have relevant experience for this role.',
      resume: '/resumes/resume2.pdf',
    },
  ];

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Mock the getUserApplications function
    jobService.getUserApplications.mockResolvedValue(mockApplications);
  });

  const renderComponent = () => {
    return render(
      <Router>
        <JobApplicationsPage />
      </Router>
    );
  };

  it('renders loading state initially', async () => {
    renderComponent();
    expect(screen.getByRole('status')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });

  it('displays applications after loading', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('My Job Applications')).toBeInTheDocument();
      expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
      expect(screen.getByText('Backend Engineer')).toBeInTheDocument();
    });
  });

  it('filters applications by search term', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search by job title or company...');
    fireEvent.change(searchInput, { target: { value: 'Backend' } });

    expect(screen.queryByText('Frontend Developer')).not.toBeInTheDocument();
    expect(screen.getByText('Backend Engineer')).toBeInTheDocument();
  });

  it('filters applications by status', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    });

    const statusFilter = screen.getByLabelText('Status Filter');
    fireEvent.change(statusFilter, { target: { value: 'interview' } });

    expect(screen.queryByText('Frontend Developer')).not.toBeInTheDocument();
    expect(screen.getByText('Backend Engineer')).toBeInTheDocument();
  });

  it('displays empty state when no applications match filters', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search by job title or company...');
    fireEvent.change(searchInput, { target: { value: 'Nonexistent Job' } });

    expect(screen.getByText('No applications found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search or filter criteria.')).toBeInTheDocument();
  });

  it('handles API errors gracefully', async () => {
    const errorMessage = 'Failed to load applications';
    jobService.getUserApplications.mockRejectedValue(new Error(errorMessage));
    
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});
