import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function CompanyDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [inviteEmail, setInviteEmail] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);

  // Simulated employees list
  const [employees, setEmployees] = useState([
    { id: 1, name: "Admin (You)", email: user?.email || "admin@company.com", status: "Active" },
    { id: 2, name: "Sarah Connor", email: "sconnor@company.com", status: "Active" },
    { id: 3, name: "John Connor", email: "jconnor@company.com", status: "Pending Invite" }
  ]);

  const handleGenerateInvite = (e) => {
    e.preventDefault();
    if (!inviteEmail) return;

    const companyParam = encodeURIComponent(user?.companyName || "Your Company");
    const emailParam = encodeURIComponent(inviteEmail);
    const origin = window.location.origin;
    const url = `${origin}/register/employee?company=${companyParam}&email=${emailParam}`;

    setGeneratedLink(url);
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    // Add to simulated list
    if (!employees.some(emp => emp.email === inviteEmail)) {
      setEmployees(prev => [
        ...prev,
        { id: prev.length + 1, name: "Invited User", email: inviteEmail, status: "Pending Invite" }
      ]);
    }
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="portal-layout">
      {/* Sidebar navigation */}
      <aside className="portal-sidebar">
        <div className="portal-logo">MSME Admin</div>
        <nav className="portal-nav">
          <Link to="/company/dashboard" className="portal-nav-item active">
            Dashboard
          </Link>
          <Link to="/departments" className="portal-nav-item">
            Departments
          </Link>
          <Link to="/questions" className="portal-nav-item">
            Questions
          </Link>
          <Link to="/upload" className="portal-nav-item">
            Upload Questionnaire
          </Link>
        </nav>
        <button
          onClick={handleLogout}
          className="btn-secondary"
          style={{ padding: "10px", marginTop: "auto", border: "1px solid var(--border)" }}
        >
          Log Out
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="portal-main">
        <header className="portal-header">
          <div>
            <h1 style={{ margin: 0, fontSize: "28px", letterSpacing: "-0.5px" }}>
              {user?.companyName || "Company Portal"}
            </h1>
            <p style={{ color: "var(--text)", marginTop: "4px" }}>Manage team onboarding and questionnaires</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div className="user-badge">
              <div className="user-avatar">
                {user?.name ? user.name[0].toUpperCase() : "C"}
              </div>
              <div>
                <div style={{ fontWeight: 600, color: "var(--text-h)" }}>{user?.name || "Admin"}</div>
                <div style={{ fontSize: "12px", color: "var(--text)" }}>Administrator</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              style={{
                padding: "8px 16px",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                background: "none",
                cursor: "pointer",
                fontSize: "14px",
                color: "var(--text-h)",
                transition: "background 0.2s"
              }}
              onMouseOver={(e) => e.target.style.background = "var(--code-bg)"}
              onMouseOut={(e) => e.target.style.background = "none"}
            >
              Log Out
            </button>
          </div>
        </header>

        {/* Quick Stats Grid */}
        <section className="stats-grid">
          <div className="stat-card">
            <h3 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: 500, color: "var(--text)" }}>
              Total Onboarded Team
            </h3>
            <div className="stat-val">{employees.length}</div>
            <p style={{ fontSize: "12px", color: "var(--accent)" }}>+1 added this week</p>
          </div>
          <div className="stat-card">
            <h3 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: 500, color: "var(--text)" }}>
              Pending Invites
            </h3>
            <div className="stat-val">
              {employees.filter(e => e.status === "Pending Invite").length}
            </div>
            <p style={{ fontSize: "12px", color: "var(--text)" }}>Awaiting activation</p>
          </div>
          <div className="stat-card">
            <h3 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: 500, color: "var(--text)" }}>
              Active Surveys
            </h3>
            <div className="stat-val">2</div>
            <p style={{ fontSize: "12px", color: "green" }}>Ongoing assessment</p>
          </div>
        </section>

        {/* Content sections */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "32px" }}>
          {/* Team List */}
          <section style={{ border: "1px solid var(--border)", borderRadius: "12px", padding: "24px" }}>
            <h2 style={{ fontSize: "18px", marginBottom: "20px" }}>Team Members</h2>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "1px solid var(--border)" }}>
                  <th style={{ paddingBottom: "12px", color: "var(--text)", fontSize: "14px", fontWeight: 500 }}>Name</th>
                  <th style={{ paddingBottom: "12px", color: "var(--text)", fontSize: "14px", fontWeight: 500 }}>Email</th>
                  <th style={{ paddingBottom: "12px", color: "var(--text)", fontSize: "14px", fontWeight: 500 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(emp => (
                  <tr key={emp.id} style={{ borderBottom: "1px solid var(--border)", height: "48px" }}>
                    <td style={{ fontWeight: 500, color: "var(--text-h)" }}>{emp.name}</td>
                    <td style={{ color: "var(--text)" }}>{emp.email}</td>
                    <td>
                      <span style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: 600,
                        background: emp.status === "Active" ? "rgba(34, 197, 94, 0.1)" : "rgba(234, 179, 8, 0.1)",
                        color: emp.status === "Active" ? "rgb(34, 197, 94)" : "rgb(234, 179, 8)"
                      }}>
                        {emp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Invitation Generator */}
          <section style={{ border: "1px solid var(--border)", borderRadius: "12px", padding: "24px" }}>
            <h2 style={{ fontSize: "18px", marginBottom: "12px" }}>Invite Employee</h2>
            <p style={{ color: "var(--text)", fontSize: "14px", lineHeight: "1.4" }}>
              Invite employees to complete self-assessments. Enter an email address to generate an onboarding URL.
            </p>

            <form onSubmit={handleGenerateInvite} style={{ marginTop: "20px" }}>
              <div className="form-group">
                <label className="form-label" htmlFor="inviteEmail">Employee Email</label>
                <input
                  id="inviteEmail"
                  type="email"
                  className="form-input"
                  placeholder="employee@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn-primary" style={{ padding: "10px" }}>
                Generate Onboarding Link
              </button>
            </form>

            {generatedLink && (
              <div className="invite-box">
                <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--accent)" }}>Invite URL Ready</span>
                <div className="copy-input-group">
                  <input
                    type="text"
                    className="form-input"
                    value={generatedLink}
                    readOnly
                    style={{ flexGrow: 1, fontSize: "12px", padding: "8px" }}
                  />
                  <button onClick={handleCopy} className="copy-btn" style={{ padding: "8px 12px" }}>
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
