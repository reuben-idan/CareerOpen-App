import React from "react";
import PropTypes from "prop-types";
import { StarIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";

const SkillsList = ({
  skills = [],
  isOwnProfile = false,
  onAddSkill,
  onRemoveSkill,
}) => {
  // Ensure skills is an array and filter out any invalid entries
  const validSkills = Array.isArray(skills)
    ? skills.filter((skill) => typeof skill === "string" && skill.trim() !== "")
    : [];

  const getLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case "expert":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "advanced":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "intermediate":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getLevelStars = (level) => {
    switch (level.toLowerCase()) {
      case "expert":
        return 5;
      case "advanced":
        return 4;
      case "intermediate":
        return 3;
      case "beginner":
        return 2;
      default:
        return 1;
    }
  };

  if (validSkills.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Skills
        </h2>
        <p className="text-gray-500 dark:text-gray-400">No skills added yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Skills & Expertise
        </h3>
        {isOwnProfile && (
          <button
            onClick={onAddSkill}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 transition-colors"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Skill
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {validSkills.map((skill, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {skill}
                  </h4>
                </div>

                {/* Skill Level Stars */}
                <div className="flex items-center space-x-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>
                      {i < getLevelStars(skill) ? (
                        <StarSolidIcon className="h-4 w-4 text-yellow-400" />
                      ) : (
                        <StarIcon className="h-4 w-4 text-gray-300 dark:text-gray-600" />
                      )}
                    </span>
                  ))}
                </div>

                {/* Skill Description */}
                {/* Assuming skill description is not available in the new format */}
              </div>

              {/* Remove Button for Own Profile */}
              {isOwnProfile && onRemoveSkill && (
                <button
                  onClick={() => onRemoveSkill(index)}
                  className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                  title="Remove skill"
                >
                  <MinusIcon className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Skill Progress Bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>Proficiency</span>
                <span>{getLevelStars(skill) * 20}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getLevelStars(skill) * 20}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

SkillsList.propTypes = {
  skills: PropTypes.arrayOf(PropTypes.string),
  isOwnProfile: PropTypes.bool,
  onAddSkill: PropTypes.func,
  onRemoveSkill: PropTypes.func,
};

export default SkillsList;
