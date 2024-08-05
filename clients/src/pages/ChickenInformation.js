import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Col, Row, Button, Form, Table } from 'react-bootstrap';
import { FiPlus, FiUser, FiCamera } from 'react-icons/fi';
import { FaClipboard } from 'react-icons/fa';
import './EventInformation.css';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from "react-redux";

const ChickenList = () => {
  const user = useSelector((state) => state.user);
  const [chickens, setChickens] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [searchBarVisible, setSearchBarVisible] = useState(false);

  useEffect(() => {
    async function fetchChickens() {
      try {
        const response = await axios.get('http://localhost:5001/chicken/chickensList');
        setChickens(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchChickens();
  }, []);

  useEffect(() => {
    if (user && user.userType === "User") {
      setSearchQuery(`${user.firstName || ''} ${user.middleName || ''} ${user.lastName || ''}`);
    }
    if (user && user.userType === "Admin") {
      setSearchQuery("");
    }
  }, [user]);

  const handleAddEvent = () => {
    navigate('/event');
  };
  const filteredChicken = chickens.filter((chicken) => {
    const fullname = chicken.fullName?.toLowerCase() || '';
    const variety = chicken.variety?.toLowerCase() || '';
    const chickenType = chicken.chickenType?.toLowerCase() || '';
    const purpose = chicken.purpose?.toLowerCase() || '';
    const dateOfAcquired = new Date(chicken.dateOfAcquired).toLocaleDateString() || '';
    const createAdminId = chicken.createAdminId?.toLowerCase() || '';
    const chickenId = chicken.chickenId?.toLowerCase() || '';
  
    return (
      fullname.includes(searchQuery.toLowerCase()) ||
      variety.includes(searchQuery.toLowerCase()) ||
      chickenType.includes(searchQuery.toLowerCase()) ||
      purpose.includes(searchQuery.toLowerCase()) ||
      dateOfAcquired.includes(searchQuery) ||
      createAdminId.includes(searchQuery.toLowerCase()) ||
      chickenId.includes(searchQuery.toLowerCase())
    );
  });
  

  
  
  


  return (
    <div className="mainboard">
    {user?.userType === "Admin" && ( 
        <>
      <Row className="align-items-center">
        <Col>
          <h1 className="text-center">Manage Chicken</h1>
        </Col>
      </Row>
      <Row className="align-items-center">
        <Col md={{ offset: 1 }}>
          
        </Col>
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
        <Col md={1}></Col>
      </Row>
      <Row className="justify-content-center mt-3">
        <Col md={10}>
        <div className="table-container">
            <table className="event-table" style={{width: "100%", borderCollapse: "collapse", fontFamily: "Arial, sans-serif"}}>
            <thead className="table-header">
                <tr>
                  <th className="text-center">Full Name</th>
                  <th className="text-center">Variety</th>
                  <th className="text-center">Chicken Type</th>
                  <th className="text-center">Purpose</th>
                  <th className="text-center">Date</th>
                  <th className="text-center">Feed</th>
                </tr>
              </thead>
              <tbody>
                {filteredChicken.map((chicken) => (
                  <tr key={chicken._id}>
                    <td className="text-center">
                      {chicken.fullName}
                    </td>
                    <td className="text-center">{chicken.variety}</td>
                    <td className="text-center">{chicken.chickenType}</td>
                    <td className="text-center">{chicken.purpose}</td>
                    <td className="text-center">{new Date(chicken.dateOfAcquired).toLocaleDateString()}</td>
                    <td className="text-center">{chicken.feed}</td>
                      {/**
<td className="text-center">
                    <Button
                      variant="link"
                      title="Attendee Information"
                      style={{ backgroundColor: "white", color: "black", borderRadius: "40px" }}
                      onClick={() => navigate(`/AttendeeInformation?eventID=${chicken._id}&eventName=${c.title}`)}
                    >
                      <FiUser />
                    </Button>
                    <Button
                      variant="link"
                      title="Link Registration"
                      style={{ backgroundColor: "white", color: "black", borderRadius: "40px" }}
                      onClick={() => handleCopyLink(event._id, event.title, event.date)}
                    >
                      <FaClipboard />
                    </Button>
                    </td> */}

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Col>
      </Row>
      </>)}

      {user?.userType === "User" && ( 
        <>
      <Row className="align-items-center">
        <Col>
          <h1 className="text-center">Manage Chicken</h1>
        </Col>
      </Row>
      <Row className="align-items-center">
        <Col md={{ offset: 1 }}>
          <Button
            onClick={handleAddEvent}
            className="d-flex align-items-center add-new-button"
            style={{ backgroundColor: "#218c74", color: "white", borderColor: "#218c74" }}
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
          <div className="table-container">
            <Table responsive striped bordered hover className="event-table">
              <thead className="table-header">
                <tr>
                  <th className="text-center">Full Name</th>
                  <th className="text-center">Variety</th>
                  <th className="text-center">Chicken Type</th>
                  <th className="text-center">Purpose</th>
                  <th className="text-center">Date</th>
                  <th className="text-center">Feed</th>
                </tr>
              </thead>
              <tbody>
                {filteredChicken.map((chicken) => (
                  <tr key={chicken._id}>
                    <td className="text-center">
                      {chicken.fullName}
                    </td>
                    <td className="text-center">{chicken.variety}</td>
                    <td className="text-center">{chicken.chickenType}</td>
                    <td className="text-center">{chicken.purpose}</td>
                    <td className="text-center">{new Date(chicken.dateOfAcquired).toLocaleDateString()}</td>
                    <td className="text-center">{chicken.feed}</td>


                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
      </>)}

      </div>
      );
    };

export default ChickenList;
