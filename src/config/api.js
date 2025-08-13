/**
 * API Configuration
 * 
 * This file contains all the API endpoint configurations for the application.
 * All endpoints should be defined here for consistency and easy maintenance.
 */

// Hardcode the API base URL to ensure it's always correct
const API_BASE_URL = 'http://localhost:8000/api/v1';

// Log the API base URL for debugging
console.log('[API] Using base URL:', API_BASE_URL);

const ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    // JWT Token endpoints
    LOGIN: '/token/',
    REFRESH: '/token/refresh/',
    VERIFY: '/token/verify/',
    
    // User endpoints
    REGISTER: '/auth/register/',
    ME: '/auth/me/',
    
    // Alias for token endpoint for backward compatibility
    TOKEN: '/token/',
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

/**
 * Helper function to build full URL for an endpoint
 * @param {string|function} endpoint - The endpoint path or a function that returns the path
 * @returns {string} The full URL
 */
const buildUrl = (endpoint) => {
  try {
    // Ensure API_BASE_URL is properly formatted
    let baseUrl = API_BASE_URL.trim();
    
    // Remove any trailing slashes
    baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    
    // If endpoint is a function, call it to get the path
    if (typeof endpoint === 'function') {
      endpoint = endpoint();
    }
    
    // If no endpoint is provided, just return the base URL
    if (!endpoint) return baseUrl;
    
    // Ensure endpoint is a string
    let path = String(endpoint).trim();
    
    // Remove any leading slashes from the endpoint
    path = path.startsWith('/') ? path.slice(1) : path;
    
    // Build the full URL
    const url = `${baseUrl}/${path}`;
    
    // Log for debugging (remove in production)
    if (import.meta.env.DEV) {
      console.log(`[API] Building URL: ${url}`);
    }
    
    return url;
  } catch (error) {
    console.error('[API] Error building URL:', error);
    throw new Error(`Failed to build API URL: ${error.message}`);
  }
};

export { API_BASE_URL, ENDPOINTS, buildUrl };
