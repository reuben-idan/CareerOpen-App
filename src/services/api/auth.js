import api from './api';

const authService = {
  // Login user
  async login(email, password) {
    try {
      const response = await api.post('/token/', { 
        email, 
        password 
      }).catch(error => {
        if (!error.response) {
          // Network error or server not responding
          throw new Error('Unable to connect to the server. Please check your connection and try again.');
        }
        throw error;
      });
      
      const { access, refresh } = response.data;
      
      // Store tokens in localStorage
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      
      // Set default auth header
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
      return this.getCurrentUser();
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        throw error.response.data || 'Login failed. Please check your credentials and try again.';
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error('No response from server. Please try again later.');
      } else {
        // Something happened in setting up the request that triggered an Error
        throw error.message || 'An error occurred during login.';
      }
    }
  },
  
  // Logout user
  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
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
    return !!localStorage.getItem('accessToken');
  },
  
  // Register new user
  async register(userData) {
    try {
      const response = await api.post('/users/register/', userData).catch(error => {
        if (!error.response) {
          // Network error or server not responding
          throw new Error('Unable to connect to the server. Please check your connection and try again.');
        }
        throw error;
      });
      
      return response.data;
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const errorData = error.response.data;
        if (typeof errorData === 'object' && errorData !== null) {
          // Handle validation errors from the server
          if (errorData.email) {
            throw new Error(errorData.email[0]);
          } else if (errorData.username) {
            throw new Error(errorData.username[0]);
          } else if (errorData.password) {
            throw new Error(errorData.password[0]);
          } else if (errorData.non_field_errors) {
            throw new Error(errorData.non_field_errors[0]);
          }
        }
        throw errorData || 'Registration failed. Please check your information and try again.';
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error('No response from server. Please try again later.');
      } else {
        // Something happened in setting up the request that triggered an Error
        throw error.message || 'An error occurred during registration.';
      }
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
