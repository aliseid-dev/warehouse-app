import { Navigate } from "react-router-dom";
import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function ProtectedRoute({ children }) {
  const [user, loading] = useAuthState(auth);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}