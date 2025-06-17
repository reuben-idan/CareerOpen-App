import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "../auth";
import { db } from "../../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfileById = async (userId) => {
    if (!userId) {
      setError("No user ID provided");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const profileRef = doc(db, "profiles", userId);
      const profileSnap = await getDoc(profileRef);
      console.log(
        "[Profile Fetch] userId:",
        userId,
        "exists:",
        profileSnap.exists(),
        profileSnap.data()
      );
      if (!profileSnap.exists()) {
        setProfile(null);
        setError("Profile not found");
      } else {
        setProfile({ id: profileSnap.id, ...profileSnap.data() });
        setError(null);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err.message);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    if (!user) {
      throw new Error("No user logged in");
    }

    try {
      const profileRef = doc(db, "profiles", user.uid);
      await updateDoc(profileRef, updates);
      setProfile((prev) => ({ ...prev, ...updates }));
    } catch (err) {
      console.error("Error updating profile:", err);
      throw err;
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfileById(user.uid);
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const value = {
    profile,
    loading,
    error,
    updateProfile,
    fetchProfileById,
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};

ProfileProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { useProfile, ProfileProvider };
