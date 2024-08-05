import React, { useState, useEffect } from "react";
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from 'cdbreact';
import { NavLink } from 'react-router-dom';
import { useLogoutUserMutation } from "../services/appApi";
import { useSelector } from "react-redux";
import "./Sidebar.css";
import { Modal, Button, Container } from "react-bootstrap";


const Sidebar = () => {
  const user = useSelector((state) => state.user);
  const [minimizePicture, setMinimizePicture] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [logoutUser] = useLogoutUserMutation();
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [activeMenuItem, setActiveMenuItem] = useState(""); 

  // Function to handle browser resize
  const handleResize = () => {
    if (window.innerWidth <= 600) {
      setMinimizePicture(true);
    } else {
      setMinimizePicture(false);
    }
  };

  useEffect(() => {
    // Add event listener for resize
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check on component mount

    // Cleanup: remove event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setCurrentDate(now.toLocaleDateString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  async function handleLogout(e) {
    e.preventDefault();
    try {
      // Use the appropriate payload for the logout request
      const payload = {
        _id: user._id, // Replace this with the correct property name for user ID
        newMessages: [], // Replace this with the correct property name for newMessages
      };
  
      await logoutUser(payload);
      // Redirect to the home page or any other page after successful logout
      window.location.replace("/");
    } catch (error) {
      // Handle any errors that occurred during logout
      console.error("Error logging out:", error);
    }
  }

  // Function to handle menu item click and update the state
  const handleMenuItemClick = (menuItem) => {
    setActiveMenuItem(menuItem);
    setIsSubMenuOpen(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShowModal = () => {
    setShowModal(true);
  };


  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false); // State to track submenu open/close

  // Function to handle submenu click
  const handleSubMenuClick = () => {
    setIsSubMenuOpen(!isSubMenuOpen);
  };

  // Render the submenu based on the submenu state
  const renderSubMenu = () => {
    if (isSubMenuOpen) {
      return (
        <>
        <Container style={{backgroundColor: "#0a2d42", padding: "5px"}}>
          <NavLink exact to="/EggCollection" activeClassName="activeClicked">
            <CDBSidebarMenuItem
              className={`CDBSidebarMenuItems ${
                activeMenuItem === "eggCollection" ? "active" : ""
              }`}
              icon="egg"
              onClick={() => handleMenuItemClick("eggCollection")}
            >
              Egg Collection
            </CDBSidebarMenuItem>
          </NavLink>
          <NavLink exact to="/ForecastEggProduction" activeClassName="activeClicked">
            <CDBSidebarMenuItem
              className={`CDBSidebarMenuItems ${
                activeMenuItem === "forecastEggProduction" ? "active" : ""
              }`}
              icon="chart-line"
              onClick={() => handleMenuItemClick("forecastEggProduction")}
            >
              Forecast About Egg Production
            </CDBSidebarMenuItem>
          </NavLink>
          {/** <NavLink exact to="/Reports" activeClassName="activeClicked">
              <CDBSidebarMenuItem
                className={`CDBSidebarMenuItems ${
                  activeMenuItem === "reports" ? "active" : ""
                }`}
                icon="file-alt"
                onClick={() => handleMenuItemClick("reports")}
              >
                Reports
              </CDBSidebarMenuItem>
            </NavLink>*/}
            </Container>
        </>
      );
    }
    return  <> </>;
  };


  return (
    <div style={{ display: 'flex', overflow: 'scroll initial' }}>
      <CDBSidebar textColor="#fff" backgroundColor="#0a3d62">
        <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large" onClick={() => setMinimizePicture(!minimizePicture)}></i>}>
          Dashboard
        </CDBSidebarHeader>
        
       
        {user.userType === "User" && ( 
  <>
            <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>
            <NavLink exact to="/ChickenInformation" activeClassName="activeClicked">
              <CDBSidebarMenuItem
                className={`CDBSidebarMenuItem ${
                  activeMenuItem === "userInformation" ? "active" : ""
                }`}
                icon="user"
                onClick={() => handleMenuItemClick("userInformation")}
              >
                Manage Chicken
              </CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/breeding" activeClassName="activeClicked">
              <CDBSidebarMenuItem
                className={`CDBSidebarMenuItem ${
                  activeMenuItem === "eventInformation" ? "active" : ""
                }`}
                icon="book"
                onClick={() => handleMenuItemClick("eventInformation")}
              >
                Manage Breeding
              </CDBSidebarMenuItem>
            </NavLink>
              <CDBSidebarMenuItem className="ListDown" icon="caret-right" onClick={handleSubMenuClick}>
                Egg Production Monitoring
              </CDBSidebarMenuItem>
            {renderSubMenu()}
            <NavLink exact to="/Health" activeClassName="activeClicked">
              <CDBSidebarMenuItem
                className={`CDBSidebarMenuItem ${
                  activeMenuItem === "health" ? "active" : ""
                }`}
                icon="heart"
                onClick={() => handleMenuItemClick("health")}
              >
                Health
              </CDBSidebarMenuItem>
            </NavLink>
          </CDBSidebarMenu>
        </CDBSidebarContent>
  </>
)}



{user.userType === "Admin" && ( 
        <>
        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>
           
            <NavLink exact to="/UserInformation" activeClassName="activeClicked">
              <CDBSidebarMenuItem
                className={`CDBSidebarMenuItem ${
                  activeMenuItem === "userInformation" ? "active" : ""
                }`}
                icon="user"
                onClick={() => handleMenuItemClick("userInformation")}
              >
                Manage User
              </CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/ChickenInformation" activeClassName="activeClicked">
              <CDBSidebarMenuItem
                className={`CDBSidebarMenuItem ${
                  activeMenuItem === "eventInformation" ? "active" : ""
                }`}
                icon="book"
                onClick={() => handleMenuItemClick("eventInformation")}
              >
                Manage Chicken
              </CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/varietyList" activeClassName="activeClicked">
              <CDBSidebarMenuItem
                className={`CDBSidebarMenuItem ${
                  activeMenuItem === "eventInformation" ? "active" : ""
                }`}
                icon="book"
                onClick={() => handleMenuItemClick("eventInformation")}
              >
                Variety
              </CDBSidebarMenuItem>
            </NavLink>
          </CDBSidebarMenu>
        </CDBSidebarContent>
        </>
      )}

{user.userType === "Event Monitoring" && ( 
        <>
        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>
            <NavLink exact to="/dashboard" activeClassName="activeClicked">
              <CDBSidebarMenuItem
                className={`CDBSidebarMenuItem ${
                  activeMenuItem === "dashboard" ? "active" : ""
                }`}
                icon="columns"
                onClick={() => handleMenuItemClick("dashboard")}
              >
                Dashboard
              </CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/EventMonitoring" activeClassName="activeClicked">
              <CDBSidebarMenuItem
                className={`CDBSidebarMenuItem ${
                  activeMenuItem === "eventInformation" ? "active" : ""
                }`}
                icon="book"
                onClick={() => handleMenuItemClick("eventInformation")}
              >
                Manage Event
              </CDBSidebarMenuItem>
            </NavLink>
          </CDBSidebarMenu>
        </CDBSidebarContent>
        </>
      )}

        <CDBSidebarFooter>
          <div style={{ textAlign: "center", padding: "5px" }}>
            <div>{currentTime}</div>
            <div>{currentDate}</div>
          </div>
        </CDBSidebarFooter>
      </CDBSidebar>

      {/* Logout Confirmation Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to logout?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleLogout}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Sidebar;

