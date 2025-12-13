import { useState, useEffect, useCallback } from 'react';
import { 
  getApplications, 
  getApplication, 
  createApplication as createApp, 
  updateApplication as updateApp,
  deleteApplication as deleteApp,
  updateApplicationStatus,
  addApplicationNote,
  addApplicationTask,
  updateApplicationTask as updateAppTask,
  deleteApplicationTask as deleteAppTask,
  addApplicationContact,
  updateApplicationContact as updateAppContact,
  deleteApplicationContact as deleteAppContact,
  getApplicationStats
} from '../services/api/applications';

const useApplications = () => {
  const [applications, setApplications] = useState([]);
  const [currentApplication, setCurrentApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  // Load all applications
  const loadApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getApplications();
      setApplications(data);
      return data;
    } catch (err) {
      console.error('Failed to load applications:', err);
      setError(err.message || 'Failed to load applications');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load a single application
  const loadApplication = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getApplication(id);
      setCurrentApplication(data);
      return data;
    } catch (err) {
      console.error(`Failed to load application ${id}:`, err);
      setError(err.message || `Failed to load application ${id}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new application
  const createNewApplication = useCallback(async (applicationData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await createApp(applicationData);
      setApplications(prev => [data, ...prev]);
      setCurrentApplication(data);
      return data;
    } catch (err) {
      console.error('Failed to create application:', err);
      setError(err.message || 'Failed to create application');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update an application
  const updateExistingApplication = useCallback(async (id, updates) => {
    try {
      setLoading(true);
      setError(null);
      const data = await updateApp(id, updates);
      setApplications(prev => 
        prev.map(app => app.id === id ? { ...app, ...data } : app)
      );
      if (currentApplication?.id === id) {
        setCurrentApplication(prev => ({ ...prev, ...data }));
      }
      return data;
    } catch (err) {
      console.error(`Failed to update application ${id}:`, err);
      setError(err.message || `Failed to update application ${id}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentApplication?.id]);

  // Delete an application
  const deleteApplication = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      await deleteApp(id);
      setApplications(prev => prev.filter(app => app.id !== id));
      if (currentApplication?.id === id) {
        setCurrentApplication(null);
      }
    } catch (err) {
      console.error(`Failed to delete application ${id}:`, err);
      setError(err.message || `Failed to delete application ${id}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentApplication?.id]);

  // Update application status
  const updateStatus = useCallback(async (id, status) => {
    try {
      setLoading(true);
      setError(null);
      const data = await updateApplicationStatus(id, status);
      setApplications(prev => 
        prev.map(app => app.id === id ? { ...app, status } : app)
      );
      if (currentApplication?.id === id) {
        setCurrentApplication(prev => ({ ...prev, status }));
      }
      return data;
    } catch (err) {
      console.error(`Failed to update status for application ${id}:`, err);
      setError(err.message || `Failed to update status for application ${id}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentApplication?.id]);

  // Add a note to an application
  const addNote = useCallback(async (id, note) => {
    try {
      setLoading(true);
      setError(null);
      const data = await addApplicationNote(id, note);
      setApplications(prev => 
        prev.map(app => {
          if (app.id === id) {
            const notes = [...(app.notes || []), data];
            return { ...app, notes };
          }
          return app;
        })
      );
      if (currentApplication?.id === id) {
        setCurrentApplication(prev => ({
          ...prev,
          notes: [...(prev.notes || []), data]
        }));
      }
      return data;
    } catch (err) {
      console.error(`Failed to add note to application ${id}:`, err);
      setError(err.message || `Failed to add note to application ${id}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentApplication?.id]);

  // Add a task to an application
  const addTask = useCallback(async (id, taskData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await addApplicationTask(id, taskData);
      setApplications(prev => 
        prev.map(app => {
          if (app.id === id) {
            const tasks = [...(app.tasks || []), data];
            return { ...app, tasks };
          }
          return app;
        })
      );
      if (currentApplication?.id === id) {
        setCurrentApplication(prev => ({
          ...prev,
          tasks: [...(prev.tasks || []), data]
        }));
      }
      return data;
    } catch (err) {
      console.error(`Failed to add task to application ${id}:`, err);
      setError(err.message || `Failed to add task to application ${id}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentApplication?.id]);

  // Update a task
  const updateTask = useCallback(async (id, taskId, taskData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await updateAppTask(id, taskId, taskData);
      setApplications(prev => 
        prev.map(app => {
          if (app.id === id) {
            const tasks = (app.tasks || []).map(task => 
              task.id === taskId ? { ...task, ...data } : task
            );
            return { ...app, tasks };
          }
          return app;
        })
      );
      if (currentApplication?.id === id) {
        setCurrentApplication(prev => ({
          ...prev,
          tasks: (prev.tasks || []).map(task => 
            task.id === taskId ? { ...task, ...data } : task
          )
        }));
      }
      return data;
    } catch (err) {
      console.error(`Failed to update task ${taskId} for application ${id}:`, err);
      setError(err.message || `Failed to update task ${taskId} for application ${id}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentApplication?.id]);

  // Delete a task
  const deleteTask = useCallback(async (id, taskId) => {
    try {
      setLoading(true);
      setError(null);
      await deleteAppTask(id, taskId);
      setApplications(prev => 
        prev.map(app => {
          if (app.id === id) {
            const tasks = (app.tasks || []).filter(task => task.id !== taskId);
            return { ...app, tasks };
          }
          return app;
        })
      );
      if (currentApplication?.id === id) {
        setCurrentApplication(prev => ({
          ...prev,
          tasks: (prev.tasks || []).filter(task => task.id !== taskId)
        }));
      }
    } catch (err) {
      console.error(`Failed to delete task ${taskId} from application ${id}:`, err);
      setError(err.message || `Failed to delete task ${taskId} from application ${id}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentApplication?.id]);

  // Add a contact to an application
  const addContact = useCallback(async (id, contactData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await addApplicationContact(id, contactData);
      setApplications(prev => 
        prev.map(app => {
          if (app.id === id) {
            const contacts = [...(app.contacts || []), data];
            return { ...app, contacts };
          }
          return app;
        })
      );
      if (currentApplication?.id === id) {
        setCurrentApplication(prev => ({
          ...prev,
          contacts: [...(prev.contacts || []), data]
        }));
      }
      return data;
    } catch (err) {
      console.error(`Failed to add contact to application ${id}:`, err);
      setError(err.message || `Failed to add contact to application ${id}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentApplication?.id]);

  // Update a contact
  const updateContact = useCallback(async (id, contactId, contactData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await updateAppContact(id, contactId, contactData);
      setApplications(prev => 
        prev.map(app => {
          if (app.id === id) {
            const contacts = (app.contacts || []).map(contact => 
              contact.id === contactId ? { ...contact, ...data } : contact
            );
            return { ...app, contacts };
          }
          return app;
        })
      );
      if (currentApplication?.id === id) {
        setCurrentApplication(prev => ({
          ...prev,
          contacts: (prev.contacts || []).map(contact => 
            contact.id === contactId ? { ...contact, ...data } : contact
          )
        }));
      }
      return data;
    } catch (err) {
      console.error(`Failed to update contact ${contactId} for application ${id}:`, err);
      setError(err.message || `Failed to update contact ${contactId} for application ${id}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentApplication?.id]);

  // Delete a contact
  const deleteContact = useCallback(async (id, contactId) => {
    try {
      setLoading(true);
      setError(null);
      await deleteAppContact(id, contactId);
      setApplications(prev => 
        prev.map(app => {
          if (app.id === id) {
            const contacts = (app.contacts || []).filter(contact => contact.id !== contactId);
            return { ...app, contacts };
          }
          return app;
        })
      );
      if (currentApplication?.id === id) {
        setCurrentApplication(prev => ({
          ...prev,
          contacts: (prev.contacts || []).filter(contact => contact.id !== contactId)
        }));
      }
    } catch (err) {
      console.error(`Failed to delete contact ${contactId} from application ${id}:`, err);
      setError(err.message || `Failed to delete contact ${contactId} from application ${id}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentApplication?.id]);

  // Load application statistics
  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getApplicationStats();
      setStats(data);
      return data;
    } catch (err) {
      console.error('Failed to load application stats:', err);
      setError(err.message || 'Failed to load application stats');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear current application
  const clearCurrentApplication = useCallback(() => {
    setCurrentApplication(null);
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    applications,
    currentApplication,
    loading,
    error,
    stats,
    loadApplications,
    loadApplication,
    createApplication: createNewApplication,
    updateApplication: updateExistingApplication,
    deleteApplication,
    updateStatus,
    addNote,
    addTask,
    updateTask,
    deleteTask,
    addContact,
    updateContact,
    deleteContact,
    loadStats,
    clearCurrentApplication,
    clearError,
  };
};

export default useApplications;
