import { useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes for validation
import { useUser } from "../context/UserContext";

const EditProfileModal = ({ onClose }) => {
  const { user, updateUser } = useUser();
  const [editedUser, setEditedUser] = useState({ ...user });
  const [profilePicturePreview, setProfilePicturePreview] = useState(
    user.profilePicture
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePicturePreview(reader.result);
        setEditedUser((prev) => ({
          ...prev,
          profilePicture: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updateUser(editedUser);
    onClose();
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

      {/* Profile Picture Section */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Profile Picture
        </label>
        <div className="flex items-center">
          <img
            src={profilePicturePreview}
            alt="Profile Preview"
            className="w-16 h-16 rounded-full mr-4"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePictureChange}
            className="text-sm text-gray-600"
          />
        </div>
      </div>

      {/* Headline Section */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Headline
        </label>
        <input
          type="text"
          name="headline"
          value={editedUser.headline}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 text-sm"
        />
      </div>

      {/* Save and Cancel Buttons */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save
        </button>
        <button
          onClick={onClose}
          className="ml-2 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

// PropTypes validation
EditProfileModal.propTypes = {
  onClose: PropTypes.func.isRequired, // Validate onClose as a required function
};

// Example PropTypes for UserContext
EditProfileModal.contextTypes = {
  user: PropTypes.shape({
    profilePicture: PropTypes.string.isRequired,
    headline: PropTypes.string.isRequired,
  }),
  updateUser: PropTypes.func.isRequired,
};

export default EditProfileModal;
