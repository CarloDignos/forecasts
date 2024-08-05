import React, { useState } from 'react';
import { useLocation, useNavigate  } from 'react-router-dom';
import './AttendeeForm.css';
import { Form, Button, Row, Col, Modal } from 'react-bootstrap';
import backgroundImage from "./homebg.jpg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faSchool, faIdCard } from '@fortawesome/free-solid-svg-icons'; // Import the necessary icons

const AttendeeRegistrationForm = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialEventId = queryParams.get('eventId') || '';
  const eventTitle = queryParams.get('eventTitle') || ''; // Extract event title
  const eventDate = queryParams.get('eventDate') || '';
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    eventId: initialEventId,
    name: '',
    school: '',
    email: '',
    idNumber: null,
  });

  const [showIdNumber, setShowIdNumber] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

const openTermsModal = () => {
  setShowTermsModal(true);
};

const closeTermsModal = () => {
  setShowTermsModal(false);
};

const handleConfirmTerms = () => {
  setAgreedToTerms(true);
  closeTermsModal();
};

const handleCancelTerms = () => {
  setAgreedToTerms(false);
  closeTermsModal();
};
const handleTermsCheckboxChange = () => {
  setAgreedToTerms(!agreedToTerms);
  if (!agreedToTerms) {
    openTermsModal();
  } else {
    closeTermsModal();
  }
};

  const handleCheckboxChange = () => {
    setShowIdNumber(!showIdNumber);
    if (!showIdNumber) {
      setFormData((prevData) => ({ ...prevData, idNumber: null }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'idNumber') {
      setFormData((prevData) => ({ ...prevData, [name]: showIdNumber ? value : null }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.name || !formData.school || (!showIdNumber && !formData.email)) {
      console.log('Please provide all required fields.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5001/register/attendee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {


  
        console.log('Attendee registered successfully.');
        setFormData({
          eventId: initialEventId,
          name: '',
          school: '',
          email: '',
          idNumber: null,
        });
  
        // Transfer data to the new URL
        const transferData = {
          id: initialEventId,
          name: formData.name,
          email: formData.email,
          school: formData.school,
          eventTitle: eventTitle,
          eventDate: eventDate,
        };
  
        // Pass the transferData to the FaceRecognition route
        navigate("/register/attendee/face", { state: { transferData } });
  
      } else {
        const data = await response.json();
        console.log('Error:', data.error);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };



  return (
    <div
      className="background-container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col md={6}>
        <div className="registration-container">
          <div className="centered-content text-center">
            <h2>Register Attendee</h2>
            <p style={{ marginTop: "5px", marginBottom: "1px" }}>Event Title: {eventTitle}</p> {/* Display event title */}
            <p>on {eventDate}</p>
          </div>
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Fullname"
                  value={formData.name}
                  onChange={handleChange}
                />
                <FontAwesomeIcon icon={faUser} className="form-icon" /> {/* Add icon */}
              </Form.Group>
              <Form.Group>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <FontAwesomeIcon icon={faEnvelope} className="form-icon" /> {/* Add icon */}
              </Form.Group>
              <Form.Group>
                <Form.Control
                  type="text"
                  name="school"
                  placeholder="School"
                  value={formData.school}
                  onChange={handleChange}
                />
                <FontAwesomeIcon icon={faSchool} className="form-icon" /> {/* Add icon */}
              </Form.Group>
              <Form.Group>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', marginTop: '5px' }}>
                  <Form.Check
                    type="checkbox"
                    checked={showIdNumber}
                    onChange={handleCheckboxChange}
                    label={<span style={{ fontWeight: 'bold' }}>If Student</span>}
                    style={{ color: '#000000', marginRight: '10px', marginBottom: '0' }}
                  />
              {showIdNumber && (
                  <div style={{ marginLeft: '20px', width: '71%', height: '71%', borderRadius: '25px', marginTop: '14px' }}>
                    <Form.Control
                      type="text"
                      name="idNumber"
                      placeholder="ID Number"
                      value={formData.idNumber || ''}
                      onChange={handleChange}
                      style={{ marginLeft: '5px', marginBottom: '0' }}
                    />
                    <FontAwesomeIcon icon={faIdCard} className="form-icon" style={{ marginTop: '14px' }}/> {/* Add icon */}
                  </div>
                )}
              </div>
            </Form.Group>
            <Form.Group>
              <Form.Check
                type="checkbox"
                checked={agreedToTerms}
                onChange={handleTermsCheckboxChange}
                label="I agree to the Terms and Conditions"
                style={{ color: '#000000', marginRight: '10px', marginBottom: '0' }}
                onClick={openTermsModal} // Open the modal when clicked
              />
            </Form.Group>

        
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
          <Button
            style={{ width: '90%', height: '90%', borderRadius: '25px' }}
            variant="primary"
            type="submit"
            disabled={!agreedToTerms}
          >
            Next
          </Button>
        </div>
          </Form>
        </div>
      </Col>
    </Row>
    <Modal show={showTermsModal} onHide={closeTermsModal}>
  <Modal.Header closeButton>
    <Modal.Title>Terms and Conditions</Modal.Title>
  </Modal.Header>
  <Modal.Body>
  <div>
      <p>Welcome to Web-Based Face Recognition System for Monitoring Event Attendance at TSU-CCS AVR</p>
      <p>By accessing and using our application, you agree to these terms and conditions.</p>

      <h3>1. Registration</h3>
      <p>In order to use certain features of the application, you may be required to register for an attendee for the events.</p>

      <h3>2. User Obligations</h3>
      <p>You agree to provide accurate and up-to-date information during registration and while using the application.</p>

      <h3>3. Privacy</h3>
      <p>Your personal information will be handled in accordance with our Data Privacy Act.</p>

      <h3>4. Use of Content</h3>
      <p>Content provided through the application is for your personal use and should not be reproduced without permission.</p>

      <h3>5. User Conduct</h3>
      <p>You agree not to engage in activities that are unlawful, offensive, or harmful to others.</p>

      <h3>6. Limitation of Liability</h3>
      <p>We are not responsible for any damages or losses resulting from your use of the application.</p>

      <h3>7. Changes to Terms</h3>
      <p>We may update these terms from time to time. It's your responsibility to review the terms periodically.</p>

      <h3>8. Termination</h3>
      <p>We reserve the right to terminate your account and access to the application at our discretion.</p>

      <h3>9. Governing Law</h3>
      <p>These terms are governed by and construed in accordance with the laws of the DATA PRIVARY ACT.</p>

      <h3>10. Contact Us</h3>
      <p>If you have any questions about these terms, please contact us at juantamad@gmail.com.</p>

      <p>Last updated: August, 2023</p>
    </div>
    <p>This is the terms and conditions content...</p>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleCancelTerms}>
      Cancel
    </Button>
    <Button variant="primary" onClick={handleConfirmTerms}>
      Confirm
    </Button>
  </Modal.Footer>
</Modal>
    </div>
  );
};

export default AttendeeRegistrationForm;
