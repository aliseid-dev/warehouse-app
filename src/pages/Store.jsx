// src/pages/Store.jsx
import React, { useState } from "react";
import Header from "../components/Header";
import StoreProducts from "../components/StoreProducts";
import TransferStock from "../components/TransferStock";
import { db } from "../utils/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import "../styles/Store.css";
import "../styles/DashboardTabs.css";

const Store = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [loading, setLoading] = useState(false);

  return (
    <div className="store-page">
      <Header title="Store" />


      <div className="store-content">
        <div className="dashboard-tabs">
          <button
            className={`tab-btn ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            Products
          </button>
          <button
            className={`tab-btn ${activeTab === "transfer" ? "active" : ""}`}
            onClick={() => setActiveTab("transfer")}
          >
            Transfer Stock
          </button>
        </div>

        {activeTab === "products" && <StoreProducts />}
        {activeTab === "transfer" && <TransferStock />}
      </div>
    </div>
  );
};

export default Store;