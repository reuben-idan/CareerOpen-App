import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const MyComponent = () => {
  return (
    <Container fluid>
      <Row>
        <Col xs={12} sm={6} md={4} lg={3}>
          {/* Content for the first column */}
          <div>...</div>
        </Col>
        <Col xs={12} sm={6} md={4} lg={3}>
          {/* Content for the second column */}
          <div>...</div>
        </Col>
        <Col xs={12} sm={6} md={4} lg={3}>
          {/* Content for the third column */}
          <div>...</div>
        </Col>
        <Col xs={12} sm={6} md={4} lg={3}>
          {/* Content for the fourth column */}
          <div>...</div>
        </Col>
      </Row>
    </Container>
  );
};

export default MyComponent;