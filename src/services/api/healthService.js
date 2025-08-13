import apiService from './apiService';

/**
 * Performs a health check of the backend API
 * @returns {Promise<Object>} A promise that resolves to the health check data
 */
export const checkHealth = async () => {
  try {
    const response = await apiService.get('/health/');
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      ...response.data
    };
  } catch (error) {
    console.error('Health check failed:', error);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: {
          status: error.response.status,
          statusText: error.response.statusText,
          message: error.response.data?.detail || 'API is not responding as expected',
        }
      };
    } else if (error.request) {
      // The request was made but no response was received
      return {
        status: 'unreachable',
        timestamp: new Date().toISOString(),
        error: {
          message: 'Unable to reach the API server. Please check your network connection.',
        }
      };
    } else {
      // Something happened in setting up the request that triggered an Error
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: {
          message: error.message || 'An unexpected error occurred',
        }
      };
    }
  }
};

/**
 * Monitors the health of the backend API at regular intervals
 * @param {Function} onStatusChange - Callback function called when health status changes
 * @param {number} [interval=30000] - Health check interval in milliseconds (default: 30 seconds)
 * @returns {Function} A function to stop the health monitoring
 */
export const monitorHealth = (onStatusChange, interval = 30000) => {
  let lastStatus = null;
  
  const checkAndNotify = async () => {
    const health = await checkHealth();
    
    // Only notify if the status has changed
    if (JSON.stringify(health) !== JSON.stringify(lastStatus)) {
      onStatusChange(health);
      lastStatus = health;
    }
  };
  
  // Initial check
  checkAndNotify();
  
  // Set up interval for periodic checks
  const healthCheckInterval = setInterval(checkAndNotify, interval);
  
  // Return a function to stop monitoring
  return () => clearInterval(healthCheckInterval);
};

/**
 * Checks if the API is currently available
 * @returns {Promise<boolean>} A promise that resolves to true if the API is available
 */
export const isApiAvailable = async () => {
  try {
    const response = await apiService.get('/health/', { 
      timeout: 5000, // 5 second timeout
      validateStatus: status => status < 500 // Consider any status < 500 as success
    });
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

export default {
  checkHealth,
  monitorHealth,
  isApiAvailable,
};
