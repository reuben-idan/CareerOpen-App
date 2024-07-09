import React, { useState } from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import logo from '../logo.jpeg';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: '',
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.role === 'jobseeker') {
      navigate('/jobseeker-profile');
    } else if (formData.role === 'employer') {
      navigate('/employer-profile');
    } else {
      // Handle invalid role
      console.error('Invalid user role');
    }
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center vh-100">
      <Card className="shadow border-0 rounded-lg w-auto">
        <Card.Body>
          <div className="text-center mb-4">
            <img src={logo} alt="CareerOpen Logo" style={{ maxWidth: '200px' }} />
            <h2 className="display-4 mt-3">Login</h2>
          </div>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={formData.email} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" value={formData.password} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group controlId="formRole">
              <Form.Label>Role</Form.Label>
              <Form.Control as="select" name="role" value={formData.role} onChange={handleInputChange} required>
                <option value="">Select Role</option>
                <option value="jobseeker">Job Seeker</option>
                <option value="employer">Employer</option>
              </Form.Control>
            </Form.Group>
            <div className="d-flex justify-content-center mt-4">
              <Button variant="primary" type="submit" size="lg">
                Login
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;