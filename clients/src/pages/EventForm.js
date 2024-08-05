import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Row, Col, Button } from 'react-bootstrap'; // Import Row and Col from Bootstrap
import './EventForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faInfoCircle, faUser } from '@fortawesome/free-solid-svg-icons';
import { ReactComponent as chickenIcon } from '../assets/chicken-rooster-icon.svg';


const EventForm = () => {
  const user = useSelector((state) => state.user);
  const [fullName, setFullName] = useState(`${user.firstName || ''} ${user.middleName || ''} ${user.lastName || ''}`);
  const [varieties, setVarieties] = useState([]);
  const [selectedVariety, setSelectedVariety] = useState('');
  const [chickenType, setChickenTypes] = useState([]);
  const [selectedChickenType, setSelectedChickenType] = useState('');
  const [purpose, setPurpose] = useState('');
  const [dateOfAcquired, setDateOfAcquired] = useState('');
  const [feed, setFeed] = useState();
  const [createId, setCreateId] = useState(`${user._id}`);
  const [processedVarieties, setProcessedVarieties] = useState([]);
  const [processedChickenTypes, setProcessedChickenTypes] = useState([]);
  const [chickenImage, setChickenImage] = useState(null);

  useEffect(() => {
    // Fetch varieties and chicken types from your Express.js API
    axios.get('http://localhost:5001/variety/varietiesGetAll')
      .then((response) => {
        setVarieties(response.data);

        // Remove duplicate varieties
        const varietySet = new Map();
        response.data.forEach(variety => {
          if (!varietySet.has(variety.variety)) {
            varietySet.set(variety.variety, variety);
          }
        });
        setProcessedVarieties(Array.from(varietySet.values()));
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    if (selectedVariety) {
      const selectedVarietyObject = varieties.find(variety => variety.variety === selectedVariety);
  
      if (selectedVarietyObject) {
        const filteredChickenTypes = varieties
          .filter(variety => variety.variety === selectedVarietyObject.variety)
          .map(variety => variety.chickenType);
  
        setProcessedChickenTypes([...new Set(filteredChickenTypes)]);
      }
    } else {
      setProcessedChickenTypes([]);
    }
  
    // Fetch the image for the selected chicken type
    if (selectedChickenType) {
      const chickenTypeObject = varieties.find(variety => variety.variety === selectedVariety && variety.chickenType === selectedChickenType);
  
      if (chickenTypeObject && chickenTypeObject.picture) {
        setChickenImage(chickenTypeObject.picture);
      } else {
        setChickenImage(null);
      }
    } else {
      setChickenImage(null);
    }
  }, [selectedVariety, selectedChickenType, varieties]);
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVariety) return alert("Please select variety.");
    if (!selectedChickenType) return alert("Please select chicken types.");
    if (!purpose) return alert("Purpose field is empty.");
    if (!feed) return alert("Feed field is empty.");
    if (!dateOfAcquired) return alert("Date of Acquired field is empty.");
    try {
      await axios.post('http://localhost:5001/chicken/chickensRegister', {
        fullName,
        variety: selectedVariety,
        chickenType: selectedChickenType,
        purpose,
        dateOfAcquired,
        feed,
        createId,
      });
      alert('Successfully added chicken');
      // Clear form inputs
      setSelectedVariety('');
      setSelectedChickenType('');
      setPurpose('');
      setDateOfAcquired('');
      setFeed('');
    } catch (error) {
      console.error(error);
      alert('Failed to create chicken.');
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
    <div className='Eventcontainer'>
      <h2 className='text-center'>Create a Chicken Background</h2>
      <form onSubmit={handleSubmit}>
      <Row>
        <Col md={6} style={{display: "none"}}>
          <input
            type="text"
            className="form-control"
            placeholder="Fullname"
            
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </Col>
        <Col md={6} style={{ display: "none"}}>
          <input
            type="text"
            className="form-control"
            placeholder="CreatedId"
            value={createId}
            onChange={(e) => setCreateId(e.target.value)}
          />
        </Col>
        <Col md={6}>
        <h5><FontAwesomeIcon icon={faInfoCircle} className="fa-icon" style={{color: "#0a3d62"}} />  Variety</h5>
        <select
          className="form-control"
          value={selectedVariety}
          onChange={(e) => setSelectedVariety(e.target.value)}
        >
          <option value="">Select variety (e.g., Layer)</option>
          {processedVarieties.map((variety) => (
            <option key={variety._id} value={variety.variety}>
              {variety.variety}
            </option>
          ))}
        </select>
      </Col>
      <Col md={6}>
        <h5><FontAwesomeIcon icon={faInfoCircle} className="fa-icon" style={{color: "#0a3d62"}}/> Chicken Type</h5>
        <select
          className="form-control"
          value={selectedChickenType}
          onChange={(e) => setSelectedChickenType(e.target.value)}
        >
          <option value="">Select chicken type (e.g., Banaba)</option>
          {processedChickenTypes.map((chickenType, index) => (
            <option key={index} value={chickenType}>
              {chickenType}
            </option>
          ))}
        </select>
      </Col>

        <Col md={6}>
          <h5><FontAwesomeIcon icon={faCalendar} className="fa-icon" style={{color: "#0a3d62"}}/> Date of Acquired</h5>
          <input
            type="date"
            className="form-control"
            value={dateOfAcquired}
            onChange={(e) => setDateOfAcquired(e.target.value)}
            min={getCurrentDate()} // Set a minimum date
          />
        </Col>
        <Col md={6}>
          <h5><FontAwesomeIcon icon={faInfoCircle} className="fa-icon" style={{color: "#0a3d62"}}/> Feed</h5>
          <input
            type="text"
            className="form-control"
            placeholder="Enter feed (e.g., Integra 1000)"
            value={feed}
            onChange={(e) => setFeed(e.target.value)}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <h5><FontAwesomeIcon icon={faInfoCircle} className="fa-icon" style={{color: "#0a3d62"}}/> Purpose</h5>
          <textarea
            className="form-control"
            placeholder="Enter description (e.g., egg production or meet production)"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          />
        </Col>
        {chickenImage && (
          <>
        <Col md={6}>
          
            <h5><FontAwesomeIcon icon={faInfoCircle} className="fa-icon" style={{color: "#0a3d62"}}/> Picture</h5><img
                src={chickenImage}
                alt={`Chicken Type: ${selectedChickenType}`}
                style={{ maxWidth: '75%', height: 'auto', borderRadius: '25px' }} />
          
        </Col>
        </>
        )}
      </Row>
      <Row>
        <Col>
          <div className="button-container">
            <Button type="submit" className="btn btn-primary" style={{borderRadius: "35px",  fontWeight: "bold", backgroundColor: "#218c74", color: "white", borderColor: "#218c74" }}>
              Save
            </Button>
          </div>
        </Col>
      </Row>
      </form>
    </div>
  );
};

export default EventForm;
