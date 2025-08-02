import { useUser } from "../context/auth";
import { useUserProfile } from "../context/user";

/**
 * Custom hook that combines authentication and user profile functionality
 * @returns {Object} Combined auth and profile methods and state
 */
const useAuth = () => {
  const auth = useUser();
  const profile = useUserProfile();

  return {
    // Auth state
    user: auth.user,
    isLoading: auth.isLoading || profile.isLoading,
    error: auth.error || profile.error,
    
    // Auth methods
    signUp: auth.signUp,
    signIn: auth.signIn,
    signOut: auth.signOut,
    updateUser: auth.updateUser,
    
    // Profile state
    profile: profile.profile,
    preferences: profile.preferences,
    
    // Profile methods
    updateProfile: profile.updateProfile,
    updatePreferences: profile.updatePreferences,
    refreshProfile: profile.refreshProfile,
    
    // Combined loading state
    isInitializing: auth.isLoading && !auth.user,
    isProfileLoading: profile.isLoading,
  };
};

export default useAuth;
