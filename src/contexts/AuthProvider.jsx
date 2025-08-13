import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';

/**
 * AuthProvider component that initializes the auth state when the app loads.
 * This should be placed at the root of the app.
 */
const AuthProvider = ({ children }) => {
  const initialize = useAuthStore((state) => state.initialize);
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    // Initialize auth state from localStorage
    initialize();
    
    // Check if the current token is still valid
    checkAuth();
  }, [initialize, checkAuth]);

  return children;
};

export default AuthProvider;
