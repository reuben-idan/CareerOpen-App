import axios from 'axios';
import authService from './auth';

// Environment configuration (Vite uses import.meta.env instead of process.env)
const ENV = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  NODE_ENV: import.meta.env.MODE || 'development',
  IS_DEV: import.meta.env.DEV,
};

// Request timeout (in milliseconds)
const REQUEST_TIMEOUT = 15000;

// Create axios instance with default config
const api = axios.create({
  baseURL: ENV.API_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor for API calls
api.interceptors.request.use(
  async (config) => {
    // Add auth token to request if available
    const token = authService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (ENV.IS_DEV) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    if (ENV.IS_DEV) {
      console.error('[API] Request error:', error);
    }
    return Promise.reject(error);
  }
);

// Helper function to safely parse JSON
const safeJsonParse = (str) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    console.error('[API] Failed to parse JSON:', str);
    return str;
  }
};

// Enhanced error handling for API responses
const handleResponse = (response) => {
  // Log successful responses in development
  if (ENV.IS_DEV) {
    try {
      console.log(`[API] ${response?.config?.method?.toUpperCase() || 'UNKNOWN'} ${response?.config?.url || 'unknown-url'} - ${response?.status || 'no-status'}`, {
        data: response?.data,
      });
    } catch (logError) {
      console.error('[API] Error logging successful response:', logError);
    }
  }

  try {
    // Ensure we have valid JSON data if content-type is JSON
    if (response?.data && typeof response.data === 'string' && 
        response.headers?.['content-type']?.includes('application/json')) {
      response.data = safeJsonParse(response.data);
    }
    
    // Return response data directly for easier consumption
    return response?.data || {};
  } catch (parseError) {
    console.error('[API] Error processing response:', parseError);
    return response?.data || {};
  }
};

// Enhanced error handling for API errors
const handleError = async (error) => {
  // Create a safe error object with all necessary properties
  const safeError = {
    message: 'An unexpected error occurred',
    isNetworkError: false,
    isServerError: false,
    isAuthError: false,
    status: null,
    data: null,
    originalError: error
  };

  // Log error in development with safe property access
  if (ENV.IS_DEV) {
    try {
      console.error('[API] Response error:', {
        url: error?.config?.url || 'unknown-url',
        status: error?.response?.status || 'no-status',
        data: error?.response?.data || 'no-data',
        error: error?.message || 'unknown-error',
        stack: error?.stack
      });
    } catch (logError) {
      console.error('[API] Error logging error response:', logError);
    }
  }

  // Handle network errors (no response from server)
  if (!error.response) {
    safeError.isNetworkError = true;
    
    // Check for specific error conditions
    if (error.code === 'ECONNABORTED') {
      safeError.message = 'Request timeout. Please check your connection and try again.';
    } else if (error.message && error.message.includes('Network Error')) {
      safeError.message = 'Network error. Please check your internet connection.';
    } else if (error.message && error.message.includes('JSON')) {
      safeError.message = 'Invalid server response. Please try again.';
      safeError.isJsonError = true;
    } else {
      safeError.message = error.message || 'Unable to connect to the server. Please check your connection.';
    }
    
    const networkError = new Error(safeError.message);
    Object.assign(networkError, safeError);
    return Promise.reject(networkError);
  }

  // Handle HTTP errors (response with error status)
  const { status, data } = error.response;
  safeError.status = status;
  safeError.data = data;
  safeError.isServerError = status >= 500;
  safeError.isAuthError = status === 401 || status === 403;

  // Handle token expiration (401 Unauthorized)
  const originalRequest = error.config;
  if (status === 401 && originalRequest && !originalRequest._retry) {
    originalRequest._retry = true;

    try {
      // Try to refresh the token
      const newToken = await authService.refreshToken();
      
      // Retry the original request with the new token
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      // If refresh fails, clear auth and redirect to login
      authService.logout();
      
      // Only redirect if we're not already on the login page
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
      
      return Promise.reject(new Error('Your session has expired. Please log in again.'));
    }
  }

  // Handle other error statuses
  let errorMessage = 'An unexpected error occurred. Please try again.';
  
  if (status === 400 && data) {
    // Handle validation errors
    if (typeof data === 'object') {
      // Handle field-specific validation errors
      const fieldErrors = Object.entries(data)
        .filter(([_, value]) => Array.isArray(value) && value.length > 0)
        .map(([field, errors]) => `${field}: ${errors.join(', ')}`);
      
      if (fieldErrors.length > 0) {
        errorMessage = fieldErrors.join('\n');
      } else if (data.detail) {
        errorMessage = data.detail;
      }
    } else if (typeof data === 'string') {
      errorMessage = data;
    }
  } else if (status === 403) {
    errorMessage = data?.detail || 'You do not have permission to perform this action.';
  } else if (status === 404) {
    errorMessage = 'The requested resource was not found.';
  } else if (status >= 500) {
    errorMessage = 'A server error occurred. Please try again later.';
  }

  // Create a new error with a user-friendly message
  const apiError = new Error(errorMessage);
  apiError.status = status;
  apiError.data = data;
  
  return Promise.reject(apiError);
};

// Add response interceptor
api.interceptors.response.use(
  response => response,
  handleError
);

/**
 * Helper function to make API requests with better error handling
 * @param {string} method - HTTP method (get, post, put, delete, etc.)
 * @param {string} url - API endpoint URL
 * @param {Object} [data] - Request payload (for POST, PUT, PATCH)
 * @param {Object} [config] - Additional axios config
 * @returns {Promise<*>} API response data
 */
const request = async (method, url, data = null, config = {}) => {
  try {
    const response = await api({
      method,
      url,
      data,
      ...config,
    });
    return response;
  } catch (error) {
    // Error is already processed by the interceptor
    throw error;
  }
};

// Helper methods for common HTTP methods
const apiClient = {
  get: (url, params = {}, config = {}) => 
    request('get', url, null, { params, ...config }),
  
  post: (url, data = {}, config = {}) => 
    request('post', url, data, config),
  
  put: (url, data = {}, config = {}) => 
    request('put', url, data, config),
  
  patch: (url, data = {}, config = {}) => 
    request('patch', url, data, config),
  
  delete: (url, config = {}) => 
    request('delete', url, null, config),
  
  // File upload helper
  upload: (url, file, fieldName = 'file', data = {}, config = {}) => {
    const formData = new FormData();
    formData.append(fieldName, file);
    
    // Append additional data
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(item => formData.append(key, item));
      } else if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });
    
    return apiClient.post(url, formData, {
      ...config,
      headers: {
        ...config.headers,
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default apiClient;
