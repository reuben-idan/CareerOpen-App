import React from 'react';

const ProfileHeader = ({ profileData, profilePicture, backgroundPicture }) => {
  return (
    <div className="profile-header">
      <div
        className="background-picture"
        style={{
          backgroundImage: `url(${backgroundPicture || 'default-background.jpg'})`,
        }}
      ></div>
      <div className="profile-info">
        <div className="profile-picture">
          {profilePicture ? (
            <img src={profilePicture} alt="Profile" />
          ) : (
            <i className="fas fa-user-circle"></i>
          )}
        </div>
        <h2>{profileData.name}</h2>
        <p>{profileData.headline}</p>
        <div className="contact-info">
          <p>
            <i className="fas fa-envelope"></i> {profileData.email}
          </p>
          <p>
            <i className="fas fa-phone"></i> {profileData.phone}
          </p>
          <p>
            <i className="fas fa-map-marker-alt"></i> {profileData.location}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;