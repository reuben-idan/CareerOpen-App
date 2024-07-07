import React, { useState, useEffect } from 'react';
import {Card, Container, Row, Col, Image, Form, Button, Navbar, Nav, FormControl, Dropdown } from 'react-bootstrap';
import axios from 'axios';
import logo from '../logo.jpeg';


const EmployerProfile = () => {
  const [companyLogo, setCompanyLogo] = useState(null);
  const [companyBanner, setCompanyBanner] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const handleCompanyLogoChange = (event) => {
    setCompanyLogo(event.target.files[0]);
  };

  const handleCompanyBannerChange = (event) => {
    setCompanyBanner(event.target.files[0]);
  };

  const handleEditClick = () => {
    setEditMode(!editMode);
  };

  // Simulate form submission for updating company information
  const handleProfileUpdate = (e) => {
    e.preventDefault();
    // Implement logic to update company profile on the server
    console.log('Company profile updated!');
    setEditMode(false); // Exit edit mode after submission
  };

  // API for fetching company's open positions (replace with actual API)
  const COMPANY_JOBS_API_URL = 'https://your-api.com/api/company/jobs';

  // State variables for company and open positions data
  const [companyName, setCompanyName] = useState('DataHaul Inc.');
  const [companyDescription, setCompanyDescription] = useState(
    'We are a leading company in the tech industry. Join our team!'
  );
  const [companyWebsite, setCompanyWebsite] = useState('https://datahaul.framer.website/');
  const [companyIndustry, setCompanyIndustry] = useState('Technology');
  const [companySize, setCompanySize] = useState(' 500+ Employees');
  const [companyLocation, setCompanyLocation] = useState(' Tema, Greater Accra');
  const [openPositions, setOpenPositions] = useState([]);

  const [role, setRole] = useState(' Senior/Leader FrontEnd Engineer');
  const [location, setLocation] = useState(' Greater Accra');
  const [employmentType, setEmploymentType] = useState(' Remote');
  const [status, setStatus] = useState(' Actively Recruiting');
  const [salary, setSalary] = useState(' GHC 50,000 to GHC 75,000');

  useEffect(() => {
    const fetchOpenPositions = async () => {
      try {
        const response = await axios.get(COMPANY_JOBS_API_URL);
        const jobsData = response.data; // Replace with parsing logic for job data
        setOpenPositions(jobsData);
      } catch (error) {
        console.error('Error fetching open positions:', error);
      }
    };

    fetchOpenPositions();
  }, []);

  const handleSaveClick = () => setEditMode(false); // Update data on save (implementation not shown)

  return (
    <div className="employer-profile">
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
              <Nav.Link href="/companies">Companies</Nav.Link>
              <Nav.Link href="/jobs">All Jobs</Nav.Link>
              <Nav.Link href="/post-job">Post a Job</Nav.Link>
              <Nav.Link href="/messaging">Messaging</Nav.Link>
              <Nav.Link href="/notifications">Notifications</Nav.Link>
              <Nav.Link href="/career-resources">Career Resources</Nav.Link>
            </Nav>

            {/* Company Logo and Dropdown Menu */}
            <Nav>
              <Dropdown>
                <Dropdown.Toggle as={Nav.Link}>
                  <Image
                    src={companyLogo ? URL.createObjectURL(companyLogo) : 'https://via.placeholder.com/50'}
                    alt="Company Logo"
                    roundedCircle width={30} height={30}
                  
                  />
                  <span className="ml-2">{companyName}</span>
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
                  

{/* Company Profile Section */}
<Container className="my-5">
  <Row>
    <Col md={8}>
      {/* Background Image */}
      <div className="background-picture-container">
        <Image
          src={companyBanner ? URL.createObjectURL(companyBanner) : 'https://via.placeholder.com/800x300'}
          alt="Background Picture"
          fluid
        /> <div className="company-logo-wrapper">
        <Image
src={companyLogo? URL.createObjectURL(companyLogo) : 'https://via.placeholder.com/150'}
alt="Profile Picture"  width={150} height={150}
roundedCircle
className="profile-picture-container"
style={{  border: '5px solid white' ,position: 'relative', top: '50%', left: '15%', transform: 'translate(-50%, -50%)' }}
className={editMode ? 'mb-2' : 'mb-3'} 
/>
{editMode && (
<Form.Control type="file" onChange={handleCompanyLogoChange} />
)}
</div>
        {editMode && (
          <Form.Control type="file" onChange={handleCompanyBannerChange} />
        )} 
      </div>

      {/* Company Information */}
      
      <div className="company-info-container mt-3">
       <div className='company-info'> <h2>{companyName}</h2>
        <p>{companyDescription}</p>
        <ul className="company-details">
          <li>
            <span className="detail-title">Website:</span>
            <a href={companyWebsite} target="_blank" rel="noreferrer">
              {companyWebsite}
            </a>
          </li>
          <li>
            <span className="detail-title">Industry:</span>
            <span>{companyIndustry}</span>
          </li>
          <li>
            <span className="detail-title">Company Size:</span>
            <span>{companySize}</span>
          </li>
          <li>
            <span className="detail-title">Location:</span>
            <span>{companyLocation}</span>
          </li>
        </ul>

        {editMode && (
          <Form onSubmit={handleProfileUpdate} id="profile-update-form">
            <Form.Group controlId="formCompanyName">
              <Form.Label>Company Name</Form.Label>
              <Form.Control type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formCompanyDescription">
              <Form.Label>Company Description</Form.Label>
              <Form.Control as="textarea" rows={5} value={companyDescription} onChange={(e) => setCompanyDescription(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formCompanyWebsite">
              <Form.Label>Website</Form.Label>
              <Form.Control type="url" value={companyWebsite} onChange={(e) => setCompanyWebsite(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formCompanyIndustry">
              <Form.Label>Industry</Form.Label>
              <Form.Control type="text" value={companyIndustry} onChange={(e) => setCompanyIndustry(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formCompanySize">
              <Form.Label>Company Size</Form.Label>
              <Form.Control type="text" value={companySize} onChange={(e) => setCompanySize(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formCompanyLocation">
              <Form.Label>Location</Form.Label>
              <Form.Control type="text" value={companyLocation} onChange={(e) => setCompanyLocation(e.target.value)} />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button variant="secondary" mr={2} onClick={handleEditClick}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" form="profile-update-form">
                Save Changes
              </Button>  </div>
              </Form>
            ) } 
  <Button variant="secondary" style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)' }} onClick={handleEditClick}>
    Edit Profile
  </Button></div></div>   
 

<hr />
    

      {/* Company Information */}
      <Col xs={12} md={12} className=" justify-content-start"> {/* Adjust col size and float as needed */}
      <Card className="shadow">
        <Card.Body>
          <Card.Title>Positions</Card.Title>
          <Card.Text>
      <div className="company-info-container mt-3">
       <div className='company-info'> <h2>{role}</h2>
        <p>{role}</p>
        <ul className="company-details">
          <li>
            <span className="detail-title">Location:</span>
            <a href={location} target="_blank" rel="noreferrer">
              {location}
            </a>
          </li>
          <li>
            <span className="detail-title">Employment Type:</span>
            <span>{employmentType}</span>
          </li>
          <li>
            <span className="detail-title">Status:</span>
            <span>{status}</span>
          </li>
          <li>
            <span className="detail-title">Salary Range:</span>
            <span>{salary}</span>
          </li>
        </ul>

        {editMode && (
          <Form onSubmit={handleProfileUpdate} id="profile-update-form">
            <Form.Group controlId="formCompanyName">
              <Form.Label>Company Name</Form.Label>
              <Form.Control type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formCompanyDescription">
              <Form.Label>Company Description</Form.Label>
              <Form.Control as="textarea" rows={5} value={companyDescription} onChange={(e) => setCompanyDescription(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formCompanyWebsite">
              <Form.Label>Website</Form.Label>
              <Form.Control type="url" value={companyWebsite} onChange={(e) => setCompanyWebsite(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formCompanyIndustry">
              <Form.Label>Industry</Form.Label>
              <Form.Control type="text" value={companyIndustry} onChange={(e) => setCompanyIndustry(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formCompanySize">
              <Form.Label>Company Size</Form.Label>
              <Form.Control type="text" value={companySize} onChange={(e) => setCompanySize(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formCompanyLocation">
              <Form.Label>Location</Form.Label>
              <Form.Control type="text" value={companyLocation} onChange={(e) => setCompanyLocation(e.target.value)} />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button variant="secondary" mr={2} onClick={handleEditClick}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" form="profile-update-form">
                Save Changes
              </Button>  </div>
              </Form>
            ) } 
  <Button variant="secondary" style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)' }}onClick={handleEditClick}>
    Edit Profile
  </Button></div></div>   
  </Card.Text></Card.Body>
      </Card>
    </Col>
    </Col>

    {/* Analytics Dashboard Placeholder (replace with actual implementation) */}
    <Col md={4}>
      <h3>Analytics Dashboard (Coming Soon!)</h3>
      <p>This section will provide insights into your company's job postings and applicant pool.</p>
    </Col>
  </Row>
</Container>


</div>

        )};
export default EmployerProfile;
