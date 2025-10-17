import React from "react";
import "../styles/BottomNav.css";
import { FaWarehouse, FaChartBar, FaStore, FaMoneyBillWave } from "react-icons/fa";

const BottomNav = ({ setPage, currentPage }) => {
  return (
    <div className="bottom-nav">
      <div
        className={`nav-item ${currentPage === "warehouse" ? "active" : ""}`}
        onClick={() => setPage("warehouse")}
      >
        <FaWarehouse className="nav-icon" />
        <span>Warehouse</span>
      </div>

      <div
        className={`nav-item ${currentPage === "store" ? "active" : ""}`}
        onClick={() => setPage("store")}
      >
        <FaStore className="nav-icon" />
        <span>Store</span>
      </div>

      <div
        className={`nav-item ${currentPage === "sales" ? "active" : ""}`}
        onClick={() => setPage("sales")}
      >
        <FaMoneyBillWave className="nav-icon" />
        <span>Sales</span>
      </div>

      <div
        className={`nav-item ${currentPage === "dashboard" ? "active" : ""}`}
        onClick={() => setPage("dashboard")}
      >
        <FaChartBar className="nav-icon" />
        <span>Dashboard</span>
      </div>
    </div>
  );
};

export default BottomNav;