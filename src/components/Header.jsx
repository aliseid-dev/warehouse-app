// src/components/Header.jsx
import React from "react";
import "../styles/Header.css";
import { FaUserCircle } from "react-icons/fa";
import logo from "../assets/FlashLogo.png";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="app-header">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <div
        className="profile-container"
        onClick={() => navigate("/profile")}
      >
        <FaUserCircle className="profile-icon" />
      </div>
    </header>
  );
};

export default Header;