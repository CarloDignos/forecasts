import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Form, Modal } from 'react-bootstrap'; // Add Modal
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './varietyList.css';

const VarietyList = () => {
  const [varieties, setVarieties] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedVariety, setSelectedVariety] = useState(null);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
  const [selectedVarietyId, setSelectedVarietyId] = useState(null);
  
  const handleDeleteVariety = (id) => {
    // Show the delete confirmation modal
    setShowDeleteConfirmationModal(true);

    // Set the selected variety to delete
    setSelectedVarietyId(id);
  };

  const handleEditVariety = (variety) => {
    setSelectedVariety(variety);
    setShowEditModal(true);
  };
    
  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  
  useEffect(() => {
    axios.get('http://localhost:5001/variety/varietiesGetAll')
      .then((response) => setVarieties(response.data)) // Update variable name
      .catch((error) => console.error(error));
  }, []);

  const filteredVarieties = varieties.filter((variety) => {
    const varietys = (variety.variety || '').toLowerCase(); // Added conditional check
    const chickenType = (variety.chickenType || '').toLowerCase(); // Added conditional check
    const eggProduction = (variety.eggProduction || '').toLowerCase(); // Added conditional check

    return (
      varietys.includes(searchQuery.toLowerCase()) ||
      chickenType.includes(searchQuery.toLowerCase()) ||
      eggProduction.includes(searchQuery.toLowerCase())
    );
  });

  const handleAddVariety = () => {
    navigate('/varietyRegister');
  };


  const handleSaveEdit = () => {
    if (!selectedVariety) {
      console.error('Selected variety is null or undefined');
      return;
    }
  
    // Create an object with the updated data
    const updatedVarietyData = {
      _id: selectedVariety._id, // Include the variety ID for identification
      variety: selectedVariety.variety,
      chickenType: selectedVariety.chickenType,
      eggProduction: selectedVariety.eggProduction,
    };

    
  
    // Make an API request to update the variety data
    axios
      .put(`http://localhost:5001/variety/varietiesUpdate/${selectedVariety._id}`, updatedVarietyData)
      .then((response) => {
        
        // Update the 'varieties' state with the updated data
        setVarieties((prevVarieties) =>
          prevVarieties.map((variety) =>
            variety._id === selectedVariety._id ? updatedVarietyData : variety
          )
        );
  
        // Close the edit modal
        handleCloseEditModal();
      })
      .catch((error) => {
        // Handle errors, display an error message, or perform other actions as needed.
        console.error('Error updating variety:', error);
      });
  };

  const handleConfirmDelete = () => {
    // Make an API request to delete the variety
    axios
      .delete(`http://localhost:5001/variety/delete/${selectedVarietyId}`)
      .then((response) => {
        // Handle a successful deletion, you can add a success message or perform other actions if needed.
        alert('Variety deleted successfully');
        
        // Update the 'varieties' state by removing the deleted variety
        setVarieties((prevVarieties) =>
          prevVarieties.filter((variety) => variety._id !== selectedVarietyId)
        );

        // Close the delete confirmation modal
        setShowDeleteConfirmationModal(false);
      })
      .catch((error) => {
        // Handle errors, display an error message, or perform other actions as needed.
        console.error('Error deleting variety:', error);

        // Close the delete confirmation modal even if there's an error
        setShowDeleteConfirmationModal(false);
      });
  };

  const handleCancelDelete = () => {
    // Close the delete confirmation modal without deleting
    setShowDeleteConfirmationModal(false);
  };

  return (
    <Container className="user-information-container">
      <Row>
        <Col>
          <h1 className="text-center">Manage Variety</h1>
        </Col>
      </Row>
      <Row className="align-items-center">
        <Col md={{ offset: 1 }}>
          {/* Add Button */}
          <Button
            onClick={handleAddVariety}
            className="d-flex align-items-center add-new-button"
            style={{ backgroundColor: "#218c74", color: "white", borderColor: "#218c74" }}
          >
            <FaPlus style={{ marginRight: "0.5rem" }} />
            Add New
          </Button>
        </Col>
        {/* Move the Search Bar to the right using offset */}
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
            <table responsive striped bordered hover className="event-table" style={{ width: "100%", borderCollapse: "collapse", fontFamily: "Arial, sans-serif" }}>
              <thead className="table-header">
                <tr>
                  <th>Variety</th>
                  <th>Chicken Type</th>
                  <th>Egg Production</th>
                  <th>Picture</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVarieties.map((variety) => (
                  <tr key={variety._id}>
                    <td>{variety.variety}</td>
                    <td>{variety.chickenType}</td>
                    <td>{variety.eggProduction}</td>
                    <td>                        
                      <div className="user-infos">
                          <img
                            src={variety.picture}
                            alt=""
                            className="user-avatar"
                          />
                        </div></td>
                    <td>
                    <Button
                      variant="link"
                      title="Edit"
                      style={{ color: "#ffa502", borderRadius: "25px" }}
                      onClick={() => handleEditVariety(variety)}
                    >
                      <FaEdit />
                    </Button>
                      <Button
                        variant="link"
                        title="Delete"
                        onClick={() => handleDeleteVariety(variety._id)}
                        style={{ color: "#eb2f06", borderRadius: "25px" }}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Col>
      </Row>
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Variety</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
          <Form.Group controlId="editVarietyForm">
  <Form.Label>Variety</Form.Label>
  <Form.Control
    type="text"
    value={selectedVariety ? selectedVariety.variety : ''}
    onChange={(e) => setSelectedVariety({ ...selectedVariety, variety: e.target.value })}
  />
  <Form.Label>Chicken Type</Form.Label>
  <Form.Control
    type="text"
    value={selectedVariety ? selectedVariety.chickenType : ''}
    onChange={(e) => setSelectedVariety({ ...selectedVariety, chickenType: e.target.value })}
  />
  <Form.Label>Egg Production</Form.Label>
  <Form.Control
    type="text"
    value={selectedVariety ? selectedVariety.eggProduction : ''}
    onChange={(e) => setSelectedVariety({ ...selectedVariety, eggProduction: e.target.value })}
  />
</Form.Group>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showDeleteConfirmationModal} onHide={handleCancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this variety?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Confirm Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default VarietyList;
