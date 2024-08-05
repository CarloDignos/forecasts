import React, { useState } from "react";
import { Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { useLoginUserMutation } from "../services/appApi";
import { useNavigate } from "react-router-dom";
import adminLogo from "../assets/bot.jpeg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./Logins.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loginUser, { isLoading, error }] = useLoginUserMutation();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [userType, setUserType] = useState(""); // New state variable for user type

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  function handleLogin(e) {
    e.preventDefault();
    // login logic
    loginUser({ email, password }).then(({ data }) => {
      if (data) {
        // Assuming the response contains the user type information, modify this according to your actual API response
        const userType = data.userType; // Replace 'userType' with the actual field name in the API response

        // Set the user type in state
        setUserType(userType);

        // Navigate based on the user type
        switch (userType) {
          case "Admin":
            navigate("/ChickenInformation");
            break;
          case "User":
            navigate("/ChickenInformation");
            break;
          default:
            navigate("/ChickenInformation"); // Navigate to the dashboard by default
            break;
        }
      }
    });
  }

  return (
    <Container className="LoginBox">
      <Row className="align-items-center">
        <Col md={20} className="d-flex align-items-center justify-content-center flex-direction-column">
          <Form style={{ width: "80%", maxWidth: 500 }} onSubmit={handleLogin}>
            
            <Form.Group className="mb-3" controlId="formBasicEmail">
              {error && <p className="alert alert-danger">{error.data}</p>}
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <img src={adminLogo} style={{ width: 100, height: 100 }} alt="" />
              </div>
              <h1 style={{ textAlign: "center" }}>Welcome back</h1>
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} value={email} required style={{ borderRadius: "25px" }} />
              <Form.Text className="text-muted">We'll never share your email with anyone else.</Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <div className="password-input-container">
                <Form.Control type={passwordVisible ? "text" : "password"} placeholder="Password" onChange={(e) => setPassword(e.target.value)} value={password} required style={{ borderRadius: "25px" }} />
                <FontAwesomeIcon
                  icon={passwordVisible ? faEye : faEyeSlash}
                  className="password-toggle-icon"
                  onClick={togglePasswordVisibility}
                />
              </div>
            </Form.Group>
            <button className="lbutton" style={{ width: "100%", borderRadius: "25px" }} variant="primary" type="submit">
              {isLoading ? <Spinner animation="grow" /> : "Login"}
            </button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
