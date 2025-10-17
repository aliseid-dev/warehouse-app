// src/components/HistoryTab.jsx
import HistoryCard from "./HistoryCard";
import "../styles/HistoryTab.css";

export default function HistoryTab({ sales = null }) {
  // sample data — later fetch from Firestore
  const sample = sales ?? [
    { id: "s1", product: "Pepsi 1L", qty: 10, total: 50, date: "2025-10-16" },
    { id: "s2", product: "Cement 50kg", qty: 2, total: 200, date: "2025-10-15" },
    { id: "s3", product: "Bricks (100)", qty: 1, total: 120, date: "2025-10-14" },
  ];

  if (!sample.length) return <p className="no-history">No sales yet.</p>;

  return (
    <div className="history-tab">
      <div className="history-list">
        {sample.map((s) => <HistoryCard key={s.id} sale={s} />)}
      </div>
    </div>
  );
}