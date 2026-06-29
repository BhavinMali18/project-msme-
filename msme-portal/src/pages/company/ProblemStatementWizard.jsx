import { useState, useEffect } from "react";
import CompanyLayout from "../../components/layout/CompanyLayout";
import api from "../../services/api";

export default function ProblemStatementWizard() {
  const [problemDetails, setProblemDetails] = useState({ title: "", description: "", solution: "", impact: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/custom-answers/my");
        const a = (res.data.answers || []).find(ans => ans.questionId === "problem_details");
        if (a && a.answer) {
          setProblemDetails(a.answer);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.post("/custom-answers", {
        answers: [{ questionId: "problem_details", answer: problemDetails }]
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      alert("Failed to save problem statement.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <CompanyLayout title="Problem Statement">
      <div className="portal-page-header">
        <h1 className="portal-page-title">Problem Statement</h1>
        <p className="portal-page-subtitle">Describe your core business challenge.</p>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: "center", color: "var(--text-sub)" }}>Loading...</div>
      ) : (
        <div className="card" style={{ maxWidth: 800 }}>
          <div style={{ padding: "0" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-sub)", letterSpacing: "0.5px", marginBottom: 16 }}>
              PROBLEM DETAILS
            </div>
            
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label" style={{ fontSize: 12 }}>PROBLEM TITLE</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Inventory Management Automation for Textile Business"
                value={problemDetails.title}
                onChange={e => setProblemDetails({ ...problemDetails, title: e.target.value })}
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label" style={{ fontSize: 12 }}>PROBLEM DESCRIPTION</label>
              <textarea 
                className="form-textarea" 
                placeholder="Describe the core business problem in detail. What's causing it? What's the impact on your revenue or operations?"
                style={{ minHeight: 100 }}
                value={problemDetails.description}
                onChange={e => setProblemDetails({ ...problemDetails, description: e.target.value })}
              />
            </div>
            
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-sub)", marginTop: 24, marginBottom: 12, borderBottom: "1px solid var(--border)", paddingBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
              EXPECTED OUTCOMES <span style={{ fontWeight: 400, textTransform: "none" }}>— both optional</span>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: 12 }}>EXPECTED SOLUTION <span style={{ fontWeight: 400, textTransform: "none" }}>(optional)</span></label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. AI-based inventory dashboard with real-time tracking"
                  value={problemDetails.solution}
                  onChange={e => setProblemDetails({ ...problemDetails, solution: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: 12 }}>EXPECTED IMPACT <span style={{ fontWeight: 400, textTransform: "none" }}>(optional)</span></label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Reduce stock loss by 20%"
                  value={problemDetails.impact}
                  onChange={e => setProblemDetails({ ...problemDetails, impact: e.target.value })}
                />
              </div>
            </div>

            <div style={{ marginTop: 32, display: "flex", justifyContent: "flex-end" }}>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : saved ? "Saved!" : "Save Problem Statement"}
              </button>
            </div>
          </div>
        </div>
      )}
    </CompanyLayout>
  );
}
