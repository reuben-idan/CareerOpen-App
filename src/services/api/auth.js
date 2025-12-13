import api from './api';
import { ENDPOINTS } from '../../config/api';

// Token storage keys
const TOKEN_KEYS = {
  ACCESS: 'accessToken',
  REFRESH: 'refreshToken',
  USER: 'user',
};

// Token refresh queue
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Authentication service for handling user authentication and token management
 */
const authService = {
  /**
   * Login a user with email and password
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<Object>} User data
   */
  async login(email, password) {
    try {
      console.log('Attempting login with endpoint:', ENDPOINTS.AUTH.LOGIN);
      const response = await api.post(ENDPOINTS.AUTH.LOGIN, { username: email, password });
      
      if (!response || !response.data) {
        throw new Error('No data received from server');
      }
      
      console.log('Login response:', response.data);
      
      // Handle the JWT token response
      const { access, refresh } = response.data;
      
      if (!access || !refresh) {
        console.error('Missing tokens in response:', response.data);
        throw new Error('Authentication failed: No tokens received');
      }
      
      // Get user data using the token
      const userResponse = await this.getCurrentUser(true);
      const userData = userResponse || {};
      
      // Store tokens and user data
      this.setAuthTokens({ access, refresh });
      this.setUser(userData);
      
      return userData;
    } catch (error) {
      // Clear any existing auth data on error
      this.clearAuth();
      
      // Handle different types of errors
      if (error && error.response) {
        // Server responded with an error status
        const { status, data } = error.response;
        const errorMessage = (data && (data.detail || data.message)) || 'Login failed. Please try again.';
        
        console.error(`Login error (${status}):`, errorMessage);
        
        if (status === 400) {
          throw new Error('Invalid email or password');
        } else if (status === 401) {
          throw new Error('Your session has expired. Please log in again.');
        } else if (status >= 500) {
          console.error('Server error during login:', error.response);
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error(errorMessage);
        }
      } else if (error && error.request) {
        // Request was made but no response received
        console.error('No response from server:', error.request);
        throw new Error('Unable to connect to the server. Please check your connection.');
      } else if (error && error.message) {
        // Something happened in setting up the request
        console.error('Request setup error:', error.message);
        throw new Error(error.message);
      } else {
        // Unknown error
        console.error('Unknown login error:', error);
        throw new Error('An unexpected error occurred during login.');
      }
    }
  },
  
  /**
   * Logout the current user
   */
  logout() {
    this.clearAuth();
  },
  
  /**
   * Get the current authenticated user
   * @param {boolean} forceRefresh - Force refresh from server
   * @returns {Promise<Object>} User data
   */
  async getCurrentUser(forceRefresh = false) {
    // Return cached user if available and not forcing refresh
    if (!forceRefresh) {
      const cachedUser = this.getCachedUser();
      if (cachedUser) {
        return cachedUser;
      }
    }
    
    try {
      const response = await api.get(ENDPOINTS.AUTH.ME);
      const userData = response.data;
      
      if (!userData || typeof userData !== 'object') {
        throw new Error('Invalid user data format received');
      }
      
      // Ensure we have the required user fields
      if (!userData.id || !userData.email) {
        console.error('Missing required user fields:', userData);
        throw new Error('Incomplete user data received');
      }
      
      // Store the user data
      this.setUser(userData);
      return userData;
    } catch (error) {
      console.error('Error fetching current user:', error);
      // Only clear auth if it's an authentication error
      if (error.response?.status === 401) {
        this.clearAuth();
      }
      throw error;
    }
  },
  
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} New user data
   */
  async register(userData) {
    try {
      console.log('Attempting registration with endpoint:', ENDPOINTS.AUTH.REGISTER);
      
      // Transform the user data to match the backend's expected format
      const registrationData = {
        username: userData.email, // Using email as username
        email: userData.email,
        password: userData.password,
        first_name: userData.first_name,
        last_name: userData.last_name,
        // Include any additional fields required by the backend
      };
      
      const response = await api.post(ENDPOINTS.AUTH.REGISTER, registrationData);
      console.log('Registration response:', response.data);
      
      // After successful registration, log the user in
      if (response.data.id) {
        return this.login(registrationData.email, registrationData.password);
      }
      
      throw new Error('Registration failed: No user ID in response');
    } catch (error) {
      if (error.response?.data) {
        throw new Error(
          error.response.data.detail || 
          Object.values(error.response.data).flat().join('\n') ||
          'Registration failed. Please check your information and try again.'
        );
      }
      throw error;
    }
  },
  
  /**
   * Refresh the access token using the refresh token
   * @returns {Promise<string>} New access token
   */
  async refreshToken() {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      });
    }
    
    isRefreshing = true;
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      this.clearAuth();
      throw new Error('No refresh token available');
    }
    
    try {
      const response = await api.post('/auth/token/refresh/', { refresh: refreshToken });
      const { access } = response.data;
      
      if (!access) {
        throw new Error('No access token in refresh response');
      }
      
      this.setAccessToken(access);
      processQueue(null, access);
      return access;
    } catch (error) {
      processQueue(error, null);
      this.clearAuth();
      throw error;
    } finally {
      isRefreshing = false;
    }
  },
  
  // Helper methods
  setAuthTokens({ access, refresh }) {
    if (access) {
      localStorage.setItem(TOKEN_KEYS.ACCESS, access);
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
    }
    if (refresh) {
      localStorage.setItem(TOKEN_KEYS.REFRESH, refresh);
    }
  },
  
  setUser(user) {
    if (user && user.id) {
      localStorage.setItem(TOKEN_KEYS.USER, JSON.stringify(user));
    }
  },
  
  getAccessToken() {
    return localStorage.getItem(TOKEN_KEYS.ACCESS);
  },
  
  getRefreshToken() {
    return localStorage.getItem(TOKEN_KEYS.REFRESH);
  },
  
  getCachedUser() {
    try {
      const userStr = localStorage.getItem(TOKEN_KEYS.USER);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },
  
  clearAuth() {
    // Clear all auth-related items from localStorage
    [TOKEN_KEYS.ACCESS, TOKEN_KEYS.REFRESH, TOKEN_KEYS.USER].forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.error('Error removing item from localStorage:', e);
      }
    });
    
    // Safely delete the Authorization header
    try {
      if (api && api.defaults && api.defaults.headers && api.defaults.headers.common) {
        delete api.defaults.headers.common['Authorization'];
      } else if (api && api.defaults) {
        // If headers.common doesn't exist, ensure it's an empty object
        api.defaults.headers = api.defaults.headers || {};
        api.defaults.headers.common = api.defaults.headers.common || {};
        delete api.defaults.headers.common['Authorization'];
      }
    } catch (e) {
      console.error('Error clearing Authorization header:', e);
    }
  },
  
  isAuthenticated() {
    return !!this.getAccessToken();
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
