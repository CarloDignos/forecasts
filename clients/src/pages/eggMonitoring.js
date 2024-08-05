import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Form, Container, Row, Col } from 'react-bootstrap';

function EggCollection() {
  const [breeding, setBreeding] = useState([]);
  const [selectedChickenType, setSelectedChickenType] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const user = useSelector((state) => state.user);
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    // Fetch breeding information based on user._id
    axios.get(`http://localhost:5001/breeding/breedingGetAll?userId=${user._id}`)
      .then((response) => {
        setBreeding(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [user._id]);

  const uniqueChickenTypes = [...new Set(breeding.map(breed => breed.selectedChicken))];

  return (
    <Container>
      <h1 className="text-center">Egg Collection</h1>
      <Row style={{ marginBottom: "15px" }}>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Select Chicken Type:</Form.Label>
            <Form.Control
              as="select"
              value={selectedChickenType}
              onChange={(e) => {
                setSelectedChickenType(e.target.value);
                setSelectedBatch(''); // Reset selected batch when chicken type changes
                setShowTable(false); // Hide table when chicken type changes
              }}
            >
              <option value="">Select...</option>
              {uniqueChickenTypes.map((chickenType, index) => (
                <option key={index} value={chickenType}>
                  {chickenType}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
        {selectedChickenType && (
          <Col md={6}>
            <Form.Group>
              <Form.Label>Select Batch:</Form.Label>
              <Form.Control
                as="select"
                value={selectedBatch}
                onChange={(e) => {
                  setSelectedBatch(e.target.value);
                  setShowTable(true); // Show table when batch is selected
                }}
              >
                <option value="">Select...</option>
                {breeding
                  .filter(breed => breed.selectedChicken === selectedChickenType)
                  .map((breed, index) => (
                    <option key={index} value={breed.batch}>
                      {breed.batch}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>
          </Col>
        )}
      </Row>
      {showTable && (
        <table className="table event-table">
          <thead className="table-header">
            <tr className="text-center">
              <th>Chicken Type</th>
              <th>Batch</th>
              <th>Chicken per Batch</th>
              <th>Total per Batch</th>
            </tr>
          </thead>
          <tbody>
            {breeding
              .filter(breed => breed.selectedChicken === selectedChickenType && breed.batch === selectedBatch)
              .map((breed, index) => (
                <tr key={index}>
                  <td className="text-center">{breed.selectedChicken}</td>
                  <td className="text-center">{breed.batch}</td>
                  <td className="text-center">{breed.chickenPerBatch}</td>
                  <td className="text-center">{breed.totalPerBatch}</td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
      {!showTable && (
        <table className="table event-table">
          <thead className="table-header">
            <tr className="text-center">
              <th>Chicken Type</th>
              <th>Batch</th>
              <th>Chicken per Batch</th>
              <th>Total per Batch</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-center" colSpan="4">No data selected</td>
            </tr>
          </tbody>
        </table>
      )}
    </Container>
  );
}

export default EggCollection;
