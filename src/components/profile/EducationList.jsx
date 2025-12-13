import React from "react";
import PropTypes from "prop-types";
import {
  AcademicCapIcon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const EducationList = ({
  education = [],
  isOwnProfile,
  onAddEducation,
  onRemoveEducation,
}) => {
  const formatDate = (date) => {
    if (!date) return "Present";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  const calculateDuration = (startDate, endDate) => {
    if (!startDate) return "";
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      end.getMonth() -
      start.getMonth();
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    return `${years > 0 ? `${years} ${years === 1 ? "year" : "years"}` : ""} ${
      remainingMonths > 0
        ? `${remainingMonths} ${remainingMonths === 1 ? "month" : "months"}`
        : ""
    }`.trim();
  };

  if (!education || education.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Education</h3>
          {isOwnProfile && (
            <button
              onClick={onAddEducation}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              <PlusIcon className="h-5 w-5 mr-1" />
              Add Education
            </button>
          )}
        </div>
        <p className="text-gray-500 text-sm">No education history added yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Education</h3>
        {isOwnProfile && (
          <button
            onClick={onAddEducation}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            <PlusIcon className="h-5 w-5 mr-1" />
            Add Education
          </button>
        )}
      </div>
      <div className="space-y-6">
        {education.map((edu, index) => (
          <div key={index} className="relative">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center">
                  <AcademicCapIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <h4 className="text-base font-medium text-gray-900">
                    {edu.degree}
                  </h4>
                </div>
                <p className="mt-1 text-sm text-gray-600">{edu.school}</p>
                <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                  {edu.location && (
                    <div className="flex items-center">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      {edu.location}
                    </div>
                  )}
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    {calculateDuration(edu.startDate, edu.endDate)}
                  </div>
                </div>
                {edu.description && (
                  <p className="mt-2 text-sm text-gray-600">
                    {edu.description}
                  </p>
                )}
              </div>
              {isOwnProfile && (
                <button
                  onClick={() => onRemoveEducation(index)}
                  className="ml-4 p-1 text-gray-400 hover:text-gray-500"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
            </div>
            {index < education.length - 1 && (
              <div className="mt-6 border-t border-gray-200" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

EducationList.propTypes = {
  education: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      degree: PropTypes.string.isRequired,
      school: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      startDate: PropTypes.string.isRequired,
      endDate: PropTypes.string,
      description: PropTypes.string,
      gpa: PropTypes.string,
      achievements: PropTypes.arrayOf(PropTypes.string),
      coursework: PropTypes.arrayOf(PropTypes.string),
      activities: PropTypes.arrayOf(PropTypes.string),
    })
  ).isRequired,
  isOwnProfile: PropTypes.bool,
  onAddEducation: PropTypes.func,
  onRemoveEducation: PropTypes.func,
};

export default EducationList;
