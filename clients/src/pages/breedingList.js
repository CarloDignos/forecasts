import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button} from "react-bootstrap";
import { useSelector } from "react-redux";
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import './breedingList.css';

const BreedingList = () => {
  const user = useSelector((state) => state.user);
  const [breedingRecords, setBreedingRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(5); // Set the number of records to display per page

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/breeding/breedingGetAll?userId=${user._id}`);
        setBreedingRecords(response.data);
      } catch (error) {
        console.error('Error fetching breeding records:', error);
      }
    };

    fetchData();
  }, [user._id]);

  // Calculate the indexes of the first and last record on the current page
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = breedingRecords.slice(indexOfFirstRecord, indexOfLastRecord);

  // Calculate the total number of pages
  const totalRecords = breedingRecords.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);

  // Handle pagination button clicks
  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  return (
    <div className="user-information-container">
      <h2 className='text-center'>Breeding Records</h2>
      <div className="table-container">
        <table className="event-table" style={{width: "100%", borderCollapse: "collapse", fontFamily: "Arial, sans-serif"}}>
          <thead className="table-header">
            <tr>
              <th className="text-center">Chicken Type</th>
              <th className="text-center">Batch</th>
              <th className="text-center">Chicken per batch</th>
              <th className="text-center">Date</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((record) => (
              <tr key={record._id}>
                <td className="text-center">{record.selectedChicken}</td>
                <td className="text-center">{record.batch}</td>
                <td className="text-center">{record.chickenPerBatch}</td>
                <td className="text-center">{new Date(record.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination-contain">
        <Button variant="light" title="Previous page" onClick={handlePrevPage} disabled={currentPage === 1}><FaArrowLeft /></Button>
        <span className="pagination-text1">{`${currentPage} of ${totalPages} pages`}</span>
        <Button variant="light" title="Next page" onClick={handleNextPage} disabled={currentPage === totalPages}><FaArrowRight /></Button>
      </div>
    </div>
  );
};

export default BreedingList;
