import React, { useState,useEffect } from 'react';
import { Container, Row, Col, Image, Form, Button, Navbar, Nav, FormControl, Dropdown } from 'react-bootstrap';
import ExperienceSection from './ExperienceSection';
import EducationSection from './EducationSection';
import axios from 'axios';
import logo from '../logo.jpeg';

const JobSeekerProfile = () => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [backgroundPicture, setBackgroundPicture] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const handleProfilePictureChange = (event) => {
    setProfilePicture(event.target.files[0]);
  };

  const handleBackgroundPictureChange = (event) => {
    setBackgroundPicture(event.target.files[0]);
  };

  const handleEditClick = () => {
    setEditMode(!editMode);
  };

  // Simulate form submission for updating profile information
  const handleProfileUpdate = (e) => {
    e.preventDefault();
    // Implement logic to update user profile on the server
    console.log('Profile updated!');
    setEditMode(false); // Exit edit mode after submission
  };


const JOB_API_URL= 'https://www.glassdoor.com/developer/jobsApiActions.htm'; // Replace with actual API endpoint
const AD_API_URL = 'https://www.glassdoor.com/developer/jobsApiActions.htm';  // Replace with actual API endpoint
const [fetchedJobs, setFetchedJobs] = useState([]);
const [fetchedAds, setFetchedAds] = useState([]);
  
useEffect(() => {
  const fetchJobs = async () => {
    try {
      const response = await axios.get(JOB_API_URL); // Replace with appropriate API call
      const jobData = response.data; // Replace with parsing logic for job data
      setFetchedJobs(jobData);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const fetchAds = async () => {
    try {
      const response = await axios.get(AD_API_URL); // Replace with appropriate API call
      const adData = response.data; // Replace with parsing logic for ad data
      setFetchedAds(adData);
    } catch (error) {
      console.error('Error fetching ads:', error);
    }
  };

  fetchJobs();
  fetchAds();
}, []);

  const [name, setName] = useState('John Doe');
  const [occupation, setOccupation] = useState('Software Engineer');
  const [skills, setSkills] = useState(['JavaScript', 'React.js', 'Node.js']);
  // ... other user data (experience, education, certifications, projects, interests)
  const [experience, setExperience] = useState([]);
const [education, setEducation] = useState([]); // Assuming an array of education objects
const [certifications, setCertifications] = useState([]); // Assuming an array of certification objects
const [aboutMe, setAboutMe] = useState('Enter your about me text here'); // Initial state with placeholder text
const [projects, setProjects] = useState([]); // Array of project objects

const [interests, setInterests] = useState([]); // Array of interest strings (or objects)
const [languages, setLanguages] = useState([]); // Array of language strings (or objects)

const [hobbies, setHobbies] = useState([]); // Array of hobby strings (or
const handleSaveClick = () => setEditMode(false); // Update data on save (implementation not shown)




  return (
    <div className="job-seeker-profile">
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container fluid>
          {/* Logo and Search Bar */}
          <Navbar.Brand href="/">
            <img src={logo} alt="Website Logo" style={{ height: '30px' }} />
          </Navbar.Brand>
          <Form className="d-flex ml-auto">
            <FormControl type="search" placeholder="Search" aria-label="Search" style={{ width: '300px' }} />
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
                  <Image
                    src={profilePicture ? URL.createObjectURL(profilePicture) : 'https://via.placeholder.com/50'}
                    alt="Profile Picture"
                    roundedCircle
                    height="30"
                  />
                  <span className="ml-2">{name}</span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="/profile">Profile</Dropdown.Item>
                  <Dropdown.Item href="/settings">Settings</Dropdown.Item>
                  <Dropdown.Item href="/account">Account</Dropdown.Item>
                  <Dropdown.Item href="/logout">Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Profile Content */}
      <Container className="my-5">
        <Row>
          <Col md={8}>
            {/* Background Picture */}
            <div className="background-picture-container">
              <Image
                src={backgroundPicture ? URL.createObjectURL(backgroundPicture) : 'https://via.placeholder.com/800x300'}
                alt="Background Picture"
                fluid
              />   <div className="profile-picture-wrapper">
              <Image
   src={profilePicture ? URL.createObjectURL(profilePicture) : 'https://via.placeholder.com/150'}
   alt="Profile Picture" fluid width={150}
   rounded
   className={editMode ? 'mb-2' : 'mb-3'} 
 />
 {editMode && (
   <Form.Control type="file" onChange={handleProfilePictureChange} />
 )}
 </div>
              {editMode && (
                <Form.Control type="file" onChange={handleBackgroundPictureChange} />
              )} 
            </div>

            {/* Profile Information */}
            <div className="profile-info-container mt-3">
          

<div className="user-info">
<h2>{name}</h2>
<p className="lead">{occupation}</p>
{editMode ? (
  <Form onSubmit={handleProfileUpdate}>
    <Form.Group controlId="formName">
      <Form.Label>Name</Form.Label>
      <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
    </Form.Group>
    <Form.Group controlId="formOccupation">
      <Form.Label>Occupation</Form.Label>
      <Form.Control type="text" value={occupation} onChange={(e) => setOccupation(e.target.value)} />
    </Form.Group>
    <Button variant="primary" type="submit">
      Save Changes
    </Button>
  </Form>
) : (
  <Button variant="link" onClick={handleEditClick}>
    Edit Profile
  </Button>
)}
<hr />
</div></div>

{/* About Me, Experience, Education, etc. sections */}
<div>
<h3>About Me</h3>


<p>
  {editMode ? (
    <Form.Control
      as="textarea"
      rows={3}
      defaultValue={aboutMe} // Prefill with current about me from state
      onChange={(e) => setAboutMe(e.target.value)} // Update about me on change
    />
  ) : (
    <p>{aboutMe}</p> // Display current about me from state
  )}
</p>



<hr />
<h3>Experience</h3>
<p>
  {editMode ? (
    <Form.Control
      as="textarea"
      rows={3}
      defaultValue={experience} // Prefill with current about me from state
      onChange={(e) => setExperience(e.target.value)} // Update about me on change
    />
  ) : (
    <p>{experience}</p> // Display current about me from state
  )}
</p>

<hr />

<h3>Education</h3>
<p>
  {editMode ? (
    <Form.Control
      as="textarea"
      rows={3}
      defaultValue={education} // Prefill with current about me from state
      onChange={(e) => setEducation(e.target.value)} // Update about me on change
    />
  ) : (
    <p>{education}</p> // Display current about me from state
  )}
</p>


<hr />

<Form.Group>
                  <Form.Label><h3>Resume</h3></Form.Label>
                  <Form.Control type="file" />
                </Form.Group>
                <Form.Group>
                  <Form.Label><h3>Certifications</h3></Form.Label>
                  <Form.Control type="file" />
                </Form.Group>

<hr />

<h3>Projects</h3>
<p>
  {editMode ? (
    <Form.Control
      as="textarea"
      rows={3}
      defaultValue={projects} // Prefill with current about me from state
      onChange={(e) => setProjects(e.target.value)} // Update about me on change
    />
  ) : (
    <p>{projects}</p> // Display current about me from state
  )}
</p>

<hr />

<h3>Skills</h3>
<p>
  {editMode ? (
    <Form.Control
      as="textarea"
      rows={3}
      defaultValue={skills} // Prefill with current about me from state
      onChange={(e) => setSkills(e.target.value)} // Update about me on change
    />
  ) : (
    <p>{skills}</p> // Display current about me from state
  )}
</p>

<hr />

<h3>Interests</h3>
<p>
  {editMode ? (
    <Form.Control
      as="textarea"
      rows={3}
      defaultValue={interests} // Prefill with current about me from state
      onChange={(e) =>setInterests(e.target.value)} // Update about me on change
    />
  ) : (
    <p>{interests}</p> // Display current about me from state
  )}
</p>
{/* ... similar structure for Certifications, Projects, Skills, Interests */}

{editMode && (
  <div className="d-flex justify-content-end">
    <Button variant="secondary" mr={2} onClick={handleEditClick}>
      Cancel
    </Button>
    <Button variant="primary" type="submit" form="profile-update-form">
      Save Changes
    </Button>
  </div>
)}
</div>
</Col>





  <Col md={4}>
    <h3>Suggested Jobs</h3>
    <ul>
      {fetchedJobs.map((job) => (
        <li key={job.id}>{job.title}</li>
      ))}
    </ul>
    <h3>Recommended Ads</h3>
    <ul>
      {fetchedAds.map((ad) => (
        <li key={ad.id}>{ad.title}</li>
      ))}
    </ul>
  </Col>
  </Row>
  </Container>
  </div>


)};


export default JobSeekerProfile;
