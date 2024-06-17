import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ApplicationTracker = () => {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get('/api/applications');
        setApplications(response.data);
      } catch (err) {
        setError(err.response.data.message);
      }
    };
    fetchApplications();
  }, []);

  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      await axios.put(`/api/applications/${applicationId}`, { status: newStatus });
      // Update the application list
      setApplications((prevApplications) =>
        prevApplications.map((app) =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <div>
      {error && <div className="error">{error}</div>}
      <h2>Job Application Tracker</h2>
      <table>
        <thead>
          <tr>
            <th>Company</th>
            <th>Position</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((application) => (
            <tr key={application.id}>
              <td>{application.company}</td>
              <td>{application.position}</td>
              <td>
                <select
                  value={application.status}
                  onChange={(e) =>
                    updateApplicationStatus(application.id, e.target.value)
                  }
                >
                  <option value="applied">Applied</option>
                  <option value="interview">Interview</option>
                  <option value="offer">Offer</option>
                  <option value="rejected">Rejected</option>
                </select>
              </td>
              <td>
                <button>View Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationTracker;