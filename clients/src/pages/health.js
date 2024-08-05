import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Form, Row, Col, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function ChickenHealthTracker() {
  const user = useSelector((state) => state.user);
  const [varieties, setVarieties] = useState([]);
  const [breeding, setBreeding] = useState([]);
  const [selectedChicken, setSelectedChicken] = useState("");
  const [filteredBatches, setFilteredBatches] = useState([]);
  const [varietyInfo, setVarietyInfo] = useState(null); 
  const [selectedBatch, setSelectedBatch] = useState("");
  const [chickenType, setChickenType] = useState('');
  const [treatmentType, setTreatmentType] = useState('');
  const [batch, setBatch] = useState('');
  const [treatmentValue, setTreatmentValue] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5001/variety/varietiesGetAll')
      .then((response) => {
        setVarieties(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    axios.get(`http://localhost:5001/breeding/breedingGetAll?userId=${user._id}`)
      .then((response) => {
        setBreeding(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [user._id]);

  const uniqueBreeding = Array.from(new Set(breeding.map(chicken => chicken.selectedChicken)));
  const uniqueHealth = Array.from(new Set(breeding.map(chicken => chicken.batch)));

  const handleChickenChange = (e) => {
    const selectedChicken = e.target.value;
    setSelectedChicken(selectedChicken);

    const selectedVariety = varieties.find(variety => variety.chickenType === selectedChicken);

    if (selectedVariety) {
      const batchesForChicken = breeding
        .filter(chicken => chicken.selectedChicken === selectedChicken)
        .map(chicken => chicken.batch);

      setFilteredBatches(batchesForChicken);

      const quarterlyPercentages = selectedVariety.timeSeries?.quarterlyPercentages || [];

      setVarietyInfo({
        eggProduction: selectedVariety.eggProduction,
        quarterlyPercentages: quarterlyPercentages,
      });
    } else {
      setFilteredBatches([]);
      setVarietyInfo(null);
    }
  };
  const handleBatchChange = (e) => {
    setSelectedBatch(e.target.value);
  };
  const handleTreatmentTypeChange = (e) => {
    setTreatmentType(e.target.value);
  };

  const handleTreatmentValueChange = (e) => {
    setTreatmentValue(e.target.value);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedChicken) return alert("Please select chicken types.");
    if (!treatmentType) return alert("Treatment  type field is empty.");
    if (!treatmentValue) return alert("Treatment field is empty.");
    if (!selectedDate) return alert("Date of Acquired field is empty.");
    try {

      const formData = {
        userId: user._id,
        chickenType: selectedChicken,
        batch: selectedBatch,
        treatmentType: treatmentType,
        treatmentValue: treatmentValue,
        selectedDate: selectedDate,
      };
  
      // Send the form data to the backend
      const response = await axios.post('hhttp://localhost:5001/health/add', formData);
  
      // Handle the response as needed (e.g., show success message, update state, etc.)
      console.log('Health data saved:', response.data);
      alert("This health information successfully save.")
      // Optionally, you can reset the form fields or perform any other actions
      setSelectedChicken('');
      setSelectedBatch('');
      setTreatmentType('');
      setTreatmentValue('');
      setSelectedDate('');
      
    } catch (error) {
      console.error('Error saving health data:', error);
      // Handle the error (e.g., show error message)
    }
  };
  

      // Define a function to get the current date in the format 'yyyy-MM-dd'
    const getCurrentDate = () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

  return (
    <Container className='LoginBox'>
      <h1 className='text-center'>Chicken Health Selection</h1>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col>
            <Form.Group controlId="chickenSelection">
              <Form.Label>Select Chicken Breeding:</Form.Label>
              <Form.Control as="select" onChange={handleChickenChange} value={selectedChicken}>
                <option value="">Select an option</option>
                {uniqueBreeding.map((option, index) => (
                  <option key={index} value={option}>{option}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group controlId="chickenSelection">
              <Form.Label>Select batch:</Form.Label>
              <Form.Control as="select" onChange={handleBatchChange} value={selectedBatch}>
                <option value="">Select an option</option>
                {uniqueHealth.map((option, index) => (
                  <option key={index} value={option}>{option}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Select Treatment Type:</Form.Label>
                <Form.Control as="select" value={treatmentType} onChange={handleTreatmentTypeChange}>
                  <option value="">Select Treatment Type</option>
                  <option value="Medication">Medication</option>
                  <option value="Vaccination">Vaccination</option>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
        
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Enter {treatmentType}</Form.Label>
                <Form.Control
                  type="text"
                  value={treatmentValue}
                  onChange={handleTreatmentValueChange}
                  placeholder={`Enter ${treatmentType}`}
                />
              </Form.Group>
            </Col>
          </Row>
        {/* Date Field */}
        <Row>
          <Col>
            <Form.Group controlId="dateSelection">
              <Form.Label>Select Date:</Form.Label>
              <Form.Control
                type="date"
                value={selectedDate}
                min={getCurrentDate()}
                onChange={handleDateChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Container style={{marginTop: "10px"}}>
          <Row>
            <Col>
              <Button variant="primary" type="submit" style={{width: "100%", height: "100%", borderRadius: "25px", backgroundColor: "#218c74", borderColor: "#fff"}}>
                Submit
              </Button>
            </Col>
            <Form.Group>
            <Link to="/HealthList">
              <p className="text-center" style={{ color: "#2980b9"}}>Click here to see your list health</p>
            </Link>
          </Form.Group>
          </Row>
        </Container>
      </Form>
    </Container>
  );
}

export default ChickenHealthTracker;
