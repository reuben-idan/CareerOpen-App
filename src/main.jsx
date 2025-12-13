import React from "react";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import "./index.css";
import App from "./App.jsx";
import { UserProvider } from "./context/auth";
import { ProfileProvider } from "./context/profile";

// MetaMask/Ethereum provider check
const initializeWeb3 = () => {
  try {
    if (typeof window !== "undefined") {
      // Check if MetaMask is installed
      if (window.ethereum && window.ethereum.isMetaMask) {
        // MetaMask is installed
        return true;
      } else {
        // MetaMask is not installed
        window.ethereum = undefined;
        // Only show warning in development
        if (process.env.NODE_ENV === "development") {
          console.info(
            "MetaMask is not installed. Web3 features are optional and not required for core functionality."
          );
        }
        return false;
      }
    }
  } catch (error) {
    console.warn("Error initializing Web3:", error);
    return false;
  }
  return false;
};

// Initialize Web3
initializeWeb3();

// Render the app
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <ProfileProvider>
        <App />
      </ProfileProvider>
    </UserProvider>
  </StrictMode>
);
