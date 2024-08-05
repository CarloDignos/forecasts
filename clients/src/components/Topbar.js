import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useLogoutUserMutation } from "../services/appApi";
import { FaSignOutAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Nav, Navbar, Container, Button, NavDropdown, Modal } from "react-bootstrap";
import './Topbar.css';

function Topbar() {
  const user = useSelector((state) => state.user);
  const [searchValue, setSearchValue] = useState('');
  const [logoutUser] = useLogoutUserMutation();

  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleResetClick = () => {
    setSearchValue('');
  };

  async function handleLogout(e) {
    e.preventDefault();
    await logoutUser(user);
    // redirect to home page
    window.location.replace("/");
  }


  return (
    <Box className="topbar" textColor="Light"  display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box className="search-bar ">
 
      </Box>
      {/* ICONS */}
      <Box display="flex" justifyContent="flex-start">
  {user && (
    <NavDropdown
      title={
        <>
          <img
            src={user.picture}
            style={{
              width: 60,
              height: 60,
              marginRight: 10,
              objectFit: "cover",
              borderRadius: "80%",
            }}
            alt=""
          />
          {`${user.firstName || ''} ${user.middleName || ''} ${user.lastName || ''}`}
        </>
      }
      id="basic-nav-dropdown"
    >
      <NavDropdown.Item onClick={handleLogout}>
        <div className="item-container">
          <FaSignOutAlt className="icon LogoutIcon" />
          <span className="label">Logout</span>
        </div>
      </NavDropdown.Item>
    </NavDropdown>
  )}
</Box>

    </Box>
  );
}

export default Topbar;
