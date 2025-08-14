import api from './api';

const APPLICATION_ENDPOINT = '/api/applications/';

// Get all job applications for the current user
export const getApplications = async () => {
  try {
    const response = await api.get(APPLICATION_ENDPOINT);
    return response.data;
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
};

// Get a single job application by ID
export const getApplication = async (id) => {
  try {
    const response = await api.get(`${APPLICATION_ENDPOINT}${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching application ${id}:`, error);
    throw error;
  }
};

// Create a new job application
export const createApplication = async (applicationData) => {
  try {
    const response = await api.post(APPLICATION_ENDPOINT, applicationData);
    return response.data;
  } catch (error) {
    console.error('Error creating application:', error);
    throw error;
  }
};

// Update an existing job application
export const updateApplication = async (id, applicationData) => {
  try {
    const response = await api.patch(`${APPLICATION_ENDPOINT}${id}/`, applicationData);
    return response.data;
  } catch (error) {
    console.error(`Error updating application ${id}:`, error);
    throw error;
  }
};

// Delete a job application
export const deleteApplication = async (id) => {
  try {
    await api.delete(`${APPLICATION_ENDPOINT}${id}/`);
  } catch (error) {
    console.error(`Error deleting application ${id}:`, error);
    throw error;
  }
};

// Get application statistics
export const getApplicationStats = async () => {
  try {
    const response = await api.get(`${APPLICATION_ENDPOINT}stats/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching application stats:', error);
    throw error;
  }
};

// Update application status
export const updateApplicationStatus = async (id, status) => {
  try {
    const response = await api.patch(`${APPLICATION_ENDPOINT}${id}/status/`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating status for application ${id}:`, error);
    throw error;
  }
};

// Add a note to an application
export const addApplicationNote = async (id, note) => {
  try {
    const response = await api.post(`${APPLICATION_ENDPOINT}${id}/notes/`, { note });
    return response.data;
  } catch (error) {
    console.error(`Error adding note to application ${id}:`, error);
    throw error;
  }
};

// Add a task to an application
export const addApplicationTask = async (id, taskData) => {
  try {
    const response = await api.post(`${APPLICATION_ENDPOINT}${id}/tasks/`, taskData);
    return response.data;
  } catch (error) {
    console.error(`Error adding task to application ${id}:`, error);
    throw error;
  }
};

// Update a task
export const updateApplicationTask = async (id, taskId, taskData) => {
  try {
    const response = await api.patch(`${APPLICATION_ENDPOINT}${id}/tasks/${taskId}/`, taskData);
    return response.data;
  } catch (error) {
    console.error(`Error updating task ${taskId} for application ${id}:`, error);
    throw error;
  }
};

// Delete a task
export const deleteApplicationTask = async (id, taskId) => {
  try {
    await api.delete(`${APPLICATION_ENDPOINT}${id}/tasks/${taskId}/`);
  } catch (error) {
    console.error(`Error deleting task ${taskId} from application ${id}:`, error);
    throw error;
  }
};

// Add a contact to an application
export const addApplicationContact = async (id, contactData) => {
  try {
    const response = await api.post(`${APPLICATION_ENDPOINT}${id}/contacts/`, contactData);
    return response.data;
  } catch (error) {
    console.error(`Error adding contact to application ${id}:`, error);
    throw error;
  }
};

// Update a contact
export const updateApplicationContact = async (id, contactId, contactData) => {
  try {
    const response = await api.patch(
      `${APPLICATION_ENDPOINT}${id}/contacts/${contactId}/`,
      contactData
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating contact ${contactId} for application ${id}:`, error);
    throw error;
  }
};

// Delete a contact
export const deleteApplicationContact = async (id, contactId) => {
  try {
    await api.delete(`${APPLICATION_ENDPOINT}${id}/contacts/${contactId}/`);
  } catch (error) {
    console.error(`Error deleting contact ${contactId} from application ${id}:`, error);
    throw error;
  }
};
