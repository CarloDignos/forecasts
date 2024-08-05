import { useEffect, useState } from "react";
import { Container, Row, Col, Form, Table, Button, Modal } from "react-bootstrap";
import {
  FiChevronsLeft,
  FiChevronsRight,
  FiArrowLeft,
  FiArrowRight,
} from "react-icons/fi";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./UserInformation.css";
import { useLocation } from "react-router-dom";
import * as XLSX from 'xlsx';
import CsvIcon from './CSVIcon';

function AttendeeInformation() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const eventDescription = queryParams.get('eventName') || '';
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Set the number of items to display per page
  const [faceData, setFaceData] = useState([]);
  const shouldRenderEventIdHeader = false; // Set your logic here
  const shouldRenderEventIdCell = false;   // Set your logic here
  const [searchBarVisible, setSearchBarVisible] = useState(false);


  const handleDownloadExcel = () => {
    const dataToExport = filteredAndPaginatedFaces().map((face) => ({
      'Name': face.name,
      'School': face.school,
      'Email': face.email,
    }));
  
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance Data');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `${eventDescription}_registered.xlsx`;
    link.click();
  };
  

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const eventID = searchParams.get("eventID");
    if (eventID) {
      setSearchQuery(eventID);
      // Additional logic if needed, like searching automatically
    }
  }, [location.search]);

  useEffect(() => {
    axios
      .get("http://localhost:5001/AttendeeInformation")
      .then((response) => setFaceData(response.data))
      .catch((err) => console.log(err));
  }, []);
  

  // Function to handle sorting
  const handleSort = (column) => {
    if (sortBy === column) {
      // If the same column is clicked again, toggle the sorting order
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // If a new column is clicked, set it as the sorting column and start with ascending order
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  // Function to handle pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };




  // Function to sort the users based on the current sort order and column
  const sortedFaces = () => {
    if (!sortBy) return faceData; // If no sorting, return the face data list as is
    return faceData.slice().sort((a, b) => {
      const valA = a[sortBy].toUpperCase();
      const valB = b[sortBy].toUpperCase();
      if (valA < valB) {
        return sortOrder === "asc" ? -1 : 1;
      }
      if (valA > valB) {
        return sortOrder === "asc" ? 1 : -1;
      }
      return 0;
    });
  };
  

  
  

  const filteredAndPaginatedFaces = () => {
    const filteredData = sortedFaces().filter((faces) => {
      const idMatch = faces.eventId && faces.eventId.toLowerCase().includes(searchQuery.toLowerCase());
      const nameMatch = faces.name && faces.name.toLowerCase().includes(searchQuery.toLowerCase());
      const emailMatch = faces.email && faces.email.toLowerCase().includes(searchQuery.toLowerCase());
      const schoolMatch = faces.school && faces.school.toLowerCase().includes(searchQuery.toLowerCase());
      return nameMatch || emailMatch || schoolMatch || idMatch;
    });
  
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
    return filteredData.slice(indexOfFirstItem, indexOfLastItem);
  };
  
  const countSearchResults = () => {
    const filteredData = sortedFaces().filter((faces) => {
      const idMatch = faces.eventId && faces.eventId.toLowerCase().includes(searchQuery.toLowerCase());
      const nameMatch = faces.name && faces.name.toLowerCase().includes(searchQuery.toLowerCase());
      const emailMatch = faces.email && faces.email.toLowerCase().includes(searchQuery.toLowerCase());
      const schoolMatch = faces.school && faces.school.toLowerCase().includes(searchQuery.toLowerCase());
      return nameMatch || emailMatch || schoolMatch || idMatch;
    });
  
    return filteredData.length;
  };
  

  const totalPages = Math.ceil(countSearchResults() / itemsPerPage);


  return (
    <Container className="mainboard">
      <Row>
        <Col>
          <h1 className="text-center">Attendee Information</h1>
        </Col>
      </Row>
      <Row className="align-items-center">
        <Col md={{ offset: 1 }}>
          <h3>Attendee's Registered</h3>
          <span>
            Total number: {countSearchResults()}
          </span>{" "}
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
                <Col md={{span:2, offset: 2}}>
        <Button style={{ backgroundColor: '#05c46b', borderColor: '#fff'}} title="Download as CSV" onClick={handleDownloadExcel}>
          <CsvIcon width="32" height="32" color="white" />
        </Button>
        </Col>
      </Row>
      <Row className="justify-content-center mt-3">
        <Col md={10}>
          <div className="table-container user-table-container">
            <div className="table-wrapper">
              <Table responsive striped bordered hover className="user-table">
                <thead className="fixed-header">
                  <tr>
                  {shouldRenderEventIdHeader && (
                      <th className="text-center" onClick={() => handleSort("EventId")}>
                        EventId{" "}
                        {sortBy === "EventId" && (
                          <span>
                            {sortOrder === "asc" ? <FiChevronsLeft /> : <FiChevronsRight />}
                          </span>
                        )}
                      </th>
                    )}
                    <th className="text-center" onClick={() => handleSort("name")}>
                      Name{" "}
                      {sortBy === "name" && (
                        <span>
                          {sortOrder === "asc" ? <FiChevronsLeft /> : <FiChevronsRight />}
                        </span>
                      )}
                    </th>
                    <th className="text-center" onClick={() => handleSort("email")}>
                      Email{" "}
                      {sortBy === "email" && (
                        <span>
                          {sortOrder === "asc" ? <FiChevronsLeft /> : <FiChevronsRight />}
                        </span>
                      )}
                    </th>
                    <th className="text-center" onClick={() => handleSort("school")}>
                      School{" "}
                      {sortBy === "school" && (
                        <span>
                          {sortOrder === "asc" ? <FiChevronsLeft /> : <FiChevronsRight />}
                        </span>
                      )}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndPaginatedFaces().map((faces) => (
                    <tr key={faces.id}>
                      {shouldRenderEventIdCell && (
                        <td className="text-center">{faces.eventId}</td>
                      )}
                      <td className="text-center">
                        <div className="user-info">
                          <span className="user-name">{faces.name}</span>
                        </div>
                      </td>
                      <td className="text-center">{faces.email}</td>
                      <td className="text-center">{faces.school}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <div className="pagination-buttons">
        <Button
          variant="light"
          title="First page"
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
          <FiChevronsLeft />
        </Button>
        <Button
          variant="light"
          title="Previous page"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <FiArrowLeft />
        </Button>
        <span className="pagination-text">
          {currentPage} of {totalPages}
        </span>
        <Button
          variant="light"
          title="Next page"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <FiArrowRight />
        </Button>
        <Button
          variant="light"
          title="Last page"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          <FiChevronsRight />
        </Button>

      </div>
          </div>
        </Col>
        </Row>
    </Container>
  );
}

export default AttendeeInformation;