import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Navbar, Nav, Form, FormControl, Image, Dropdown } from 'react-bootstrap';
import { FaUserCircle, FaFileUpload, FaPencilAlt } from 'react-icons/fa';

import profilePicture from '../ProfilePicture.jpg';

const Profile = ({ onLogout}) => {
  const navigate = useNavigate();
  const [userProfilePicture, setUserProfilePicture] = useState(null);
  const [backgroundPicture, setBackgroundPicture] = useState(null);
  const [aboutMe, setAboutMe] = useState('');
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    // Fetch user profile data from the API
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (response.ok) {
          setUserProfilePicture(data.profilePicture);
          setBackgroundPicture(data.backgroundPicture);
          setAboutMe(data.aboutMe);
          setExperience(data.experience);
          setEducation(data.education);
          setCertifications(data.certifications);
          setProjects(data.projects);
          setSkills(data.skills);
        } else {
          console.error('Failed to fetch profile data:', data.error);
        }
      } catch (error) {
        console.error('Error during profile data fetch:', error);
      }
    };

    fetchProfileData();
  }, []);

  const handleLogout = () => {
    // Remove the token from local storage or a cookie
    localStorage.removeItem('token');
    onLogout();
    navigate('/login');
  

  return (
    <div>
      {/* Render the user profile */}
      <LogoutButton onLogout={handleLogout} />
    </div>
  );
  };

const LogoutButton = ({ onLogout }) => {
  return (
    <button onClick={onLogout}>
      Logout
    </button>
  );
};

  const handleProfilePictureUpload = (event) => {
    const file = event.target.files[0];
    setUserProfilePicture(URL.createObjectURL(file));
    // Save the updated profile picture to local storage
    localStorage.setItem('profileData', JSON.stringify({ ...JSON.parse(localStorage.getItem('profileData')), profilePicture: URL.createObjectURL(file) }));
  };

  const handleBackgroundPictureUpload = (event) => {
    const file = event.target.files[0];
    setBackgroundPicture(URL.createObjectURL(file));
    // Save the updated background picture to local storage
    localStorage.setItem('profileData', JSON.stringify({ ...JSON.parse(localStorage.getItem('profileData')), backgroundPicture: URL.createObjectURL(file) }));
  };

  const handleAboutMeUpdate = (event) => {
    setAboutMe(event.target.value);
    // Save the updated about me to local storage
    localStorage.setItem('profileData', JSON.stringify({ ...JSON.parse(localStorage.getItem('profileData')), aboutMe: event.target.value }));
  };

  const handleEducationUpdate = (event) => {
    const { name, value } = event.target;
    setEducation(prevEducation => ({
      ...prevEducation,
      [name]: value
    }));
    const profileData = JSON.parse(localStorage.getItem('profileData'));
    localStorage.setItem('profileData', JSON.stringify({ ...profileData, education: { ...profileData.education, [name]: value } }));
  };
  
  const handleCertificationsUpdate = (event) => {
    const { name, value } = event.target;
    setCertifications(prevCertifications => ({
      ...prevCertifications,
      [name]: value
    }));
    const profileData = JSON.parse(localStorage.getItem('profileData'));
    localStorage.setItem('profileData', JSON.stringify({ ...profileData, certifications: { ...profileData.certifications, [name]: value } }));
  };
  
  const handleProjectsUpdate = (event) => {
    const { name, value } = event.target;
    setProjects(prevProjects => ({
      ...prevProjects,
      [name]: value
    }));
    const profileData = JSON.parse(localStorage.getItem('profileData'));
    localStorage.setItem('profileData', JSON.stringify({ ...profileData, projects: { ...profileData.projects, [name]: value } }));
  };
  
  const handleSkillsUpdate = (event) => {
    const { name, value } = event.target;
    setSkills(prevSkills => ({
      ...prevSkills,
      [name]: value
    }));
    const profileData = JSON.parse(localStorage.getItem('profileData'));
    localStorage.setItem('profileData', JSON.stringify({ ...profileData, skills: { ...profileData.skills, [name]: value } }));
  };

  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg">
      {/* Logo and Search Bar */}
      <Navbar.Brand href="/">
        <img
          src="path/to/your/logo.png"
          alt="Website Logo"
          style={{ height: '30px' }}
        />
      </Navbar.Brand>
      <Form className="d-flex">
        <FormControl
          type="search"
          placeholder="Search"
          aria-label="Search"
          className="mr-2"
          style={{ width: '300px' }}
        />
      </Form>

      {/* Navigation Links */}
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/my-network">My Network</Nav.Link>
          <Nav.Link href="/jobs">Jobs</Nav.Link>
          <Nav.Link href="/messaging">Messaging</Nav.Link>
          <Nav.Link href="/notifications">Notifications</Nav.Link>
          <Nav.Link href="/career-resources">Career Resources</Nav.Link>
        </Nav>

        {/* Profile Picture and Dropdown Menu */}
        <Nav>
          <Dropdown>
            <Dropdown.Toggle as={Nav.Link}>
              <img
                src={profilePicture}
                alt="Profile Picture"
                className="rounded-circle"
                style={{ height: '30px' }}
              />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="/profile">Profile</Dropdown.Item>
              <Dropdown.Item href="/settings">Settings</Dropdown.Item>
              <Dropdown.Item href="/account">Account</Dropdown.Item>
              <Dropdown.Item href="/logout">Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>

        {/* Business Dropdown Menu */}
        <Nav>
          <Dropdown>
            <Dropdown.Toggle as={Nav.Link}>Business</Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="/business/products">Products</Dropdown.Item>
              <Dropdown.Item href="/business/services">Services</Dropdown.Item>
              <Dropdown.Item href="/business/partners">Partners</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>

      <Container className="my-5">
        <Row>
          <Col md={8}>
            <Card className="mb-4">
              <Card.Body>
                <div className="text-center mb-4">
                  <img
                    src={userProfilePicture || 'default-profile.png'}
                    alt="Profile"
                    className="rounded-circle"
                    width="150"
                    height="150"
                  />
                  <Button variant="primary" className="mt-2" onClick={() => document.getElementById('profilePicture').click()}>
                    <FaFileUpload /> Update Profile Picture
                  </Button>
                  <input type="file" id="profilePicture" accept="image/*" style={{ display: 'none' }} onChange={handleProfilePictureUpload} />
                </div>
                <h2 className="text-center mb-4">About Me</h2>
                <textarea
                  className="form-control mb-2"
                  rows="3"
                  value={aboutMe}
                  onChange={handleAboutMeUpdate}
                ></textarea>
                <Button variant="primary" className="float-right">
                  <FaPencilAlt /> Edit
                </Button>
              </Card.Body>
            </Card>

            {/* Add similar sections for experience, education, certifications, projects, and skills */}
            <Card className="mb-4">
              <Card.Body>
                <h2 className="text-center mb-4">Education</h2>
                {/* Render the education information here */}
                <Button variant="primary" className="float-right">
                  <FaPencilAlt /> Edit
                </Button>
              </Card.Body>
            </Card>

            <Card className="mb-4">
              <Card.Body>
                <h2 className="text-center mb-4">Certifications</h2>
                {/* Render the certifications information here */}
                <Button variant="primary" className="float-right">
                  <FaPencilAlt /> Edit
                </Button>
              </Card.Body>
            </Card>

            <Card className="mb-4">
              <Card.Body>
                <h2 className="text-center mb-4">Projects</h2>
                {/* Render the projects information here */}
                <Button variant="primary" className="float-right">
                  <FaPencilAlt /> Edit
                </Button>
              </Card.Body>
            </Card>

            <Card className="mb-4">
              <Card.Body>
                <h2 className="text-center mb-4">Skills</h2>
                {/* Render the skills information here */}
                <Button variant="primary" className="float-right">
                  <FaPencilAlt /> Edit
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            {/* Fetch and display live feeds of adverts and job opportunities using an API */}
            <h2 className="mb-4">Ads and Job Opportunities</h2>
            {/* Render the fetched content here */}
            <div>
              {/* Render the ads and job opportunities here */}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Profile;