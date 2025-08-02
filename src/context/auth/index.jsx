import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import authService from "../../services/api/auth";
import api from "../../services/api/api";

// Create a Context for the user data
const UserContext = createContext();

// UserContext provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // User state initialized as null
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Sign up new user
  const signUp = async (userData) => {
    try {
      const user = await authService.register(userData);
      // After successful registration, log the user in
      await signIn(userData.email, userData.password);
      return user;
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    }
  };

  // Sign in user
  const signIn = async (email, password) => {
    try {
      const user = await authService.login(email, password);
      setUser(user);
      return user;
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  // Sign out user
  const signOut = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        signUp,
        signIn,
        signOut,
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
