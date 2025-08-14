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

// Error boundary for the entire app
const AppErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);
  const [errorInfo, setErrorInfo] = useState(null);

  useEffect(() => {
    // Log any uncaught errors
    const handleError = (event) => {
      console.error('Uncaught error:', event.error);
      setHasError(true);
      setError(event.error);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h2>Something went wrong</h2>
        <p>We're sorry for the inconvenience. The application has encountered an unexpected error.</p>
        {error && (
          <details style={{ marginTop: '10px', whiteSpace: 'pre-wrap' }}>
            <summary>Error details</summary>
            <div style={{ color: 'red' }}>{error.toString()}</div>
            {errorInfo?.componentStack && (
              <pre style={{ overflowX: 'auto' }}>{errorInfo.componentStack}</pre>
            )}
          </details>
        )}
        <button 
          onClick={() => window.location.reload()}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Reload App
        </button>
      </div>
    );
  }

  return children;
};

// Render the app with error boundaries
try {
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <AppErrorBoundary>
        <UserProvider>
          <ProfileProvider>
            <App />
          </ProfileProvider>
        </UserProvider>
      </AppErrorBoundary>
    </StrictMode>
  );
} catch (error) {
  console.error('Failed to render app:', error);
  
  // Attempt to show error in the UI
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif; color: #721c24; background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px; margin: 20px;">
        <h2>Application Error</h2>
        <p>Failed to initialize the application. Please check the console for more details.</p>
        <p>${error.message || 'Unknown error occurred'}</p>
        <button onclick="window.location.reload()" style="margin-top: 10px; padding: 8px 16px; background-color: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Reload Page
        </button>
      </div>
    `;
  }
}
