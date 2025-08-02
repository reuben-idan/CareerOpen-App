import api from './api';

const applicationService = {
  // Submit a job application
  async submitApplication(jobId, applicationData) {
    try {
      const formData = new FormData();
      
      // Append file if present
      if (applicationData.resumeFile) {
        formData.append('resume', applicationData.resumeFile);
      }
      
      // Append other fields
      formData.append('cover_letter', applicationData.coverLetter || '');
      formData.append('job_id', jobId);
      
      const response = await api.post('/applications/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get application details
  async getApplication(applicationId) {
    try {
      const response = await api.get(`/applications/${applicationId}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get applications for current user
  async getUserApplications(filters = {}) {
    try {
      const response = await api.get('/applications/me/', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get applications for a job (employer only)
  async getJobApplications(jobId, filters = {}) {
    try {
      const response = await api.get(`/jobs/${jobId}/applications/`, { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update application status
  async updateApplicationStatus(applicationId, status, notes = '') {
    try {
      const response = await api.patch(
        `/applications/${applicationId}/status/`,
        { status, notes }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add note to application
  async addApplicationNote(applicationId, note) {
    try {
      const response = await api.post(
        `/applications/${applicationId}/notes/`,
        { note }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get application notes
  async getApplicationNotes(applicationId) {
    try {
      const response = await api.get(`/applications/${applicationId}/notes/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Schedule interview
  async scheduleInterview(applicationId, interviewData) {
    try {
      const response = await api.post(
        `/applications/${applicationId}/schedule-interview/`,
        interviewData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Withdraw application
  async withdrawApplication(applicationId) {
    try {
      const response = await api.post(`/applications/${applicationId}/withdraw/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get application statistics
  async getApplicationStats() {
    try {
      const response = await api.get('/applications/stats/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default applicationService;
