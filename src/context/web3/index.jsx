import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const Web3Context = createContext();

const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
};

const Web3Provider = ({ children }) => {
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState(null);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const checkMetaMask = async () => {
      try {
        // Check if window and ethereum are available
        if (typeof window === "undefined" || !window.ethereum) {
          setIsMetaMaskInstalled(false);
          setError("MetaMask is not installed");
          setIsInitialized(true);
          return;
        }

        // Check if it's actually MetaMask
        if (!window.ethereum.isMetaMask) {
          setIsMetaMaskInstalled(false);
          setError("MetaMask is not installed");
          setIsInitialized(true);
          return;
        }

        setIsMetaMaskInstalled(true);
        setError(null);

        // Check if already connected
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setIsConnected(true);
          }
        } catch (err) {
          console.warn("Error checking accounts:", err);
        }

        // Listen for account changes
        window.ethereum.on("accountsChanged", (accounts) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setIsConnected(true);
          } else {
            setAccount(null);
            setIsConnected(false);
          }
        });

        // Listen for chain changes
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        // Listen for disconnect
        window.ethereum.on("disconnect", () => {
          setAccount(null);
          setIsConnected(false);
        });

      } catch (err) {
        console.error("Error checking MetaMask:", err);
        setError(err.message);
      } finally {
        setIsInitialized(true);
      }
    };

    checkMetaMask();

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners();
      }
    };
  }, []);

  const connectWallet = async () => {
    try {
      if (!isMetaMaskInstalled) {
        throw new Error("MetaMask is not installed");
      }

      if (!window.ethereum.isMetaMask) {
        throw new Error("MetaMask is not installed");
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
        setError(null);
      }
    } catch (err) {
      console.error("Error connecting wallet:", err);
      setError(err.message);
      throw err;
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
  };

  const value = {
    isMetaMaskInstalled,
    isConnected,
    account,
    error,
    isInitialized,
    connectWallet,
    disconnectWallet,
  };

  // Don't render children until initialized
  if (!isInitialized) {
    return null;
  }

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

Web3Provider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { useWeb3, Web3Provider }; 