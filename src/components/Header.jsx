// src/components/Header.jsx
import React from "react";
import "../styles/Header.css";
import { FaUserCircle } from "react-icons/fa";
import logo from "../assets/FlashLogo.png";

const Header = ({ onProfileClick }) => {
  return (
    <header className="app-header">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <div className="profile-container" onClick={onProfileClick}>
        <FaUserCircle className="profile-icon" />
      </div>
    </header>
  );
};

export default Header;