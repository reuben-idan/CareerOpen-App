import React from "react";
import PropTypes from "prop-types";
import {
  BriefcaseIcon,
  MapPinIcon,
  CalendarIcon,
  CheckCircleIcon,
  PlusIcon,
  MinusIcon,
} from "@heroicons/react/24/outline";

const ExperienceList = ({
  experience,
  isOwnProfile = false,
  onAddExperience,
  onRemoveExperience,
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return "Present";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const getDuration = (startDate, endDate) => {
    if (!startDate) return "";

    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();

    const years = end.getFullYear() - start.getFullYear();
    const months = end.getMonth() - start.getMonth();

    let duration = "";
    if (years > 0) {
      duration += `${years} ${years === 1 ? "year" : "years"}`;
    }
    if (months > 0 || years === 0) {
      if (duration) duration += ", ";
      duration += `${months} ${months === 1 ? "month" : "months"}`;
    }

    return duration;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Work Experience
        </h3>
        {isOwnProfile && (
          <button
            onClick={onAddExperience}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 transition-colors"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Experience
          </button>
        )}
      </div>

      <div className="space-y-6">
        {experience.map((exp, index) => (
          <div
            key={exp.id || index}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {/* Job Title and Company */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {exp.title}
                    </h4>
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                      <BriefcaseIcon className="h-4 w-4" />
                      <span className="font-medium">{exp.company}</span>
                    </div>
                  </div>

                  {/* Remove Button for Own Profile */}
                  {isOwnProfile && onRemoveExperience && (
                    <button
                      onClick={() => onRemoveExperience(index)}
                      className="ml-4 p-1 text-gray-400 hover:text-red-500 transition-colors"
                      title="Remove experience"
                    >
                      <MinusIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Location and Duration */}
                <div className="flex flex-wrap items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center space-x-1">
                    <MapPinIcon className="h-4 w-4" />
                    <span>{exp.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CalendarIcon className="h-4 w-4" />
                    <span>
                      {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                    </span>
                  </div>
                  <div className="text-blue-600 dark:text-blue-400 font-medium">
                    {getDuration(exp.startDate, exp.endDate)}
                  </div>
                </div>

                {/* Description */}
                {exp.description && (
                  <div className="mb-4">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                )}

                {/* Achievements */}
                {exp.achievements && exp.achievements.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Key Achievements:
                    </h5>
                    <ul className="space-y-1">
                      {exp.achievements.map((achievement, idx) => (
                        <li
                          key={idx}
                          className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400"
                        >
                          <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Technologies/Skills Used */}
                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="mt-4">
                    <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Technologies Used:
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {experience.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 dark:text-gray-500 mb-2">
            <BriefcaseIcon className="h-12 w-12 mx-auto" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            No work experience added yet.{" "}
            {isOwnProfile && "Add your first job to get started!"}
          </p>
        </div>
      )}
    </div>
  );
};

ExperienceList.propTypes = {
  experience: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      title: PropTypes.string.isRequired,
      company: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      startDate: PropTypes.string.isRequired,
      endDate: PropTypes.string,
      description: PropTypes.string,
      achievements: PropTypes.arrayOf(PropTypes.string),
      technologies: PropTypes.arrayOf(PropTypes.string),
    })
  ).isRequired,
  isOwnProfile: PropTypes.bool,
  onAddExperience: PropTypes.func,
  onRemoveExperience: PropTypes.func,
};

export default ExperienceList;
