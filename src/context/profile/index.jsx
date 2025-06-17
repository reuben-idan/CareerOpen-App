import React, { createContext, useContext, useState, useCallback } from "react";
import { useUser } from "../auth";
import { db } from "../../config/firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
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
  const createInitialProfile = (userId, initialData = {}) => {
    return {
      name: initialData.name || user?.displayName || "Anonymous User",
      email: initialData.email || user?.email || "",
      title: initialData.title || "No title provided",
      bio: initialData.bio || "",
      location: initialData.location || "",
      avatar: initialData.avatar || user?.photoURL || null,
      stats: {
        connections: 0,
        profileViews: 0,
        posts: 0,
        likes: 0,
      },
      skills: initialData.skills || [],
      experience: initialData.experience || [],
      education: initialData.education || [],
      certifications: initialData.certifications || [],
      languages: initialData.languages || [],
      activities: initialData.activities || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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

      // Fetch from database
      const profileRef = doc(db, "profiles", userId);
      const profileSnap = await getDoc(profileRef);

      if (profileSnap.exists()) {
        const profileData = {
          id: profileSnap.id,
          ...profileSnap.data(),
        };
        setProfile(profileData);
        localStorage.setItem(`profile_${userId}`, JSON.stringify(profileData));
      } else {
        // Create a new profile if it doesn't exist
        const newProfile = {
          id: userId,
          name: "",
          title: "",
          bio: "",
          location: "",
          email: "",
          phone: "",
          website: "",
          skills: [],
          experience: [],
          education: [],
          photoURL: "",
          coverPhoto: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        await setDoc(profileRef, newProfile);
        setProfile(newProfile);
        localStorage.setItem(`profile_${userId}`, JSON.stringify(newProfile));
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(
    async (updatedData) => {
      if (!profile?.id) {
        throw new Error("No profile to update");
      }

      setLoading(true);
      setError(null);

      try {
        const profileRef = doc(db, "profiles", profile.id);
        const updateData = {
          ...updatedData,
          updatedAt: new Date().toISOString(),
        };

        // Update in database
        await updateDoc(profileRef, updateData);

        // Update local state
        const updatedProfile = {
          ...profile,
          ...updateData,
        };
        setProfile(updatedProfile);

        // Update cache
        localStorage.setItem(
          `profile_${profile.id}`,
          JSON.stringify(updatedProfile)
        );

        return updatedProfile;
      } catch (err) {
        console.error("Error updating profile:", err);
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [profile]
  );

  const value = {
    profile,
    loading,
    error,
    fetchProfileById,
    updateProfile,
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
