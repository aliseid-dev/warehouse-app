import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import WarehousePage from "./pages/WarehousePage";
import Store from "./pages/Store";
import SalesPage from "./pages/SalesPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ProtectedRoute from "./components/ProtectedRoute";
import BottomNav from "./components/BottomNav";
import "./styles/index.css";

function App() {
  const location = useLocation();
  const hideBottomNav = ["/login", "/signup", "/forgot-password"].includes(location.pathname);

  return (
    <div className="app-container">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route
          path="/warehouse"
          element={
            <ProtectedRoute>
              <WarehousePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/store"
          element={
            <ProtectedRoute>
              <Store />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales"
          element={
            <ProtectedRoute>
              <SalesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/warehouse" replace />} />
        <Route path="*" element={<Navigate to="/warehouse" replace />} />
      </Routes>

      {!hideBottomNav && <BottomNav />}
    </div>
  );
}

export default App;