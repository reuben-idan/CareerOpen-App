import { create } from 'zustand';
import { apiService } from '../services/api/apiService';

// Helper function to get stored auth data from localStorage
const getStoredAuth = () => {
  if (typeof window === 'undefined') return null;
  
  const stored = localStorage.getItem('auth');
  if (!stored) return null;
  
  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error parsing stored auth data:', error);
    return null;
  }
};

// Create the auth store
const useAuthStore = create((set, get) => ({
  // Initial state
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  // Initialize from localStorage
  initialize: () => {
    const stored = getStoredAuth();
    if (stored) {
      set({
        user: stored.user,
        accessToken: stored.accessToken,
        refreshToken: stored.refreshToken,
        isAuthenticated: !!stored.accessToken,
      });
    }
  },
  
  // Login action
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await apiService.login(credentials);
      const { access, refresh, user } = response.data;
      
      // Update state
      set({
        user,
        accessToken: access,
        refreshToken: refresh,
        isAuthenticated: true,
        isLoading: false,
      });
      
      // Save to localStorage
      localStorage.setItem('auth', JSON.stringify({
        user,
        accessToken: access,
        refreshToken: refresh,
      }));
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Login failed';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },
  
  // Logout action
  logout: () => {
    // Clear state
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });
    
    // Clear localStorage
    localStorage.removeItem('auth');
  },
  
  // Set access token (used by the interceptor)
  setAccessToken: (token) => {
    set({ accessToken: token });
    
    // Update localStorage
    const stored = getStoredAuth();
    if (stored) {
      stored.accessToken = token;
      localStorage.setItem('auth', JSON.stringify(stored));
    }
  },
  
  // Check if the user is authenticated
  checkAuth: async () => {
    const { accessToken } = get();
    if (!accessToken) return false;
    
    try {
      // Try to fetch the user's profile to verify the token
      await apiService.getProfile();
      return true;
    } catch (error) {
      // If the token is invalid, log the user out
      if (error.response?.status === 401) {
        get().logout();
      }
      return false;
    }
  },
}));

export { useAuthStore };
