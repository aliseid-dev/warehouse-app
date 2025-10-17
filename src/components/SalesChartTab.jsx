// src/components/SalesChartTab.jsx
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { db } from "../utils/firebase";
import { collection, getDocs } from "firebase/firestore";
import "../styles/SalesChartTab.css";

export default function SalesChartTab() {
  const [view, setView] = useState("weekly"); // daily | weekly | monthly | yearly
  const [chartData, setChartData] = useState([]);
  const [totalSales, setTotalSales] = useState(0);

  const views = ["daily", "weekly", "monthly", "yearly"];

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const salesSnap = await getDocs(collection(db, "sales"));
        const sales = salesSnap.docs.map(doc => doc.data());

        // Aggregate sales based on selected view
        let aggregated = [];
        let total = 0;

        if (view === "daily") {
          const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
          aggregated = days.map(day => {
            const daySales = sales.filter(s => s.day === day).reduce((a,b) => a + (b.amount || 0), 0);
            total += daySales;
            return { name: day, sales: daySales };
          });
        } else if (view === "weekly") {
          aggregated = [1,2,3,4].map(week => {
            const weekSales = sales.filter(s => s.week === week).reduce((a,b) => a + (b.amount || 0),0);
            total += weekSales;
            return { name: `Wk ${week}`, sales: weekSales };
          });
        } else if (view === "monthly") {
          const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
          aggregated = months.map(month => {
            const monthSales = sales.filter(s => s.month === month).reduce((a,b) => a + (b.amount || 0),0);
            total += monthSales;
            return { name: month, sales: monthSales };
          });
        } else if (view === "yearly") {
          const years = [...new Set(sales.map(s => s.year))];
          aggregated = years.map(year => {
            const yearSales = sales.filter(s => s.year === year).reduce((a,b) => a + (b.amount || 0),0);
            total += yearSales;
            return { name: year, sales: yearSales };
          });
        }

        setChartData(aggregated);
        setTotalSales(total);
      } catch(err) {
        console.error(err);
      }
    };

    fetchSalesData();
  }, [view]);

  return (
    <div className="sales-chart-panel">
      <div className="sales-chart-header">
        <h3>Sales Overview</h3>
        <div className="view-toggle">
          {views.map(v => (
            <button
              key={v}
              className={`view-btn ${view===v ? "active" : ""}`}
              onClick={() => setView(v)}
            >
              {v[0].toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="sales" stroke="#5c3d99" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Visual summary below chart */}
      <div className="sales-summary">
        <div className="summary-card">
          <h4>Total Sales</h4>
          <p>{totalSales}</p>
        </div>
        <div className="summary-card">
          <h4>Avg Sales</h4>
          <p>{(totalSales / chartData.length).toFixed(0)}</p>
        </div>
        <div className="summary-card">
          <h4>Max Sale</h4>
          <p>{Math.max(...chartData.map(d => d.sales))}</p>
        </div>
      </div>
    </div>
  );
}