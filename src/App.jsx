import { Routes, Route, Navigate } from "react-router-dom";
import WarehousePage from "./pages/WarehousePage";
import Store from "./pages/Store";
import SalesPage from "./pages/SalesPage";
import DashboardPage from "./pages/DashboardPage";
import BottomNav from "./components/BottomNav";
import "./styles/index.css";

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Navigate to="/warehouse" replace />} />
        <Route path="/warehouse" element={<WarehousePage />} />
        <Route path="/store" element={<Store />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*" element={<Navigate to="/warehouse" replace />} />
      </Routes>

      <BottomNav />
    </div>
  );
}

export default App;