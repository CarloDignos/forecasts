import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const TermsAndConditionsModal = ({ show, onHide, onConfirm }) => {
  return (
    <Modal show={show} onHide={onHide}>
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
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TermsAndConditionsModal;
