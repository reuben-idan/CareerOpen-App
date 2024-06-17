import React, { useState, useEffect } from 'react';
import axios from 'axios';

const JobAlertNotifications = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`/api/users/${userId}/job-alerts/notifications`);
        setNotifications(response.data);
      } catch (err) {
        setError(err.response.data.message);
      }
    };
    fetchNotifications();
  }, [userId]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await axios.put(`/api/users/${userId}/job-alerts/notifications/${notificationId}`, { read: true });
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === notificationId ? { ...notification, read: true } : notification
        )
      );
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div>
      <h2>Job Alert Notifications</h2>
      {notifications.length === 0 ? (
        <p>No new job alert notifications.</p>
      ) : (
        <ul>
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className={`notification ${notification.read ? 'read' : ''}`}
            >
              <h3>{notification.job.title}</h3>
              <p>{notification.job.company.name}</p>
              <p>{notification.job.location}</p>
              <p>{notification.createdAt}</p>
              {!notification.read && (
                <button onClick={() => handleMarkAsRead(notification.id)}>
                  Mark as Read
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default JobAlertNotifications;