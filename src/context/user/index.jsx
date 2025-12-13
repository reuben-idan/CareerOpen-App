import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useUser } from '../auth';
import userService from '../../services/api/user';

const UserProfileContext = createContext();

export const UserProfileProvider = ({ children }) => {
  const { user } = useUser();
  const [profile, setProfile] = useState(null);
  const [preferences, setPreferences] = useState({
    theme: 'light',
    emailNotifications: true,
    pushNotifications: true,
    newsletter: false,
    language: 'en',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user profile when user changes
  const loadProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const profileData = await userService.getProfile(user.id);
      setProfile(profileData);
      
      // Load preferences if available
      if (profileData.preferences) {
        setPreferences(prev => ({
          ...prev,
          ...profileData.preferences
        }));
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
      setError('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Update profile function
  const updateProfile = async (updates) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const updatedProfile = await userService.updateProfile(user.id, updates);
      setProfile(prev => ({
        ...prev,
        ...updatedProfile
      }));
      return updatedProfile;
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError('Failed to update profile');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Update preferences function
  const updatePreferences = async (newPreferences) => {
    if (!user) return;
    
    try {
      const updatedPrefs = {
        ...preferences,
        ...newPreferences
      };
      
      await userService.updatePreferences(user.id, updatedPrefs);
      setPreferences(updatedPrefs);
      return updatedPrefs;
    } catch (err) {
      console.error('Failed to update preferences:', err);
      setError('Failed to update preferences');
      throw err;
    }
  };

  // Load profile when user changes
  useEffect(() => {
    loadProfile();
  }, [user, loadProfile]);

  // Context value
  const value = {
    profile,
    preferences,
    isLoading,
    error,
    updateProfile,
    updatePreferences,
    refreshProfile: loadProfile,
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
};

// Custom hook to use the user profile context
export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};

UserProfileProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UserProfileContext;
