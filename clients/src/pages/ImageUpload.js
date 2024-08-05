// ImageUpload.js
import React, { useState } from 'react';
import axios from 'axios';

function ImageUpload() {
  const [image, setImage] = useState(null);

  const handleImageUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('imageData', image);

      // Send formData to your backend route for storing data in MongoDB
      const response = await axios.post('/face-add', formData);
      console.log(response.data);
      // Handle success or error responses
    } catch (error) {
      console.error(error);
      // Handle the error
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />
      <button onClick={handleImageUpload}>Upload Image</button>
    </div>
  );
}

export default ImageUpload;
