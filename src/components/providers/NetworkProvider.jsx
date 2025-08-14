import React from 'react';
import { NetworkProvider as Provider } from '../../contexts/NetworkContext';
import useWebSocket from '../../hooks/useWebSocket';

/**
 * NetworkProvider component that wraps the application with network context and WebSocket connection
 */
const NetworkProvider = ({ children }) => {
  // Initialize WebSocket connection for real-time updates
  // Note: Replace with your actual WebSocket server URL
  const wsUrl = process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:8000/ws/notifications/';
  
  // Initialize WebSocket connection
  const { isConnected: isWsConnected } = useWebSocket(wsUrl);
  
  // Log WebSocket connection status (for debugging)
  React.useEffect(() => {
    console.log(`WebSocket ${isWsConnected ? 'connected' : 'disconnected'}`);
  }, [isWsConnected]);
  
  return (
    <Provider>
      {children}
    </Provider>
  );
};

export default NetworkProvider;
