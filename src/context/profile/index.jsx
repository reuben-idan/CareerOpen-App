import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useUser } from "../auth";
import api from "../../services/api/api";
import storageService from "../../services/api/storage";
import PropTypes from "prop-types";

const ProfileContext = createContext();

const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};

const ProfileProvider = ({ children }) => {
  const { user } = useUser();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000; // 1 second

  // Create initial profile data
  const createInitialProfile = (initialData = {}) => {
    return {
      name: initialData.name || user?.name || "Anonymous User",
      email: initialData.email || user?.email || "",
      title: initialData.title || "No title provided",
      bio: initialData.bio || "",
      location: initialData.location || "",
      avatar: initialData.avatar || "",
      phone: initialData.phone || "",
      website: initialData.website || "",
      skills: initialData.skills || [],
      experience: initialData.experience || [],
      education: initialData.education || [],
      certifications: initialData.certifications || [],
      languages: initialData.languages || [],
      activities: initialData.activities || [],
      stats: {
        connections: initialData.stats?.connections || 0,
        profileViews: initialData.stats?.profileViews || 0,
        posts: initialData.stats?.posts || 0,
        likes: initialData.stats?.likes || 0,
      },
      createdAt: initialData.createdAt || new Date().toISOString(),
      updatedAt: initialData.updatedAt || new Date().toISOString(),
    };
  };

  const fetchProfileById = useCallback(async (userId) => {
    if (!userId) {
      setError("No user ID provided");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Check for cached data first
      const cachedData = localStorage.getItem(`profile_${userId}`);
      if (cachedData) {
        setProfile(JSON.parse(cachedData));
      }

      // Use /auth/me/ for the current user's profile instead of /auth/users/{id}/
      const response = await api.get('/auth/me/');
      
      if (response) {
        const profileData = createInitialProfile(response);
        setProfile(profileData);
        localStorage.setItem(`profile_${userId}`, JSON.stringify(profileData));
        return profileData;
      }
      
      // If no profile exists, we'll handle this case in the backend
      // by returning a 404, which will be caught below
      throw new Error('Profile not found');
      
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateProfile = useCallback(
    async (updatedData) => {
      if (!profile?.id) {
        throw new Error("No profile to update");
      }

      setLoading(true);
      setError(null);

      try {
        // Use the /auth/me/ endpoint for updating the current user's profile
        const response = await api.patch('/auth/me/', updatedData);
        const updatedProfile = createInitialProfile(response);
        setProfile(updatedProfile);
        localStorage.setItem(
          `profile_${user.id}`,
          JSON.stringify(updatedProfile)
        );
        return updatedProfile;
      } catch (err) {
        console.error("Error updating profile:", err);
        setError(err.response?.data?.message || err.message || 'Failed to update profile');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user?.id]
  );
  
  // Upload profile picture
  const uploadProfilePicture = useCallback(
    async (file) => {
      if (!profile?.id) {
        throw new Error("No profile to update");
      }
      
      setLoading(true);
      setError(null);
      
      try {
        // Upload the file using the storage service
        const { url, path } = await storageService.uploadProfilePicture(file, profile.id);
        
        // Update the profile with the new avatar URL
        return await updateProfile({ avatar: url });
      } catch (err) {
        console.error("Error uploading profile picture:", err);
        setError(err.response?.data?.message || err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [profile, updateProfile]
  );
  
  // Upload cover photo
  const uploadCoverPhoto = useCallback(
    async (file) => {
      if (!profile?.id) {
        throw new Error("No profile to update");
      }
      
      setLoading(true);
      setError(null);
      
      try {
        // Upload the file using the storage service
        const { url, path } = await storageService.uploadCoverPhoto(file, profile.id);
        
        // Update the profile with the new cover photo URL
        return await updateProfile({ coverPhoto: url });
      } catch (err) {
        console.error("Error uploading cover photo:", err);
        setError(err.response?.data?.message || err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [profile, updateProfile]
  );
  
  // Automatically fetch profile when user changes
  useEffect(() => {
    if (user?.id) {
      fetchProfileById(user.id);
    }
  }, [user?.id]);

  const value = {
    profile,
    loading,
    error,
    fetchProfileById,
    updateProfile,
    uploadProfilePicture,
    uploadCoverPhoto,
    retryCount,
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};

ProfileProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { useProfile, ProfileProvider };
