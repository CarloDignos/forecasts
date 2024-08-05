import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Alert, Container, Modal } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import botImg from "../assets/bot.jpeg";
import { useNavigate } from 'react-router-dom';
import "./Signup.css";

function RegistrationForm() {
  const [user, setUser] = useState({
    userType: 'User',
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    password: '',
    picture: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [upladingImg, setUploadingImg] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file.size >= 2097152) {
      alert("Max file size is 2mb");
    } else {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    if (user.password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!termsAccepted) {
      setError('You must accept the terms and conditions');
      return;
    }
    try {
      // Upload the image and get the URL
      if (image) {
        const imageUrl = await uploadImage();
        user.picture = imageUrl;
      }

      const response = await axios.post('http://localhost:5001/users/', user);
      if (response.status === 201) {
        setSuccessMessage(response.data.message);
        navigate('/login'); // Navigate to the login page upon successful registration
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError('User already exists');
      } else {
        setError('Failed to register user');
      }
    }
  };

  async function uploadImage() {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "jmkohxmf");
    try {
      setUploadingImg(true);
      let res = await fetch("https://api.cloudinary.com/v1_1/aspiree14/image/upload", {
        method: "post",
        body: data,
      });
      const urlData = await res.json();
      setUploadingImg(false);
      return urlData.url;
    } catch (error) {
      setUploadingImg(false);
      console.log(error);
    }
  }

  const handleTermsChange = (e) => {
    setTermsAccepted(e.target.checked);
    if (e.target.checked) {
      setShowModal(true);
    }
  };

  const handleCloseModal = () => setShowModal(false);

  return (
    <Container>
      <div className="text-center signup-form-container">
        <h1>Create an account</h1>
        {error && <Alert variant="danger">{error}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group style={{ marginBottom: "20px" }}>
            <div className="signup-profile-pic__container">
              <img src={imagePreview || botImg} className="signup-profile-pic" alt="" />
              <label htmlFor="image-upload" className="image-upload-label">
                <i className="fas fa-plus-circle add-picture-icon"></i>
              </label>
              <input
                type="file"
                id="image-upload"
                hidden
                accept="image/png, image/jpeg"
                onChange={handleImageChange}
              />
            </div>
          </Form.Group>
          <Form.Group style={{ marginBottom: "20px" }}>
            <Form.Control
              type="text"
              name="userType"
              placeholder="User Type"
              onChange={handleInputChange}
              value={user.userType}
              required
              style={{ display: "none" }}
            />
          </Form.Group>
          <Form.Group style={{ marginBottom: "20px", borderRadius: "25px" }}>
            <Form.Control
            style={{ borderRadius: "25px" }}
              type="text"
              name="firstName"
              placeholder="First Name"
              onChange={handleInputChange}
              value={user.firstName}
              required
            />
          </Form.Group>
          <Form.Group style={{ marginBottom: "20px", borderRadius: "25px" }}>
            <Form.Control
            style={{ borderRadius: "25px" }}
              type="text"
              name="middleName"
              placeholder="Middle Name"
              onChange={handleInputChange}
              value={user.middleName}
            />
          </Form.Group>
          <Form.Group style={{ marginBottom: "20px", borderRadius: "25px" }}>
            <Form.Control
            style={{ borderRadius: "25px" }}
              type="text"
              name="lastName"
              placeholder="Last Name"
              onChange={handleInputChange}
              value={user.lastName}
              required
            />
          </Form.Group>
          <Form.Group style={{ marginBottom: "20px" }}>
            <Form.Control
              style={{ borderRadius: "25px" }}
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleInputChange}
              value={user.email}
              required
            />
          </Form.Group>
          <Form.Group style={{ position: 'relative', marginBottom: "20px" }}>
            <Form.Control
              style={{ borderRadius: "25px" }}
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              onChange={handleInputChange}
              value={user.password}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: 15, top: 10, cursor: 'pointer' }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </Form.Group>
          <Form.Group style={{ position: 'relative', marginBottom: "20px" }}>
            <Form.Control
              style={{ borderRadius: "25px" }}
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleConfirmPasswordChange}
              value={confirmPassword}
              required
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{ position: 'absolute', right: 15, top: 10, cursor: 'pointer' }}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </Form.Group>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
            <Form.Group className="terms-conditions-group" style={{ marginBottom: "0" }}>
              <Form.Check
                type="checkbox"
                label=""
                onChange={handleTermsChange}
                required
              />
            </Form.Group>
            <span style={{ marginLeft: "10px" }}>I agree to the Terms and Conditions</span>
          </div>

          <div className="button-container">
            <Button variant="primary" type="submit" className="expanded-button">
              Register
            </Button>
          </div>
        </Form>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Terms and Conditions</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ maxHeight: 'calc(100vh - 210px)', overflowY: 'auto' }}>
            <p>
              Welcome to our Web-Based Chicken Management System ("System"). This System is designed to assist poultry farmers in the Philippines by utilizing time series analysis forecasts to optimize chicken farming operations. By using this System, you agree to comply with and be bound by the following terms and conditions. Please read them carefully.
            </p>
            <h5>Acceptance of Terms</h5>
            <p>
              By accessing and using the System, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these Terms and Conditions, you should not use the System.
            </p>
            <h5>Description of the System</h5>
            <p>
              The System is a digital platform that assists poultry farmers in managing their chicken farms more efficiently. It leverages time series analysis to make predictions and forecasts related to various aspects of chicken farming, such as growth rates, feed consumption, and egg production. The System provides real-time data and insights to help farmers make informed decisions and optimize their operations for better productivity and profitability.
            </p>
            <h5>User Responsibilities</h5>
            <ul>
              <li><b>Accurate Information:</b> You agree to provide accurate and complete information when using the System and to update such information as necessary.</li>
              <li><b>Compliance:</b> You agree to comply with all applicable laws, regulations, and guidelines when using the System.</li>
              <li><b>Account Security:</b> You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.</li>
            </ul>
            <h5>Data and Privacy</h5>
            <ul>
              <li><b>Data Collection:</b> The System collects data related to your chicken farming operations to provide accurate forecasts and insights. By using the System, you consent to the collection and use of this data as described in our Privacy Policy.</li>
              <li><b>Data Security:</b> We implement reasonable security measures to protect your data from unauthorized access and use. However, we cannot guarantee absolute security.</li>
            </ul>
            <h5>Intellectual Property</h5>
            <ul>
              <li><b>Ownership:</b> All content and materials available on the System, including but not limited to text, graphics, logos, and software, are the property of the System's operators or their licensors and are protected by applicable intellectual property laws.</li>
              <li><b>Use of Content:</b> You may not reproduce, distribute, modify, create derivative works of, publicly display, or otherwise use any content from the System without prior written permission from the System's operators.</li>
            </ul>
            <h5>Limitation of Liability</h5>
            <ul>
              <li><b>No Warranty:</b> The System is provided "as is" and "as available" without any warranties of any kind, either express or implied. We do not warrant that the System will be uninterrupted, error-free, or free from viruses or other harmful components.</li>
              <li><b>Limited Liability:</b> In no event shall the System's operators be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in connection with the use of the System.</li>
            </ul>
            <h5>Changes to Terms</h5>
            <p>
              We reserve the right to modify these Terms and Conditions at any time. Any changes will be effective immediately upon posting the updated Terms and Conditions on the System. Your continued use of the System after any such changes constitutes your acceptance of the new Terms and Conditions.
            </p>
            <h5>Governing Law</h5>
            <p>
              These Terms and Conditions shall be governed by and construed in accordance with the laws of the Philippines, without regard to its conflict of law principles.
            </p>
            <h5>Contact Information</h5>
            <p>
              If you have any questions or concerns about these Terms and Conditions, please contact us at:
            </p>
            <p>
              Information@gmail.com 
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Container>
  );
}

export default RegistrationForm;
