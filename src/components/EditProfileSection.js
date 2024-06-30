import React, { useState } from 'react';

const EditProfileSection = ({ profileData, onProfileUpdate }) => {
  const [editMode, setEditMode] = useState(false);
  const [updatedData, setUpdatedData] = useState(profileData);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = () => {
    onProfileUpdate(updatedData);
    setEditMode(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUpdatedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="edit-profile-section">
      <h3>About Me</h3>
      {editMode ? (
        <textarea
          name="about"
          value={updatedData.about}
          onChange={handleInputChange}
        ></textarea>
      ) : (
        <p>{updatedData.about}</p>
      )}

      <h3>Experience</h3>
      {updatedData.experience.map((item) => (
        <div key={item.id} className="experience-item">
          <h4>{item.role}</h4>
          <p>{item.company}</p>
          <p>{item.duration}</p>
        </div>
      ))}

      {/* Add similar sections for Education, Certifications, Projects, Skills, and Interests */}

      {editMode ? (
        <div className="edit-buttons">
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setEditMode(false)}>Cancel</button>
        </div>
      ) : (
        <button onClick={handleEdit}>Edit</button>
      )}
    </div>
  );
};

export default EditProfileSection;