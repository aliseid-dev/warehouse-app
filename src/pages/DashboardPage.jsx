// src/pages/DashboardPage.jsx
import { useState } from "react";
import DashboardTabs from "../components/DashboardTabs";
import OverviewTab from "../components/OverviewTab";
import SalesChartTab from "../components/SalesChartTab";
import HistoryTab from "../components/HistoryTab";
import Header from "../components/Header";
import "../styles/DashboardPage.css";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview"); // overview | sales | history

  return (
    <div className="dashboard-page">
      {/* Header */}
      <Header />

      {/* Tabs */}
      <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Tab Content */}
      <div className="dashboard-content">
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "sales" && <SalesChartTab />}
        {activeTab === "history" && <HistoryTab />}
      </div>
    </div>
  );
}