import React, { useState } from 'react';

const BackgroundPictureUpload = ({ onBackgroundPictureUpload }) => {
  const [backgroundPicture, setBackgroundPicture] = useState(null);

  const handleBackgroundPictureUpload = (event) => {
    const file = event.target.files[0];
    setBackgroundPicture(file);
    onBackgroundPictureUpload(file);
  };

  return (
    <div className="background-picture-upload">
      {backgroundPicture ? (
        <img src={URL.createObjectURL(backgroundPicture)} alt="Background" />
      ) : (
        <div className="placeholder-background"></div>
      )}
      <label htmlFor="background-picture">
        <i className="fas fa-camera"></i> Upload Background
      </label>
      <input
        type="file"
        id="background-picture"
        accept="image/*"
        onChange={handleBackgroundPictureUpload}
      />
    </div>
  );
};

export default BackgroundPictureUpload;