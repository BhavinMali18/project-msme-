import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const NAV = [
  { to: "/company/dashboard", icon: "⊞", label: "Dashboard" },
  { to: "/company/dept-heads", icon: "👥", label: "Dept Heads" },
  { to: "/company/custom-questions", icon: "❓", label: "Custom Questions" },
  { to: "/company/submit-problem", icon: "📋", label: "Problem Statement" },
];

export default function CompanyLayout({ children, title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = (user?.companyName || user?.name || "C")[0].toUpperCase();

  return (
    <div className="portal-layout">
      {/* Sidebar */}
      <aside className="portal-sidebar">
        <div className="portal-sidebar-inner">
          <div className="portal-logo">
            <div className="portal-logo-dot" />
            {user?.companyName || "MSME Portal"}
          </div>

          <nav className="portal-nav">
            <div className="portal-nav-section-label">Main</div>
            {NAV.map(({ to, icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  "portal-nav-item" + (isActive ? " active" : "")
                }
              >
                <span style={{ fontSize: "15px" }}>{icon}</span>
                {label}
              </NavLink>
            ))}

            <div className="portal-nav-section-label" style={{ marginTop: "auto", paddingTop: "12px" }}>Account</div>
            <button className="portal-nav-item" onClick={handleLogout}>
              <span style={{ fontSize: "15px" }}>⎋</span>
              Log Out
            </button>
          </nav>

          <div className="portal-user">
            <div className="portal-user-info">
              <div className="user-avatar">{initials}</div>
              <div>
                <div className="portal-user-name">{user?.name}</div>
                <div className="portal-user-role">Company Admin</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="portal-main">
        <div className="portal-topbar">
          <span className="portal-topbar-title">{title}</span>
          <div className="portal-topbar-actions">
            <div className="user-avatar" style={{ width: 32, height: 32, fontSize: 13 }}>
              {initials}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-h)", lineHeight: 1.2 }}>
                {user?.name}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-sub)" }}>
                {user?.companyName}
              </div>
            </div>
          </div>
        </div>

        <div className="portal-content">
          {children}
        </div>
      </main>
    </div>
  );
}
