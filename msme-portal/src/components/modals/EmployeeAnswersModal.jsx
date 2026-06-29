import { useState, useEffect } from "react";
import api from "../../services/api";
import { translations } from "../../i18n/languages";

export default function EmployeeAnswersModal({ employeeId, onClose }) {
  const [data, setData] = useState(null);
  const [customQs, setCustomQs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [ansRes, qRes] = await Promise.all([
          api.get(`/dept-heads/${employeeId}/answers`),
          api.get("/custom-questions")
        ]);
        setData(ansRes.data);
        setCustomQs(qRes.data.questions || []);
      } catch (err) {
        alert("Failed to load answers.");
      } finally {
        setLoading(false);
      }
    };
    if (employeeId) load();
  }, [employeeId]);

  if (loading) return <div className="modal-overlay"><div className="modal">Loading answers...</div></div>;
  if (!data) return null;

  const getCustomQText = (id) => {
    const q = customQs.find(x => x._id === id);
    return q ? q.question?.en || q.question : id;
  };

  const getDeptQText = (deptId, qId) => {
    const t = translations["en"]?.[deptId] || {};
    return t[qId] || qId;
  };

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: 800, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 className="modal-title" style={{ margin: 0 }}>Answers: {data.employee?.name || "Employee"}</h2>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>Close</button>
        </div>

        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 16, marginBottom: 12, borderBottom: "1px solid var(--border)", paddingBottom: 8 }}>Department Answers</h3>
          {data.deptAnswers.length === 0 ? <p style={{ color: "var(--text-sub)", fontSize: 13 }}>No department answers submitted yet.</p> : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {data.deptAnswers.map(a => (
                <div key={a._id} style={{ background: "var(--bg-light)", padding: 16, borderRadius: 8, border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: 11, color: "var(--accent)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>
                    {a.departmentId}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 8, color: "var(--text-h)" }}>
                    {getDeptQText(a.departmentId, a.questionId)}
                  </div>
                  <div style={{ fontSize: 14, color: "var(--text-main)", whiteSpace: "pre-wrap", background: "#fff", padding: 12, borderRadius: 6, border: "1px solid var(--border)" }}>
                    {String(a.answer)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 style={{ fontSize: 16, marginBottom: 12, borderBottom: "1px solid var(--border)", paddingBottom: 8 }}>Custom Answers & Suggestions</h3>
          {data.customAnswers.length === 0 ? <p style={{ color: "var(--text-sub)", fontSize: 13 }}>No custom answers submitted yet.</p> : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {data.customAnswers.map(a => (
                <div key={a._id} style={{ background: "var(--bg-light)", padding: 16, borderRadius: 8, border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: "var(--text-h)" }}>
                    {a.questionId === "problem_details" ? "Problem Details (Suggestions/Issues)" : getCustomQText(a.questionId)}
                  </div>
                  <div style={{ fontSize: 14, color: "var(--text-main)", background: "#fff", padding: 12, borderRadius: 6, border: "1px solid var(--border)" }}>
                    {typeof a.answer === "object" ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {a.answer.title && <div><strong style={{fontSize:12, color:"var(--text-sub)"}}>TITLE</strong><br/>{a.answer.title}</div>}
                        {a.answer.description && <div><strong style={{fontSize:12, color:"var(--text-sub)"}}>DESCRIPTION</strong><br/>{a.answer.description}</div>}
                        {a.answer.solution && <div><strong style={{fontSize:12, color:"var(--text-sub)"}}>EXPECTED SOLUTION</strong><br/>{a.answer.solution}</div>}
                        {a.answer.impact && <div><strong style={{fontSize:12, color:"var(--text-sub)"}}>EXPECTED IMPACT</strong><br/>{a.answer.impact}</div>}
                      </div>
                    ) : String(a.answer)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
