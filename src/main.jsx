import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { UserProvider } from "./context/auth";
import { ProfileProvider } from "./context/profile";

// MetaMask/Ethereum provider check (prevents connectChrome error if MetaMask is not installed)
if (typeof window !== "undefined" && !window.ethereum) {
  window.ethereum = undefined;
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    console.info("MetaMask is not installed. Some web3 features may not work.");
  }
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <ProfileProvider>
        <App />
      </ProfileProvider>
    </UserProvider>
  </StrictMode>
);
