import React from "react";
import { Link } from "react-router-dom";
import {
  CodeBracketIcon,
  ChartBarIcon,
  PresentationChartLineIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
  GlobeAltIcon,
  BeakerIcon,
  CommandLineIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";
import { analytics } from "../../services/analytics";

const JobCategories = () => {
  const categories = [
    {
      name: "Software Development",
      icon: CodeBracketIcon,
      count: 1250,
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900",
    },
    {
      name: "Data Science",
      icon: ChartBarIcon,
      count: 850,
      color: "text-purple-500",
      bgColor: "bg-purple-100 dark:bg-purple-900",
    },
    {
      name: "Product Management",
      icon: PresentationChartLineIcon,
      count: 620,
      color: "text-green-500",
      bgColor: "bg-green-100 dark:bg-green-900",
    },
    {
      name: "Human Resources",
      icon: UserGroupIcon,
      count: 480,
      color: "text-pink-500",
      bgColor: "bg-pink-100 dark:bg-pink-900",
    },
    {
      name: "Engineering",
      icon: WrenchScrewdriverIcon,
      count: 950,
      color: "text-yellow-500",
      bgColor: "bg-yellow-100 dark:bg-yellow-900",
    },
    {
      name: "Marketing",
      icon: GlobeAltIcon,
      count: 720,
      color: "text-indigo-500",
      bgColor: "bg-indigo-100 dark:bg-indigo-900",
    },
    {
      name: "Research",
      icon: BeakerIcon,
      count: 380,
      color: "text-red-500",
      bgColor: "bg-red-100 dark:bg-red-900",
    },
    {
      name: "DevOps",
      icon: CommandLineIcon,
      count: 540,
      color: "text-cyan-500",
      bgColor: "bg-cyan-100 dark:bg-cyan-900",
    },
    {
      name: "Content",
      icon: DocumentTextIcon,
      count: 420,
      color: "text-orange-500",
      bgColor: "bg-orange-100 dark:bg-orange-900",
    },
    {
      name: "Business",
      icon: BuildingOfficeIcon,
      count: 680,
      color: "text-teal-500",
      bgColor: "bg-teal-100 dark:bg-teal-900",
    },
  ];

  const handleCategoryClick = (category) => {
    analytics.track("view_job_category", {
      category: category.name,
      count: category.count,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Browse Jobs by Category
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/jobs/category/${category.name
                .toLowerCase()
                .replace(/\s+/g, "-")}`}
              onClick={() => handleCategoryClick(category)}
              className="relative rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 dark:hover:border-gray-500 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
            >
              <div
                className={`flex-shrink-0 rounded-md p-3 ${category.bgColor}`}
              >
                <category.icon
                  className={`h-6 w-6 ${category.color}`}
                  aria-hidden="true"
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {category.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {category.count.toLocaleString()} jobs
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/jobs"
            className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500"
          >
            View all categories
            <span aria-hidden="true"> &rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobCategories;
