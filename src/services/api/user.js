import api from './api';

const userService = {
  // Get current user profile
  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me/');
      return response;
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  },

  // Get user profile by ID
  async getUserProfile(userId) {
    try {
      const response = await api.get(`/auth/users/${userId}/`);
      return response;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  // Update user profile
  async updateProfile(userId, profileData) {
    try {
      const response = await api.patch(`/auth/me/`, profileData);
      return response;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  // Update user preferences
  async updatePreferences(userId, preferences) {
    try {
      const response = await api.patch(`/users/${userId}/preferences/`, { preferences });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Upload profile picture
  async uploadProfilePicture(userId, file) {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await api.post(`/users/${userId}/avatar/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data.avatar_url;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Change password
  async changePassword(currentPassword, newPassword) {
    try {
      await api.post('/auth/password/change/', {
        current_password: currentPassword,
        new_password: newPassword,
      });
      return true;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Request password reset
  async requestPasswordReset(email) {
    try {
      await api.post('/auth/password/reset/', { email });
      return true;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Reset password with token
  async resetPassword(uid, token, newPassword) {
    try {
      await api.post('/auth/password/reset/confirm/', {
        uid,
        token,
        new_password: newPassword,
      });
      return true;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Verify email
  async verifyEmail(uid, token) {
    try {
      await api.post('/auth/verify-email/', { uid, token });
      return true;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Resend verification email
  async resendVerificationEmail(email) {
    try {
      await api.post('/auth/resend-verification-email/', { email });
      return true;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update user type
  async updateUserType(userId, userType) {
    try {
      const response = await api.patch(`/users/${userId}/type/`, { user_type: userType });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add user skill
  async addSkill(userId, skill) {
    try {
      const response = await api.post(`/users/${userId}/skills/`, skill);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Remove user skill
  async removeSkill(userId, skillId) {
    try {
      await api.delete(`/users/${userId}/skills/${skillId}/`);
      return true;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user's saved jobs
  async getSavedJobs(userId, filters = {}) {
    try {
      const response = await api.get(`/users/${userId}/saved-jobs/`, { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Save a job
  async saveJob(userId, jobId) {
    try {
      const response = await api.post(`/users/${userId}/saved-jobs/`, { job_id: jobId });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Unsave a job
  async unsaveJob(userId, savedJobId) {
    try {
      await api.delete(`/users/${userId}/saved-jobs/${savedJobId}/`);
      return true;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user's job applications
  async getUserApplications(userId, filters = {}) {
    try {
      const response = await api.get(`/users/${userId}/applications/`, { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user's job alerts
  async getJobAlerts(userId) {
    try {
      const response = await api.get(`/users/${userId}/job-alerts/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create job alert
  async createJobAlert(userId, alertData) {
    try {
      const response = await api.post(`/users/${userId}/job-alerts/`, alertData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update job alert
  async updateJobAlert(userId, alertId, alertData) {
    try {
      const response = await api.patch(
        `/users/${userId}/job-alerts/${alertId}/`,
        alertData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete job alert
  async deleteJobAlert(userId, alertId) {
    try {
      await api.delete(`/users/${userId}/job-alerts/${alertId}/`);
      return true;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user's connections
  async getConnections(userId, filters = {}) {
    try {
      const response = await api.get(`/users/${userId}/connections/`, { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Send connection request
  async sendConnectionRequest(userId, targetUserId, message = '') {
    try {
      const response = await api.post(`/users/${userId}/connection-requests/`, {
        to_user: targetUserId,
        message,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Respond to connection request
  async respondToConnectionRequest(requestId, accept = true) {
    try {
      const response = await api.post(`/connection-requests/${requestId}/respond/`, {
        action: accept ? 'accept' : 'reject',
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Remove connection
  async removeConnection(connectionId) {
    try {
      await api.delete(`/connections/${connectionId}/`);
      return true;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user's notifications
  async getNotifications(userId, filters = {}) {
    try {
      const response = await api.get(`/users/${userId}/notifications/`, { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Mark notification as read
  async markNotificationAsRead(notificationId) {
    try {
      const response = await api.patch(`/notifications/${notificationId}/`, { read: true });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Mark all notifications as read
  async markAllNotificationsAsRead(userId) {
    try {
      await api.post(`/users/${userId}/notifications/mark-all-read/`);
      return true;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete notification
  async deleteNotification(notificationId) {
    try {
      await api.delete(`/notifications/${notificationId}/`);
      return true;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user statistics
  async getUserStats(userId) {
    try {
      const response = await api.get(`/users/${userId}/stats/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete user account
  async deleteAccount(userId) {
    try {
      await api.delete(`/users/${userId}/`);
      return true;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Deactivate user account
  async deactivateAccount(userId) {
    try {
      await api.post(`/users/${userId}/deactivate/`);
      return true;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default userService;
