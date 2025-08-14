import axios from 'axios';
import { ENDPOINTS, buildUrl } from '../../config/api';
import { useAuthStore } from '../../stores/authStore';

// Create axios instance with default config
const api = axios.create({
  baseURL: buildUrl(''),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url.includes(ENDPOINTS.AUTH.REFRESH)) {
        // If we get 401 on refresh, clear auth and redirect to login
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const refreshToken = useAuthStore.getState().refreshToken;
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        const response = await axios.post(
          buildUrl(ENDPOINTS.AUTH.REFRESH),
          { refresh: refreshToken }
        );
        
        const { access } = response.data;
        
        // Update the auth store with the new token
        useAuthStore.getState().setAccessToken(access);
        
        // Update the Authorization header
        originalRequest.headers.Authorization = `Bearer ${access}`;
        
        // Retry the original request
        return api(originalRequest);
      } catch (error) {
        // If refresh fails, clear auth and redirect to login
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

// API service methods
export const apiService = {
  // Auth
  login: (credentials) => api.post(ENDPOINTS.AUTH.LOGIN, credentials),
  refreshToken: (refreshToken) => api.post(ENDPOINTS.AUTH.REFRESH, { refresh: refreshToken }),
  
  // Jobs
  getJobs: (params = {}) => api.get(ENDPOINTS.JOBS.BASE, { params }),
  getJob: (id) => api.get(`${ENDPOINTS.JOBS.BASE}${id}/`),
  applyForJob: (jobId, data) => api.post(ENDPOINTS.JOBS.APPLY(jobId), data),
  
  // Network
  getNetworkData: () => api.get(ENDPOINTS.NETWORK.BASE),
  getConnections: () => api.get(ENDPOINTS.NETWORK.CONNECTIONS),
  getConnectionRequests: () => api.get(ENDPOINTS.NETWORK.REQUESTS),
  
  // User
  getProfile: () => api.get(ENDPOINTS.USERS.PROFILE),
  updateProfile: (data) => api.patch(ENDPOINTS.USERS.UPDATE_PROFILE, data),
  
  // System
  healthCheck: () => api.get(ENDPOINTS.SYSTEM.HEALTH),
};

export default apiService;
