import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import PremiumApplications from '../PremiumApplications';
import * as api from '../../../services/api/applications';

// Mock the API module
jest.mock('../../../services/api/applications');

// Create a test query client
const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
};

// Create a wrapper component with necessary providers
const createWrapper = () => {
  const testQueryClient = createTestQueryClient();
  
  return ({ children }) => (
    <QueryClientProvider client={testQueryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

// Mock data
const mockApplications = [
  {
    id: 1,
    position: 'Frontend Developer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    type: 'Full-time',
    status: 'applied',
    appliedDate: '2023-11-25',
    notes: 'Initial application submitted',
    jobDescription: 'https://example.com/job/1',
    companyWebsite: 'https://techcorp.com',
  },
  {
    id: 2,
    position: 'Backend Engineer',
    company: 'CodeMasters',
    location: 'Remote',
    type: 'Contract',
    status: 'interview',
    appliedDate: '2023-11-20',
    notes: 'Technical interview scheduled',
    jobDescription: 'https://example.com/job/2',
    companyWebsite: 'https://codemasters.dev',
  },
];

describe('PremiumApplications', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Mock the API responses
    api.getApplications.mockResolvedValue(mockApplications);
    api.getApplication.mockImplementation((id) => 
      Promise.resolve(mockApplications.find(app => app.id === id))
    );
    api.createApplication.mockResolvedValue({
      id: 3,
      position: 'New Position',
      company: 'New Company',
      status: 'applied',
      appliedDate: '2023-12-01',
    });
    api.updateApplication.mockResolvedValue({
      ...mockApplications[0],
      position: 'Updated Position',
    });
    api.deleteApplication.mockResolvedValue({});
  });

  it('renders the applications list', async () => {
    render(<PremiumApplications />, { wrapper: createWrapper() });
    
    // Check if loading state is shown initially
    expect(screen.getByRole('status')).toBeInTheDocument();
    
    // Wait for applications to load
    await waitFor(() => {
      expect(api.getApplications).toHaveBeenCalledTimes(1);
    });
    
    // Check if applications are displayed
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    expect(screen.getByText('Backend Engineer')).toBeInTheDocument();
    
    // Check if filter controls are present
    expect(screen.getByPlaceholderText('Search applications...')).toBeInTheDocument();
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Applied')).toBeInTheDocument();
    expect(screen.getByText('Interview')).toBeInTheDocument();
  });

  it('filters applications by status', async () => {
    render(<PremiumApplications />, { wrapper: createWrapper() });
    
    // Wait for applications to load
    await waitFor(() => {
      expect(api.getApplications).toHaveBeenCalledTimes(1);
    });
    
    // Click on 'Interview' filter
    fireEvent.click(screen.getByText('Interview'));
    
    // Check if only interview applications are shown
    expect(screen.queryByText('Frontend Developer')).not.toBeInTheDocument();
    expect(screen.getByText('Backend Engineer')).toBeInTheDocument();
  });

  it('searches applications', async () => {
    render(<PremiumApplications />, { wrapper: createWrapper() });
    
    // Wait for applications to load
    await waitFor(() => {
      expect(api.getApplications).toHaveBeenCalledTimes(1);
    });
    
    // Type in search input
    const searchInput = screen.getByPlaceholderText('Search applications...');
    fireEvent.change(searchInput, { target: { value: 'Frontend' } });
    
    // Check if only matching applications are shown
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    expect(screen.queryByText('Backend Engineer')).not.toBeInTheDocument();
  });

  it('creates a new application', async () => {
    render(<PremiumApplications />, { wrapper: createWrapper() });
    
    // Wait for applications to load
    await waitFor(() => {
      expect(api.getApplications).toHaveBeenCalledTimes(1);
    });
    
    // Click 'Add Application' button
    fireEvent.click(screen.getByText('Add Application'));
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/position/i), {
      target: { value: 'New Position' },
    });
    fireEvent.change(screen.getByLabelText(/company/i), {
      target: { value: 'New Company' },
    });
    
    // Submit the form
    fireEvent.click(screen.getByText('Save'));
    
    // Check if create API was called
    await waitFor(() => {
      expect(api.createApplication).toHaveBeenCalledWith({
        position: 'New Position',
        company: 'New Company',
        location: '',
        type: 'Full-time',
        status: 'applied',
        appliedDate: expect.any(String),
        notes: '',
        jobDescription: '',
        companyWebsite: '',
        contacts: [],
        tasks: [],
      });
    });
    
    // Check if the new application is in the list
    await waitFor(() => {
      expect(screen.getByText('New Position')).toBeInTheDocument();
    });
  });

  it('edits an existing application', async () => {
    render(<PremiumApplications />, { wrapper: createWrapper() });
    
    // Wait for applications to load
    await waitFor(() => {
      expect(api.getApplications).toHaveBeenCalledTimes(1);
    });
    
    // Click on the first application to view details
    fireEvent.click(screen.getByText('Frontend Developer'));
    
    // Wait for the application details to load
    await waitFor(() => {
      expect(api.getApplication).toHaveBeenCalledWith(1);
    });
    
    // Click edit button
    fireEvent.click(screen.getByText('Edit'));
    
    // Update the position
    const positionInput = screen.getByLabelText(/position/i);
    fireEvent.change(positionInput, {
      target: { value: 'Updated Position' },
    });
    
    // Save the changes
    fireEvent.click(screen.getByText('Save'));
    
    // Check if update API was called
    await waitFor(() => {
      expect(api.updateApplication).toHaveBeenCalledWith(1, {
        ...mockApplications[0],
        position: 'Updated Position',
      });
    });
    
    // Check if the application was updated in the UI
    expect(screen.getByText('Updated Position')).toBeInTheDocument();
  });

  it('deletes an application', async () => {
    // Mock window.confirm
    const originalConfirm = window.confirm;
    window.confirm = jest.fn(() => true);
    
    render(<PremiumApplications />, { wrapper: createWrapper() });
    
    // Wait for applications to load
    await waitFor(() => {
      expect(api.getApplications).toHaveBeenCalledTimes(1);
    });
    
    // Click on the first application to view details
    fireEvent.click(screen.getByText('Frontend Developer'));
    
    // Wait for the application details to load
    await waitFor(() => {
      expect(api.getApplication).toHaveBeenCalledWith(1);
    });
    
    // Click delete button
    fireEvent.click(screen.getByText('Delete'));
    
    // Confirm deletion
    expect(window.confirm).toHaveBeenCalled();
    
    // Check if delete API was called
    await waitFor(() => {
      expect(api.deleteApplication).toHaveBeenCalledWith(1);
    });
    
    // Restore original confirm
    window.confirm = originalConfirm;
  });

  it('handles API errors gracefully', async () => {
    // Mock API to reject with an error
    const errorMessage = 'Failed to load applications';
    api.getApplications.mockRejectedValueOnce(new Error(errorMessage));
    
    render(<PremiumApplications />, { wrapper: createWrapper() });
    
    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
    
    // Check if retry button is shown
    const retryButton = screen.getByText(/try again/i);
    expect(retryButton).toBeInTheDocument();
    
    // Mock API to succeed on retry
    api.getApplications.mockResolvedValueOnce([mockApplications[0]]);
    
    // Click retry button
    fireEvent.click(retryButton);
    
    // Check if applications are loaded after retry
    await waitFor(() => {
      expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    });
  });

  it('toggles between mobile and desktop views', async () => {
    // Set initial viewport to mobile
    global.innerWidth = 500;
    global.dispatchEvent(new Event('resize'));
    
    const { rerender } = render(<PremiumApplications />, { wrapper: createWrapper() });
    
    // Wait for applications to load
    await waitFor(() => {
      expect(api.getApplications).toHaveBeenCalledTimes(1);
    });
    
    // Check if mobile view is active (list should be visible, detail view hidden)
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    
    // Click on an application to show detail view
    fireEvent.click(screen.getByText('Frontend Developer'));
    
    // Check if detail view is shown and list is hidden
    expect(screen.queryByText('Backend Engineer')).not.toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
    
    // Click back button
    fireEvent.click(screen.getByText('Back to List'));
    
    // Check if list is shown again
    expect(screen.getByText('Backend Engineer')).toBeInTheDocument();
    
    // Change to desktop view
    global.innerWidth = 1200;
    global.dispatchEvent(new Event('resize'));
    
    // Re-render with new viewport
    rerender(<PremiumApplications />);
    
    // Check if both list and detail views are visible
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    expect(screen.getByText('Backend Engineer')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });
});
