import React from "react";
import { Link } from "react-router-dom";
import {
  UserCircleIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
  PencilIcon,
  CameraIcon,
} from "@heroicons/react/24/outline";
import { useUser } from "../../context/auth";

const ProfileCard = ({ profile, onEdit }) => {
  const { user } = useUser();
  const isOwnProfile = user?.uid === profile.id;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card overflow-hidden">
      {/* Cover Photo */}
      <div className="relative h-32 bg-gradient-to-r from-primary-500 to-primary-600">
        {profile.coverPhoto ? (
          <img
            src={profile.coverPhoto}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center">
            <div className="text-center text-white">
              <CameraIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm opacity-75">No cover photo</p>
            </div>
          </div>
        )}

        {/* Cover Photo Edit Button */}
        {isOwnProfile && (
          <button
            onClick={() => onEdit && onEdit()}
            className="absolute top-2 right-2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-all duration-200"
            title="Edit cover photo"
          >
            <CameraIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Profile Content */}
      <div className="px-6 py-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative -mt-16 group">
              <div className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden shadow-lg">
                {profile.photoURL ? (
                  <img
                    src={profile.photoURL}
                    alt={profile.displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <UserCircleIcon className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Profile Picture Edit Overlay */}
              {isOwnProfile && (
                <div className="absolute inset-0 rounded-full bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer">
                  <div className="text-center text-white">
                    <CameraIcon className="h-6 w-6 mx-auto mb-1" />
                    <span className="text-xs">Change Photo</span>
                  </div>
                </div>
              )}
            </div>
            <div className="pt-16">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {profile.displayName || profile.name || "User"}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {profile.headline || profile.title || "Professional"}
              </p>
            </div>
          </div>

          {isOwnProfile && (
            <button
              onClick={onEdit}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit Profile
            </button>
          )}
        </div>

        {/* Contact Information */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {profile.location && (
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <MapPinIcon className="h-5 w-5 mr-2 text-gray-400" />
              <span>{profile.location}</span>
            </div>
          )}
          {profile.email && (
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <EnvelopeIcon className="h-5 w-5 mr-2 text-gray-400" />
              <a
                href={`mailto:${profile.email}`}
                className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                {profile.email}
              </a>
            </div>
          )}
          {profile.phone && (
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <PhoneIcon className="h-5 w-5 mr-2 text-gray-400" />
              <a
                href={`tel:${profile.phone}`}
                className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                {profile.phone}
              </a>
            </div>
          )}
          {profile.website && (
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <GlobeAltIcon className="h-5 w-5 mr-2 text-gray-400" />
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                {profile.website}
              </a>
            </div>
          )}
        </div>

        {/* About */}
        {profile.about && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              About
            </h3>
            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed">
              {profile.about}
            </p>
          </div>
        )}

        {/* Experience */}
        {profile.experience?.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Experience
            </h3>
            <div className="space-y-4">
              {profile.experience.map((exp, index) => (
                <div key={index} className="flex items-start">
                  <BriefcaseIcon className="h-5 w-5 mt-1 mr-3 text-gray-400" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {exp.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      {exp.company}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {exp.startDate} - {exp.endDate || "Present"}
                    </p>
                    {exp.description && (
                      <p className="mt-1 text-gray-600 dark:text-gray-300">
                        {exp.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {profile.education?.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Education
            </h3>
            <div className="space-y-4">
              {profile.education.map((edu, index) => (
                <div key={index} className="flex items-start">
                  <AcademicCapIcon className="h-5 w-5 mt-1 mr-3 text-gray-400" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {edu.degree}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      {edu.school}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {edu.startDate} - {edu.endDate || "Present"}
                    </p>
                    {edu.description && (
                      <p className="mt-1 text-gray-600 dark:text-gray-300">
                        {edu.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {profile.skills?.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200"
                >
                  {typeof skill === "string" ? skill : skill.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
