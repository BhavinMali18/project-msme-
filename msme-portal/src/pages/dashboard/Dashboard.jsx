import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ParticipantDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Simulated department assessments list
  const departments = [
    { code: "operations", name: "Operations & Production", status: "Not Started", progress: 0 },
    { code: "finance", name: "Finance & Working Capital", status: "In Progress", progress: 45 },
    { code: "hr", name: "HR & Workforce", status: "Completed", progress: 100 }
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      {/* Header Bar */}
      <header style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 40px",
        borderBottom: "1px solid var(--border)",
        background: "var(--bg)"
      }}>
        <div>
          <div style={{ fontSize: "20px", fontWeight: 700, color: "var(--accent)" }}>MSME Assessment</div>
          <div style={{ fontSize: "14px", color: "var(--text)" }}>{user?.companyName || "Organization Partner"}</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div className="user-badge">
            <div className="user-avatar" style={{ width: "36px", height: "36px" }}>
              {user?.name ? user.name[0].toUpperCase() : "P"}
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontWeight: 600, fontSize: "14px", color: "var(--text-h)" }}>{user?.name || "Participant"}</div>
              <div style={{ fontSize: "11px", color: "var(--text)" }}>Employee</div>
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

      {/* Main content */}
      <main style={{ flexGrow: 1, padding: "40px", maxWidth: "900px", margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
        <section style={{
          background: "radial-gradient(circle at top right, var(--accent-bg), transparent)",
          border: "1px solid var(--accent-border)",
          borderRadius: "16px",
          padding: "32px",
          marginBottom: "40px",
          textAlign: "left"
        }}>
          <h1 style={{ margin: "0 0 8px 0", fontSize: "32px", fontWeight: 600, letterSpacing: "-1px" }}>
            Hello, {user?.name || "Participant"}!
          </h1>
          <p style={{ fontSize: "16px", color: "var(--text)", lineHeight: "1.5", maxWidth: "600px" }}>
            Welcome to the MSME Assessment Portal. Your company has invited you to complete assessments across key operational areas. Please fill out the questionnaires below.
          </p>
        </section>

        {/* Questionnaires Checklist */}
        <section style={{ textAlign: "left" }}>
          <h2 style={{ fontSize: "20px", marginBottom: "24px", fontWeight: 600 }}>Your Department Assessments</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {departments.map(dept => (
              <div
                key={dept.code}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  padding: "24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "var(--bg)"
                }}
              >
                <div style={{ flexGrow: 1, marginRight: "40px" }}>
                  <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", color: "var(--text-h)", fontWeight: 600 }}>
                    {dept.name}
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{
                      width: "120px",
                      height: "6px",
                      background: "var(--border)",
                      borderRadius: "3px",
                      overflow: "hidden"
                    }}>
                      <div style={{
                        width: `${dept.progress}%`,
                        height: "100%",
                        background: dept.progress === 100 ? "rgb(34, 197, 94)" : "var(--accent)"
                      }} />
                    </div>
                    <span style={{ fontSize: "12px", color: "var(--text)" }}>{dept.progress}% Complete</span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                  <span style={{
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: 600,
                    background: dept.status === "Completed" ? "rgba(34, 197, 94, 0.1)" :
                                dept.status === "In Progress" ? "rgba(234, 179, 8, 0.1)" : "var(--code-bg)",
                    color: dept.status === "Completed" ? "rgb(34, 197, 94)" :
                           dept.status === "In Progress" ? "rgb(234, 179, 8)" : "var(--text)"
                  }}>
                    {dept.status}
                  </span>

                  <button style={{
                    padding: "10px 20px",
                    borderRadius: "6px",
                    border: dept.status === "Completed" ? "1px solid var(--border)" : "none",
                    background: dept.status === "Completed" ? "transparent" : "var(--accent)",
                    color: dept.status === "Completed" ? "var(--text)" : "white",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}>
                    {dept.status === "Completed" ? "Review" : dept.status === "In Progress" ? "Resume" : "Start"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
