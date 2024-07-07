import React, { useState } from 'react';
import { Image, Container, Row, Col, Form, Button } from 'react-bootstrap';

const ProfileHeader = ({ onProfilePictureChange, onBackgroundChange }) => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);

  const handleProfilePictureChange = (event) => {
    setProfilePicture(event.target.files[0]);
  };

  const handleBackgroundChange = (event) => {
    setBackgroundImage(event.target.files[0]);
  };

  return (
    <Container fluid className="profile-header">
      <Row>
        <Col xs={12} md={4} className="d-flex justify-content-center align-items-center">
          {/* Profile Picture */}
          <div className="profile-picture-container">
            <Image
              src={profilePicture ? URL.createObjectURL(profilePicture) : 'https://via.placeholder.com/150'}
              alt="Profile Picture"
              roundedCircle
              fluid
              width={150}
              height={150}
            />
            {onProfilePictureChange && (
              <Form.Control type="file" onChange={handleProfilePictureChange} hidden />
            )}
          </div>
        </Col>
        <Col xs={12} md={8} className="background-container">
          {/* Background Image */}
          <Image
            src={backgroundImage ? URL.createObjectURL(backgroundImage) : 'https://via.placeholder.com/800x300'}
            alt="Background Image"
            fluid
          />
          {onBackgroundChange && (
            <Form.Label htmlFor="background-upload" className="background-upload-label">
              Change Background
              <Form.Control type="file" id="background-upload" onChange={handleBackgroundChange} hidden />
            </Form.Label>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProfileHeader;
