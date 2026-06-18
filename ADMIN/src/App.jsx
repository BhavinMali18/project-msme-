import { BrowserRouter, Routes, Route, NavLink, Navigate, useNavigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Companies from "./pages/Companies";
import Participants from "./pages/Participants";
import Login from "./pages/Login";
import { LayoutDashboard, Building2, Users, LogOut } from "lucide-react";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar-header">MSME Admin</div>
        <nav style={{ display: "flex", flexDirection: "column", gap: "8px", flexGrow: 1 }}>
          <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>
          <NavLink to="/companies" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Building2 size={20} /> MSME Companies
          </NavLink>
          <NavLink to="/participants" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Users size={20} /> Hackathon
          </NavLink>
        </nav>
        <div style={{ padding: "0 24px", marginTop: "auto" }}>
          <button onClick={handleLogout} className="btn btn-outline" style={{ width: "100%", color: "var(--text-sidebar)", borderColor: "rgba(255,255,255,0.2)" }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>
      <main className="main-content">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/participants" element={<Participants />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
