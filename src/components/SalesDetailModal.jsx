import "../styles/SaleDetailsModal.css";
import { db } from "../utils/firebase";
import { doc, deleteDoc } from "firebase/firestore";

export default function SaleDetailsModal({ sale, onClose, onDelete }) {
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

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this sale? This action cannot be undone."
      )
    )
      return;

    try {
      await deleteDoc(doc(db, "sales", sale.id));
      alert("✅ Sale deleted successfully");

      // Notify parent to remove this sale from state
      onDelete && onDelete(sale.id);

      // Close modal
      onClose();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete sale");
    }
  };

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
          <div className="details-row">
            <strong>TIN:</strong> {sale.tinNumber || "N/A"}
          </div>
        </div>

        <button className="delete-btn" onClick={handleDelete}>
          Delete Sale
        </button>
      </div>
    </div>
  );
}