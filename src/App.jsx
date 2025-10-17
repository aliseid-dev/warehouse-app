import { useState, useEffect } from "react";
import ProductList from "./components/ProductList";
import DashboardPage from "./pages/DashboardPage";
import BottomNav from "./components/BottomNav";
import SplashScreen from "./pages/SplashScreen";
import WarehousePage from "./pages/WarehousePage";
import Store from "./pages/Store";
import SalesPage from "./pages/SalesPage"; // ✅ corrected import
import "./styles/index.css";

function App() {
  const [page, setPage] = useState("warehouse");
  const [loading, setLoading] = useState(true);

  // Show splash screen for 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="app-container">
      {loading ? (
        <SplashScreen />
      ) : (
        <>
          {page === "warehouse" && <WarehousePage />}
          {page === "store" && <Store />}
          {page === "sales" && <SalesPage />} {/* ✅ updated */}
          {page === "dashboard" && <DashboardPage />}
          <BottomNav setPage={setPage} currentPage={page} />
        </>
      )}
    </div>
  );
}

export default App;