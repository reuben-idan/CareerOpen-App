import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import Registration from './components/Registration';
import Login from './components/Login';
import Profile from './components/Profile';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const handleRegistration = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
    return <Navigate to="/login" />;
  };

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
    return <Navigate to="/profile" />;
  };
  
  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    return <Navigate to="/login" />;
  };
  
  return (
    <Router>
      <Container fluid className="h-100 d-flex flex-column">
        <Row className="flex-grow-1">
          <Col className="d-flex align-items-center justify-content-center">
            <Routes>
              <Route
                path="/registration"
                element={<Registration onRegistration={handleRegistration} />}
              />
              <Route
                path="/login"
                element={token ? <Navigate to="/profile" /> : <Login onLogin={handleLogin} />}
              />
              <Route
                path="/profile"
                element={token ? <Profile onLogout={handleLogout} /> : <Navigate to="/login" />}
              />
              <Route path="*" element={<Navigate to="/registration" />} />
            </Routes>
          </Col>
        </Row>
      </Container>
    </Router>
  );
};

export default App;