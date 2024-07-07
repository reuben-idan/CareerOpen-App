import React, { useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
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
    <Container fluid className="d-flex justify-content-center align-items-center vh-100">
    <Card className="shadow border-0 rounded-lg w-auto">
      <Card.Body>
        <div className="text-center mb-4">
          <img src={logo} alt="CareerOpen Logo" style={{ maxWidth: '200px' }} />
          <h2 className="display-4 mt-3">Registration</h2>
        </div>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} required />
          </Form.Group>
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" value={formData.email} onChange={handleInputChange} required />
          </Form.Group>
          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name="password" value={formData.password} onChange={handleInputChange} required />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Check
              inline
              type="radio"
              name="userType"
              id="jobSeeker"
              value="jobSeeker"
              checked={userType === 'jobSeeker'}
              onChange={handleUserTypeChange}
              label="Job Seeker"
            />
            <Form.Check
              inline
              type="radio"
              name="userType"
              id="employer"
              value="employer"
              checked={userType === 'employer'}
              onChange={handleUserTypeChange}
              label="Employer"
            />
          </Form.Group>
          <div className="d-grid gap-2">
            <Button variant="primary" type="submit" size="lg">
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