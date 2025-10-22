import { useState } from "react";
import SaleDetailsModal from "./SalesDetailModal"; 
import "../styles/HistoryTab.css";

export default function HistoryCard({ sale }) {
  const [showModal, setShowModal] = useState(false);

  // Format date to "22 Nov 2026"
  const formattedDate = sale.timestamp?.seconds
    ? new Date(sale.timestamp.seconds * 1000).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

  return (
    <>
      <div className="history-card">
        <div className="left">
          <div className="product">{sale.productName}</div>
        </div>
        <div className="right">
          <div className="date">{formattedDate}</div>
          <div className="total">${sale.total}</div>
        </div>
        <button className="view-details-btn" onClick={() => setShowModal(true)}>
          View Details
        </button>
      </div>

      {showModal && (
        <SaleDetailsModal
          sale={sale}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}