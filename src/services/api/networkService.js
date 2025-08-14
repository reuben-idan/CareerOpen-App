import { apiService } from './apiService';

/**
 * Fetches network data including connections, pending requests, and suggestions
 * @param {Object} [params] - Query parameters for filtering/sorting
 * @param {number} [params.page] - Page number for pagination
 * @param {number} [params.page_size] - Number of items per page
 * @returns {Promise<Object>} A promise that resolves to the network data
 */
export const fetchNetworkData = async (params = {}) => {
  try {
    // Set default pagination if not provided
    const page = params.page || 1;
    const pageSize = params.page_size || 10;
    
    // Prepare query parameters
    const queryParams = {
      ...params,
      page,
      page_size: pageSize,
    };
    
    // Remove undefined or null values
    Object.keys(queryParams).forEach(key => 
      (queryParams[key] === undefined || queryParams[key] === '') && delete queryParams[key]
    );
    
    const response = await apiService.get('/network/', { 
      params: queryParams,
      _fullResponse: true // Include full response for pagination headers
    });
    
    // Return both data and headers for pagination
    return {
      data: response.data,
      headers: response.headers,
      status: response.status
    };
  } catch (error) {
    console.error('Error fetching network data:', error);
    
    // Enhanced error handling
    if (error.response) {
      const errorMessage = error.response.data?.detail || 
                         error.response.data?.message || 
                         'Failed to fetch network data';
      const customError = new Error(errorMessage);
      customError.response = error.response;
      throw customError;
    } else if (error.request) {
      throw new Error('No response received from the server. Please check your network connection.');
    } else {
      throw new Error(`Request failed: ${error.message}`);
    }
  }
};

/**
 * Sends a connection request to another user
 * @param {string|number} userId - The ID of the user to connect with
 * @returns {Promise<Object>} A promise that resolves to the connection request data
 */
export const sendConnectionRequest = async (userId) => {
  if (!userId) {
    throw new Error('User ID is required to send a connection request');
  }
  
  try {
    const response = await apiService.post('/network/connections/request/', { user_id: userId });
    return response.data;
  } catch (error) {
    console.error('Error sending connection request:', error);
    
    if (error.response) {
      const errorMessage = error.response.data?.detail || 
                         Object.values(error.response.data || {}).flat().join('\n') ||
                         'Failed to send connection request';
      const apiError = new Error(errorMessage);
      apiError.response = error.response;
      throw apiError;
    }
    
    throw error;
  }
};

/**
 * Accepts a pending connection request
 * @param {string|number} requestId - The ID of the connection request to accept
 * @returns {Promise<Object>} A promise that resolves to the accepted connection data
 */
export const acceptConnectionRequest = async (requestId) => {
  if (!requestId) {
    throw new Error('Request ID is required to accept a connection');
  }
  
  try {
    const response = await apiService.post(`/network/connections/${requestId}/accept/`);
    return response.data;
  } catch (error) {
    console.error('Error accepting connection request:', error);
    
    if (error.response) {
      const errorMessage = error.response.data?.detail || 
                         Object.values(error.response.data || {}).flat().join('\n') ||
                         'Failed to accept connection request';
      const apiError = new Error(errorMessage);
      apiError.response = error.response;
      throw apiError;
    }
    
    throw error;
  }
};

/**
 * Declines a pending connection request
 * @param {string|number} requestId - The ID of the connection request to decline
 * @returns {Promise<Object>} A promise that resolves when the request is declined
 */
export const declineConnectionRequest = async (requestId) => {
  if (!requestId) {
    throw new Error('Request ID is required to decline a connection');
  }
  
  try {
    const response = await apiService.post(`/network/connections/${requestId}/decline/`);
    return response.data;
  } catch (error) {
    console.error('Error declining connection request:', error);
    
    if (error.response) {
      const errorMessage = error.response.data?.detail || 
                         Object.values(error.response.data || {}).flat().join('\n') ||
                         'Failed to decline connection request';
      const apiError = new Error(errorMessage);
      apiError.response = error.response;
      throw apiError;
    }
    
    throw error;
  }
};

/**
 * Removes a connection
 * @param {string|number} connectionId - The ID of the connection to remove
 * @returns {Promise<Object>} A promise that resolves when the connection is removed
 */
export const removeConnection = async (connectionId) => {
  if (!connectionId) {
    throw new Error('Connection ID is required to remove a connection');
  }
  
  try {
    const response = await apiService.delete(`/network/connections/${connectionId}/`);
    return response.data;
  } catch (error) {
    console.error('Error removing connection:', error);
    
    if (error.response) {
      const errorMessage = error.response.data?.detail || 
                         Object.values(error.response.data || {}).flat().join('\n') ||
                         'Failed to remove connection';
      const apiError = new Error(errorMessage);
      apiError.response = error.response;
      throw apiError;
    }
    
    throw error;
  }
};

/**
 * Searches for users to connect with
 * @param {string} query - The search query
 * @param {Object} [params] - Additional query parameters
 * @returns {Promise<Array>} A promise that resolves to an array of user search results
 */
export const searchUsers = async (query, params = {}) => {
  if (!query) {
    throw new Error('Search query is required');
  }
  
  try {
    const response = await apiService.get('/network/search/', {
      params: {
        q: query,
        ...params
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error searching users:', error);
    
    if (error.response) {
      const errorMessage = error.response.data?.detail || 
                         'Failed to search users';
      const apiError = new Error(errorMessage);
      apiError.response = error.response;
      throw apiError;
    }
    
    throw error;
  }
};

export default {
  fetchNetworkData,
  sendConnectionRequest,
  acceptConnectionRequest,
  declineConnectionRequest,
  removeConnection,
  searchUsers,
};
