import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../../firebaseConfig"; // Import Firebase auth
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import PropTypes from "prop-types";

// Create a Context for the user data
const UserContext = createContext();

// UserContext provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // User state initialized as null
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    // Set up the Firebase onAuthStateChanged listener
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser); // Set Firebase user data
      } else {
        setUser(null); // No user, set null
      }
      setIsLoading(false); // Set loading to false after checking authentication
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  // Sign up new user
  const signUp = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user; // Return user data from Firebase
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    }
  };

  // Sign in user
  const signIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user; // Return user data from Firebase
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  // Sign out user
  const signOutUser = async () => {
    try {
      await signOut(auth);
      setUser(null); // Clear user state after signing out
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        signUp,
        signIn,
        signOutUser,
        isLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context in any component
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// PropTypes validation for UserProvider
UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
