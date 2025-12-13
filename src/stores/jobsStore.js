import { create } from 'zustand';
import { fetchJobs, fetchJobById } from '../services/api/jobsService';

// Helper function to parse pagination from response headers
const parsePagination = (headers) => {
  const pagination = {
    count: 0,
    next: null,
    previous: null,
    totalPages: 1,
    currentPage: 1,
  };

  try {
    if (headers['x-pagination']) {
      const paginationData = JSON.parse(headers['x-pagination']);
      return {
        count: paginationData.count || 0,
        next: paginationData.next || null,
        previous: paginationData.previous || null,
        totalPages: paginationData.total_pages || 1,
        currentPage: paginationData.current_page || 1,
      };
    }
  } catch (error) {
    console.error('Error parsing pagination:', error);
  }

  return pagination;
};

/**
 * Zustand store for managing jobs state
 * @typedef {Object} JobsStore
 * @property {Array} jobs - The list of jobs
 * @property {Object} currentJob - The currently selected job
 * @property {boolean} isLoading - Loading state
 * @property {string|null} error - Error message if any
 * @property {function} fetchJobs - Fetches jobs from the API
 * @property {function} fetchJobById - Fetches a single job by ID
 * @property {function} setCurrentJob - Sets the current job
 */

/** @type {import('zustand').UseBoundStore<import('zustand').StoreApi<JobsStore>>} */
const useJobsStore = create((set, get) => ({
  // Jobs list state
  jobs: [],
  currentJob: null,
  isLoading: false,
  error: null,
  
  // Pagination state
  pagination: {
    count: 0,
    next: null,
    previous: null,
    totalPages: 1,
    currentPage: 1,
  },
  
  // Getter for current page
  get currentPage() {
    return get().pagination.currentPage;
  },
  
  // Getter for total pages
  get totalPages() {
    return get().pagination.totalPages;
  },
  
  // Getter for total count
  get totalCount() {
    return get().pagination.count;
  },
  
  /**
   * Fetches jobs from the API with optional filters
   * @param {Object} [filters] - Optional filters for the jobs query
   */
  fetchJobs: async (filters = {}) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetchJobs(filters);
      const pagination = parsePagination(response.headers);
      
      set({ 
        jobs: response.data.results || response.data, // Handle both list and paginated responses
        pagination: {
          ...pagination,
          // Ensure we don't lose pagination data if not in headers
          count: response.data.count || response.data.length || 0,
          next: response.data.next || null,
          previous: response.data.previous || null,
          totalPages: Math.ceil((response.data.count || response.data.length || 0) / (filters.page_size || 10)),
          currentPage: parseInt(filters.page || 1, 10),
        },
        isLoading: false 
      });
      
      return response.data.results || response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 
                         error.response?.data?.message || 
                         'Failed to fetch jobs';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },
  
  /**
   * Fetches a single job by ID
   * @param {string|number} jobId - The ID of the job to fetch
   */
  fetchJobById: async (jobId) => {
    if (get().currentJob?.id === jobId) {
      return get().currentJob; // Return cached job if it's already the current one
    }
    
    set({ isLoading: true, error: null });
    
    try {
      const job = await fetchJobById(jobId);
      set({ currentJob: job, isLoading: false });
      return job;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || `Failed to fetch job ${jobId}`;
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },
  
  /**
   * Sets the current job
   * @param {Object|null} job - The job to set as current, or null to clear
   */
  setCurrentJob: (job) => set({ currentJob: job }),
  
  /**
   * Clears the jobs state
   */
  clear: () => {
    set({
      jobs: [],
      currentJob: null,
      error: null,
      pagination: {
        count: 0,
        next: null,
        previous: null,
        totalPages: 1,
        currentPage: 1,
      },
    });
  },
  
  /**
   * Creates a new job posting
   * @param {Object} jobData - The job data to post
   * @returns {Promise<Object>} The created job
   */
  createJob: async (jobData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch('/api/v1/jobs/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(jobData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create job');
      }
      
      const createdJob = await response.json();
      
      // Update the jobs list with the new job
      set(state => ({
        jobs: [createdJob, ...state.jobs],
        isLoading: false
      }));
      
      return createdJob;
      
    } catch (error) {
      console.error('Error creating job:', error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
}));

export default useJobsStore;
