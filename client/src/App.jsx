import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Placeholder from "./pages/Placeholder";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { roleHome } from "./utils/roleHome";

function Home() {
  const { user, loading } = useAuth();
  if (loading) return <p className="p-6">Loading...</p>;
  return <Navigate to={user ? roleHome[user.role] : "/login"} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/patient"
        element={
          <ProtectedRoute roles={["patient"]}>
            <Placeholder title="Patient dashboard" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reception"
        element={
          <ProtectedRoute roles={["receptionist"]}>
            <Placeholder title="Reception dashboard" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor"
        element={
          <ProtectedRoute roles={["doctor"]}>
            <Placeholder title="Doctor dashboard" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<p className="p-6">Page not found</p>} />
    </Routes>
  );
}
