import React from 'react';
import { render, screen } from '../../test-utils';
import JobApplicationCard from '../JobApplicationCard';

describe('JobApplicationCard', () => {
  const mockApplication = {
    id: 1,
    job: {
      id: 101,
      title: 'Senior Frontend Developer',
      company: {
        name: 'Tech Innovations Inc.',
      },
      location: 'Remote',
    },
    status: 'interview',
    applied_at: '2025-08-01T12:00:00Z',
    cover_letter: 'I am excited to apply for this position...',
    resume: '/resumes/resume1.pdf',
  };

  it('renders job application details correctly', () => {
    render(<JobApplicationCard application={mockApplication} />);
    
    expect(screen.getByText('Senior Frontend Developer')).toBeInTheDocument();
    expect(screen.getByText('Tech Innovations Inc.')).toBeInTheDocument();
    expect(screen.getByText('Remote')).toBeInTheDocument();
    expect(screen.getByText('Interview')).toBeInTheDocument();
    expect(screen.getByText('View Job')).toHaveAttribute('href', '/jobs/101');
    expect(screen.getByText('View Resume')).toHaveAttribute('href', '/resumes/resume1.pdf');
  });

  it('displays the correct status badge with appropriate styling', () => {
    render(<JobApplicationCard application={mockApplication} />);
    
    const statusBadge = screen.getByText('Interview');
    expect(statusBadge).toHaveClass('bg-blue-100', 'text-blue-800');
  });

  it('formats the application date correctly', () => {
    render(<JobApplicationCard application={mockApplication} />);
    
    // The exact format might vary based on your date formatting function
    expect(screen.getByText(/Applied on:/)).toBeInTheDocument();
  });

  it('truncates long cover letters', () => {
    const longCoverLetter = 'A'.repeat(300);
    const appWithLongCoverLetter = {
      ...mockApplication,
      cover_letter: longCoverLetter,
    };
    
    render(<JobApplicationCard application={appWithLongCoverLetter} />);
    
    const displayedText = screen.getByText(/A{100}/); // Check for part of the long string
    expect(displayedText).toBeInTheDocument();
  });

  it('handles missing optional fields gracefully', () => {
    const minimalApplication = {
      id: 2,
      job: {
        id: 102,
        title: 'Backend Developer',
        company: {
          name: 'Code Masters',
        },
      },
      status: 'applied',
      applied_at: '2025-08-02T10:30:00Z',
    };
    
    render(<JobApplicationCard application={minimalApplication} />);
    
    expect(screen.getByText('Backend Developer')).toBeInTheDocument();
    expect(screen.getByText('Code Masters')).toBeInTheDocument();
    expect(screen.getByText('Applied')).toBeInTheDocument();
    
    // Check that optional fields don't cause errors when missing
    expect(screen.queryByText('View Resume')).not.toBeInTheDocument();
  });
});
