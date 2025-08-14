/**
 * API Configuration
 * 
 * This file contains all the API endpoint configurations for the application.
 * All endpoints should be defined here for consistency and easy maintenance.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

const ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/token/',
    REFRESH: '/token/refresh/',
  },
  
  // Job endpoints
  JOBS: {
    BASE: '/jobs/',
    FEATURED: '/jobs/featured/',
    CATEGORIES: '/jobs/categories/',
    APPLY: (jobId) => `/jobs/${jobId}/apply/`,
  },
  
  // Network endpoints
  NETWORK: {
    BASE: '/network/',
    CONNECTIONS: '/network/connections/',
    REQUESTS: '/network/requests/',
    RECOMMENDATIONS: '/network/recommendations/',
  },
  
  // User endpoints
  USERS: {
    PROFILE: '/users/me/',
    UPDATE_PROFILE: '/users/me/',
    CHANGE_PASSWORD: '/users/change-password/',
    RESET_PASSWORD: '/users/reset-password/',
  },
  
  // System endpoints
  SYSTEM: {
    HEALTH: '/health/',
    CONFIG: '/config/',
  },
};

// Helper function to build full URL for an endpoint
const buildUrl = (endpoint) => {
  // If endpoint is a function, call it with any provided arguments
  if (typeof endpoint === 'function') {
    return `${API_BASE_URL}${endpoint()}`;
  }
  return `${API_BASE_URL}${endpoint}`;
};

export { API_BASE_URL, ENDPOINTS, buildUrl };
