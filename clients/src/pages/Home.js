import React from "react";
import { Row, Col, Button, Container} from "react-bootstrap";
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import "./Home.css";

function Home() {
    const navigate = useNavigate(); // Create a navigate function

    const handleSignUpClick = () => {
        navigate('/register'); // Navigate to the "/registration" route
    }

    return (
        <Container>    
            <Row>
                <Col md={1}>  </Col>

                <Col md={5} className="home__bg justify-content-center" style={{ minWidth: "450px", maxWidth: "450px"}}></Col>
                <Col md={5} className="d-flex flex-direction-column align-items-center justify-content-center">
                    <div className="button-container">
                        <h1>Web-Based Chicken Management System Utilizing Time Series Analysis Forecast</h1>
                        <p>This system digital platform designed to assist poultry farmers in managing their chicken farms more efficiently. It leverages time series analysis, a statistical technique, to make predictions and forecasts related to various aspects of chicken farming, such as growth rates, feed consumption, and egg production. This system provides real-time data and insights, helping farmers make informed decisions and optimize their operations for better productivity and profitability.</p>
                        <Button
                            className="expanded-button"
                            style={{borderRadius: "15px", backgroundColor: "#e58e26", borderColor: "#fff", color: "black" }}
                            onClick={handleSignUpClick} // Add an onClick handler to call handleSignUpClick
                        >
                            Sign Up here
                        </Button>
                    </div>
                </Col>        
            </Row>
        </Container>
    );
}

export default Home;
