import api from './api';

const authService = {
  // Login user
  async login(email, password) {
    try {
      // First, get the JWT tokens using the login endpoint
      const response = await api.post('/login/', { 
        email, 
        password 
      }).catch(error => {
        if (!error.response) {
          // Network error or server not responding
          throw new Error('Unable to connect to the server. Please check your connection and try again.');
        }
        throw error;
      });
      
      // Log the response for debugging
      console.log('Login response:', response);
      
      // Extract tokens and user data from the response
      // The backend returns: { user: {...}, access: '...', refresh: '...' }
      if (!response || !response.user || !response.access || !response.refresh) {
        console.error('Invalid login response format:', response);
        throw new Error('Invalid server response. Please try again.');
      }
      
      const { access, refresh, user: userData } = response;
      
      // Store tokens in localStorage
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      
      // Set default auth header
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
      // Store user data in localStorage for initial render
      localStorage.setItem('user', JSON.stringify(userData));
      
      return userData;
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
      // First check if we have user data in localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          return JSON.parse(storedUser);
        } catch (e) {
          console.error('Error parsing stored user data:', e);
          // Continue to fetch fresh data if parsing fails
        }
      }
      
      // If no stored user or parsing failed, fetch from server
      const user = await api.get('/auth/me/');
      
      // Update the stored user data
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      
      // If we have a 401 (Unauthorized), clear the stored tokens and user data
      if (error.response?.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        delete api.defaults.headers.common['Authorization'];
      }
      
      throw error;
    }
  },
  
  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('accessToken');
  },
  
  // Register new user
  async register(userData) {
    try {
      const response = await api.post('/auth/register/', userData).catch(error => {
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
