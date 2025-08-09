import axios from 'axios';
import { handleApiError } from '../../utils/apiErrorHandler';

const API_URL = 'http://localhost:8000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000, // 10 seconds timeout
});

// Add a request interceptor to include the auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request error before the request is sent
    const errorInfo = handleApiError(error);
    return Promise.reject(errorInfo);
  }
);

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => {
    // Any status code that lies within the range of 2xx causes this function to trigger
    return response.data;
  },
  (error) => {
    // Any status codes that fall outside the range of 2xx cause this function to trigger
    const errorInfo = handleApiError(error);
    
    // Handle specific status codes
    if (error.response?.status === 401) {
      // Handle unauthorized (e.g., token expired)
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      // Optionally redirect to login or refresh token
    }
    
    return Promise.reject(errorInfo);
  }
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => {
    // Ensure response data is properly parsed
    if (typeof response.data === 'string') {
      try {
        response.data = JSON.parse(response.data);
      } catch (e) {
        console.error('Failed to parse response data:', e);
      }
    }
    return response;
  },
  async (error) => {
    // Handle network errors
    if (!error.response) {
      const networkError = new Error('Network Error: Unable to connect to the server. Please check your internet connection.');
      networkError.isNetworkError = true;
      return Promise.reject(networkError);
    }

    const originalRequest = error.config;

    // If error is 401 and we haven't already tried to refresh the token
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          // No refresh token, clear auth and redirect to login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
          return Promise.reject(new Error('Session expired. Please log in again.'));
        }
        
        // Try to refresh the token
        const response = await axios.post(`${API_URL}/token/refresh/`, {
          refresh: refreshToken,
        }).catch(refreshError => {
          // If refresh fails, clear auth and redirect to login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
          return Promise.reject(new Error('Session expired. Please log in again.'));
        });
        
        const { access, refresh } = response.data;
        
        // Store new tokens
        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh || refreshToken);
        
        // Update the authorization header
        originalRequest.headers.Authorization = `Bearer ${access}`;
        
        // Retry the original request
        return api(originalRequest);
      } catch (error) {
        // If refresh fails, clear auth and redirect to login
        console.error('Failed to refresh token:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(new Error('Session expired. Please log in again.'));
      }
    }
    
    // Handle other errors
    const errorResponse = {
      status: error.response.status,
      statusText: error.response.statusText,
      data: safeJsonParse(error.response.data),
      headers: error.response.headers,
    };
    
    const errorMessage = error.response.data?.detail || 
                        error.response.data?.message || 
                        error.response.statusText ||
                        'An unexpected error occurred';
    
    const apiError = new Error(errorMessage);
    apiError.response = errorResponse;
    
    return Promise.reject(apiError);
  }
);

export default api;
