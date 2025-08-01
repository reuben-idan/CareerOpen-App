import api from './authService';

const jobService = {
  // Get all jobs with optional filters
  getJobs: async (filters = {}) => {
    try {
      const response = await api.get('/jobs/', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get a single job by ID
  getJobById: async (jobId) => {
    try {
      const response = await api.get(`/jobs/${jobId}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create a new job
  createJob: async (jobData) => {
    try {
      const response = await api.post('/jobs/', jobData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update a job
  updateJob: async (jobId, jobData) => {
    try {
      const response = await api.put(`/jobs/${jobId}/`, jobData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete a job
  deleteJob: async (jobId) => {
    try {
      await api.delete(`/jobs/${jobId}/`);
      return true;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Search jobs
  searchJobs: async (query, filters = {}) => {
    try {
      const response = await api.get('/jobs/search/', {
        params: { search: query, ...filters },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Apply for a job
  applyForJob: async (jobId, applicationData) => {
    try {
      const response = await api.post(`/jobs/${jobId}/apply/`, applicationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user's job applications
  getUserApplications: async () => {
    try {
      const response = await api.get('/jobs/applications/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get application details
  getApplicationDetails: async (applicationId) => {
    try {
      const response = await api.get(`/jobs/applications/${applicationId}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Save/unsave a job
  toggleSaveJob: async (jobId) => {
    try {
      const response = await api.post(`/jobs/${jobId}/save/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get saved jobs
  getSavedJobs: async () => {
    try {
      const response = await api.get('/jobs/saved/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default jobService;
