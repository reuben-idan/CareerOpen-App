import "react";
import PropTypes from "prop-types";
import { FaPen } from "react-icons/fa";

const ProfileHeader = ({ user }) => {
  return (
    <div className="relative bg-gray-200">
      {/* Background Image */}
      <div
        className="h-48 bg-cover bg-center"
        style={{
          backgroundImage: `url(${user.backgroundPicture})`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>

      {/* Profile Information */}
      <div className="container mx-auto px-8 -mt-16 relative">
        <div className="bg-white rounded-lg shadow-lg p-8 flex items-center justify-between">
          <div className="flex items-center">
            {/* Profile Picture */}
            <img
              src={user.profilePicture}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white"
            />
            <div className="ml-6">
              <h1 className="text-3xl font-semibold text-gray-800">
                {user.name}
              </h1>
              <p className="text-xl text-gray-600">{user.headline}</p>
              <p className="text-sm text-gray-500 mt-2">{user.location}</p>
            </div>
          </div>
          {/* Edit Profile Button */}
          <button className="bg-blue-600 text-white px-4 py-2 rounded-full flex items-center space-x-2 hover:bg-blue-700">
            <FaPen />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// PropTypes validation
ProfileHeader.propTypes = {
  user: PropTypes.shape({
    profilePicture: PropTypes.string.isRequired, // Validate `profilePicture` as a required string
    backgroundPicture: PropTypes.string.isRequired, // Validate `backgroundPicture` as a required string
    name: PropTypes.string.isRequired, // Validate `name` as a required string
    headline: PropTypes.string.isRequired, // Validate `headline` as a required string
    location: PropTypes.string.isRequired, // Validate `location` as a required string
  }).isRequired,
};

export default ProfileHeader;
