import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import RegisterEmployee from "./pages/auth/RegisterEmployee";

import AdminDashboard from "./pages/admin/Dashboard";
import Departments from "./pages/admin/Departments";
import Questions from "./pages/admin/Questions";
import UploadQuestionnaire from "./pages/admin/UploadQuestionnaire";

import CompanyDashboard from "./pages/company/Dashboard";
import ParticipantDashboard from "./pages/dashboard/Dashboard";

const RootRedirect = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return user?.role === "company" ? (
    <Navigate to="/company/dashboard" replace />
  ) : (
    <Navigate to="/dashboard" replace />
  );
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Root Redirect Route */}
        <Route path="/" element={<RootRedirect />} />

        {/* Public Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/employee" element={<RegisterEmployee />} />

        {/* Company Dashboard (Protected) */}
        <Route
          path="/company/dashboard"
          element={
            <ProtectedRoute allowedRole="company">
              <CompanyDashboard />
            </ProtectedRoute>
          }
        />

        {/* Participant Portal (Protected) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRole="participant">
              <ParticipantDashboard />
            </ProtectedRoute>
          }
        />

        {/* Original Questionnaire Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="company">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/departments"
          element={
            <ProtectedRoute allowedRole="company">
              <Departments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/questions"
          element={
            <ProtectedRoute allowedRole="company">
              <Questions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute allowedRole="company">
              <UploadQuestionnaire />
            </ProtectedRoute>
          }
        />

        {/* Fallback Catch-All */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;