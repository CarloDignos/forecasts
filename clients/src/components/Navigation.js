import React, { useState } from "react";
import { Nav, Navbar, Container, Button, NavDropdown, Modal } from "react-bootstrap";
import { useLogoutUserMutation, useDeleteAccountMutation  } from "../services/appApi";
import { useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { FaTrashAlt, FaSignOutAlt } from "react-icons/fa";
import { useLocation } from "react-router-dom"; // Import the useLocation hook
import logo from "../pages/logochicken.png";
import "./Navigation.css"

function Navigation() {
  const user = useSelector((state) => state.user);
  const [logoutUser] = useLogoutUserMutation();
  const [deleteAccount] = useDeleteAccountMutation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleShowDeleteModal = () => setShowDeleteModal(true);
  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const location = useLocation(); // Get the current location

  async function handleDeleteAccount() {
    try {
      await deleteAccount(user.id);
      console.log("Account deleted successfully");
      await logoutUser(user);
      console.log("User logged out");
      window.location.replace("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      // Handle error
    }
  }

  async function handleConfirmDeleteAccount() {
    handleCloseDeleteModal();
    handleDeleteAccount();
  }

  async function handleLogout(e) {
    e.preventDefault();
    await logoutUser(user);
    // redirect to home page
    window.location.replace("/");
  }

  const isRegisterPath = location.pathname.startsWith("/register/"); // Check if the current path matches "/register/:eventId"

  if (isRegisterPath) {
    return null; // Return null to hide the navigation bar
  }
  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>
              <img src={logo} style={{ width: 60, height: 60 }} alt="" />
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {!isRegisterPath && ( // Hide "Home" and "Login" links on the /register/:eventId path
                <>
                  <LinkContainer to="/">
                    <Nav.Link className="stroke-effect">Home</Nav.Link>
                  </LinkContainer>
                  {!user && (
                    <LinkContainer to="/login">
                      <Nav.Link className="stroke-effect login-link">Login</Nav.Link>
                    </LinkContainer>
                  )}
                </>
              )}
              {user && (
                <NavDropdown
                  title={
                    <>
                      <img
                        src={user.picture}
                        style={{
                          width: 30,
                          height: 30,
                          marginRight: 10,
                          objectFit: "cover",
                          borderRadius: "80%",
                        }}
                        alt=""
                      />
                      {user.name}
                    </>
                  }
                  id="basic-nav-dropdown"
                >
                  <NavDropdown.Item onClick={handleShowDeleteModal}>
                    <div className="item-container">
                      <FaTrashAlt className="icon DeleteIcon" />
                      <span className="label">Delete Account</span>
                    </div>
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={handleLogout}>
                    <div className="item-container">
                      <FaSignOutAlt className="icon LogoutIcon" />
                      <span className="label">Logout</span>
                    </div>
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
        <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete your account?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDeleteModal}>
              No
            </Button>
            <Button variant="danger" onClick={handleConfirmDeleteAccount}>
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
      </Navbar>
    </>
  );
}

export default Navigation;
