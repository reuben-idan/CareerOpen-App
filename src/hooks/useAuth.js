import { useAuthStore } from '../stores/authStore';

/**
 * Custom hook that provides authentication state and methods
 * @returns {Object} Auth methods and state
 */
const useAuth = () => {
  const {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    checkAuth,
    refreshToken,
  } = useAuthStore();

  /**
   * Login with email/username and password
   * @param {string} username - User's username or email
   * @param {string} password - User's password
   * @returns {Promise<{success: boolean, error?: string}>} Login result
   */
  const signIn = async (username, password) => {
    return await login({ username, password });
  };

  /**
   * Sign up a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<{success: boolean, error?: string}>} Signup result
   */
  const signUp = async (userData) => {
    // TODO: Implement signup logic when the endpoint is available
    console.log('Signup not implemented yet', userData);
    return { success: false, error: 'Signup not implemented yet' };
  };

  /**
   * Sign out the current user
   */
  const signOut = () => {
    logout();
  };

  /**
   * Update user profile
   * @param {Object} profileData - Updated profile data
   * @returns {Promise<{success: boolean, error?: string}>} Update result
   */
  const updateProfile = async (profileData) => {
    // TODO: Implement profile update when the endpoint is available
    console.log('Profile update not implemented yet', profileData);
    return { success: false, error: 'Profile update not implemented yet' };
  };

  return {
    // Auth state
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    error,
    
    // Auth methods
    login: signIn,
    signIn,
    signUp,
    logout: signOut,
    signOut,
    checkAuth,
    refreshToken,
    
    // Profile methods (stubs for now)
    updateUser: updateProfile,
    updateProfile,
    
    // For compatibility with existing code
    isInitializing: isLoading && !user,
    isProfileLoading: false,
  };
};

export default useAuth;
