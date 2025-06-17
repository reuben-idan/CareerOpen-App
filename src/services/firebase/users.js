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
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, {
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
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
    const userRef = doc(db, "users", userId);
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
