import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import "@fortawesome/fontawesome-free/css/all.min.css";

function Reports() {
  return (
    <Container className="mainboard">
      <Row className="justify-content-center">
        <h2 className="dashboard-title text-center">Welcome to Reports </h2>
        <Col md={3}>
          <Link to="/UserInformation"> {/* Add Link to navigate to /UserInformation */}
            <div className="dashboard-card">
              <i className="fas fa-users user-icon"></i>
              <span className="user-count">1000</span>
              <h3>Number of users</h3>
            </div>
          </Link>
        </Col>
        </Row>
    </Container>
    );
}

export default Reports;

