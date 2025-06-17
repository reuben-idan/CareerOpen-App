import React, { useState } from "react";
import {
  BellIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { analytics } from "../../services/analytics";

const JobAlerts = ({ alerts: initialAlerts = [] }) => {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newAlert, setNewAlert] = useState({
    keywords: "",
    location: "",
    frequency: "daily",
  });

  const handleAddAlert = () => {
    if (!newAlert.keywords) return;

    const alert = {
      id: Date.now(),
      ...newAlert,
      active: true,
      createdAt: new Date().toISOString(),
    };

    setAlerts([...alerts, alert]);
    setNewAlert({ keywords: "", location: "", frequency: "daily" });
    setIsAdding(false);
    analytics.track("create_job_alert", { alert });
  };

  const handleDeleteAlert = (id) => {
    setAlerts(alerts.filter((alert) => alert.id !== id));
    analytics.track("delete_job_alert", { alertId: id });
  };

  const handleToggleAlert = (id) => {
    setAlerts(
      alerts.map((alert) =>
        alert.id === id ? { ...alert, active: !alert.active } : alert
      )
    );
    analytics.track("toggle_job_alert", {
      alertId: id,
      active: !alerts.find((a) => a.id === id).active,
    });
  };

  const handleEditAlert = (id) => {
    const alert = alerts.find((a) => a.id === id);
    setNewAlert({
      keywords: alert.keywords,
      location: alert.location,
      frequency: alert.frequency,
    });
    setEditingId(id);
    setIsAdding(true);
  };

  const handleUpdateAlert = () => {
    if (!newAlert.keywords) return;

    setAlerts(
      alerts.map((alert) =>
        alert.id === editingId
          ? { ...alert, ...newAlert, updatedAt: new Date().toISOString() }
          : alert
      )
    );
    setNewAlert({ keywords: "", location: "", frequency: "daily" });
    setEditingId(null);
    setIsAdding(false);
    analytics.track("update_job_alert", {
      alertId: editingId,
      alert: newAlert,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Job Alerts
          </h2>
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Alert
          </button>
        </div>

        {isAdding && (
          <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="keywords"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Keywords
                </label>
                <input
                  type="text"
                  id="keywords"
                  value={newAlert.keywords}
                  onChange={(e) =>
                    setNewAlert({ ...newAlert, keywords: e.target.value })
                  }
                  placeholder="e.g., Software Engineer, React"
                  className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  value={newAlert.location}
                  onChange={(e) =>
                    setNewAlert({ ...newAlert, location: e.target.value })
                  }
                  placeholder="e.g., New York, Remote"
                  className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="frequency"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Alert Frequency
                </label>
                <select
                  id="frequency"
                  value={newAlert.frequency}
                  onChange={(e) =>
                    setNewAlert({ ...newAlert, frequency: e.target.value })
                  }
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setEditingId(null);
                    setNewAlert({
                      keywords: "",
                      location: "",
                      frequency: "daily",
                    });
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Cancel
                </button>
                <button
                  onClick={editingId ? handleUpdateAlert : handleAddAlert}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  {editingId ? "Update Alert" : "Create Alert"}
                </button>
              </div>
            </div>
          </div>
        )}

        {alerts.length === 0 ? (
          <div className="text-center py-12">
            <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              No job alerts
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Get notified when new jobs match your criteria.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {alert.keywords}
                    </h3>
                    {alert.active && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {alert.location || "Any location"} • {alert.frequency}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEditAlert(alert.id)}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleToggleAlert(alert.id)}
                    className={`${
                      alert.active
                        ? "text-green-500 hover:text-green-600"
                        : "text-gray-400 hover:text-gray-500"
                    }`}
                  >
                    <CheckCircleIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteAlert(alert.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobAlerts;
