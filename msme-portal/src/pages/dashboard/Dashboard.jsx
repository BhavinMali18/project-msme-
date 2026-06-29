import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const Icon = ({ d, size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const Icons = {
  check:    "M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3",
  clock:    "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 6v4l3 3",
  logout:   "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  play:     "M5 3l14 9-14 9V3z",
  edit:     "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  eye:      "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  question: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01",
};

function ProgressRing({ pct, size = 72, color = "var(--accent)" }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border)" strokeWidth="8" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="8"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.6s ease" }} />
      <text x={size/2} y={size/2} dominantBaseline="middle" textAnchor="middle"
        style={{ transform: "rotate(90deg)", transformOrigin: "50% 50%",
          fontSize: "13px", fontWeight: 700, fill: "var(--text-h)" }}>
        {pct}%
      </text>
    </svg>
  );
}

export default function EmployeeDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/answers/my-progress")
      .then(res => setProgress(res.data.progress || []))
      .catch(err => console.error("Progress fetch error", err))
      .finally(() => setLoading(false));
  }, []);

  const totalQuestions  = progress.reduce((s, p) => s + p.totalQuestions, 0);
  const totalAnswered   = progress.reduce((s, p) => s + p.answeredCount, 0);
  const totalSubmitted  = progress.filter(p => p.isSubmitted).length;
  const totalDepts      = progress.length;

  const deptName = (dept) => dept?.title?.en || dept?.code || "Department";

  const getStatus = (p) => {
    if (p.isSubmitted)         return { label: "Submitted",   color: "#22c55e", bg: "rgba(34,197,94,0.1)" };
    if (p.answeredCount > 0)   return { label: "In Progress", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" };
    return                            { label: "Not Started",  color: "var(--text)", bg: "var(--code-bg)" };
  };

  const getBtnLabel = (p) => {
    if (p.isSubmitted)       return "Review";
    if (p.answeredCount > 0) return "Continue";
    return "Start";
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "18px 48px", borderBottom: "1px solid var(--border)", background: "var(--bg)",
        position: "sticky", top: 0, zIndex: 100
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "10px",
            background: "var(--accent)", display: "flex", alignItems: "center",
            justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "16px"
          }}>M</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "16px", color: "var(--text-h)", lineHeight: 1.2 }}>MSME Assessment</div>
            <div style={{ fontSize: "12px", color: "var(--text)" }}>{user?.companyName || "Employee Portal"}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "50%",
              background: "var(--accent-bg)", color: "var(--accent)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: "14px"
            }}>{user?.name?.[0]?.toUpperCase() || "E"}</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: "14px", color: "var(--text-h)" }}>{user?.name}</div>
              <div style={{ fontSize: "11px", color: "var(--text)" }}>Employee</div>
            </div>
          </div>
          <button onClick={() => { logout(); navigate("/login"); }} style={{
            display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px",
            border: "1px solid var(--border)", borderRadius: "8px", background: "none",
            cursor: "pointer", fontSize: "13px", color: "var(--text)", fontWeight: 500
          }}>
            <Icon d={Icons.logout} size={14} /> Log Out
          </button>
        </div>
      </header>

      <main style={{ flexGrow: 1, padding: "48px", maxWidth: "960px", margin: "0 auto", width: "100%", boxSizing: "border-box" }}>

        {/* Welcome Banner */}
        <section style={{
          background: "radial-gradient(circle at top right, var(--accent-bg), transparent 60%)",
          border: "1px solid var(--accent-border)", borderRadius: "20px",
          padding: "36px 40px", marginBottom: "48px",
          display: "flex", justifyContent: "space-between", alignItems: "center", gap: "32px"
        }}>
          <div>
            <h1 style={{ margin: "0 0 8px 0", fontSize: "30px", fontWeight: 700, letterSpacing: "-0.8px" }}>
              Welcome, {user?.name || "Employee"} 👋
            </h1>
            <p style={{ fontSize: "15px", color: "var(--text)", lineHeight: 1.6, maxWidth: "520px" }}>
              Complete your department assessments below. You can save drafts and come back anytime. All answers are final only after you submit each department.
            </p>
          </div>

          {/* Quick stats */}
          <div style={{ display: "flex", gap: "24px", flexShrink: 0 }}>
            {[
              { val: totalDepts,     label: "Departments",       color: "var(--accent)" },
              { val: totalAnswered,  label: "Answered",          color: "#22c55e" },
              { val: totalQuestions - totalAnswered, label: "Pending", color: "#f59e0b" },
            ].map(({ val, label, color }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "32px", fontWeight: 700, color, lineHeight: 1 }}>{val}</div>
                <div style={{ fontSize: "12px", color: "var(--text)", marginTop: "4px" }}>{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Department Cards */}
        <section>
          <h2 style={{ marginTop: 0, marginBottom: "24px", fontSize: "20px", fontWeight: 700, letterSpacing: "-0.3px" }}>
            Your Department Assessments
          </h2>

          {loading ? (
            <div style={{ textAlign: "center", padding: "60px", color: "var(--text)" }}>
              Loading your assessments…
            </div>
          ) : progress.length === 0 ? (
            <div style={{
              border: "1px dashed var(--border)", borderRadius: "16px",
              padding: "60px", textAlign: "center", color: "var(--text)"
            }}>
              <Icon d={Icons.question} size={40} color="var(--accent)" />
              <div style={{ marginTop: "16px", fontSize: "16px" }}>No departments assigned yet.</div>
              <div style={{ fontSize: "14px", marginTop: "8px" }}>Check with your administrator.</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {progress.map((p) => {
                const status = getStatus(p);
                return (
                  <div key={p.department._id} style={{
                    border: "1px solid var(--border)", borderRadius: "16px", padding: "28px 32px",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    gap: "32px", background: "var(--bg)",
                    transition: "box-shadow 0.2s, border-color 0.2s",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
                  }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent)"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
                  >
                    {/* Left: info */}
                    <div style={{ flexGrow: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                        <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 700, color: "var(--text-h)" }}>
                          {deptName(p.department)}
                        </h3>
                        <span style={{
                          padding: "3px 10px", borderRadius: "20px", fontSize: "12px",
                          fontWeight: 600, background: status.bg, color: status.color
                        }}>{status.label}</span>
                      </div>

                      <div style={{ fontSize: "13px", color: "var(--text)", marginBottom: "14px" }}>
                        {p.totalQuestions} Questions &nbsp;·&nbsp;
                        {p.answeredCount} Answered &nbsp;·&nbsp;
                        {p.isSubmitted
                          ? <span style={{ color: "#22c55e", fontWeight: 600 }}>Submitted ✓</span>
                          : <span style={{ color: "#f59e0b" }}>{p.totalQuestions - p.answeredCount} Remaining</span>
                        }
                      </div>

                      {/* Progress bar */}
                      <div style={{ height: "6px", borderRadius: "3px", background: "var(--border)", overflow: "hidden", maxWidth: "400px" }}>
                        <div style={{
                          height: "100%",
                          width: `${p.percentage}%`,
                          borderRadius: "3px",
                          background: p.isSubmitted ? "#22c55e" : "var(--accent)",
                          transition: "width 0.6s ease"
                        }} />
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--text)", marginTop: "6px" }}>{p.percentage}% Complete</div>
                    </div>

                    {/* Right: ring + button */}
                    <div style={{ display: "flex", alignItems: "center", gap: "24px", flexShrink: 0 }}>
                      <ProgressRing
                        pct={p.percentage}
                        color={p.isSubmitted ? "#22c55e" : "var(--accent)"}
                      />
                      <button
                        onClick={() => navigate(`/dashboard/questionnaire/${p.department._id}`)}
                        style={{
                          padding: "12px 24px", borderRadius: "10px",
                          border: p.isSubmitted ? "1px solid var(--border)" : "none",
                          background: p.isSubmitted ? "transparent" : "var(--accent)",
                          color: p.isSubmitted ? "var(--text-h)" : "#fff",
                          fontWeight: 700, fontSize: "14px", cursor: "pointer",
                          transition: "all 0.2s", display: "flex", alignItems: "center", gap: "8px"
                        }}
                      >
                        <Icon d={p.isSubmitted ? Icons.eye : Icons.play} size={15}
                          color={p.isSubmitted ? "var(--text)" : "#fff"} />
                        {getBtnLabel(p)}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
