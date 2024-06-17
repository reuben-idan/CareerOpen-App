import React, { useState, useEffect } from 'react';
import axios from 'axios';

const JobAlertSettings = ({ userId }) => {
  const [alertSettings, setAlertSettings] = useState({
    keywords: '',
    location: '',
    emailFrequency: 'daily',
    pushNotifications: true,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAlertSettings = async () => {
      try {
        const response = await axios.get(`/api/users/${userId}/job-alerts`);
        setAlertSettings(response.data);
      } catch (err) {
        setError(err.response.data.message);
      }
    };
    fetchAlertSettings();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/users/${userId}/job-alerts`, alertSettings);
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  const handleInputChange = (e) => {
    setAlertSettings({ ...alertSettings, [e.target.name]: e.target.value });
  };

  const handlePushNotificationChange = () => {
    setAlertSettings({ ...alertSettings, pushNotifications: !alertSettings.pushNotifications });
  };

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div>
      <h2>Job Alert Settings</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="keywords">Keywords:</label>
          <input type="text" id="keywords" name="keywords" value={alertSettings.keywords} onChange={handleInputChange} />
        </div>
        <div>
          <label htmlFor="location">Location:</label>
          <input type="text" id="location" name="location" value={alertSettings.location} onChange={handleInputChange} />
        </div>
        <div>
          <label htmlFor="emailFrequency">Email Frequency:</label>
          <select id="emailFrequency" name="emailFrequency" value={alertSettings.emailFrequency} onChange={handleInputChange}>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div>
          <label htmlFor="pushNotifications">Push Notifications:</label>
          <input type="checkbox" id="pushNotifications" name="pushNotifications" checked={alertSettings.pushNotifications} onChange={handlePushNotificationChange} />
        </div>
        <button type="submit">Save Settings</button>
      </form>
    </div>
  );
};

export default JobAlertSettings;