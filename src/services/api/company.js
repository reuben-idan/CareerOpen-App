import api from './api';

const companyService = {
  // Create a new company
  async createCompany(companyData) {
    try {
      const response = await api.post('/companies/', companyData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get company by ID
  async getCompany(companyId) {
    try {
      const response = await api.get(`/companies/${companyId}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update company
  async updateCompany(companyId, companyData) {
    try {
      const response = await api.put(`/companies/${companyId}/`, companyData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete company
  async deleteCompany(companyId) {
    try {
      await api.delete(`/companies/${companyId}/`);
      return true;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all companies
  async getAllCompanies(filters = {}) {
    try {
      const response = await api.get('/companies/', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get jobs by company
  async getCompanyJobs(companyId, filters = {}) {
    try {
      const response = await api.get(`/companies/${companyId}/jobs/`, { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Upload company logo
  async uploadLogo(companyId, file) {
    try {
      const formData = new FormData();
      formData.append('logo', file);
      
      const response = await api.post(`/companies/${companyId}/logo/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data.logoUrl;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get company statistics
  async getCompanyStats(companyId) {
    try {
      const response = await api.get(`/companies/${companyId}/stats/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Verify company
  async verifyCompany(companyId) {
    try {
      const response = await api.post(`/companies/${companyId}/verify/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default companyService;
