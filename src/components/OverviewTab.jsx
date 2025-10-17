import { useEffect, useState } from "react";
import { db } from "../utils/firebase";
import { collection, getDocs } from "firebase/firestore";
import { FaBox, FaBoxes, FaDollarSign } from "react-icons/fa";
import "../styles/OverviewTab.css";

export default function OverviewTab() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStock: 0,
    totalSales: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsSnap = await getDocs(collection(db, "products"));
        const salesSnap = await getDocs(collection(db, "sales"));

        let totalStock = 0;
        let totalSales = 0;

        productsSnap.forEach((doc) => {
          const data = doc.data();
          totalStock += data.quantity || 0;
        });

        salesSnap.forEach((doc) => {
          const data = doc.data();
          totalSales += data.amount || 0;
        });

        setStats({
          totalProducts: productsSnap.size,
          totalStock,
          totalSales,
        });
      } catch (error) {
        console.error("Error loading stats:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="overview-tab">
      <div className="overview-top-row">
        <div className="overview-card products">
          <div className="card-icon"><FaBox size={28} /></div>
          <h3>Total Products</h3>
          <p>{stats.totalProducts}</p>
        </div>

        <div className="overview-card stock">
          <div className="card-icon"><FaBoxes size={28} /></div>
          <h3>Total Stock</h3>
          <p>{stats.totalStock}</p>
        </div>
      </div>

      <div className="overview-bottom-row">
        <div className="overview-card sales">
          <div className="card-icon"><FaDollarSign size={28} /></div>
          <h3>Total Sales</h3>
          <p>{stats.totalSales}</p>
        </div>
      </div>
    </div>
  );
}