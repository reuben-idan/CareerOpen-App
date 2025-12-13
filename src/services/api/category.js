import api from './api';

const categoryService = {
  // Get all categories
  async getCategories(filters = {}) {
    try {
      const response = await api.get('/categories/', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get category by ID
  async getCategory(categoryId) {
    try {
      const response = await api.get(`/categories/${categoryId}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create a new category (admin only)
  async createCategory(categoryData) {
    try {
      const response = await api.post('/categories/', categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update a category (admin only)
  async updateCategory(categoryId, categoryData) {
    try {
      const response = await api.put(`/categories/${categoryId}/`, categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete a category (admin only)
  async deleteCategory(categoryId) {
    try {
      await api.delete(`/categories/${categoryId}/`);
      return true;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get popular categories
  async getPopularCategories(limit = 10) {
    try {
      const response = await api.get('/categories/popular/', { params: { limit } });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get skills for a category
  async getCategorySkills(categoryId) {
    try {
      const response = await api.get(`/categories/${categoryId}/skills/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get jobs in a category
  async getCategoryJobs(categoryId, filters = {}) {
    try {
      const response = await api.get(`/categories/${categoryId}/jobs/`, { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Search categories
  async searchCategories(query) {
    try {
      const response = await api.get('/categories/search/', { params: { q: query } });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default categoryService;
