// VarietyForm.js
import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import botImg from "../assets/upload.png";
import { useNavigate } from 'react-router-dom';

const VarietyForm = () => {
  const [varietyData, setVarietyData] = useState({
    variety: '',
    chickenType: '',
    description: '',
    eggProduction: '',
    picture: '',
    timeSeries: {
      quarterlyPercentages: [],
      isApplicable: false,
    },
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImg, setUploadingImg] = useState(false);
  const navigate = useNavigate();


  async function uploadImage() {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "jmkohxmf");
  
    try {
      setUploadingImg(true);
      let res = await fetch("https://api.cloudinary.com/v1_1/aspiree14/image/upload", {
        method: "post",
        body: data,
      });
      const urlData = await res.json();
      setUploadingImg(false);
  
      return urlData.url;
    } catch (error) {
      setUploadingImg(false);
      console.error(error);
    }
  }
  const formatQuarterlyPercentages = (value) => {
    // Remove any non-digit characters and limit to 8 digits
    const formattedValue = value.replace(/\D/g, '').slice(0, 8);

    // Split into an array of 2-digit parts and join with commas
    const parts = formattedValue.match(/.{1,2}/g);
    if (parts) {
      return parts.join('-');
    } else {
      return '';
    }
  };



  const handleQuarterlyPercentagesChange = (e) => {
    const formattedValue = formatQuarterlyPercentages(e.target.value);
    setVarietyData({
      ...varietyData,
      timeSeries: {
        ...varietyData.timeSeries,
        quarterlyPercentages: formattedValue.split('-').map(Number),
      },
    });
  };

  const handleIsApplicableChange = (e) => {
    const isChecked = e.target.checked;
    setVarietyData({
      ...varietyData,
      eggProduction: isChecked && varietyData.eggProduction === 'Not Applicable' ? '' : varietyData.eggProduction,
      timeSeries: {
        ...varietyData.timeSeries,
        quarterlyPercentages: isChecked && varietyData.timeSeries.quarterlyPercentages[0] === 'Not Applicable' ? [] : varietyData.timeSeries.quarterlyPercentages,
        isApplicable: isChecked,
      },
    });
  };
  
  // Move handleImageChange declaration up here
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file.size >= 2097152) {
      alert("Max file size is 2mb");
    } else {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Check if an image is selected
      if (!image) {
        return alert("Please upload your profile picture");
      }
  
      // Upload the image and get the URL
      const Url = await uploadImage(image);
  
      // Rest of your form submission logic
      const response = await axios.post('http://localhost:5001/variety/varieties', {
        ...varietyData,
        picture: Url,
      });
  
      console.log('Variety added:', response.data);
      navigate('/varietyList');
    } catch (error) {
      // Handle errors during image upload or form submission
      console.error('Error submitting form:', error);
      // You can also display an alert or other user notification here
    }
  };
  
  


  

  
  return (
    <Container className="text-center signup-form-container">
      <Row>
        <Col>
        <h1>Create new Varieties</h1>

          <Form onSubmit={handleSubmit}>
          <Form.Group style={{ marginBottom: "20px" }}>
              <div className="signup-profile-pic__container">
                <img src={imagePreview || botImg} className="signup-profile-pic" alt="" />
                <label htmlFor="image-upload" className="image-upload-label">
                  <i className="fas fa-plus-circle add-picture-icon"></i>
                </label>
                <input
                  type="file"
                  id="image-upload"
                  hidden
                  accept="image/png, image/jpeg"
                  onChange={handleImageChange}
                />
              </div>
            </Form.Group>
            <Form.Group controlId="variety">
              <Form.Label>Variety</Form.Label>
              <Form.Control
                placeholder="Enter variety here."
                type="text"
                value={varietyData.variety}
                onChange={(e) => setVarietyData({ ...varietyData, variety: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="chickenType">
              <Form.Label>Chicken Type</Form.Label>
              <Form.Control
                placeholder="Enter chicken type here."
                type="text"
                value={varietyData.chickenType}
                onChange={(e) => setVarietyData({ ...varietyData, chickenType: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                placeholder="Enter description here."
                type="text"
                value={varietyData.description}
                onChange={(e) => setVarietyData({ ...varietyData, description: e.target.value })}
              />
            </Form.Group>
                        <Form.Group controlId="isApplicable" style={{ display: 'flex', alignItems: 'center' }}>
              <Form.Check
                type="checkbox"
                style={{ marginRight: '10px' }} // Add some space between checkbox and label
                checked={varietyData.timeSeries.isApplicable}
                onChange={handleIsApplicableChange}
              />
              <Form.Label style={{ marginBottom: '0' }}>Is Applicable</Form.Label>
            </Form.Group>
            {varietyData.timeSeries.isApplicable ? (
            <>
            <Form.Group controlId="eggProduction">
              <Form.Label>Egg Production</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter egg production per quarter (e.g.,  65)"
                value={varietyData.eggProduction}
                onChange={(e) => setVarietyData({ ...varietyData, eggProduction: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="quarterlyPercentages">
              <Form.Label>Quarterly Percentages</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter percentages separated by dashes (e.g.,   Q1-Q2-Q3-Q4)"
                value={formatQuarterlyPercentages(varietyData.timeSeries.quarterlyPercentages.join('-'))}
                onChange={handleQuarterlyPercentagesChange}
              />
            </Form.Group>
              </>
            ) : (
              <>
                <Form.Group controlId="eggProduction">
                  <Form.Label>Egg Production</Form.Label>
                  <Form.Control
                    type="text"
                    value="Not Applicable"
                    disabled
                  />
                </Form.Group>
                <Form.Group controlId="quarterlyPercentages">
                  <Form.Label>Quarterly Percentages</Form.Label>
                  <Form.Control
                    type="text"
                    value="Not Applicable"
                    disabled
                  />
                </Form.Group>
              </>
            )}
            <Form.Group>
            <Button variant='success' type="submit" className="btn btn-primary" style={{margin: "10px", borderRadius: "35px",  fontWeight: "bold", backgroundColor: "green", color: "white" }}>
              Submit
            </Button>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default VarietyForm;
