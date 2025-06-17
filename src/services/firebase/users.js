import { db } from "../../config/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

/**
 * Creates a new user profile in Firestore
 * @param {string} userId - The user's unique ID
 * @param {Object} userData - The user's profile data
 * @returns {Promise<void>}
 */
export const createUserProfile = async (userId, userData) => {
  try {
    const profileRef = doc(db, "profiles", userId);
    const profileSnap = await getDoc(profileRef);
    if (!profileSnap.exists()) {
      // Try to migrate from 'users' collection if exists
      const oldUserRef = doc(db, "users", userId);
      const oldUserSnap = await getDoc(oldUserRef);
      let dataToSave = { ...userData };
      if (oldUserSnap.exists()) {
        dataToSave = { ...oldUserSnap.data(), ...userData };
      }
      await setDoc(profileRef, {
        ...dataToSave,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } else {
      // Profile already exists, just update
      await setDoc(
        profileRef,
        {
          ...userData,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    }
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
};

/**
 * Updates an existing user profile in Firestore
 * @param {string} userId - The user's unique ID
 * @param {Object} userData - The updated user profile data
 * @returns {Promise<void>}
 */
export const updateUserProfile = async (userId, userData) => {
  try {
    const userRef = doc(db, "profiles", userId); // Save to 'profiles' collection
    await setDoc(
      userRef,
      {
        ...userData,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

/**
 * Gets a user profile from Firestore
 * @param {string} userId - The user's unique ID
 * @returns {Promise<Object>} The user's profile data
 */
export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};
