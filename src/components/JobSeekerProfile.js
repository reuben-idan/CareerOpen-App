import React, { Component } from 'react';
import { Container, Row, Col, Image, Form, Button, Navbar, Nav, FormControl,Dropdown } from 'react-bootstrap';

class JobSeekerProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profilePicture: null,
      backgroundPicture: null,
      name: 'John Doe',
      occupation: 'Software Engineer',
      skills: ['JavaScript', 'React.js', 'Node.js'],
      experience: [
        { title: 'Software Engineer', company: 'ABC Inc.', duration: '2 years' },
        { title: 'Intern', company: 'XYZ Corp.', duration: '6 months' },
      ],
      education: [
        { degree: 'Bachelor of Science in Computer Science', institution: 'University of Example', graduationYear: 2020 },
      ],
      certifications: [
        { name: 'AWS Certified Developer', issuingOrganization: 'Amazon Web Services' },
        { name: 'React.js Certified Developer', issuingOrganization: 'Udemy' },
      ],
      projects: [
        { name: 'Job Seeker Profile', description: 'A React.js application for job seekers to showcase their profile' },
        { name: 'E-commerce Website', description: 'A full-stack web application for an online store' },
      ],
      interests: ['Coding', 'Reading', 'Traveling'],
    };

    this.handleProfilePictureChange = this.handleProfilePictureChange.bind(this);
    this.handleBackgroundPictureChange = this.handleBackgroundPictureChange.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleProfilePictureChange(event) {
    this.setState({ profilePicture: event.target.files[0] });
  }

  handleBackgroundPictureChange(event) {
    this.setState({ backgroundPicture: event.target.files[0] });
  }

  handleLogout() {
    // Implement logout functionality here
  }

  render() {
    const { profilePicture, backgroundPicture, name, occupation, skills, experience, education, certifications, projects, interests } = this.state;

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
            <Nav.Link href="/me">
                <Image src={profilePicture ? URL.createObjectURL(profilePicture) : 'https://via.placeholder.com/50'} alt="Profile Picture" roundedCircle height="40" />
                <span className="ml-2">{name}</span>
                </Nav.Link>

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
            <Container className="my-5">
          <Row>
            <Col md={8}>
              <div className="profile-picture-container">
                <Image
                  src={backgroundPicture ? URL.createObjectURL(backgroundPicture) : 'https://via.placeholder.com/800x300'}
                  alt="Background Picture"
                  fluid
                />
                <Form.Control type="file" onChange={this.handleBackgroundPictureChange} />
           
              <div className="profile-info-container mt-3">
                <Image
                  src={profilePicture ? URL.createObjectURL(profilePicture) : 'https://via.placeholder.com/150'}
                  alt="Profile Picture"
                  roundedCircle
                  className="mb-3"
                />
                <Form.Control type="file" onChange={this.handleProfilePictureChange} />
                {/* ... rest of the component */}
              </div>   </div>
            </Col>
           
          </Row>
        </Container>
              <div className="profile-info-container mt-3">
               
                
                <h2>{name}</h2>
                <p className="lead">{occupation}</p>
                <hr />
                <h3>About Me</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                <hr />
                <h3>Experience</h3>
                <ul className="list-unstyled">
                  {experience.map((exp, index) => (
                    <li key={index}>
                      <h4>{exp.title}</h4>
                      <p>{exp.company} - {exp.duration}</p>
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
                      <h4>{cert.name}</h4>
                      <p>{cert.issuingOrganization}</p>
                    </li>
                  ))}
                </ul>
                <hr />
                <h3>Projects</h3>
                <ul className="list-unstyled">
                  {projects.map((project, index) => (
                    <li key={index}>
                      <h4>{project.name}</h4>
                      <p>{project.description}</p>
                    </li>
                  ))}
                </ul>
                <hr />
                <h3>Skills</h3>
                <ul className="list-unstyled">
                  {skills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
                <hr />
                <h3>Interests</h3>
                <ul className="list-unstyled">
                  {interests.map((interest, index) => (
                    <li key={index}>{interest}</li>
                  ))}
                </ul>
                <hr />
                <Form.Group>
                  <Form.Label>Resume</Form.Label>
                  <Form.Control type="file" />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Certifications</Form.Label>
                  <Form.Control type="file" />
                </Form.Group>
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
                  </div>);
  }}

                  export default JobSeekerProfile;
      