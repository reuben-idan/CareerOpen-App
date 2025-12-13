import api from './api';

const jobsService = {
  // Get all jobs
  async getJobs(filters = {}) {
    try {
      const response = await api.get('/jobs/', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get a single job by ID
  async getJobById(jobId) {
    try {
      const response = await api.get(`/jobs/${jobId}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create a new job
  async createJob(jobData) {
    try {
      const response = await api.post('/jobs/', jobData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update an existing job
  async updateJob(jobId, jobData) {
    try {
      const response = await api.put(`/jobs/${jobId}/`, jobData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete a job
  async deleteJob(jobId) {
    try {
      await api.delete(`/jobs/${jobId}/`);
      return true;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Apply for a job
  async applyForJob(jobId, applicationData) {
    try {
      const response = await api.post(`/jobs/${jobId}/apply/`, applicationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get applications for a job (employer only)
  async getJobApplications(jobId) {
    try {
      const response = await api.get(`/jobs/${jobId}/applications/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Search jobs by query
  async searchJobs(query) {
    try {
      const response = await api.get('/jobs/search/', { params: { q: query } });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get jobs by employer
  async getJobsByEmployer(employerId) {
    try {
      const response = await api.get(`/jobs/employer/${employerId}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default jobsService;
