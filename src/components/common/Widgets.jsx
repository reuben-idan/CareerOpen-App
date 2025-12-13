// components/Widgets.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  UserGroupIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  StarIcon,
  BellIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

const Widgets = () => {
  const widgets = [
    {
      id: "connections",
      title: "My Network",
      icon: UserGroupIcon,
      count: 245,
      link: "/network",
      color: "text-blue-500",
    },
    {
      id: "jobs",
      title: "Saved Jobs",
      icon: BriefcaseIcon,
      count: 12,
      link: "/jobs/saved",
      color: "text-green-500",
    },
    {
      id: "courses",
      title: "Learning",
      icon: AcademicCapIcon,
      count: 3,
      link: "/learning",
      color: "text-purple-500",
    },
    {
      id: "recommendations",
      title: "Recommendations",
      icon: StarIcon,
      count: 8,
      link: "/recommendations",
      color: "text-yellow-500",
    },
    {
      id: "notifications",
      title: "Notifications",
      icon: BellIcon,
      count: 5,
      link: "/notifications",
      color: "text-red-500",
    },
    {
      id: "messages",
      title: "Messages",
      icon: ChatBubbleLeftRightIcon,
      count: 3,
      link: "/messages",
      color: "text-indigo-500",
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Quick Access
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {widgets.map((widget) => (
          <Link
            key={widget.id}
            to={widget.link}
            className="group flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <div
              className={`p-2 rounded-lg ${widget.color} bg-opacity-10 group-hover:bg-opacity-20`}
            >
              <widget.icon className="h-6 w-6" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                {widget.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {widget.count} {widget.count === 1 ? "item" : "items"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Widgets;
