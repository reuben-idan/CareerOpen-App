import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useApplications } from '../useApplications';
import * as api from '../../services/api/applications';

// Mock the API module
jest.mock('../../services/api/applications');

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

// Create a wrapper component with QueryClientProvider
const createWrapper = () => {
  const testQueryClient = createTestQueryClient();
  
  return ({ children }) => (
    <QueryClientProvider client={testQueryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useApplications', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should fetch applications on mount', async () => {
    const mockApplications = [
      { id: 1, position: 'Frontend Developer', company: 'TechCorp', status: 'applied' },
      { id: 2, position: 'Backend Developer', company: 'CodeMasters', status: 'interview' },
    ];
    
    // Mock the API response
    api.getApplications.mockResolvedValueOnce(mockApplications);
    
    const { result, waitFor } = renderHook(() => useApplications(), {
      wrapper: createWrapper(),
    });
    
    // Initial state
    expect(result.current.applications).toEqual([]);
    expect(result.current.loading).toBe(true);
    
    // Wait for the query to resolve
    await waitFor(() => !result.current.loading);
    
    // After data is loaded
    expect(api.getApplications).toHaveBeenCalledTimes(1);
    expect(result.current.applications).toEqual(mockApplications);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch error', async () => {
    const errorMessage = 'Failed to fetch applications';
    
    // Mock the API to reject with an error
    api.getApplications.mockRejectedValueOnce(new Error(errorMessage));
    
    const { result, waitFor } = renderHook(() => useApplications(), {
      wrapper: createWrapper(),
    });
    
    // Wait for the query to reject
    await waitFor(() => !result.current.loading);
    
    // After error occurs
    expect(api.getApplications).toHaveBeenCalledTimes(1);
    expect(result.current.applications).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
  });

  it('should create a new application', async () => {
    const newApplication = {
      position: 'Full Stack Developer',
      company: 'WebWizards',
      status: 'applied',
    };
    
    const createdApplication = {
      id: 3,
      ...newApplication,
      appliedDate: '2023-11-30',
      lastUpdated: '2023-11-30',
    };
    
    // Mock API responses
    api.getApplications.mockResolvedValueOnce([]);
    api.createApplication.mockResolvedValueOnce(createdApplication);
    
    const { result, waitFor } = renderHook(() => useApplications(), {
      wrapper: createWrapper(),
    });
    
    // Wait for initial load
    await waitFor(() => !result.current.loading);
    
    // Create new application
    await act(async () => {
      await result.current.createApplication(newApplication);
    });
    
    // Verify the application was created
    expect(api.createApplication).toHaveBeenCalledWith(newApplication);
    expect(result.current.applications).toContainEqual(createdApplication);
  });

  it('should update an existing application', async () => {
    const initialApplications = [
      { id: 1, position: 'Frontend Developer', company: 'TechCorp', status: 'applied' },
    ];
    
    const updatedApplication = {
      id: 1,
      position: 'Senior Frontend Developer',
      company: 'TechCorp',
      status: 'interview',
    };
    
    // Mock API responses
    api.getApplications.mockResolvedValueOnce(initialApplications);
    api.updateApplication.mockResolvedValueOnce(updatedApplication);
    
    const { result, waitFor } = renderHook(() => useApplications(), {
      wrapper: createWrapper(),
    });
    
    // Wait for initial load
    await waitFor(() => !result.current.loading);
    
    // Update application
    await act(async () => {
      await result.current.updateApplication(1, updatedApplication);
    });
    
    // Verify the application was updated
    expect(api.updateApplication).toHaveBeenCalledWith(1, updatedApplication);
    expect(result.current.applications).toContainEqual(updatedApplication);
  });

  it('should delete an application', async () => {
    const initialApplications = [
      { id: 1, position: 'Frontend Developer', company: 'TechCorp', status: 'applied' },
    ];
    
    // Mock API responses
    api.getApplications.mockResolvedValueOnce(initialApplications);
    api.deleteApplication.mockResolvedValueOnce({});
    
    const { result, waitFor } = renderHook(() => useApplications(), {
      wrapper: createWrapper(),
    });
    
    // Wait for initial load
    await waitFor(() => !result.current.loading);
    
    // Delete application
    await act(async () => {
      await result.current.deleteApplication(1);
    });
    
    // Verify the application was deleted
    expect(api.deleteApplication).toHaveBeenCalledWith(1);
    expect(result.current.applications).toHaveLength(0);
  });

  it('should update application status', async () => {
    const initialApplications = [
      { id: 1, position: 'Frontend Developer', company: 'TechCorp', status: 'applied' },
    ];
    
    const updatedStatus = 'interview';
    const updatedApplication = {
      ...initialApplications[0],
      status: updatedStatus,
    };
    
    // Mock API responses
    api.getApplications.mockResolvedValueOnce(initialApplications);
    api.updateApplicationStatus.mockResolvedValueOnce(updatedApplication);
    
    const { result, waitFor } = renderHook(() => useApplications(), {
      wrapper: createWrapper(),
    });
    
    // Wait for initial load
    await waitFor(() => !result.current.loading);
    
    // Update status
    await act(async () => {
      await result.current.updateStatus(1, updatedStatus);
    });
    
    // Verify the status was updated
    expect(api.updateApplicationStatus).toHaveBeenCalledWith(1, updatedStatus);
    expect(result.current.applications[0].status).toBe(updatedStatus);
  });

  it('should handle notes, tasks, and contacts', async () => {
    const initialApplications = [
      { id: 1, position: 'Frontend Developer', company: 'TechCorp', status: 'applied' },
    ];
    
    const newNote = { id: 1, content: 'Follow up next week' };
    const newTask = { id: 1, title: 'Prepare for interview', dueDate: '2023-12-10', completed: false };
    const newContact = { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Hiring Manager' };
    
    // Mock API responses
    api.getApplications.mockResolvedValueOnce(initialApplications);
    api.addApplicationNote.mockResolvedValueOnce(newNote);
    api.addApplicationTask.mockResolvedValueOnce(newTask);
    api.addApplicationContact.mockResolvedValueOnce(newContact);
    
    const { result, waitFor } = renderHook(() => useApplications(), {
      wrapper: createWrapper(),
    });
    
    // Wait for initial load
    await waitFor(() => !result.current.loading);
    
    // Add note
    await act(async () => {
      await result.current.addNote(1, 'Follow up next week');
    });
    
    // Add task
    await act(async () => {
      await result.current.addTask(1, { title: 'Prepare for interview', dueDate: '2023-12-10' });
    });
    
    // Add contact
    await act(async () => {
      await result.current.addContact(1, { name: 'John Doe', email: 'john@example.com', role: 'Hiring Manager' });
    });
    
    // Verify all operations were called
    expect(api.addApplicationNote).toHaveBeenCalledWith(1, { note: 'Follow up next week' });
    expect(api.addApplicationTask).toHaveBeenCalledWith(1, { title: 'Prepare for interview', dueDate: '2023-12-10' });
    expect(api.addApplicationContact).toHaveBeenCalledWith(1, { name: 'John Doe', email: 'john@example.com', role: 'Hiring Manager' });
  });
});
