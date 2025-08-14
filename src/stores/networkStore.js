import { create } from 'zustand';
import { 
  fetchNetworkData, 
  sendConnectionRequest, 
  acceptConnectionRequest, 
  declineConnectionRequest, 
  removeConnection, 
  searchUsers 
} from '../services/api/networkService';

// Helper function to parse pagination from response headers
const parsePagination = (headers) => {
  const pagination = {
    count: 0,
    next: null,
    previous: null,
    totalPages: 1,
    currentPage: 1,
  };

  try {
    if (headers['x-pagination']) {
      const paginationData = JSON.parse(headers['x-pagination']);
      return {
        count: paginationData.count || 0,
        next: paginationData.next || null,
        previous: paginationData.previous || null,
        totalPages: paginationData.total_pages || 1,
        currentPage: paginationData.current_page || 1,
      };
    }
  } catch (error) {
    console.error('Error parsing pagination:', error);
  }

  return pagination;
};

const useNetworkStore = create((set, get) => ({
  // Network data state
  connections: [],
  pendingRequests: [],
  suggestions: [],
  searchResults: [],
  isLoading: false,
  isSearching: false,
  error: null,
  
  // Pagination state
  pagination: {
    count: 0,
    next: null,
    previous: null,
    totalPages: 1,
    currentPage: 1,
  },
  
  // Getters
  get currentPage() {
    return get().pagination.currentPage;
  },
  
  get totalPages() {
    return get().pagination.totalPages;
  },
  
  get totalCount() {
    return get().pagination.count;
  },
  
  /**
   * Fetches network data including connections and pending requests
   * @param {Object} [filters] - Optional filters for the network data
   */
  fetchNetworkData: async (filters = {}) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetchNetworkData(filters);
      const pagination = parsePagination(response.headers);
      
      // The API should return an object with connections, pending_requests, and suggestions
      const { connections = [], pending_requests = [], suggestions = [] } = response.data;
      
      set({ 
        connections,
        pendingRequests: pending_requests,
        suggestions,
        pagination: {
          ...pagination,
          count: response.data.count || connections.length,
          totalPages: Math.ceil((response.data.count || connections.length) / (filters.page_size || 10)),
          currentPage: parseInt(filters.page || 1, 10),
        },
        isLoading: false 
      });
      
      return response.data;
    } catch (error) {
      const errorMessage = error.message || 'Failed to fetch network data';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },
  
  /**
   * Searches for users to connect with
   * @param {string} query - The search query
   * @param {Object} [params] - Additional search parameters
   */
  searchUsers: async (query, params = {}) => {
    if (!query) {
      set({ searchResults: [], isSearching: false });
      return [];
    }
    
    set({ isSearching: true, error: null });
    
    try {
      const results = await searchUsers(query, params);
      set({ searchResults: results, isSearching: false });
      return results;
    } catch (error) {
      const errorMessage = error.message || 'Failed to search users';
      set({ error: errorMessage, isSearching: false, searchResults: [] });
      throw error;
    }
  },
  
  /**
   * Sends a connection request to another user
   * @param {string|number} userId - The ID of the user to connect with
   */
  sendConnectionRequest: async (userId) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await sendConnectionRequest(userId);
      
      // Update the suggestions list by removing the user we just sent a request to
      set(state => ({
        suggestions: state.suggestions.filter(user => user.id !== userId),
        isLoading: false
      }));
      
      return result;
    } catch (error) {
      const errorMessage = error.message || 'Failed to send connection request';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },
  
  /**
   * Accepts a pending connection request
   * @param {string|number} requestId - The ID of the connection request to accept
   */
  acceptConnectionRequest: async (requestId) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await acceptConnectionRequest(requestId);
      
      // Update the pending requests and connections lists
      set(state => ({
        pendingRequests: state.pendingRequests.filter(req => req.id !== requestId),
        connections: [...state.connections, result],
        isLoading: false
      }));
      
      return result;
    } catch (error) {
      const errorMessage = error.message || 'Failed to accept connection request';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },
  
  /**
   * Declines a pending connection request
   * @param {string|number} requestId - The ID of the connection request to decline
   */
  declineConnectionRequest: async (requestId) => {
    set({ isLoading: true, error: null });
    
    try {
      await declineConnectionRequest(requestId);
      
      // Update the pending requests list
      set(state => ({
        pendingRequests: state.pendingRequests.filter(req => req.id !== requestId),
        isLoading: false
      }));
      
      return true;
    } catch (error) {
      const errorMessage = error.message || 'Failed to decline connection request';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },
  
  /**
   * Removes a connection
   * @param {string|number} connectionId - The ID of the connection to remove
   */
  removeConnection: async (connectionId) => {
    set({ isLoading: true, error: null });
    
    try {
      await removeConnection(connectionId);
      
      // Update the connections list
      set(state => ({
        connections: state.connections.filter(conn => conn.id !== connectionId),
        isLoading: false
      }));
      
      return true;
    } catch (error) {
      const errorMessage = error.message || 'Failed to remove connection';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },
  
  /**
   * Clears the network store state
   */
  clear: () => set({ 
    connections: [],
    pendingRequests: [],
    suggestions: [],
    searchResults: [],
    error: null,
    pagination: {
      count: 0,
      next: null,
      previous: null,
      totalPages: 1,
      currentPage: 1,
    },
  }),
}));

export default useNetworkStore;
