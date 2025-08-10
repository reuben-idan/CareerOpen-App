import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  getMyConnections, 
  getPendingConnections, 
  getMyFollowers, 
  getMyFollowing,
  getConversations,
  getNotifications,
  getUnreadNotificationCount
} from '../services/api/network';

const NetworkContext = createContext();

export const NetworkProvider = ({ children }) => {
  const [connections, setConnections] = useState([]);
  const [pendingConnections, setPendingConnections] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState({
    connections: false,
    pendingConnections: false,
    followers: false,
    following: false,
    conversations: false,
    notifications: false,
  });

  // Error state
  const [error, setError] = useState(null);

  // Load all network data
  const loadNetworkData = useCallback(async () => {
    try {
      setIsLoading(prev => ({ ...prev, connections: true, pendingConnections: true }));
      const [conns, pending] = await Promise.all([
        getMyConnections(),
        getPendingConnections(),
      ]);
      setConnections(conns);
      setPendingConnections(pending);
    } catch (err) {
      setError(err.message || 'Failed to load network data');
    } finally {
      setIsLoading(prev => ({ ...prev, connections: false, pendingConnections: false }));
    }
  }, []);

  // Load followers and following
  const loadFollowData = useCallback(async () => {
    try {
      setIsLoading(prev => ({ ...prev, followers: true, following: true }));
      const [followersData, followingData] = await Promise.all([
        getMyFollowers(),
        getMyFollowing(),
      ]);
      setFollowers(followersData);
      setFollowing(followingData);
    } catch (err) {
      setError(err.message || 'Failed to load follow data');
    } finally {
      setIsLoading(prev => ({ ...prev, followers: false, following: false }));
    }
  }, []);

  // Load conversations
  const loadConversations = useCallback(async () => {
    try {
      setIsLoading(prev => ({ ...prev, conversations: true }));
      const data = await getConversations();
      setConversations(data);
    } catch (err) {
      setError(err.message || 'Failed to load conversations');
    } finally {
      setIsLoading(prev => ({ ...prev, conversations: false }));
    }
  }, []);

  // Load notifications
  const loadNotifications = useCallback(async () => {
    try {
      setIsLoading(prev => ({ ...prev, notifications: true }));
      const [notifs, count] = await Promise.all([
        getNotifications(true), // Only unread by default
        getUnreadNotificationCount(),
      ]);
      setNotifications(notifs);
      setUnreadCount(count);
    } catch (err) {
      setError(err.message || 'Failed to load notifications');
    } finally {
      setIsLoading(prev => ({ ...prev, notifications: false }));
    }
  }, []);

  // Initial data load
  useEffect(() => {
    loadNetworkData();
    loadFollowData();
    loadConversations();
    loadNotifications();
  }, [loadNetworkData, loadFollowData, loadConversations, loadNotifications]);

  // Refresh all network data
  const refreshAll = useCallback(async () => {
    await Promise.all([
      loadNetworkData(),
      loadFollowData(),
      loadConversations(),
      loadNotifications(),
    ]);
  }, [loadNetworkData, loadFollowData, loadConversations, loadNotifications]);

  // Context value
  const contextValue = {
    // State
    connections,
    pendingConnections,
    followers,
    following,
    conversations,
    notifications,
    unreadCount,
    isLoading,
    error,
    
    // Actions
    refreshConnections: loadNetworkData,
    refreshFollowData,
    refreshConversations: loadConversations,
    refreshNotifications: loadNotifications,
    refreshAll,
    
    // Setters
    setConnections,
    setPendingConnections,
    setFollowers,
    setFollowing,
    setConversations,
    setNotifications,
    setUnreadCount,
  };

  return (
    <NetworkContext.Provider value={contextValue}>
      {children}
    </NetworkContext.Provider>
  );
};

// Custom hook to use the network context
export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};

export default NetworkContext;
