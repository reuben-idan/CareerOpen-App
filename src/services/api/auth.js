import api from './api';

const authService = {
  // Login user
  async login(email, password) {
    try {
      const response = await api.post('/token/', { email, password });
      const { access, refresh } = response.data;
      
      // Store tokens in localStorage
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      
      // Set default auth header
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
      return this.getCurrentUser();
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  // Logout user
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    delete api.defaults.headers.common['Authorization'];
  },
  
  // Get current user
  async getCurrentUser() {
    try {
      const response = await api.get('/users/me/');
      return response.data;
    } catch (error) {
      // If not authenticated, clear tokens
      if (error.response?.status === 401) {
        this.logout();
      }
      throw error.response?.data || error.message;
    }
  },
  
  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  },
  
  // Register new user
  async register(userData) {
    try {
      const response = await api.post('/users/register/', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  // Update user profile
  async updateProfile(userId, profileData) {
    try {
      const response = await api.put(`/users/${userId}/`, profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default authService;
