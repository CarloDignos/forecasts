
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import * as faceapi from 'face-api.js';
import './FaceReg.css';
import * as XLSX from 'xlsx';
import {
  FiArrowLeft,
  FiArrowRight,
} from "react-icons/fi";
import CsvIcon from './CSVIcon';
import { Button } from "react-bootstrap";

function App() {
  const videoRef = useRef();
  const canvasRef = useRef();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialEventId = queryParams.get('eventID') || '';
  const eventDescription = queryParams.get('eventDescription') || '';
  const [image, setImage] = useState(null);
  const [eventId, setEventId] = useState(initialEventId); 
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [videoStarted, setVideoStarted] = useState(false); // Track if the video has started
  const [faceDetectionInterval, setFaceDetectionInterval] = useState(null); // Store the interval ID
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [entriesPerPage] = useState(10); // Number of entries per page

  // Function to change the current page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

    // Calculate the indexes of the entries to display on the current page
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentEntries = results.slice(indexOfFirstEntry, indexOfLastEntry);
  
    const handleDownloadExcel = () => {
      // Create a new array with objects that include only the desired properties
      const modifiedResults = results.map(({ name, school, email, timestampIn, timestampOut }) => ({
        'Name' : name,
        'School': school,
        'Email': email,
        'Time In': timestampIn,
        'Time Out': timestampOut || 'N/A',
      }));
    
      const ws = XLSX.utils.json_to_sheet(modifiedResults);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Attendance Data');
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `${eventDescription}_Attendance.xlsx`;
      link.click();
    };
    
  useEffect(() => {
    loadModels();
    const timer = setInterval(updateTime, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const updateTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    setCurrentTime(`${formattedHours}:${formattedMinutes} ${ampm}`);
  };

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((currentStream) => {
        videoRef.current.srcObject = currentStream;
        setVideoStarted(true);
      })
      .catch((err) => {
        console.log(err);
      });

    // Add an error event listener to the video element
    videoRef.current.addEventListener('error', () => {
      setMessage('Video error occurred. Reloading the browser...');
      window.location.reload(); // Reload the browser when a video error occurs
    });
  };
  const stopVideo = () => {
    if (videoStarted) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();

      tracks.forEach((track) => {
        track.stop();
      });

      videoRef.current.srcObject = null;
      setVideoStarted(false);

      // Clear the face detection interval
      clearInterval(faceDetectionInterval);
    }
  };
  const loadModels = () => {
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('/models'),
    ]).then(() => {
      if (!videoStarted) {
        startVideo();
      }
      faceMyDetect();
    });
  };
  

  const faceMyDetect = () => {
    const detectedFaces = new Set(); // Use a Set to store unique face names
    setFaceDetectionInterval(
      setInterval(async () => {
        const detections = await faceapi
          .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks();
  
        canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(videoRef.current);
        faceapi.matchDimensions(canvasRef.current, {
          width: 640,
          height: 480,
        });
  
        const resized = faceapi.resizeResults(detections, {
          width: 640,
          height: 480,
        });
  
        faceapi.draw.drawDetections(canvasRef.current, resized);
        faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);
  
        if (resized.length > 0) {
          // Face detected, update the image state with the image from the video feed
          const videoCanvas = document.createElement('canvas');
          videoCanvas.width = 640;
          videoCanvas.height = 480;
          const videoContext = videoCanvas.getContext('2d');
          videoContext.drawImage(videoRef.current, 0, 0, 640, 480);
          videoCanvas.toBlob(async (blob) => {
            const imageFile = new File([blob], 'face_detected_image.png', { type: 'image/png' });
            setImage(imageFile);
  
            const formData = new FormData();
            formData.append('image', imageFile);
            formData.append('eventId', eventId);
  
            try {
              const response = await fetch('http://localhost:5001/compare-faces', {
                method: 'POST',
                body: formData,
              });
  
              const data = await response.json();
              if (response.status === 200) {
                const faceName = data.results[0].name;
                if (detectedFaces.has(faceName)) {
                  // This face is already recognized. Only update the "Time Out" timestamp.
                  setResults((prevResults) => {
                    const updatedResults = [...prevResults];
                    const timestamp = new Date().toLocaleTimeString();
                    const index = updatedResults.findIndex((result) => result.name === faceName);
                    if (index !== -1) {
                      updatedResults[index].timestampOut = timestamp;
                    }
                    return updatedResults;
                  });
                  setMessage('Time Out for ' + faceName);
                } else {
                  const timestamp = new Date().toLocaleTimeString();
                  detectedFaces.add(faceName);
                  setResults((prevResults) => [
                    ...prevResults,
                    {
                      ...data.results[0],
                      timestampIn: timestamp,
                    },
                  ]);
                  setMessage('Time In for ' + faceName);
                }
              } else {
                setMessage(data.message);
              }
            } catch (error) {
              console.error(error);
              setMessage('Error occurred during face comparison.');
            }
          }, 'image/png');
        }
      }, 10000)
    );
  };


  
  

  
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleEventIdChange = (event) => {
    setEventId(event.target.value);
  };

  const handleCompareFaces = async () => {
    if (!image || !eventId) {
      setMessage('Please upload an image and specify an eventId.');
      return;
    }
  
    const formData = new FormData();
    formData.append('image', image);
    formData.append('eventId', eventId);
  
    try {
      const response = await fetch('http://localhost:5001/compare-faces', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.status === 200) {
        // Check if the face is already in the results
        const isFaceAlreadyDetected = results.some((result) => result.name === data.results[0].name);
  
        if (isFaceAlreadyDetected) {
          setMessage('This face is already time in');
        } else {
          setResults((prevResults) => [...prevResults, ...data.results]);
          setMessage(data.message);
        }
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error(error);
      setMessage('Error occurred during face comparison.');
    }
  };
  
  

  return (
      <div className="myapp justify-content-center align-items-center">
      <h1>Face Recognition</h1>
      <p>Event Title:{eventDescription}</p>
      <div className="appvide">
        <video crossOrigin="anonymous" ref={videoRef} width="640" height="480" autoPlay></video>
        <p style={{ display: 'none' }}>{currentTime}</p>
      </div>
      <canvas ref={canvasRef} width="640" height="480" className="appcanvas" />
      <div>
        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }}/>
      </div>
      <div>
        <input type="text" value={eventId} onChange={handleEventIdChange} style={{ display: 'none' }}/>
      </div>
      <div className='StartStop'>
      {videoStarted ? (
          <Button style={{ borderRadius: '50px' }} onClick={stopVideo} title="Stop Video">
            <i className="fa fa-stop" />
          </Button>
        ) : (
          <Button style={{ borderRadius: '50px' }} onClick={startVideo} title="Start Video">
            <i className="fa fa-play" />
          </Button>
        )} 
        <Button style={{ display: 'none' }} onClick={handleCompareFaces}>Compare Faces</Button>

      </div>
      <p>{message}</p>
      {results.length > 0 && (
        <div>
          <h2>Attendee's information</h2>
          <Button className='btnDownload' title='Download as spreadsheets' onClick={handleDownloadExcel}><CsvIcon width="32" height="32" color="white" /></Button>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>School</th>
                <th>Email</th>
                <th>Time In</th>
                <th>Time Out</th>
              </tr>
            </thead>
            <tbody>
              {currentEntries.map((result, index) => (
                <tr key={index}>
                  <td>{result.name}</td>
                  <td>{result.school}</td>
                  <td>{result.email}</td>
                  <td>{result.timestampIn}</td>
                  <td>{result.timestampOut || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="centered-content">
          <div className="pagination" >
            
            {/* "Previous" button */}
            <Button variant="light" title="Previous page" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}><FiArrowLeft /></Button>
            <label className='lbPage'>
              Page {currentPage} of {Math.ceil(results.length / entriesPerPage)}
            </label>
            {/* "Next" button */}
            <Button variant="light" title="Next page" onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(results.length / entriesPerPage)}><FiArrowRight /></Button>
          </div>
        </div>
        </div>
      )}
      {!results.length > 0 && (
        <div>
          <h2>Attendee's information</h2>
         <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>School</th>
                <th>Email</th>
                <th>Time In</th>
                <th>Time Out</th>
              </tr>
            </thead>
            <tbody>
              {currentEntries.map((result, index) => (
                <tr key={index}>
                  <td>{result.name}</td>
                  <td>{result.school}</td>
                  <td>{result.email}</td>
                  <td>{result.timestampIn}</td>
                  <td>{result.timestampOut || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      )}
    </div>
  );
}

export default App;