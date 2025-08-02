import api from './api';

const storageService = {
  /**
   * Upload a file to the server
   * @param {File} file - The file to upload
   * @param {string} path - The path where to store the file (e.g., 'profile-pictures', 'documents')
   * @returns {Promise<{url: string, path: string}>} The URL and path of the uploaded file
   */
  async uploadFile(file, path) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('path', path);

      const response = await api.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error(error.response?.data?.message || 'Failed to upload file');
    }
  },

  /**
   * Delete a file from the server
   * @param {string} filePath - The path of the file to delete
   * @returns {Promise<void>}
   */
  async deleteFile(filePath) {
    try {
      await api.delete(`/files`, { data: { path: filePath } });
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete file');
    }
  },

  /**
   * Upload a profile picture
   * @param {File} file - The image file to upload
   * @param {string} userId - The ID of the user
   * @returns {Promise<{url: string, path: string}>}
   */
  async uploadProfilePicture(file, userId) {
    const fileExtension = file.name.split('.').pop();
    const fileName = `profile-pictures/${userId}/profile.${fileExtension}`;
    return await this.uploadFile(file, fileName);
  },

  /**
   * Upload a cover photo
   * @param {File} file - The image file to upload
   * @param {string} userId - The ID of the user
   * @returns {Promise<{url: string, path: string}>}
   */
  async uploadCoverPhoto(file, userId) {
    const fileExtension = file.name.split('.').pop();
    const fileName = `cover-photos/${userId}/cover.${fileExtension}`;
    return await this.uploadFile(file, fileName);
  },

  /**
   * Get file extension from URL
   * @param {string} url - The file URL
   * @returns {string} The file extension
   */
  getFileExtension(url) {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      return pathname.split('.').pop().toLowerCase();
    } catch (e) {
      console.error('Error parsing URL:', e);
      return '';
    }
  },

  /**
   * Extract file path from URL
   * @param {string} url - The file URL
   * @returns {string} The file path
   */
  getFilePathFromURL(url) {
    try {
      const urlObj = new URL(url);
      // Remove the leading slash and any query parameters
      return urlObj.pathname.substring(1);
    } catch (e) {
      console.error('Error parsing file path from URL:', e);
      return '';
    }
  },
};

export default storageService;
