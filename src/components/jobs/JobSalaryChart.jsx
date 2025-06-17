import React, { useState, useEffect } from "react";
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/outline";
import { analytics } from "../../services/analytics";

const JobSalaryChart = ({ jobs, category }) => {
  const [salaryData, setSalaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const processSalaryData = () => {
      try {
        setLoading(true);
        // Process salary data
        const salaries = jobs.map((job) => {
          const salary = job.salary.replace(/[^0-9]/g, "");
          return parseInt(salary, 10);
        });

        const ranges = [
          { min: 0, max: 50000, label: "0-50k" },
          { min: 50000, max: 100000, label: "50k-100k" },
          { min: 100000, max: 150000, label: "100k-150k" },
          { min: 150000, max: 200000, label: "150k-200k" },
          { min: 200000, max: Infinity, label: "200k+" },
        ];

        const distribution = ranges.map((range) => ({
          range: range.label,
          count: salaries.filter(
            (salary) => salary >= range.min && salary < range.max
          ).length,
        }));

        const average = salaries.reduce((a, b) => a + b, 0) / salaries.length;
        const median = salaries.sort((a, b) => a - b)[
          Math.floor(salaries.length / 2)
        ];

        setSalaryData({
          distribution,
          average,
          median,
          min: Math.min(...salaries),
          max: Math.max(...salaries),
        });

        analytics.track("view_salary_chart", {
          category,
          jobCount: jobs.length,
        });
      } catch (err) {
        setError("Failed to process salary data");
        analytics.track("error", {
          action: "process_salary_data",
          error: err.message,
        });
      } finally {
        setLoading(false);
      }
    };

    processSalaryData();
  }, [jobs, category]);

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

  const maxCount = Math.max(...salaryData.distribution.map((d) => d.count));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Salary Distribution
          </h2>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200">
            {category}
          </span>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center">
                <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  Average
                </span>
              </div>
              <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                ${Math.round(salaryData.average).toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center">
                <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  Median
                </span>
              </div>
              <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                ${Math.round(salaryData.median).toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center">
                <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  Highest
                </span>
              </div>
              <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                ${salaryData.max.toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center">
                <ArrowTrendingDownIcon className="h-5 w-5 text-red-500" />
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  Lowest
                </span>
              </div>
              <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                ${salaryData.min.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {salaryData.distribution.map((item) => (
              <div key={item.range}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-500 dark:text-gray-400">
                    {item.range}
                  </span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {item.count} jobs
                  </span>
                </div>
                <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-primary-500"
                    style={{
                      width: `${(item.count / maxCount) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          <p>
            Based on {jobs.length} job listings. Salaries are approximate and
            may vary based on experience, location, and other factors.
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobSalaryChart;
