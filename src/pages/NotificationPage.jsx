// pages/NotificationPage.jsx
import { useState, useEffect } from "react";
import NotificationList from "../components/notifications/NotificationList";
import NotificationFilter from "../components/notifications/NotificationFilter";
import Sidebar from "../components/layout/Sidebar";

// Sample data for notifications
const sampleNotifications = [
  {
    id: 1,
    message: "You have a new connection request from Jane Doe",
    timestamp: "2 hours ago",
    category: "connection_requests",
  },
  {
    id: 2,
    message: "John has applied to your job listing",
    timestamp: "1 day ago",
    category: "job_updates",
  },
  {
    id: 3,
    message: "You received a new message from Sarah",
    timestamp: "3 days ago",
    category: "messages",
  },
  {
    id: 4,
    message: "Your job application was viewed by an employer",
    timestamp: "5 days ago",
    category: "job_updates",
  },
];

const NotificationPage = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [filteredNotifications, setFilteredNotifications] =
    useState(sampleNotifications);

  useEffect(() => {
    if (selectedFilter === "all") {
      setFilteredNotifications(sampleNotifications);
    } else {
      setFilteredNotifications(
        sampleNotifications.filter(
          (notification) => notification.category === selectedFilter
        )
      );
    }
  }, [selectedFilter]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar Navigation */}
      <Sidebar />
      {/* Main Content */}
      <div className="flex-1 ml-0 md:ml-64">
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">
            Notifications
          </h1>

          {/* Filter Component */}
          <NotificationFilter
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
          />

          {/* Notifications List */}
          <NotificationList notifications={filteredNotifications} />
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
