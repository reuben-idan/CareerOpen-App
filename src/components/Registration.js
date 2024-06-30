import React, { useState } from 'react';
import { Container, Navbar, Nav, Form, Button, Card } from 'react-bootstrap';
import logo from '../logo.jpeg'; // Import the logo image

const Registration = ({ onSubmit }) => {
  const [userType, setUserType] = useState('jobSeeker');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, userType });
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card className="w-75">
        <Card.Body>
          <div className="d-flex justify-content-center mb-4">
            <img src={logo} alt="CareerOpen Logo" style={{ maxWidth: '200px' }} />
          </div>
          <h2 className="text-center mb-4">Registration</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Check
                type="radio"
                name="userType"
                value="jobSeeker"
                checked={userType === 'jobSeeker'}
                onChange={handleUserTypeChange}
                label="Job Seeker"
              />
              <Form.Check
                type="radio"
                name="userType"
                value="employer"
                checked={userType === 'employer'}
                onChange={handleUserTypeChange}
                label="Employer"
              />
            </Form.Group>
            <div className="d-flex justify-content-center">
              <Button variant="primary" type="submit">
                Register
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Registration;