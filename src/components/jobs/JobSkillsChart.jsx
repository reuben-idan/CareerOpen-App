import React, { useState, useEffect } from "react";
import {
  ChartBarIcon,
  CodeBracketIcon,
  ArrowTrendingUpIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { analytics } from "../../services/analytics";

const JobSkillsChart = ({ jobs, category }) => {
  const [skillsData, setSkillsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);

  useEffect(() => {
    const processSkillsData = () => {
      try {
        setLoading(true);
        // Extract and count skills from all jobs
        const skillsCount = {};
        const skillsSalary = {};
        const skillsDemand = {};

        jobs.forEach((job) => {
          if (job.skills) {
            job.skills.forEach((skill) => {
              // Count skill occurrences
              skillsCount[skill] = (skillsCount[skill] || 0) + 1;

              // Calculate average salary for each skill
              const salary = parseInt(job.salary.replace(/[^0-9]/g, ""), 10);
              if (!isNaN(salary)) {
                if (!skillsSalary[skill]) {
                  skillsSalary[skill] = { total: 0, count: 0 };
                }
                skillsSalary[skill].total += salary;
                skillsSalary[skill].count += 1;
              }

              // Track demand (jobs posted in last 30 days)
              const postedDate = new Date(job.postedAt);
              const thirtyDaysAgo = new Date();
              thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
              if (postedDate >= thirtyDaysAgo) {
                skillsDemand[skill] = (skillsDemand[skill] || 0) + 1;
              }
            });
          }
        });

        // Process and sort skills data
        const processedData = Object.entries(skillsCount).map(
          ([skill, count]) => ({
            skill,
            count,
            percentage: (count / jobs.length) * 100,
            averageSalary: Math.round(
              skillsSalary[skill].total / skillsSalary[skill].count
            ),
            demand: skillsDemand[skill] || 0,
            demandPercentage: ((skillsDemand[skill] || 0) / count) * 100,
          })
        );

        // Sort by count and take top 10
        const topSkills = processedData
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);

        setSkillsData(topSkills);

        analytics.track("view_skills_chart", {
          category,
          jobCount: jobs.length,
          skillCount: Object.keys(skillsCount).length,
        });
      } catch (err) {
        setError("Failed to process skills data");
        analytics.track("error", {
          action: "process_skills_data",
          error: err.message,
        });
      } finally {
        setLoading(false);
      }
    };

    processSkillsData();
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

  const maxCount = Math.max(...skillsData.map((d) => d.count));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Top Required Skills
          </h2>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200">
            {category}
          </span>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            {skillsData.map((item) => (
              <div
                key={item.skill}
                className="relative"
                onMouseEnter={() => setSelectedSkill(item)}
                onMouseLeave={() => setSelectedSkill(null)}
              >
                <div className="flex items-center justify-between text-sm mb-1">
                  <div className="flex items-center">
                    <CodeBracketIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-900 dark:text-white font-medium">
                      {item.skill}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-500 dark:text-gray-400">
                      {item.count} jobs
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {item.percentage.toFixed(1)}%
                    </span>
                  </div>
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

          {selectedSkill && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-start">
                <InformationCircleIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {selectedSkill.skill}
                  </h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center text-sm">
                      <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-gray-500 dark:text-gray-400">
                        Average Salary: $
                        {selectedSkill.averageSalary.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500 dark:text-gray-400">
                        Demand (30 days): {selectedSkill.demand} jobs (
                        {selectedSkill.demandPercentage.toFixed(1)}% of total)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          <p>
            Based on {jobs.length} job listings. Skills are ranked by frequency
            of appearance in job requirements.
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobSkillsChart;
