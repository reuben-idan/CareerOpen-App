import api from './api';

/**
 * Network API service for handling user connections, follows, messages, and notifications
 */

// ====================================
// Connection Endpoints
// ====================================

/**
 * Send a connection request to another user
 * @param {number} userId - ID of the user to connect with
 * @param {string} message - Optional message to include with the request
 * @returns {Promise<Object>} - The created connection request
 */
export const sendConnectionRequest = async (userId, message = '') => {
  try {
    const response = await api.post('/network/connections/', { to_user: userId, message });
    return response.data;
  } catch (error) {
    console.error('Error sending connection request:', error);
    throw error.response?.data || error.message;
  }
};

/**
 * Respond to a connection request
 * @param {number} connectionId - ID of the connection request
 * @param {string} action - Action to take ('accept' or 'decline')
 * @returns {Promise<Object>} - The updated connection
 */
export const respondToConnectionRequest = async (connectionId, action) => {
  try {
    const response = await api.post(`/network/connections/${connectionId}/respond/`, { action });
    return response.data;
  } catch (error) {
    console.error('Error responding to connection request:', error);
    throw error.response?.data || error.message;
  }
};

/**
 * Get pending connection requests
 * @returns {Promise<Array>} - List of pending connection requests
 */
export const getPendingConnections = async () => {
  try {
    const response = await api.get('/network/connections/pending/');
    return response.data;
  } catch (error) {
    console.error('Error fetching pending connections:', error);
    throw error.response?.data || error.message;
  }
};

/**
 * Get user's connections
 * @returns {Promise<Array>} - List of user's connections
 */
export const getMyConnections = async () => {
  try {
    const response = await api.get('/network/connections/me/');
    return response.data;
  } catch (error) {
    console.error('Error fetching connections:', error);
    throw error.response?.data || error.message;
  }
};

// ====================================
// Follow Endpoints
// ====================================

/**
 * Follow a user
 * @param {number} userId - ID of the user to follow
 * @returns {Promise<Object>} - The follow relationship
 */
export const followUser = async (userId) => {
  try {
    const response = await api.post('/network/follows/', { following: userId });
    return response.data;
  } catch (error) {
    console.error('Error following user:', error);
    throw error.response?.data || error.message;
  }
};

/**
 * Unfollow a user
 * @param {number} followId - ID of the follow relationship to delete
 * @returns {Promise<void>}
 */
export const unfollowUser = async (followId) => {
  try {
    await api.delete(`/network/follows/${followId}/`);
  } catch (error) {
    console.error('Error unfollowing user:', error);
    throw error.response?.data || error.message;
  }
};

/**
 * Get user's followers
 * @returns {Promise<Array>} - List of users who follow the current user
 */
export const getMyFollowers = async () => {
  try {
    const response = await api.get('/network/follows/followers/');
    return response.data;
  } catch (error) {
    console.error('Error fetching followers:', error);
    throw error.response?.data || error.message;
  }
};

/**
 * Get users the current user is following
 * @returns {Promise<Array>} - List of users the current user is following
 */
export const getMyFollowing = async () => {
  try {
    const response = await api.get('/network/follows/following/');
    return response.data;
  } catch (error) {
    console.error('Error fetching following:', error);
    throw error.response?.data || error.message;
  }
};

// ====================================
// Message Endpoints
// ====================================

/**
 * Send a message to another user
 * @param {number} recipientId - ID of the message recipient
 * @param {string} content - Message content
 * @returns {Promise<Object>} - The sent message
 */
export const sendMessage = async (recipientId, content) => {
  try {
    const response = await api.post('/network/messages/', { recipient: recipientId, content });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error.response?.data || error.message;
  }
};

/**
 * Get conversation with a specific user
 * @param {number} userId - ID of the user to get conversation with
 * @param {number} [page=1] - Page number for pagination
 * @returns {Promise<Object>} - Paginated list of messages
 */
export const getConversation = async (userId, page = 1) => {
  try {
    const response = await api.get(`/network/messages/with/${userId}/`, {
      params: { page }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching conversation:', error);
    throw error.response?.data || error.message;
  }
};

/**
 * Get list of conversations
 * @returns {Promise<Array>} - List of conversations with the last message
 */
export const getConversations = async () => {
  try {
    const response = await api.get('/network/messages/conversations/');
    return response.data;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error.response?.data || error.message;
  }
};

// ====================================
// Notification Endpoints
// ====================================

/**
 * Get user's notifications
 * @param {boolean} [unreadOnly=false] - Whether to fetch only unread notifications
 * @returns {Promise<Array>} - List of notifications
 */
export const getNotifications = async (unreadOnly = false) => {
  try {
    const response = await api.get('/network/notifications/', {
      params: { unread: unreadOnly }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error.response?.data || error.message;
  }
};

/**
 * Mark a notification as read
 * @param {number} notificationId - ID of the notification to mark as read
 * @returns {Promise<Object>} - The updated notification
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await api.post(`/network/notifications/${notificationId}/mark-as-read/`);
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error.response?.data || error.message;
  }
};

/**
 * Mark all notifications as read
 * @returns {Promise<Object>} - Status of the operation
 */
export const markAllNotificationsAsRead = async () => {
  try {
    const response = await api.post('/network/notifications/mark-all-read/');
    return response.data;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error.response?.data || error.message;
  }
};

/**
 * Get count of unread notifications
 * @returns {Promise<number>} - Count of unread notifications
 */
export const getUnreadNotificationCount = async () => {
  try {
    const response = await api.get('/network/notifications/unread/count/');
    return response.data.count;
  } catch (error) {
    console.error('Error fetching unread notification count:', error);
    throw error.response?.data || error.message;
  }
};
