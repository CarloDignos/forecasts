import { useEffect, useState } from "react";
import { Container, Row, Col, Form, Table, Button, Modal } from "react-bootstrap";
import {
  FiEye,
  FiEdit,
  FiTrash2,
  FiPlus,
  FiChevronsLeft,
  FiChevronsRight,
  FiArrowLeft,
  FiArrowRight,
} from "react-icons/fi";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./UserInformation.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import EditUser from "./editUser";

function UserInformation() {
  const user = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState(user._id);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2; // Set the number of items to display per page
  const navigate = useNavigate();
  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Function to update the user in the table
  const handleUpdateUser = (updatedUser) => {
    // Send a PUT request to update the user on the server-side (You need to implement this endpoint in your server code)
    axios
      .put(`http://localhost:5001/users/${updatedUser._id}`, updatedUser)
      .then(() => {
        // Update the user list in the state
        const updatedUsers = users.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        );
        setUsers(updatedUsers);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    axios
      .get("http://localhost:5001/UserInformation")
      .then((response) => setUsers(response.data))
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

  // Function to filter users based on the search query
const filteredUsers = () => {
  return users.filter((user) => {
    // Filter by name, email, userType, and userCreatedId properties
    const nameMatch = user.name.toLowerCase().includes(searchQuery.toLowerCase());
    const emailMatch = user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const userTypeMatch = user.userType.toLowerCase().includes(searchQuery.toLowerCase());
    const userCreatedIdMatch = user.userCreatedId?.toString().includes(searchQuery);

    return nameMatch || emailMatch || userTypeMatch || userCreatedIdMatch;
  });
};



  // Function to sort the users based on the current sort order and column
  const sortedUsers = () => {
    if (!sortBy) return filteredUsers(); // If no sorting, return the filtered list as is
    return filteredUsers().sort((a, b) => {
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

  // Function to handle pagination and get the users for the current page
  const getCurrentPageItems = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return sortedUsers().slice(indexOfFirstItem, indexOfLastItem);
  };

  // Calculate the total number of pages for pagination
  const totalPages = Math.ceil(sortedUsers().length / itemsPerPage);

  const handleAddUser = () => {
    navigate("/register");
  };

  const handleDeleteUser = (userId) => {
    setUserToDelete(userId);
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = () => {
    axios
      .delete(`https://faceback.onrender.com/users/${userToDelete}`)
      .then(() => {
        const updatedUsers = users.filter((user) => user._id !== userToDelete);
        setUsers(updatedUsers);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setUserToDelete(null);
        setShowDeleteModal(false);
      });
  };

  return (
    <Container className="mainboard">
      <Row>
        <Col>
          <h1 className="text-center">User Information</h1>
        </Col>
      </Row>
      <Row className="align-items-center">
        <Col md={{ offset: 1 }}>
          {/* Add Button */}
          <Button
            onClick={handleAddUser}
            className="d-flex align-items-center add-new-button"
            style={{ backgroundColor: "green", color: "white" }}
          >
            <FiPlus style={{ marginRight: "0.5rem" }} />
            Add New
          </Button>
        </Col>
        {/* Move the Search Bar to the right using offset */}
        <Col md={{ span: 3, offset: 2 }} className="hidden-row">
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
          <div className="table-container user-table-container">
            <div className="table-wrapper">
              <Table responsive striped bordered hover className="user-table">
                <thead className="fixed-header">
                  <tr>
                    <th
                      className="text-center"
                      onClick={() => handleSort("name")}
                    >
                      Name{" "}
                      {sortBy === "name" && (
                        <span>
                          {sortOrder === "asc" ? <FiChevronsLeft /> : <FiChevronsRight />}
                        </span>
                      )}
                    </th>
                    <th
                      className="text-center"
                      onClick={() => handleSort("email")}
                    >
                      Email{" "}
                      {sortBy === "email" && (
                        <span>
                          {sortOrder === "asc" ? <FiChevronsLeft /> : <FiChevronsRight />}
                        </span>
                      )}
                    </th>
                    <th
                      className="text-center"
                      onClick={() => handleSort("userType")}
                    >
                      Access Level{" "}
                      {sortBy === "userType" && (
                        <span>
                          {sortOrder === "asc" ? <FiChevronsLeft /> : <FiChevronsRight />}
                        </span>
                      )}
                    </th>
                    <th className="text-center">Actions</th>{" "}
                    {/* New column for actions */}
                  </tr>
                </thead>
                <tbody>
                  {getCurrentPageItems().map((user) => (
                    <tr key={user.id}>
                      <td className="text-center">
                        <div className="user-info">
                          <img
                            src={user.picture}
                            alt={user.name}
                            className="user-avatar"
                          />
                          <span className="user-name">{user.name}</span>
                        </div>
                      </td>
                      <td className="text-center">{user.email}</td>
                      <td className="text-center">{user.userType}</td>
                      <td className="text-center">
                        {/* Action buttons */}
                        <Button
                          variant="link"
                          title="Edit"
                          style={{ backgroundColor: "orange", color: "black" }}
                          onClick={() => setEditingUser(user)}
                        >
                          <FiEdit />
                        </Button>
                        <Button
                          variant="link"
                          title="Delete"
                          style={{ backgroundColor: "maroon", color: "white" }}
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          <FiTrash2 />
                        </Button>
                      </td>
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
      {editingUser && (
        <EditUser
          user={editingUser}
          show={editingUser !== null}
          onHide={() => setEditingUser(null)}
          onSave={handleUpdateUser}
        />
      )}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDeleteUser}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default UserInformation;
