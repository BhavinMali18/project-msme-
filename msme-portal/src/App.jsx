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
import ProblemStatementWizard from "./pages/company/ProblemStatementWizard";
import DeptHeads from "./pages/company/DeptHeads";
import CustomQuestions from "./pages/company/CustomQuestions";

import ParticipantDashboard from "./pages/dashboard/Dashboard";
import Questionnaire from "./pages/dashboard/Questionnaire";
import DeptDashboard from "./pages/dept/Dashboard";

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

  if (user?.role === "company") return <Navigate to="/company/dashboard" replace />;
  if (user?.role === "dept_head") return <Navigate to="/dept/dashboard" replace />;
  // participant = employee
  return <Navigate to="/dashboard" replace />;
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
        <Route
          path="/company/submit-problem"
          element={
            <ProtectedRoute allowedRole="company">
              <ProblemStatementWizard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/dept-heads"
          element={
            <ProtectedRoute allowedRole="company">
              <DeptHeads />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/custom-questions"
          element={
            <ProtectedRoute allowedRole="company">
              <CustomQuestions />
            </ProtectedRoute>
          }
        />

        {/* Dept Head Portal */}
        <Route
          path="/dept/dashboard"
          element={
            <ProtectedRoute allowedRole="dept_head">
              <DeptDashboard />
            </ProtectedRoute>
          }
        />

        {/* Employee/Participant Portal (Protected) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRole="participant">
              <ParticipantDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/questionnaire/:departmentId"
          element={
            <ProtectedRoute allowedRole="participant">
              <Questionnaire />
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