import React, { useState } from 'react';

const ProfilePictureUpload = ({ onProfilePictureUpload }) => {
  const [profilePicture, setProfilePicture] = useState(null);

  const handleProfilePictureUpload = (event) => {
    const file = event.target.files[0];
    setProfilePicture(file);
    onProfilePictureUpload(file);
  };

  return (
    <div className="profile-picture-upload">
      <label htmlFor="profile-picture">
        {profilePicture ? (
          <img src={URL.createObjectURL(profilePicture)} alt="Profile" />
        ) : (
          <i className="fas fa-user-circle"></i>
        )}
      </label>
      <input
        type="file"
        id="profile-picture"
        accept="image/*"
        onChange={handleProfilePictureUpload}
      />
    </div>
  );
};

export default ProfilePictureUpload;