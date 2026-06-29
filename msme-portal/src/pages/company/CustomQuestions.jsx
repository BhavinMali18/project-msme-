import { useState, useEffect } from "react";
import CompanyLayout from "../../components/layout/CompanyLayout";
import api from "../../services/api";

const QUESTION_TYPES = [
  { value: "text", label: "Short Text" },
  { value: "multiline", label: "Long Text" },
  { value: "yesno", label: "Yes / No" },
  { value: "scale", label: "Scale 1–5" },
];

export default function CustomQuestions() {
  const [deptHeads, setDeptHeads] = useState([]);
  const [selectedHead, setSelectedHead] = useState("all");
  const [questions, setQuestions] = useState([]);
  const [loadingQ, setLoadingQ] = useState(false);
  const [form, setForm] = useState({ text: "", type: "text" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load dept heads
  useEffect(() => {
    api.get("/dept-heads").then(r => setDeptHeads(r.data.deptHeads || [])).catch(() => {});
  }, []);

  // Load questions when filter changes
  useEffect(() => {
    const fetchQ = async () => {
      setLoadingQ(true);
      try {
        const params = selectedHead !== "all" ? `?deptHeadId=${selectedHead}` : "";
        const res = await api.get(`/custom-questions${params}`);
        setQuestions(res.data.questions || []);
      } catch {
        setQuestions([]);
      } finally {
        setLoadingQ(false);
      }
    };
    fetchQ();
  }, [selectedHead]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.text.trim()) { setError("Question text is required."); return; }
    try {
      setSaving(true);
      setError("");
      const payload = {
        text: form.text,
        type: form.type,
        deptHeadId: selectedHead === "all" ? null : selectedHead,
        order: questions.length,
      };
      const res = await api.post("/custom-questions", payload);
      setQuestions(prev => [...prev, res.data.question]);
      setForm({ text: "", type: "text" });
      setSuccess("Question added!");
      setTimeout(() => setSuccess(""), 2500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add question.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this question?")) return;
    try {
      await api.delete(`/custom-questions/${id}`);
      setQuestions(prev => prev.filter(q => q._id !== id));
    } catch {
      alert("Failed to delete.");
    }
  };

  const headName = (id) => {
    const h = deptHeads.find(d => d._id === id);
    return h ? h.name : "All Dept Heads";
  };

  return (
    <CompanyLayout title="Custom Questions">
      <div className="portal-page-header">
        <h1 className="portal-page-title">Custom Questions</h1>
        <p className="portal-page-subtitle">
          Write custom questions for your dept heads. Choose "All" to send to everyone or pick a specific head.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 24, alignItems: "start" }}>
        {/* LEFT — Add question form */}
        <div className="card">
          <div className="card-title">Add a Question</div>
          <div className="card-sub">Select who will see it, then write the question.</div>

          {error && <div className="auth-error">{error}</div>}
          {success && (
            <div style={{ background: "var(--success-bg)", border: "1px solid rgba(22,163,74,0.2)", color: "var(--success)", padding: "10px 14px", borderRadius: "var(--radius)", fontSize: 13, marginBottom: 16 }}>
              ✓ {success}
            </div>
          )}

          <form onSubmit={handleAdd} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Target Dept Head</label>
              <select
                className="form-select"
                value={selectedHead}
                onChange={e => setSelectedHead(e.target.value)}
              >
                <option value="all">All Department Heads</option>
                {deptHeads.map(h => (
                  <option key={h._id} value={h._id}>{h.name} — {h.department}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Question Type</label>
              <select
                className="form-select"
                value={form.type}
                onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
              >
                {QUESTION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Question Text</label>
              <textarea
                className="form-textarea"
                placeholder="e.g. What is the biggest operational challenge in your department?"
                value={form.text}
                onChange={e => setForm(p => ({ ...p, text: e.target.value }))}
              />
            </div>

            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? "Saving…" : "+ Add Question"}
            </button>
          </form>
        </div>

        {/* RIGHT — Questions list */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text-h)" }}>
              Showing: <span style={{ color: "var(--text-sub)" }}>{headName(selectedHead)}</span>
            </div>
            <span className="badge badge-default">{questions.length} questions</span>
          </div>

          {loadingQ ? (
            <div style={{ textAlign: "center", padding: 40, color: "var(--text-sub)" }}>Loading…</div>
          ) : questions.length === 0 ? (
            <div style={{
              textAlign: "center", padding: 40,
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)", color: "var(--text-sub)"
            }}>
              No questions yet for this selection.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {questions.map((q, i) => (
                <div key={q._id} className="card" style={{ padding: "16px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, color: "var(--text-sub)", marginBottom: 4 }}>
                        Q{i + 1} · <span className="badge badge-default" style={{ fontSize: 10 }}>{q.type}</span>
                        {q.deptHeadId && (
                          <span className="badge badge-success" style={{ fontSize: 10, marginLeft: 6 }}>
                            {headName(q.deptHeadId)}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 14, color: "var(--text-h)", fontWeight: 500, lineHeight: 1.4 }}>{q.text}</div>
                    </div>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(q._id)}
                      style={{ flexShrink: 0 }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </CompanyLayout>
  );
}
