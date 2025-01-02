// pages/NotificationPage.jsx
import { useState, useEffect } from "react";
import NotificationList from "../components/NotificationList";
import NotificationFilter from "../components/NotificationFilter";

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
    <div className="bg-gray-50 min-h-screen">
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
  );
};

export default NotificationPage;
