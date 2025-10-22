// src/components/DashboardTabs.jsx
import React from "react";
import "../styles/DashboardTabs.css";

export default function DashboardTabs({ activeTab, setActiveTab }) {
  return (
    <div className="dashboard-tabs">
      <button
        className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
        onClick={() => setActiveTab("overview")}
      >
        Overview
      </button>

      <button
        className={`tab-btn ${activeTab === "history" ? "active" : ""}`}
        onClick={() => setActiveTab("history")}
      >
        History
      </button>
    </div>
  );
}