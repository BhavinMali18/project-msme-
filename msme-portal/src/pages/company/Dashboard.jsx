import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import CompanyLayout from "../../components/layout/CompanyLayout";
import api from "../../services/api";
import EmployeeAnswersModal from "../../components/modals/EmployeeAnswersModal";

function StatCard({ label, value, sub, icon }) {
  return (
    <div className="stat-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div className="stat-card-label">{label}</div>
        <div style={{ fontSize: 20, opacity: 0.5 }}>{icon}</div>
      </div>
      <div className="stat-val">{value ?? "—"}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

function ProgressBar({ value }) {
  return (
    <div style={{ height: 6, borderRadius: 3, background: "var(--border)", overflow: "hidden", marginTop: 8 }}>
      <div style={{ height: "100%", width: `${Math.min(100, value)}%`, background: "var(--accent)", borderRadius: 3, transition: "width 0.6s" }} />
    </div>
  );
}

function StatusBadge({ status }) {
  const cfg = {
    "Submitted": { bg: "var(--success-bg)", color: "var(--success)" },
    "Draft Saved": { bg: "var(--warning-bg)", color: "var(--warning)" },
    "Pending": { bg: "var(--accent-bg)", color: "var(--text)" }
  }[status] || { bg: "var(--accent-bg)", color: "var(--text)" };

  return (
    <span className="badge" style={{ background: cfg.bg, color: cfg.color }}>
      {status}
    </span>
  );
}

export default function CompanyDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [deptProg, setDeptProg] = useState([]);
  const [table, setTable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingAnswersFor, setViewingAnswersFor] = useState(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch actual stats
      // Note: If you don't have these endpoints fully wired up with real data yet, they'll just return 0s or empty arrays.
      const [statsRes, deptRes, tableRes] = await Promise.all([
        api.get(`/answers/company-stats`).catch(() => ({ data: { stats: {} } })),
        api.get(`/answers/dept-progress`).catch(() => ({ data: { progress: [] } })),
        api.get(`/answers/submission-table`).catch(() => ({ data: { table: [] } }))
      ]);

      setStats(statsRes.data.stats || {
        totalEmployees: 0,
        completedAssessments: 0,
        averageScore: "N/A",
        activeDepartments: 0
      });
      setDeptProg(deptRes.data.progress || []);
      setTable(tableRes.data.table || []);
    } catch (err) {
      console.error("Dashboard fetch error", err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  const fmtDate = (d) => {
    if (!d) return "—";
    const date = new Date(d);
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <CompanyLayout title="Dashboard">
      <div className="portal-page-header">
        <h1 className="portal-page-title">Company Overview</h1>
        <p className="portal-page-subtitle">Monitor questionnaire completion across your departments.</p>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: "var(--text-sub)" }}>Loading dashboard…</div>
      ) : (
        <>
          <div className="stats-grid">
            <StatCard label="Dept Heads" value={stats?.totalEmployees || 0} icon="👥" sub="Total registered heads" />
            <StatCard label="Completed" value={stats?.completedAssessments || 0} icon="✅" sub="Questionnaires finished" />
            <StatCard label="Departments" value={stats?.activeDepartments || 0} icon="🏢" sub="With active users" />
          </div>

          <div style={{ marginTop: 24 }}>
            {/* Submissions Table */}
            <div className="table-wrap">
              <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
                <div className="card-title" style={{ margin: 0 }}>Recent Submissions</div>
              </div>
              {table.length === 0 ? (
                <div style={{ color: "var(--text-sub)", fontSize: 13, textAlign: "center", padding: 40 }}>
                  No submissions yet. Add Dept Heads to get started.
                </div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Dept Head</th>
                      <th>Department</th>
                      <th>Status</th>
                      <th>Last Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.map((row, i) => (
                      <tr 
                        key={i} 
                        onClick={() => setViewingAnswersFor(row.employeeId)}
                        style={{ cursor: "pointer" }}
                        title="Click to view answers"
                        className="clickable-row"
                      >
                        <td style={{ fontWeight: 500 }}>{row.employeeName}</td>
                        <td>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                            {(row.departments || []).map(d => (
                              <span key={d} className="badge badge-default">{d}</span>
                            ))}
                          </div>
                        </td>
                        <td><StatusBadge status={row.status} /></td>
                        <td style={{ color: "var(--text-sub)" }}>{fmtDate(row.lastUpdated)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}

      {viewingAnswersFor && (
        <EmployeeAnswersModal
          employeeId={viewingAnswersFor}
          onClose={() => setViewingAnswersFor(null)}
        />
      )}
    </CompanyLayout>
  );
}
