import { useState, useEffect } from "react";
import CompanyLayout from "../../components/layout/CompanyLayout";
import api from "../../services/api";
import EmployeeAnswersModal from "../../components/modals/EmployeeAnswersModal";

const DEPARTMENTS = [
  "Operations & Production", "Finance & Accounts", "Human Resources",
  "Sales & Marketing", "Supply Chain", "Technology",
  "Regulatory & Compliance", "Energy & Sustainability", "Custom"
];

function CredentialsModal({ creds, onClose }) {
  const [copied, setCopied] = useState({});

  const copy = (key, val) => {
    navigator.clipboard.writeText(val);
    setCopied(p => ({ ...p, [key]: true }));
    setTimeout(() => setCopied(p => ({ ...p, [key]: false })), 2000);
  };

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: 440 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 24 }}>🎉</span>
          <div>
            <div className="modal-title">Dept Head Created!</div>
            <div className="modal-sub" style={{ marginBottom: 0 }}>Share these login credentials with {creds.name}</div>
          </div>
        </div>

        <div className="creds-box">
          <div className="creds-row">
            <div>
              <div className="creds-label">Email / Login ID</div>
              <div className="creds-value">{creds.email}</div>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => copy("email", creds.email)}
            >
              {copied.email ? "✓ Copied" : "Copy"}
            </button>
          </div>
          <div className="creds-row">
            <div>
              <div className="creds-label">Temporary Password</div>
              <div className="creds-value">{creds.password}</div>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => copy("pw", creds.password)}
            >
              {copied.pw ? "✓ Copied" : "Copy"}
            </button>
          </div>
        </div>

        <div style={{
          background: "var(--warning-bg)", border: "1px solid rgba(217,119,6,0.2)",
          borderRadius: "var(--radius)", padding: "10px 14px", fontSize: 12, color: "var(--warning)"
        }}>
          ⚠️ This password will not be shown again. Please save it now.
        </div>

        <div className="modal-footer">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              const text = `MSME Portal Login\nEmail: ${creds.email}\nPassword: ${creds.password}`;
              navigator.clipboard.writeText(text);
            }}
          >
            Copy Both
          </button>
          <button className="btn btn-primary" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
}

function AddDeptHeadModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({ name: "", departments: [] });
  const [customDept, setCustomDept] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDeptToggle = (dept) => {
    setForm(prev => {
      const depts = prev.departments.includes(dept)
        ? prev.departments.filter(d => d !== dept)
        : [...prev.departments, dept];
      return { ...prev, departments: depts };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let finalDepts = [...form.departments];
    if (finalDepts.includes("Custom") && customDept.trim()) {
      finalDepts = finalDepts.filter(d => d !== "Custom");
      finalDepts.push(customDept.trim());
    }
    
    if (!form.name.trim() || finalDepts.length === 0) {
      setError("Name and at least one department are required.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await api.post("/dept-heads", { name: form.name, departments: finalDepts });
      onSuccess(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create dept head.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-title">Add Department Head</div>
        <div className="modal-sub">They will receive a generated login email & password.</div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              className="form-input"
              placeholder="e.g. Rajesh Sharma"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Departments (Select multiple)</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
              {DEPARTMENTS.map(d => (
                <label key={d} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={form.departments.includes(d)}
                    onChange={() => handleDeptToggle(d)}
                  />
                  {d}
                </label>
              ))}
            </div>
          </div>
          {form.departments.includes("Custom") && (
            <div className="form-group">
              <label className="form-label">Custom Department Name</label>
              <input
                className="form-input"
                placeholder="Enter department name"
                value={customDept}
                onChange={e => setCustomDept(e.target.value)}
              />
            </div>
          )}

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Creating…" : "Create Dept Head"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ChangePasswordModal({ head, onClose, onSuccess }) {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await api.put(`/dept-heads/${head._id}/password`, { newPassword });
      onSuccess(res.data.credentials, head.name);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-title">Change Password</div>
        <div className="modal-sub">Set a new login password for {head.name}.</div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. securePass123"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Saving…" : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function DeptHeads() {
  const [heads, setHeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newCreds, setNewCreds] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [resettingHead, setResettingHead] = useState(null);
  const [viewingAnswersFor, setViewingAnswersFor] = useState(null);

  const fetchHeads = async () => {
    try {
      setLoading(true);
      const res = await api.get("/dept-heads");
      setHeads(res.data.deptHeads || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHeads(); }, []);

  const handleSuccess = (data) => {
    setShowAdd(false);
    setNewCreds({ ...data.credentials, name: data.deptHead.name });
    setHeads(prev => [data.deptHead, ...prev]);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this dept head? They will lose portal access.")) return;
    try {
      setDeleting(id);
      await api.delete(`/dept-heads/${id}`);
      setHeads(prev => prev.filter(h => h._id !== id));
    } catch {
      alert("Failed to delete.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <CompanyLayout title="Department Heads">
      <div className="portal-page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 className="portal-page-title">Department Heads</h1>
          <p className="portal-page-subtitle">Create login credentials for each department head.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
          + Add Dept Head
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: "var(--text-sub)" }}>Loading…</div>
      ) : heads.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "60px 24px",
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)", color: "var(--text-sub)"
        }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>👥</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text-h)", marginBottom: 6 }}>No Dept Heads Yet</div>
          <div style={{ fontSize: 13 }}>Click "Add Dept Head" to create logins for your team.</div>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email / Login ID</th>
                <th>Department</th>
                <th>Added</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {heads.map(h => (
                <tr key={h._id}>
                  <td style={{ fontWeight: 600 }}>{h.name}</td>
                  <td style={{ fontFamily: "monospace", fontSize: 13 }}>{h.email}</td>
                  <td>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {(h.departments?.length > 0 ? h.departments : [h.department]).map(d => (
                        <span key={d} className="badge badge-default">{d}</span>
                      ))}
                    </div>
                  </td>
                  <td style={{ color: "var(--text-sub)", fontSize: 12 }}>
                    {new Date(h.createdAt).toLocaleDateString("en-IN")}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setViewingAnswersFor(h._id)}
                      >
                        View Answers
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setResettingHead(h)}
                      >
                        Change PW
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        disabled={deleting === h._id}
                        onClick={() => handleDelete(h._id)}
                      >
                        {deleting === h._id ? "…" : "Remove"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAdd && (
        <AddDeptHeadModal
          onClose={() => setShowAdd(false)}
          onSuccess={handleSuccess}
        />
      )}

      {resettingHead && (
        <ChangePasswordModal
          head={resettingHead}
          onClose={() => setResettingHead(null)}
          onSuccess={(creds, name) => {
            setResettingHead(null);
            setNewCreds({ ...creds, name });
          }}
        />
      )}

      {newCreds && (
        <CredentialsModal
          creds={newCreds}
          onClose={() => setNewCreds(null)}
        />
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
