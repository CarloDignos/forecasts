import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { useSelector } from "react-redux";
import { useNavigate, Link } from 'react-router-dom';

const BreedingForm = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [state, setState] = useState({
    selectedChicken: '',
    batch: '',
    chickenPerBatch: '',
    date: '',
    chickenTypes: [],
  });

  useEffect(() => {
    const fetchChickenTypes = async () => {
      try {
        const response = await fetch(`http://localhost:5001/chicken/chickensList?createId=${user._id}`);
        if (response.ok) {
          const data = await response.json();
          setState((prevState) => ({ ...prevState, chickenTypes: data }));
        } else {
          console.error('Failed to fetch chicken types');
        }
      } catch (error) {
        console.error('Error fetching chicken types:', error);
      }
    };

    fetchChickenTypes();
  }, [user._id]);

  const handleChickenChange = (event) => {
    setState((prevState) => ({ ...prevState, selectedChicken: event.target.value }));
  };

  const handleChickenPerBatchChange = (event) => {
    const input = event.target.value;

    // Check if the input contains only digits
    if (/^\d+$/.test(input) || input === '') {
      setState((prevState) => ({ ...prevState, chickenPerBatch: event.target.value }));
    }
  };

  const handleBatchChange = (event) => {
    const input = event.target.value;

    // Check if the input contains only digits
    if (/^\d+$/.test(input) || input === '') {
      setState((prevState) => ({ ...prevState, batch: input }));
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

  const handleDateChange = (event) => {
    setState((prevState) => ({ ...prevState, date: event.target.value }));
  };

  const handleBreedingSubmit = async (event) => {
    event.preventDefault();

    const { selectedChicken, batch, chickenPerBatch, date } = state;
    // Check if any of the required fields is empty
    if (!selectedChicken) {
      alert('Please select chicken variety first.');
      return;
    }
    if (!batch) {
      alert('Please fill in the batch field.');
      return;
    }
    if (!chickenPerBatch) {
      alert('Please fill in the number of chickens per batch.');
      return;
    }
    if (!date) {
      alert('Please select date field.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/breeding/breedingRegister', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          createdId: user._id,
          fullName: `${user.firstName || ''} ${user.middleName || ''} ${user.lastName || ''}`,
          selectedChicken,
          batch,
          chickenPerBatch,
          date,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert('Breeding Record Created', data);

        // Reload the page after successful submission
        window.location.reload(true);
      } else {
        const errorData = await response.json(); // Assuming the error message is in JSON format
        alert(`Failed to create breeding record. Error: ${errorData.error}`);
      }
    } catch (error) {
      alert('Error submitting breeding record:', error);
    }
  };

  // Filter out duplicate chicken varieties
  const uniqueChickenVarieties = [...new Set(state.chickenTypes.map(chicken => chicken.variety))];

  return (
    <Container className="LoginBox">
      <h1 className="text-center">Chicken Breeding</h1>
      <Form onSubmit={handleBreedingSubmit}>
        <Form.Group>
          <Form.Label>Select Chicken</Form.Label>
          <Form.Control as="select" onChange={handleChickenChange} value={state.selectedChicken}>
            <option value="">Select here</option>
            {uniqueChickenVarieties.map((variety) => (
              <option key={variety} value={variety}>
                {variety}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>Enter Batch</Form.Label>
          <Form.Control
            type="text"
            onChange={handleBatchChange}
            value={state.batch}
            placeholder={`Enter batch (e.g., 1)`}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Number of chicken per batch</Form.Label>
          <Form.Control
            type="text"
            onChange={handleChickenPerBatchChange}
            value={state.chickenPerBatch}
            placeholder={`Enter batch (e.g., 50)`}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Enter Date</Form.Label>
          <Form.Control type="date" onChange={handleDateChange} value={state.date} min={getCurrentDate()} />
        </Form.Group>
        <Button
          variant="primary"
          type="submit"
          style={{
            marginTop: '20px',
            width: '100%',
            height: '100%',
            borderRadius: '25px',
            backgroundColor: '#218c74',
            borderColor: '#fff',
          }}
        >
          Submit
        </Button>
        <Form.Group>
          <Link to="/BreedingList">
            <p className="text-center" style={{ color: "#2980b9" }}>Click here to see your list Breeding</p>
          </Link>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default BreedingForm;
