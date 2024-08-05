import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import './FaceDetection.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSchool, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import backgroundImage from "./homebg.jpg";

function App() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialEventId = queryParams.get('eventId') || '';
  const eventTitle = queryParams.get('eventTitle') || ''; // Extract event title
  const eventDate = queryParams.get('eventDate') || '';
  const [eventId, setEventId] = useState(initialEventId);
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState(null);
  const [isCameraMode, setIsCameraMode] = useState(false); // Track camera or file mode
  const webcamRef = useRef(null);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [webcamError, setWebcamError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  
  const handleWebcamError = (error) => {
    setWebcamError(error);
  };

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
  


  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
    setIsCameraMode(false); // Hide the camera after capturing
  };

  const handleUpload = (event) => {
    const selectedImage = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const imageSrc = reader.result;
      setImage(imageSrc);
      setIsCameraMode(false); // Hide the camera button and webcam
    };

    if (selectedImage) {
      reader.readAsDataURL(selectedImage);
    }
  };

  const handleSubmit = async () => {
    try {
      // Check if any of the eventId is empty
      if (!eventId) {
        alert('Please! the field for eventId is empty.');
        return;
      }
      // Check if any of the name is empty
      if (!name) {
        alert('Please! the field for name is empty.');
        return;
      }
      // Check if any of the school is empty
      if (!school) {
        alert('Please! the field for school is empty.');
        return;
      }
      // Check if any of the email is empty
      if (!email) {
        alert('Please! the field for email is empty.');
        return;
      }
      // Check if any of the agreement is empty
      if (!agreedToTerms) {
        alert('Please agree to the Terms and Conditions.');
        return;
      }
      // Check if any of the capture is empty
      if (!image) {
        alert('Please capture or upload an image.');
        return;
      }
      setIsLoading(true);
      const formData = new FormData();
      formData.append('image', dataURLtoFile(image, 'image.png'));
      formData.append('eventId', eventId);
      formData.append('name', name);
      formData.append('school', school);
      formData.append('email', email);
  
      await axios.post('http://localhost:5001/post-face', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      // If the request is successful, clear the form and image
      setEventId('');
      setName('');
      setSchool('');
      setEmail('');
      setImage(null);
      setIsLoading(false); // Set loading state to false
      alert('Successfully saved data');
    } catch (error) {
      setIsLoading(false); // Set loading state to false
      if (error.response && error.response.data && error.response.data.message) {
        // If the server returns an error message, display it to the user
        alert(error.response.data.message);
      } else {
        // Handle other types of errors
        console.error(error);
        alert('An error occurred while uploading the image.');
      }
    }
  };
  
  

  // Convert Data URL to File
  function dataURLtoFile(dataUrl, filename) {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }


  return (
    <div className='background-container' style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="justify-content-center align-items-center min-vh-100">
      {isLoading && (
        <div className="spinner">
<div className="dot"></div>
<div className="dot"></div>
<div className="dot"></div>
<div className="dot"></div>
<div className="dot"></div></div>
        )}
                {!isLoading && (
            <>
        <div className={`registration-container ${isLoading ? 'loading' : '' }`}>

          <div className="centered-contents text-center">

            <h1>Register Attendee</h1>
            <p style={{ marginTop: "5px", marginBottom: "1px" }}>Event Title: {eventTitle}</p> {/* Display event title */}
            <p>on {eventDate}</p>
          </div>
    <div className="input-container">
      <input type="text" placeholder="Event ID" value={eventId} onChange={(e) => setEventId(e.target.value)} style={{ display: 'none' }}/>
    </div>
    <div className="input-container">
      <FontAwesomeIcon icon={faUser} />
      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
    </div>
    <div className="input-container">
      <FontAwesomeIcon icon={faSchool} />
      <input type="text" placeholder="School" value={school} onChange={(e) => setSchool(e.target.value)} />
    </div>
    <div className="input-container">
      <FontAwesomeIcon icon={faEnvelope} />
      <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
    </div>
      {isCameraMode ? (
        <>
      <div className='webcontainer'>
            {webcamError ? (
              <div className="error-message">
                Error loading webcam: Please! refresh this site to load the camera.
              </div>
            ) : (
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/png"
                className="webcam"
                onUserMediaError={handleWebcamError}
              />
            )}

            {!webcamError && (
              <button
                onClick={handleCapture}
                className="capture-button"
              >
                <i className="fas fa-camera"></i>
              </button>
            )}
          </div>
        </>
      ) : (
        <>
          <input type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }}/>
          {image && <img src={image} alt="Captured/Uploaded" className="captured-image"/>}
        </>
      )}
      <br />
{image && (
  <Button className="clear-image-button" onClick={() => setImage(null)}>Clear Image</Button>
)}
<Button className="toggle-camera-button" onClick={() => setIsCameraMode(!isCameraMode)}>
  {isCameraMode ? 'Hide Camera' : 'Show Camera'}
</Button>
<Button className="submit-button" onClick={handleSubmit}>Submit</Button>
   
      <div className="input-inline">
      <input
        type="checkbox"
        checked={agreedToTerms}
        onChange={handleTermsCheckboxChange}
        style={{ color: '#000000', marginRight: '10px', marginBottom: '0' }}
        onClick={openTermsModal}
      />
      <label htmlFor="agreedToTerms"className="center-label">I agree to the Terms and Conditions</label>
      </div>

    </div>
    </>
          )}        
    </div>
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
      <p>If you have any questions about these terms, please contact us at facerecognition123@gmail.com.</p>

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
}

export default App;