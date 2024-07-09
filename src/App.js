import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
import Login from './components/Login';
import Registration from './components/Registration';
import JobSeekerProfile from './components/JobSeekerProfile';
import EmployerProfile from './components/EmployerProfile';

const App = () => {
  return (
    <Router>
      <div>
        <Navbar bg="light" expand="lg">
          <Container>
            <Navbar.Brand as={Link} to="/">
              CareerOpen
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/registration">
                Sign Up
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/jobseeker-profile" element={<JobSeekerProfile />} />
          <Route path="/employer-profile" element={<EmployerProfile />} />
          {/* Add other routes as needed */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;