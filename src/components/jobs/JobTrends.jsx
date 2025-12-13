import React, { useState, useEffect } from "react";
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { analytics } from "../../services/analytics";

const JobTrends = ({ jobs, category }) => {
  const [trendsData, setTrendsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("3m"); // 1m, 3m, 6m, 1y

  useEffect(() => {
    const processTrendsData = () => {
      try {
        setLoading(true);
        const now = new Date();
        const ranges = {
          "1m": 30,
          "3m": 90,
          "6m": 180,
          "1y": 365,
        };

        const days = ranges[timeRange];
        const startDate = new Date(now);
        startDate.setDate(startDate.getDate() - days);

        // Group jobs by date
        const jobsByDate = {};
        const salaryByDate = {};
        const skillsByDate = {};

        jobs.forEach((job) => {
          const jobDate = new Date(job.postedAt);
          if (jobDate >= startDate) {
            const dateKey = jobDate.toISOString().split("T")[0];

            // Count jobs
            jobsByDate[dateKey] = (jobsByDate[dateKey] || 0) + 1;

            // Track salaries
            const salary = parseInt(job.salary.replace(/[^0-9]/g, ""), 10);
            if (!isNaN(salary)) {
              if (!salaryByDate[dateKey]) {
                salaryByDate[dateKey] = { total: 0, count: 0 };
              }
              salaryByDate[dateKey].total += salary;
              salaryByDate[dateKey].count += 1;
            }

            // Track skills
            if (job.skills) {
              job.skills.forEach((skill) => {
                if (!skillsByDate[dateKey]) {
                  skillsByDate[dateKey] = {};
                }
                skillsByDate[dateKey][skill] =
                  (skillsByDate[dateKey][skill] || 0) + 1;
              });
            }
          }
        });

        // Process data for chart
        const dates = Object.keys(jobsByDate).sort();
        const processedData = dates.map((date) => ({
          date,
          jobCount: jobsByDate[date],
          averageSalary: Math.round(
            salaryByDate[date].total / salaryByDate[date].count
          ),
          topSkills: Object.entries(skillsByDate[date] || {})
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([skill]) => skill),
        }));

        // Calculate trends
        const firstWeek = processedData.slice(0, 7);
        const lastWeek = processedData.slice(-7);
        const jobTrend = calculateTrend(
          firstWeek.reduce((sum, day) => sum + day.jobCount, 0),
          lastWeek.reduce((sum, day) => sum + day.jobCount, 0)
        );
        const salaryTrend = calculateTrend(
          firstWeek.reduce((sum, day) => sum + day.averageSalary, 0) / 7,
          lastWeek.reduce((sum, day) => sum + day.averageSalary, 0) / 7
        );

        setTrendsData({
          dailyData: processedData,
          trends: {
            jobs: jobTrend,
            salary: salaryTrend,
          },
        });

        analytics.track("view_job_trends", {
          category,
          timeRange,
          jobCount: jobs.length,
        });
      } catch (err) {
        setError("Failed to process trends data");
        analytics.track("error", {
          action: "process_trends_data",
          error: err.message,
        });
      } finally {
        setLoading(false);
      }
    };

    processTrendsData();
  }, [jobs, category, timeRange]);

  const calculateTrend = (start, end) => {
    const change = ((end - start) / start) * 100;
    return {
      value: change,
      direction: change > 0 ? "up" : "down",
      magnitude: Math.abs(change),
    };
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
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
          <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            {error}
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Job Market Trends
          </h2>
          <div className="flex items-center space-x-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
            >
              <option value="1m">Last Month</option>
              <option value="3m">Last 3 Months</option>
              <option value="6m">Last 6 Months</option>
              <option value="1y">Last Year</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Job Postings
                </p>
                <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                  {trendsData.dailyData.reduce(
                    (sum, day) => sum + day.jobCount,
                    0
                  )}
                </p>
              </div>
              <div
                className={`flex items-center ${
                  trendsData.trends.jobs.direction === "up"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {trendsData.trends.jobs.direction === "up" ? (
                  <ArrowTrendingUpIcon className="h-5 w-5" />
                ) : (
                  <ArrowTrendingDownIcon className="h-5 w-5" />
                )}
                <span className="ml-1 text-sm font-medium">
                  {Math.abs(trendsData.trends.jobs.value).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Average Salary
                </p>
                <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                  $
                  {Math.round(
                    trendsData.dailyData.reduce(
                      (sum, day) => sum + day.averageSalary,
                      0
                    ) / trendsData.dailyData.length
                  ).toLocaleString()}
                </p>
              </div>
              <div
                className={`flex items-center ${
                  trendsData.trends.salary.direction === "up"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {trendsData.trends.salary.direction === "up" ? (
                  <ArrowTrendingUpIcon className="h-5 w-5" />
                ) : (
                  <ArrowTrendingDownIcon className="h-5 w-5" />
                )}
                <span className="ml-1 text-sm font-medium">
                  {Math.abs(trendsData.trends.salary.value).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
            Recent Trends
          </h3>
          <div className="space-y-4">
            {trendsData.dailyData.slice(-5).map((day) => (
              <div
                key={day.date}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {new Date(day.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {day.jobCount} jobs posted
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <p>Top Skills:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {day.topSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          <p>
            Based on {jobs.length} job listings. Trends are calculated by
            comparing the first and last week of the selected period.
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobTrends;
