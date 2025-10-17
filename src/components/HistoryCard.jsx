// src/components/HistoryCard.jsx
import "../styles/HistoryTab.css";

export default function HistoryCard({ sale }) {
  return (
    <div className="history-card">
      <div className="left">
        <div className="product">{sale.product}</div>
        <div className="meta">Qty: {sale.qty} • ${sale.total}</div>
      </div>
      <div className="right">
        <div className="date">{sale.date}</div>
      </div>
    </div>
  );
}