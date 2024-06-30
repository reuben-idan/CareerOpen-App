import React, { useState } from 'react';
import { Container, Row, Col, Image, Form, Button, Navbar, Nav, FormControl, Dropdown } from 'react-bootstrap';

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
            <img src="path/to/your/logo.png" alt="Website Logo" style={{ height: '30px' }} />
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
                    height="40"
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
              />
              {editMode && (
                <Form.Control type="file" onChange={handleBackgroundPictureChange} />
              )}
            </div>

            {/* Profile Information */}
            <div className="profile-info-container mt-3">
              <div className="profile-picture-wrapper">
             <Image
  src={profilePicture ? URL.createObjectURL(profilePicture) : 'https://via.placeholder.com/150'}
  alt="Profile Picture"
  roundedCircle
  className={editMode ? 'mb-2' : 'mb-3'}
/>
{editMode && (
  <Form.Control type="file" onChange={handleProfilePictureChange} />
)}
</div>

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

<ul className="list-unstyled">
  {experience.map((exp, index) => (
    <li key={index}>
      {editMode ? (
        <div>
          <h4>
            <Form.Control
              type="text"
              defaultValue={exp.title} // Prefill with current title (assuming experience objects have a "title" field)
              onChange={(e) => {
                // Fix: Spread the entire object with updated title
                const updatedExperience = [...experience];
                updatedExperience[index] = { ...updatedExperience[index], title: e.target.value };
                setExperience(updatedExperience);
              }}
            />
          </h4>
          <p>
            <Form.Control
              type="text"
              defaultValue={`${exp.company} - ${exp.duration}`} // Prefill with company and duration (assuming experience objects have "company" and "duration" fields)
              onChange={(e) => {
                const updatedExperience = [...experience];
                const [company, duration] = e.target.value.split(' - ');
                updatedExperience[index].company = company;
                updatedExperience[index].duration = duration;
                setExperience(updatedExperience);
              }}
            />
          </p>
        </div>
      ) : (
        <div>
          <h4>{exp.title}</h4>
          <p>{exp.company} - {exp.duration}</p>
        </div>
      )}
    </li>
  ))}
</ul>

<hr />

<h3>Education</h3>
<ul className="list-unstyled">
  {education.map((edu, index) => (
    <li key={index}>
      <h4>{edu.degree}</h4>
      <p>{edu.institution} - {edu.graduationYear}</p>
    </li>
  ))}
</ul>

<hr />

<h3>Certifications</h3>
<ul className="list-unstyled">
  {certifications.map((cert, index) => (
    <li key={index}>
      <h4>{cert.name}</h4>  {/* Assuming certifications have a "name" field */}
      <p>{cert.issuer} (Issued: {cert.issuedDate ? cert.issuedDate : 'NA'})</p> {/* Optional issued date */}
    </li>
  ))}
</ul>

<hr />

<h3>Projects</h3>
<ul className="list-unstyled">
  {projects.map((project, index) => (
    <li key={index}>
      <h4>{project.title}</h4>
      <p>{project.description}</p> {/* Assuming projects have a "description" field */}
      <a href={project.url} target="_blank" rel="noopener noreferrer">View Project</a> {/* Optional project URL */}
    </li>
  ))}
</ul>

<hr />

<h3>Skills</h3>
<ul className="list-unstyled">
  {skills.map((skill, index) => (
    <li key={index}>
      <span>{skill}</span>  {/* Assuming skills are just strings */}
    </li>
  ))}
</ul>

<hr />

<h3>Interests</h3>
<ul className="list-unstyled">
  {interests.map((interest, index) => (
    <li key={index}>
      <span>{interest}</span>  {/* Assuming interests are just strings */}
    </li>
  ))}
</ul>
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
{/* Live feed of adverts and job opportunities using API */}
<h3>Suggested Jobs</h3>
<ul>
<li>Job 1</li>
<li>Job 2</li>
<li>Job 3</li>
</ul>
<h3>Recommended Ads</h3>
<ul>
<li>Ad 1</li>
<li>Ad 2</li>
</ul>
</Col>
</Row>
</Container>
</div>
);
};

export default JobSeekerProfile;

