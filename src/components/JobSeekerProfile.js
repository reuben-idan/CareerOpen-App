import React, { useState,useEffect,localStorage } from 'react';
import {Card, Container, Row, Col, Image, Form, Button, Navbar, Nav, FormControl, Dropdown } from 'react-bootstrap';
import ExperienceSection from './ExperienceSection';
import EducationSection from './EducationSection';
import axios from 'axios';
import logo from '../logo.jpeg';
import background from '../background.jpeg';
import jobseeker_picture from '../Jobseeker_picture.jpg'
import Advert2 from '../Advert2.jpg';
import Advert1 from '../Advert1.jpg';
import UG from '../UG.jpg';
import Generation from '../Generation.jpeg';
import python from '../python.jpeg';
import javascript from '../javascript.jpeg';
import react from '../react.png';
import bootstrap from '../bootstrap.jpeg';
import { applyToJob } from './../backendCompenents/applicationController';

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


const JOB_API_URL= 'https://boards-api.greenhouse.io/v1/boards/{board_token}/job'; // Replace with actual API endpoint
const AD_API_URL = 'https://advertising-api-fe.amazon.com';  // Replace with actual API endpoint
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

  const [name, setName] = useState(' Evelyn Idan');
  const [occupation, setOccupation] = useState('Software Engineer');
  const [skills, setSkills] = useState(['JavaScript', 'React.js', 'Node.js']);

  // ... job boards and recommendations
  const [companyName, setCompanyName] = useState('DataHaul Inc.');
  const [role, setRole] = useState(' Senior/Leader FrontEnd Engineer');
  const [location, setLocation] = useState(' Greater Accra');
  const [employmentType, setEmploymentType] = useState(' Remote');
  const [status, setStatus] = useState(' Actively Recruiting');
  const [salary, setSalary] = useState(' GHC 50,000 to GHC 75,000');
  

  // ... job boards 2
  const [companyName2, setCompanyName2] = useState('Morgan Stanley');
  const [role2, setRole2] = useState('Senior Fullstack Software Engineer (FinTech/Cryptocurrency/ Stablecoins)');
  const [location2, setLocation2] = useState(' New York');
  const [employmentType2, setEmploymentType2] = useState(' Remote');
  const [status2, setStatus2] = useState(' Actively Recruiting');
  const [salary2, setSalary2] = useState(' USD $200,000 to USD $300,000');

  // ... Education

 
  const [institution, setInstitution] = useState('University of Ghana, Legon');
  const [course, setCourse] = useState('Computer Engineering');
  const [time, setTime] = useState('2016-2020');
  const [description, setDescription] = useState('In this Computer Engineering program, I embark on a transformative journey to cultivate essential skills and master the tools needed for success in this exciting and highly rewarding role.');
  
   // ... Experience

 
   const [company4, setCompany4] = useState('Generation Ghana');
   const [role4, setRole4] = useState(' Freelance Web Developer');
   const [duration, setDuration] = useState('2020-2024');
   const [jobDescription, setJobDescription] = useState('In this comprehensive Web Developer freelance role, I embark on a transformative journey to cultivate essential skills and master the tools needed for success in this exciting and highly rewarding role.');
  

   // ...Skills

   
   const [skills1, setSkills1] = useState('Javascript');
   const [skills2, setSkills2] = useState('React.js');
   const [skills3, setSkills3] = useState('Bootstrap');
   const [skills4, setSkills4] = useState('Python');
   // ... other user data (experience, education, certifications, projects, interests)
  const [experience, setExperience] = useState("5+ years of progressive software engineering Experience across two companies, building and maintaining web applications and APIs. Developed a strong foundation in Design Thinking Methodologies while designing and implementing user-friendly web applications at Apple Inc.Leveraged expertise in UI Implementation, to lead the development of critical [product/feature] at Meta, resulting in 15% new App visits.Demonstrated a collaborative spirit, working effectively across teams to deliver high-quality, scalable software solutions."
);
const [education, setEducation] = useState([]); // Assuming an array of education objects
const [certifications, setCertifications] = useState([]); // Assuming an array of certification objects
const [aboutMe, setAboutMe] = useState("Hi there! I'm Evelyn Idan, a passionate and results-oriented Software Engineer based in Accra, Ghana. I have  experience in  web development, mobile app development, data structures and algorithms and a strong desire to leverage my skills to create innovative and user-friendly software solutions"

); // Initial state with placeholder text
const [projects, setProjects] = useState([]); // Array of project objects

const [interests, setInterests] = useState([]); // Array of interest strings (or objects)
const [languages, setLanguages] = useState([]); // Array of language strings (or objects)

const [hobbies, setHobbies] = useState([]); // Array of hobby strings (or
const handleSaveClick = () => setEditMode(false); // Update data on save (implementation not shown)




  return (
    <div className="job-seeker-profile">
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
                    src={jobseeker_picture || 'https://via.placeholder.com/50'}
                    alt="Profile Picture"
                    roundedCircle width={30} height={30}
                    
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
            <div className="background-picture-container ">
              <Image
                src={background || 'https://via.placeholder.com/800x300'}
                alt="Background Picture"
                fluid
              />   <div className="profile-picture-wrapper">
              <Image
   src={jobseeker_picture || 'https://via.placeholder.com/150'}
   alt="Profile Picture"  width={150} height={150}
   roundedCircle 
    className="profile-picture-container"
              style={{  border: '5px solid white' ,position: 'relative', top: '50%', left: '15%', transform: 'translate(-50%, -50%)' }}
  
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
  <Button variant="secondary" style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)' }} onClick={handleEditClick}>
    Edit Profile
  </Button>
)}
<hr />
</div></div>

{/* About Me, Experience, Education, etc. sections */}
<div>
<Col xs={12} md={12} className="justify-content-start"> {/* Adjust col size and float as needed */}
      <Card className="shadow">
        <Card.Body>
          <Card.Title>About Me</Card.Title>
          <Card.Text>



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
</Card.Text></Card.Body>
      </Card>
    </Col>

    



<hr />

{/*...Experience */}
<Col xs={12} md={12} className=" justify-content-start"> {/* Adjust col size and float as needed */}
      <Card className="shadow">
        <Card.Body>
          <Card.Title>Experience</Card.Title>
          <Card.Text>
      <div className="company-info-container mt-3">
       <div className='company-info'> <div> <h2><Image
                    src={Generation}
                    alt="Profile Picture"
                    fluid width={50} height={50}
                    
                  />{role4}</h2></div>
        <p>{company4} <i>{duration}</i></p>

        <span className="detail-title"></span>
            <span>{jobDescription}</span>
         
       
         
         
       
        <hr />
{/*Job position 2 */}
        

        {editMode && (
          <Form onSubmit={handleProfileUpdate} id="profile-update-form">
            <Form.Group controlId="formCompanyName">
              <Form.Label>Organization</Form.Label>
              <Form.Control type="text" value={company4} onChange={(e) => setCompany4(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formCompanyDescription">
              <Form.Label>Role</Form.Label>
              <Form.Control as="textarea" rows={5} value={role4} onChange={(e) => setRole4(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formCompanyWebsite">
              <Form.Label>Duration</Form.Label>
              <Form.Control type="text" value={duration} onChange={(e) => setTime(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formCompanyIndustry">
              <Form.Label>Job Description</Form.Label>
              <Form.Control type="text" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} />
            </Form.Group>
            
            {/* ... send position */}

           
            
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
    Edit Experience
  </Button></div></div>   
  </Card.Text></Card.Body>
      </Card>
    </Col>



<hr />
<Col xs={12} md={12} className=" justify-content-start"> {/* Adjust col size and float as needed */}
      <Card className="shadow">
        <Card.Body>
          <Card.Title>Education</Card.Title>
          <Card.Text>
      <div className="company-info-container mt-3">
       <div className='company-info'> <div> <h2><Image
                    src={UG}
                    alt="Profile Picture"
                    fluid width={50} height={50}
                    
                  />{institution}</h2></div>
        <p>{course} <i>{time}</i></p>

        <span className="detail-title"></span>
            <span>{description}</span>
         
       
         
         
       
        <hr />
{/*Job position 2 */}
        

        {editMode && (
          <Form onSubmit={handleProfileUpdate} id="profile-update-form">
            <Form.Group controlId="formCompanyName">
              <Form.Label>Institution</Form.Label>
              <Form.Control type="text" value={institution} onChange={(e) => setInstitution(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formCompanyDescription">
              <Form.Label>Course</Form.Label>
              <Form.Control as="textarea" rows={5} value={course} onChange={(e) => setCourse(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formCompanyWebsite">
              <Form.Label>Time</Form.Label>
              <Form.Control type="text" value={time} onChange={(e) => setTime(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formCompanyIndustry">
              <Form.Label>Description</Form.Label>
              <Form.Control type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
            </Form.Group>
            
            {/* ... send position */}

           
            
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
    Edit Education
  </Button></div></div>   
  </Card.Text></Card.Body>
      </Card>
    </Col>


<hr />
<Col xs={12} md={12} className="justify-content-start"> {/* Adjust col size and float as needed */}
      <Card className="shadow">
        <Card.Body>
          <Card.Title>Resume</Card.Title>
          <Card.Text>

<Form.Group>
                  <Form.Label><h3></h3></Form.Label>
                  <Form.Control type="file" />
                </Form.Group>

                </Card.Text>
</Card.Body>
      </Card>
    </Col>
    <hr />

    <Col xs={12} md={12} className="justify-content-start"> {/* Adjust col size and float as needed */}
      <Card className="shadow">
        <Card.Body>
          <Card.Title>Certifications</Card.Title>
          <Card.Text>
                <Form.Group>
                  <Form.Label><h3></h3></Form.Label>
                  <Form.Control type="file" />
                </Form.Group>
                </Card.Text>
</Card.Body>
      </Card>
    </Col>

<hr />

<Col xs={12} md={12} className="justify-content-start"> {/* Adjust col size and float as needed */}
      <Card className="shadow">
        <Card.Body>
          <Card.Title>Projects</Card.Title>
          <Card.Text>

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

</Card.Text>
</Card.Body>
      </Card>
    </Col>

<hr />
{/*...Skills */}
<Col xs={12} md={12} className="  justify-content-start"> {/* Adjust col size and float as needed */}
      <Card className="shadow">
        <Card.Body>
          <Card.Title>Skills</Card.Title>
          <Card.Text>
      <div className="company-info-container mt-3">
       <div className='company-info'> <div> <p><Image
                    src={javascript}
                    alt="Profile Picture"
                    fluid roundedCircle width={50} height={50}
                    
                  />{skills1}</p></div>
                 
                  <div> <p><Image
                    src={react}
                    alt="Profile Picture"
                    fluid  roundedCircle width={50} height={50}
                    
                  />{skills2}</p></div>
                  <div> <p><Image
                    src={bootstrap}
                    alt="Profile Picture"
                    fluid  roundedCircle width={50} height={50}
                    
                  />{skills3}</p></div>
                  <div> <p><Image
                    src={python}
                    alt="Profile Picture"
                    fluid roundedCircle width={50} height={50}
                    
                  />{skills4}</p></div>
           
         
       
         
         
       
        <hr />
{/*Job position 2 */}
        

        {editMode && (
          <Form onSubmit={handleProfileUpdate} id="profile-update-form">
            <Form.Group controlId="formCompanyName">
              <Form.Label>Skills 1</Form.Label>
              <Form.Control type="text" value={skills1} onChange={(e) => setSkills1(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formCompanyDescription">
              <Form.Label>Skills 2</Form.Label>
              <Form.Control as="textarea" rows={5} value={skills2} onChange={(e) => setSkills2(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formCompanyWebsite">
              <Form.Label>Skills 3</Form.Label>
              <Form.Control type="text" value={skills3} onChange={(e) => setSkills3(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formCompanyIndustry">
              <Form.Label>Skill 4</Form.Label>
              <Form.Control type="text" value={skills4} onChange={(e) => setSkills4(e.target.value)} />
            </Form.Group>
            
            {/* ... send position */}

           
            
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
    Edit Skills
  </Button></div></div>   
  </Card.Text></Card.Body>
      </Card>
    </Col>

<hr />

<Col xs={12} md={12} className="justify-content-start"> {/* Adjust col size and float as needed */}
      <Card className="shadow">
        <Card.Body>
          <Card.Title>Interests</Card.Title>
          <Card.Text>

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
</Card.Text>
</Card.Body>
      </Card>
    </Col>
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



{/* ... Suggested Jobs */}

  <Col md={4}>
    <h3>Suggested Jobs</h3>
    <Col xs={12} md={12} className=" justify-content-start"> {/* Adjust col size and float as needed */}
      <Card className="shadow">
        <Card.Body>
          <Card.Title>Positions</Card.Title>
          <Card.Text>
      <div className="company-info-container mt-3">
       <div className='company-info'> <h2>{role}</h2>
        <p>{companyName}</p>
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

        
  <Button variant="secondary" style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)' }}>
   Apply
  </Button></div></div>   
  </Card.Text></Card.Body>
      </Card>
    </Col>

    <hr />
    {/* ... Second job posting */}

    <Col xs={12} md={12} className=" justify-content-start"> {/* Adjust col size and float as needed */}
      <Card className="shadow">
        <Card.Body>
          <Card.Title>Positions</Card.Title>
          <Card.Text>
      <div className="company-info-container mt-3">
       <div className='company-info'> <h2>{role2}</h2>
        <p>{companyName2}</p>
        <ul className="company-details">
          <li>
            <span className="detail-title">Location:</span>
            <a  target="_blank" rel="noreferrer">
              {location2}
            </a>
          </li>
          <li>
            <span className="detail-title">Employment Type:</span>
            <span>{employmentType2}</span>
          </li>
          <li>
            <span className="detail-title">Status:</span>
            <span>{status2}</span>
          </li>
          <li>
            <span className="detail-title">Salary Range:</span>
            <span>{salary2}</span>
          </li>
        </ul>

        
  <Button variant="secondary" style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)' }}>
   Apply
  </Button></div></div>   
  </Card.Text></Card.Body>
      </Card>
    </Col>

    <hr />
    
    <h3>Recommended Ads</h3>
    
    <Col xs={12} md={12} className="justify-content-start">
  <Card className="shadow">
    <Card.Img variant="top" src={Advert2} alt="Background Picture" fluid />
    <Card.Body>
      <Button variant="secondary" style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)' }} >
        Buy
      </Button>
    </Card.Body>
  </Card>
</Col>
< hr />
{/* ..... Second Advert */}


<Col xs={12} md={12} className="justify-content-start">
  <Card className="shadow">
    <Card.Img variant="top" src={Advert1} alt="Background Picture" fluid />
    <Card.Body>
      <Button variant="secondary" style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)' }} >
        Buy
      </Button>
    </Card.Body>
  </Card>
</Col>
  </Col>
  </Row>
  </Container>
  </div>


)};


export default JobSeekerProfile;
