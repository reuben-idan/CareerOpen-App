import { useEffect, useRef, useCallback } from 'react';
import useAuth from './useAuth';
import { useNetwork } from '../contexts/NetworkContext';

/**
 * Custom hook for managing WebSocket connections for real-time updates
 * @param {string} url - WebSocket server URL
 * @returns {Object} - WebSocket connection status and methods
 */
const useWebSocket = (url) => {
  const { user } = useAuth();
  const { refreshNotifications, refreshConversations, refreshConnections } = useNetwork();
  const ws = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectInterval = 5000; // 5 seconds

  // Handle incoming WebSocket messages
  const handleMessage = useCallback((event) => {
    try {
      const data = JSON.parse(event.data);
      
      // Handle different types of real-time updates
      switch (data.type) {
        case 'NEW_MESSAGE':
          console.log('New message received:', data.payload);
          refreshConversations();
          break;
          
        case 'MESSAGE_READ':
          console.log('Message read update:', data.payload);
          refreshConversations();
          break;
          
        case 'NEW_NOTIFICATION':
          console.log('New notification:', data.payload);
          refreshNotifications();
          break;
          
        case 'CONNECTION_REQUEST':
          console.log('New connection request:', data.payload);
          refreshConnections();
          refreshNotifications();
          break;
          
        case 'CONNECTION_ACCEPTED':
          console.log('Connection accepted:', data.payload);
          refreshConnections();
          refreshNotifications();
          break;
          
        default:
          console.log('Unknown message type:', data.type, data);
      }
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  }, [refreshConnections, refreshConversations, refreshNotifications]);

  // Handle WebSocket errors
  const handleError = useCallback((error) => {
    console.error('WebSocket error:', error);
  }, []);

  // Handle WebSocket close event
  const handleClose = useCallback((event) => {
    console.log('WebSocket disconnected:', event.code, event.reason);
    
    // Attempt to reconnect if we haven't exceeded max attempts
    if (reconnectAttempts.current < maxReconnectAttempts) {
      reconnectAttempts.current += 1;
      console.log(`Attempting to reconnect (${reconnectAttempts.current}/${maxReconnectAttempts})...`);
      
      setTimeout(() => {
        connect();
      }, reconnectInterval * reconnectAttempts.current); // Exponential backoff
    } else {
      console.error('Max reconnection attempts reached');
    }
  }, []);

  // Connect to WebSocket server
  const connect = useCallback(() => {
    if (!user?.token) {
      console.log('No auth token available, waiting for authentication...');
      return;
    }

    try {
      // Close existing connection if any
      if (ws.current) {
        ws.current.close();
      }

      // Create new WebSocket connection with auth token
      const wsUrl = new URL(url);
      wsUrl.searchParams.append('token', user.token);
      
      ws.current = new WebSocket(wsUrl.toString());
      
      // Set up event listeners
      ws.current.onopen = () => {
        console.log('WebSocket connected');
        reconnectAttempts.current = 0; // Reset reconnect attempts on successful connection
      };
      
      ws.current.onmessage = handleMessage;
      ws.current.onerror = handleError;
      ws.current.onclose = handleClose;
      
    } catch (error) {
      console.error('WebSocket connection error:', error);
    }
  }, [url, user?.token, handleMessage, handleError, handleClose]);

  // Disconnect WebSocket
  const disconnect = useCallback(() => {
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
  }, []);

  // Set up WebSocket connection on mount and clean up on unmount
  useEffect(() => {
    if (user?.token) {
      connect();
    }
    
    return () => {
      disconnect();
    };
  }, [user?.token, connect, disconnect]);

  // Reconnect if token changes
  useEffect(() => {
    if (user?.token) {
      connect();
    }
  }, [user?.token, connect]);

  // Send message through WebSocket
  const sendMessage = useCallback((message) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
      return true;
    }
    console.error('WebSocket is not connected');
    return false;
  }, []);

  return {
    isConnected: ws.current?.readyState === WebSocket.OPEN,
    sendMessage,
    reconnect: connect,
    disconnect,
  };
};

export default useWebSocket;
