import React, { useState, useEffect } from "react";
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UserGroupIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  MapPinIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/outline";
import { analytics } from "../../services/analytics";

const JobInsights = ({ jobs }) => {
  const [insights, setInsights] = useState({
    salary: {},
    skills: {},
    locations: {},
    experience: {},
    education: {},
    trends: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const processInsights = () => {
      try {
        // Process salary insights
        const salaries = jobs
          .map((job) => {
            const salary = job.salary?.replace(/[^0-9]/g, "");
            return salary ? parseInt(salary) : null;
          })
          .filter(Boolean);

        const avgSalary = salaries.reduce((a, b) => a + b, 0) / salaries.length;
        const maxSalary = Math.max(...salaries);
        const minSalary = Math.min(...salaries);

        // Process skills insights
        const skillsCount = {};
        jobs.forEach((job) => {
          job.skills?.forEach((skill) => {
            skillsCount[skill] = (skillsCount[skill] || 0) + 1;
          });
        });

        const topSkills = Object.entries(skillsCount)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([skill, count]) => ({
            skill,
            count,
            percentage: (count / jobs.length) * 100,
          }));

        // Process location insights
        const locations = {};
        jobs.forEach((job) => {
          locations[job.location] = (locations[job.location] || 0) + 1;
        });

        const topLocations = Object.entries(locations)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([location, count]) => ({
            location,
            count,
            percentage: (count / jobs.length) * 100,
          }));

        // Process experience insights
        const experienceLevels = {};
        jobs.forEach((job) => {
          const level = job.requirements?.experience || "Not specified";
          experienceLevels[level] = (experienceLevels[level] || 0) + 1;
        });

        // Process education insights
        const educationLevels = {};
        jobs.forEach((job) => {
          const level = job.requirements?.education || "Not specified";
          educationLevels[level] = (educationLevels[level] || 0) + 1;
        });

        // Process trends
        const now = new Date();
        const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
        const recentJobs = jobs.filter(
          (job) => new Date(job.postedAt) > thirtyDaysAgo
        );

        const trend = {
          total: jobs.length,
          recent: recentJobs.length,
          growth: ((recentJobs.length / jobs.length) * 100).toFixed(1),
        };

        setInsights({
          salary: { avgSalary, maxSalary, minSalary },
          skills: topSkills,
          locations: topLocations,
          experience: experienceLevels,
          education: educationLevels,
          trends: trend,
        });

        analytics.track("view_job_insights", {
          totalJobs: jobs.length,
          recentJobs: recentJobs.length,
        });
      } catch (err) {
        console.error("Error processing job insights:", err);
        setError("Failed to process job insights");
        analytics.track("error_processing_job_insights", {
          error: err.message,
        });
      } finally {
        setLoading(false);
      }
    };

    processInsights();
  }, [jobs]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card p-6">
        <div className="text-center">
          <p className="text-red-500 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Job Market Insights
          </h2>
          <div className="flex items-center space-x-2">
            <ChartBarIcon className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Based on {insights.trends.total} jobs
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Salary Insights */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Salary Range
              </h3>
              <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Average
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  ${insights.salary.avgSalary.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Highest
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  ${insights.salary.maxSalary.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Lowest
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  ${insights.salary.minSalary.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Top Skills */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Top Required Skills
              </h3>
              <BriefcaseIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-2">
              {insights.skills.map(({ skill, count, percentage }) => (
                <div key={skill} className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {skill}
                  </span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900 dark:text-white mr-2">
                      {count}
                    </span>
                    <span className="text-xs text-gray-400">
                      ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Locations */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Popular Locations
              </h3>
              <MapPinIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-2">
              {insights.locations.map(({ location, count, percentage }) => (
                <div
                  key={location}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {location}
                  </span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900 dark:text-white mr-2">
                      {count}
                    </span>
                    <span className="text-xs text-gray-400">
                      ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Experience Requirements */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Experience Levels
              </h3>
              <ClockIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-2">
              {Object.entries(insights.experience).map(([level, count]) => (
                <div key={level} className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {level}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Education Requirements */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Education Requirements
              </h3>
              <AcademicCapIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-2">
              {Object.entries(insights.education).map(([level, count]) => (
                <div key={level} className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {level}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Market Trends */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Market Trends
              </h3>
              <ArrowTrendingUpIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Last 30 Days
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {insights.trends.recent} jobs
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Growth Rate
                </span>
                <div className="flex items-center">
                  {parseFloat(insights.trends.growth) > 0 ? (
                    <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      parseFloat(insights.trends.growth) > 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {insights.trends.growth}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobInsights;
