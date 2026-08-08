import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Gates a route group by role. A hospital user can never see /admin/*
// and an admin user is redirected away from /hospital/* — each dashboard
// only renders for the role it belongs to.
export default function ProtectedRoute({ role, children }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={`/${user.role}`} replace />;

  return children;
}
