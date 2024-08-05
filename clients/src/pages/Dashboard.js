import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./Dashboard.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useSelector } from "react-redux";
import backgroundImage from './20945843.jpg'; // Import the image

function Dashboard() {
  const user = useSelector((state) => state.user);
  const userType = user.userType;
  const userId = user._id; // Assuming _id is the user's ID
  // State to store attendee count
  const [attendeeCount, setAttendeeCount] = useState(0);

  // State to store event count
  const [eventCount, setEventCount] = useState(0);
 // State to store user counts
 const [userCounts, setUserCounts] = useState({
  Admin: 0,
  EventOrganizer: 0,
  EventMonitoring: 0,
});

// Fetch user data and calculate counts
useEffect(() => {
  // Replace this with your actual API call to fetch user data
  // For demonstration, we'll set some dummy data here
  const dummyUserData = [
    { userType: "Admin" },
    { userType: "Event Organizer" },
    { userType: "Event Monitoring" },
    // Add more user data as needed
  ];

  const counts = dummyUserData.reduce((acc, user) => {
    if (user.userType === "Admin") {
      acc.Admin++;
    } else if (user.userType === "Event Organizer") {
      acc.EventOrganizer++;
    } else if (user.userType === "Event Monitoring") {
      acc.EventMonitoring++;
    }
    return acc;
  }, { ...userCounts });

  setUserCounts(counts);
}, []);



  // Fetch event data and calculate event count
  useEffect(() => {
    // Replace this with your actual API call to fetch event data
    // For demonstration, we'll set some dummy data here
    const dummyEventData = [
      { createdId: userId },
      { createdId: "anotherUserId" },
      { createdId: userId },
      // Add more event data as needed
    ];

    const count = dummyEventData.reduce((acc, event) => {
      if (event.createdId === userId) {
        acc++;
      }
      return acc;
    }, 0);

    setEventCount(count);
  }, [userId]);

  useEffect(() => {
    // Replace this with your actual API call to fetch attendee data
    // For demonstration, we'll set some dummy data here
    const dummyAttendeeData = [
      { eventId: "event1", createdId: userId },
      { eventId: "event1", createdId: "anotherUserId" },
      { eventId: "event2", createdId: userId },
      // Add more attendee data as needed
    ];

    const count = dummyAttendeeData.reduce((acc, attendee) => {
      if (attendee.eventId === "event1" && attendee.createdId === userId) {
        acc++;
      }
      return acc;
    }, 0);

    setAttendeeCount(count);
  }, [userId]);
  return (
    <Container className="mainboard">
      
      
      {userType === "Admin" && ( 
        <>
          
        </>
      )}


      {userType === "User" && ( 
        <>
        {/* 
        <h1 className="dashboard-title text-center">Welcome to Dashboard {user.userType}</h1>
          
          <Row className="justify-content-center row-Organizer">
          <Col md={3}>
                <div className="dashboard-card">
                  <i className="fas fa-users user-icon"></i>
                  <span className="user-count">{userCounts.EventMonitoring}</span>
                  <h3>Event Monitoring</h3>
                </div>
            </Col>
            <Col md={3}>
                <div className="dashboard-card">
                  <i className="fas fa-calendar-alt user-icon"></i>
                  <span className="scheduled-events">{eventCount}</span>
                  <h3>Scheduled events</h3>
                </div>
            </Col>
          </Row>*/}
        </>
      )}


      {userType === "Event Monitoring" && ( 
        <>
        <h1 className="dashboard-title text-center">Welcome to Dashboard {user.userType}</h1>
          {/*Event Monitoring View*/}
          <Row className="justify-content-center row-Organizer">
            <Col md={3}>
                <div className="dashboard-card">
                  <i className="fas fa-calendar-alt user-icon"></i>
                  <span className="scheduled-events">{eventCount}</span>
                  <h3>Scheduled events</h3>
                </div>
            </Col>
            <Col md={3}>
                <div className="dashboard-card">
                  <i className="fas fa-clock event-icon"></i>
                  <span className="ongoing-events">{attendeeCount}</span>
                  <h3>Attendee's Register</h3>
                </div>
            </Col>
          </Row>
        </>
      )}

    </Container>
  );
}

export default Dashboard;