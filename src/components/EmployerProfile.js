import React, { useState, useEffect, } from 'react';
import {Card, Container, Row, Col, Image, Form, Button, Navbar, Nav, FormControl, Dropdown } from 'react-bootstrap';
import axios from 'axios';
import logo from '../logo.jpeg';
import DataHaul_logo from '../DataHaul_logo.jpeg';
import haulbackground from '../haulbackground.jpg';
import Applicants  from '../Applicants.jpg';
import applicants4 from '../applicants4.jpg'
import jobposting3 from '../jobposting3.png';
import analytics from '../analytics.jpeg';


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

   // ... job boards 2
   const [companyName2, setCompanyName2] = useState('Morgan Stanley');
   const [role2, setRole2] = useState('Senior Fullstack Software Engineer (FinTech/Cryptocurrency/ Stablecoins)');
   const [location2, setLocation2] = useState(' New York');
   const [employmentType2, setEmploymentType2] = useState(' Remote');
   const [status2, setStatus2] = useState(' Actively Recruiting');
   const [salary2, setSalary2] = useState(' USD $200,000 to USD $300,000');



   // ... job boards 3
   const [companyName3, setCompanyName3] = useState('Morgan Stanley');
   const [role3, setRole3] = useState(' Data Science Associate');
   const [location3, setLocation3] = useState(' Greater Accra');
   const [employmentType3, setEmploymentType3] = useState(' Remote');
   const [status3, setStatus3] = useState(' Actively Recruiting');
   const [salary3, setSalary3] = useState(' GHC 40,000 to GHC 50,000');

  const [role, setRole] = useState(' Senior/Leader FrontEnd Engineer');
  const [location, setLocation] = useState(' Greater Accra');
  const [employmentType, setEmploymentType] = useState(' Remote');
  const [status, setStatus] = useState(' Actively Recruiting');
  const [salary, setSalary] = useState(' GHC 50,000 to GHC 75,000');
  const [jobPostings, setJobPostings] = useState([]);
  const [applicants, setApplicants] = useState([]);

  const AnalyticsDashboard = () => {
 
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch('https://your-api-endpoint.com/analytics', {
            // Add authentication headers if needed
            headers: {
              'Authorization': 'Bearer your_access_token'
            }
          });
      
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
      
          const data = await response.json();
          // Update your state variables with the fetched data
          setJobPostings(data.jobPostings);
          setApplicants(data.applicants);
        } catch (error) {
          console.error('Error fetching data:', error);
          // Handle errors appropriately (e.g., display an error message)
        }
      };
  
      fetchData();
    }, []);}
  const handleSaveClick = () => setEditMode(false); // Update data on save (implementation not shown)

  return (
    <div className="employer-profile">
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
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
                    src={DataHaul_logo || 'https://via.placeholder.com/50'}
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
          src={haulbackground || 'https://via.placeholder.com/800x300'}
          alt="Background Picture"
          fluid
        /> <div className="company-logo-wrapper">
        <Image
src={DataHaul_logo || 'https://via.placeholder.com/150'}
alt="Profile Picture"  width={150} height={150}
roundedCircle
className="profile-picture-container"
style={{  border: '5px solid white' ,position: 'relative', top: '50%', left: '15%', transform: 'translate(-50%, -50%)' }}

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
            <a  target="_blank" rel="noreferrer">
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
        <hr />
{/*Job position 2 */}
        <h2>{role3}</h2>
        <p>{role3}</p>
        <ul className="company-details">
          <li>
            <span className="detail-title">Location:</span>
            <a  target="_blank" rel="noreferrer">
              {location3}
            </a>
          </li>
          <li>
            <span className="detail-title">Employment Type:</span>
            <span>{employmentType3}</span>
          </li>
          <li>
            <span className="detail-title">Status:</span>
            <span>{status3}</span>
          </li>
          <li>
            <span className="detail-title">Salary Range:</span>
            <span>{salary3}</span>
          </li>
        </ul>

        {editMode && (
          <Form onSubmit={handleProfileUpdate} id="profile-update-form">
            <Form.Group controlId="formCompanyName">
              <Form.Label>Role</Form.Label>
              <Form.Control type="text" value={role} onChange={(e) => setRole(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formCompanyDescription">
              <Form.Label>Location</Form.Label>
              <Form.Control as="textarea" rows={5} value={location} onChange={(e) => setLocation(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formCompanyWebsite">
              <Form.Label>Employment Type</Form.Label>
              <Form.Control type="url" value={employmentType} onChange={(e) => setEmploymentType(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formCompanyIndustry">
              <Form.Label>Status</Form.Label>
              <Form.Control type="text" value={status} onChange={(e) => setStatus(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formCompanySize">
              <Form.Label>Salary</Form.Label>
              <Form.Control type="text" value={salary} onChange={(e) => setSalary(e.target.value)} />
            </Form.Group>
            {/* ... send position */}

            <Form.Group controlId="formCompanyName">
              <Form.Label>Role</Form.Label>
              <Form.Control type="text" value={role3} onChange={(e) => setRole3(e.target.value)} />
            </Form.Group>
            
            <Form.Group controlId="formCompanyDescription">
              <Form.Label>Location</Form.Label>
              <Form.Control as="textarea" rows={5} value={location3} onChange={(e) => setLocation3(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formCompanyWebsite">
              <Form.Label>Employment Type</Form.Label>
              <Form.Control type="url" value={employmentType3} onChange={(e) => setEmploymentType3(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formCompanyIndustry">
              <Form.Label>Status</Form.Label>
              <Form.Control type="text" value={status3} onChange={(e) => setStatus3(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formCompanySize">
              <Form.Label>Salary</Form.Label>
              <Form.Control type="text" value={salary3} onChange={(e) => setSalary3(e.target.value)} />
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
    Edit Positions
  </Button></div></div>   
  </Card.Text></Card.Body>
      </Card>
    </Col>
    </Col>

    {/* Analytics Dashboard Placeholder (replace with actual implementation) */}
    <Col md={4}>
      <h3>Analytics Dashboard</h3>
      <div>
        
       {/* ... job posting Analytics*/}

    <Col xs={12} md={12} className=" justify-content-start"> {/* Adjust col size and float as needed */}
      <Card className="shadow">
        <Card.Body>
          <Card.Title>Job Postings Analytics</Card.Title>
          <Card.Text>
      <div className="company-info-container mt-3">
       <div className='company-info'>  <Image
                    src={analytics }
                    alt="Profile Picture"
                   fluid 
                    
                  />
                  < hr />
                  <Image
                    src={jobposting3}
                    alt="Profile Picture"
                   fluid 
                    
                  />         
        <hr />

        
  <Button variant="secondary" style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)' }}>
   Learn more
  </Button></div></div>   
  </Card.Text></Card.Body>
      </Card>
    </Col>

    <hr />
      </div>
      <div>
       
         {/* ... Applicants Analytics*/}

    <Col xs={12} md={12} className=" justify-content-start"> {/* Adjust col size and float as needed */}
      <Card className="shadow">
        <Card.Body>
          <Card.Title>Applicants Analytics</Card.Title>
          <Card.Text>
      <div className="company-info-container mt-3">
       <div className='company-info'>  <Image
                    src={applicants4 }
                    alt="Profile Picture"
                   fluid 
                    
                  />
                 
                  <Image
                    src={Applicants}
                    alt="Profile Picture"
                   fluid 
                    
                  />         
       <hr />
        
  <Button variant="secondary" style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)' }}>
   Learn more
  </Button></div></div>   
  </Card.Text></Card.Body>
      </Card>
    </Col>

      </div>
    </Col>
  </Row>
</Container>


</div>

        )};
export default EmployerProfile;
