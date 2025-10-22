// src/components/HistoryTab.jsx
import { useEffect, useState } from "react";
import SalesDetailModal from "./SalesDetailModal";
import { db } from "../utils/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import "../styles/HistoryTab.css";

export default function HistoryTab() {
  const [sales, setSales] = useState([]);
  const [filter, setFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedSale, setSelectedSale] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch sales
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const salesCol = collection(db, "sales");
        const q = query(salesCol, orderBy("timestamp", "desc"));
        const salesSnap = await getDocs(q);

        const salesData = salesSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setSales(salesData);
      } catch (err) {
        console.error("Error fetching sales:", err);
      }
    };

    fetchSales();
  }, []);

  // Filter sales
  const filteredSales = sales.filter((s) => {
    const dateObj = s.timestamp?.seconds
      ? new Date(s.timestamp.seconds * 1000)
      : null;
    const dateStr = dateObj
      ? dateObj.toISOString().split("T")[0]
      : "";

    const matchesText =
      s.customerName?.toLowerCase().includes(filter.toLowerCase()) ||
      s.tinNumber?.toString().includes(filter);

    const matchesDate =
      (!startDate || dateStr >= startDate) &&
      (!endDate || dateStr <= endDate);

    return matchesText && matchesDate;
  });

  const openModal = (sale) => {
    setSelectedSale(sale);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedSale(null);
    setModalOpen(false);
  };

  return (
    <div className="history-tab-container">
      <div className="history-header">
        <h3>Sales History</h3>
        <div className="history-filters">
          <input
            type="text"
            placeholder="Filter by customer or TIN"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <div className="date-filters">
            <label>
              From:
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </label>
            <label>
              To:
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </label>
          </div>
        </div>
      </div>

      {filteredSales.length === 0 ? (
        <p className="no-history">No sales match the filter.</p>
      ) : (
        <div className="history-table-wrapper">
          <table className="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((s) => (
                <tr key={s.id}>
                  <td>
                    {s.timestamp?.seconds
                      ? new Date(s.timestamp.seconds * 1000).toLocaleDateString(
                          "en-GB",
                          { day: "2-digit", month: "short", year: "numeric" }
                        )
                      : "N/A"}
                  </td>
                  <td>{s.customerName || "N/A"}</td>
                  <td>${s.total}</td>
                  <td>
                    <button className="view-btn" onClick={() => openModal(s)}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && selectedSale && (
        <SalesDetailModal sale={selectedSale} onClose={closeModal} />
      )}
    </div>
  );
}