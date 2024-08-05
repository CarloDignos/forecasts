import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Col, Row, Button, Form } from 'react-bootstrap';
import { FiPlus, FiUser, FiCamera } from 'react-icons/fi';
import './EventInformation.css';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from "react-redux";

const EventList = () => {
  const user = useSelector((state) => state.user);
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState(user.userCreatedId);
  const navigate = useNavigate();
  const [searchBarVisible, setSearchBarVisible] = useState(false);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await axios.get('http://localhost:5001/events');
        setEvents(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchEvents();
  }, []);

  useEffect(() => {
    if (user && user.userCreatedId) {
      setSearchQuery(user.userCreatedId);
    }
  }, [user]);


  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      new Date(event.date).toLocaleDateString().includes(searchQuery) ||
      event.createdBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.createdId.toLowerCase().includes(searchQuery.toLowerCase()) 
  );
  

  const handleAddEvent = () => {
    navigate('/event');
  };

  return (
    <div className="mainboard">
      {/*View for Event Monitoring*/}
    {user.userType === "Event Monitoring" && ( 
        <>
      <Row className="align-items-center">
        <Col>
          <h1 className="text-center">Event Information</h1>
        </Col>
      </Row>
      <Row className="align-items-center hidden-row">
        <Col md={{ offset: 1 }}>
          <Button
            onClick={handleAddEvent}
            className="d-flex align-items-center add-new-button"
            style={{ backgroundColor: 'green', color: 'white', display: 'none' }}
          >
            <FiPlus style={{ marginRight: '0.5rem' }} />
            Add New
          </Button>
        </Col>
        {searchBarVisible && (
          <Col md={{ span: 3, offset: 2 }}>
            <Form>
              <Form.Group controlId="searchForm">
                <Form.Control
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Col>
        )}
        <Col md={1}></Col>
      </Row>
      <Row className="justify-content-center mt-3">
        <Col md={10}>
          <div className="table-container event-table-container">
            <table className="event-table">
              <thead className="fixed-header">
                <tr>
                  <th className="text-center">Title</th>
                  <th className="text-center">Description</th>
                  <th className="text-center">Date</th>
                  <th className="text-center">Created By</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event) => (
                  <tr key={event._id}>
                    <td className="text-center">
                      {event.title}
                    </td>
                    <td className="text-center">{event.description}</td>
                    <td className="text-center">{new Date(event.date).toLocaleDateString()}</td>
                    <td className="text-center">{event.createdBy}</td>
                    <td className="text-center">
                    <Button
                      variant="link"
                      title="Attendee Information"
                      style={{ backgroundColor: "white", color: "black", borderRadius: "40px" }}
                      onClick={() => navigate(`/AttendeeInformation?eventID=${event._id}&eventName=${event.title}`)}
                    >
                      <FiUser />
                    </Button>
                    <Button
                      variant="link"
                      title="Scanning Face"
                      style={{ backgroundColor: "white", color: "black", borderRadius: "40px" }}
                      onClick={() => navigate(`/FaceScanner?eventID=${event._id}&eventDescription=${encodeURIComponent(event.title)}`)} // Include event description in the query parameters
                    >
                      <FiCamera />
                    </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Col>
      </Row>
      </>)}


    </div>
  );
};

export default EventList;
