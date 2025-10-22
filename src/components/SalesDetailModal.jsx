// src/components/SaleDetailsModal.jsx
import "../styles/SaleDetailsModal.css";

export default function SaleDetailsModal({ sale, onClose }) {
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>

        <h2 className="modal-title">Sale Details</h2>

        <div className="modal-details">
          <div className="details-row">
            <strong>Product:</strong> {sale.productName}
          </div>
          <div className="details-row">
            <strong>Customer:</strong> {sale.customerName}
          </div>
          <div className="details-row">
            <strong>Quantity:</strong> {sale.quantity}
          </div>
          <div className="details-row">
            <strong>Total:</strong> ${sale.total}
          </div>
          <div className="details-row">
            <strong>Payment Status:</strong> {sale.paymentStatus}
          </div>
          <div className="details-row">
            <strong>Date:</strong> {formattedDate}
          </div>
          {/* Using tinNumber from Firestore */}
          <div className="details-row">
            <strong>TIN:</strong> {sale.tinNumber || "N/A"}
          </div>
        </div>
      </div>
    </div>
  );
}