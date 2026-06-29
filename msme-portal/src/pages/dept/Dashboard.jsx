import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import DeptLayout from "../../components/layout/DeptLayout";
import api from "../../services/api";
import { DEPARTMENTS_CONFIG } from "../../utils/questions";
import { translations } from "../../i18n/languages";

// ── Custom Question Renderer ──────────────────────────
function CustomQItem({ q, answer, onChange }) {
  if (q.type === "yesno") {
    return (
      <div className="q-item">
        <div className="q-text">{q.text}</div>
        <div className="yesno-row">
          {["Yes", "No"].map(opt => (
            <button
              key={opt}
              type="button"
              className={"yesno-btn" + (answer === opt ? " selected" : "")}
              onClick={() => onChange(q._id, opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (q.type === "scale") {
    return (
      <div className="q-item">
        <div className="q-text">{q.text}</div>
        <div className="scale-row">
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              type="button"
              className={"scale-btn" + (answer == n ? " selected" : "")}
              onClick={() => onChange(q._id, n)}
            >
              {n}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-sub)" }}>
          <span>Low</span><span>High</span>
        </div>
      </div>
    );
  }

  if (q.type === "multiline") {
    return (
      <div className="q-item">
        <div className="q-text">{q.text}</div>
        <textarea
          className="form-textarea"
          value={answer || ""}
          onChange={e => onChange(q._id, e.target.value)}
          placeholder="Write your answer here…"
        />
      </div>
    );
  }

  // default: text
  return (
    <div className="q-item">
      <div className="q-text">{q.text}</div>
      <input
        className="form-input"
        value={answer || ""}
        onChange={e => onChange(q._id, e.target.value)}
        placeholder="Your answer…"
      />
    </div>
  );
}

// ── Dept Questions Renderer (structured) ─────────────
function DeptQItem({ q, lang = "en", answer, onChange }) {
  const text = q.question?.[lang] || q.question?.en || q.question;

  if (q.type === "scale") {
    return (
      <div className="q-item">
        <div className="q-text">{text}</div>
        <div className="scale-row">
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              type="button"
              className={"scale-btn" + (answer == n ? " selected" : "")}
              onClick={() => onChange(q._id, n)}
            >
              {n}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-sub)" }}>
          <span>Low</span><span>High</span>
        </div>
      </div>
    );
  }

  if (q.type === "yesNo" || q.type === "yesno") {
    return (
      <div className="q-item">
        <div className="q-text">{text}</div>
        <div className="yesno-row">
          {["Yes", "No"].map(opt => (
            <button
              key={opt}
              type="button"
              className={"yesno-btn" + (answer === opt ? " selected" : "")}
              onClick={() => onChange(q._id, opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (q.type === "multiSelect") {
    const selected = Array.isArray(answer) ? answer : [];
    return (
      <div className="q-item">
        <div className="q-text">{text}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {(q.options || []).map(opt => {
            const checked = selected.includes(opt.value);
            return (
              <label key={opt.value} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13 }}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    const next = checked ? selected.filter(v => v !== opt.value) : [...selected, opt.value];
                    onChange(q._id, next);
                  }}
                />
                {opt.label}
              </label>
            );
          })}
        </div>
      </div>
    );
  }

  if (q.type === "textarea" || q.type === "text") {
    return (
      <div className="q-item">
        <div className="q-text">{text}</div>
        <textarea
          className="form-textarea"
          value={answer || ""}
          onChange={e => onChange(q._id, e.target.value)}
          placeholder="Your answer…"
        />
      </div>
    );
  }

  return (
    <div className="q-item">
      <div className="q-text">{text}</div>
      <input
        className="form-input"
        value={answer || ""}
        onChange={e => onChange(q._id, e.target.value)}
        placeholder="Your answer…"
      />
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────
export default function DeptDashboard() {
  const { user } = useAuth();
  const [customQuestions, setCustomQuestions] = useState([]);
  const [deptQuestions, setDeptQuestions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [answers, setAnswers] = useState({}); // { questionId: answer }
  const [deptAnswers, setDeptAnswers] = useState({});
  const [problemDetails, setProblemDetails] = useState({ title: "", description: "", solution: "", impact: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        // 1. Load custom questions for this dept head
        const cqRes = await api.get("/custom-questions");
        setCustomQuestions(cqRes.data.questions || []);

        // 2. Load previously saved custom answers
        const caRes = await api.get("/custom-answers/my");
        const prevAnswers = {};
        (caRes.data.answers || []).forEach(a => { 
          if (a.questionId === "problem_details") {
            setProblemDetails(a.answer || { title: "", description: "", solution: "", impact: "" });
          } else {
            prevAnswers[a.questionId] = a.answer; 
          }
        });
        setAnswers(prevAnswers);

        // 3. Load dept questions from the Question bank using dept names
        const deptNames = user?.departments?.length > 0 ? user.departments : (user?.department ? [user.department] : []);
        
        let allDeptQs = [];
        let allDeptAns = {};
        let matchedDepts = [];

        for (const deptName of deptNames) {
          const matchedDept = DEPARTMENTS_CONFIG.find(d => {
            const tName = translations["en"]?.[d.id]?.name;
            return d.id?.toLowerCase() === deptName?.toLowerCase() ||
                   tName?.toLowerCase() === deptName?.toLowerCase();
          });

          if (matchedDept) {
            const deptTranslations = translations["en"]?.[matchedDept.id] || {};
            matchedDepts.push({ _id: matchedDept.id, name: deptTranslations.name || matchedDept.id });
            
            const qs = matchedDept.questions.map(q => ({
              _id: `${matchedDept.id}_${q.id}`, // prefix to avoid key collisions
              originalId: q.id,
              departmentId: matchedDept.id,
              departmentName: deptTranslations.name || matchedDept.id,
              type: q.type,
              question: { en: deptTranslations[q.id] || `Question ${q.id}` }
            }));
            allDeptQs = [...allDeptQs, ...qs];
            
            // Also try to load saved answers for these dept questions
            try {
              const myAnsRes = await api.get(`/answers/my/${matchedDept.id}`);
              (myAnsRes.data.answers || []).forEach(a => { 
                allDeptAns[`${matchedDept.id}_${a.questionId}`] = a.answer; 
              });
            } catch (e) {
              // ignore if not found
            }
          }
        }
        
        setDepartments(matchedDepts);
        setDeptQuestions(allDeptQs);
        setDeptAnswers(allDeptAns);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const handleCustomAnswer = (qId, val) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const handleDeptAnswer = (qId, val) => {
    setDeptAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");

      // Save custom answers + problem details
      const customPayload = customQuestions.map(q => ({
        questionId: q._id,
        answer: answers[q._id] ?? "",
      }));
      customPayload.push({
        questionId: "problem_details",
        answer: problemDetails
      });
      await api.post("/custom-answers", { answers: customPayload });

      // Save dept answers (using existing employeeAnswer endpoint)
      if (deptQuestions.length > 0) {
        const deptPayload = deptQuestions.map(q => ({
          questionId: q.originalId,
          answer: deptAnswers[q._id] ?? "",
          departmentId: q.departmentId,
        }));
        await api.post("/answers", { answers: deptPayload });
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const progress = (() => {
    const total = customQuestions.length + deptQuestions.length;
    if (total === 0) return 0;
    const filled = [...customQuestions, ...deptQuestions].filter(q => {
      const a = customQuestions.includes(q) ? answers[q._id] : deptAnswers[q._id];
      return a !== undefined && a !== "" && a !== null;
    }).length;
    return Math.round((filled / total) * 100);
  })();

  return (
    <DeptLayout title="My Questionnaire">
      <div className="portal-page-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 className="portal-page-title">My Questionnaire</h1>
            <p className="portal-page-subtitle">
              {user?.department} — Fill both panels and save at the bottom.
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: "var(--text-h)" }}>{progress}%</div>
            <div style={{ fontSize: 11, color: "var(--text-sub)" }}>Complete</div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: 4, background: "var(--border)", borderRadius: 4, marginTop: 16, overflow: "hidden" }}>
          <div style={{ height: "100%", background: "var(--accent)", borderRadius: 4, width: `${progress}%`, transition: "width 0.4s" }} />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 80, color: "var(--text-sub)" }}>Loading your questionnaire…</div>
      ) : (
        <>
          {error && <div className="auth-error" style={{ marginBottom: 20 }}>{error}</div>}
          {saved && (
            <div style={{ background: "var(--success-bg)", border: "1px solid rgba(22,163,74,0.2)", color: "var(--success)", padding: "12px 16px", borderRadius: "var(--radius)", marginBottom: 20, fontWeight: 600, fontSize: 14 }}>
              ✓ Answers saved successfully!
            </div>
          )}

          <div className="dual-panel">
            {/* LEFT PANEL — Custom Questions */}
            <div className="q-panel">
              <div className="q-panel-header">
                <span style={{ fontSize: 20 }}>❓</span>
                <div>
                  <div className="q-panel-title">Custom Questions</div>
                  <div style={{ fontSize: 11, color: "var(--text-sub)" }}>From your company admin</div>
                </div>
                <span className="badge badge-default" style={{ marginLeft: "auto" }}>
                  {customQuestions.length} questions
                </span>
              </div>
              <div className="q-panel-body">
                {customQuestions.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "32px 0", color: "var(--text-sub)", fontSize: 13 }}>
                    No custom questions assigned yet.
                  </div>
                ) : (
                  customQuestions.map(q => (
                    <CustomQItem
                      key={q._id}
                      q={q}
                      answer={answers[q._id]}
                      onChange={handleCustomAnswer}
                    />
                  ))
                )}

                {/* The new PROBLEM DETAILS section */}
                <hr style={{ margin: "24px 0", borderTop: "1px solid var(--border)" }} />
                
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
                </div>
              </div>
            </div>

            {/* RIGHT PANEL — Dept Structured Questions */}
            <div className="q-panel">
              <div className="q-panel-header">
                <span style={{ fontSize: 20 }}>🏢</span>
                <div>
                  <div className="q-panel-title">Department Questions</div>
                  <div style={{ fontSize: 11, color: "var(--text-sub)" }}>
                    {departments.map(d => d.name).join(" + ") || "Standard assessment"}
                  </div>
                </div>
                <span className="badge badge-default" style={{ marginLeft: "auto" }}>
                  {deptQuestions.length} questions
                </span>
              </div>
              <div className="q-panel-body">
                {departments.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "32px 0", color: "var(--text-sub)", fontSize: 13 }}>
                    No department questions found for your roles.<br />
                    Your admin can add questions from the Admin panel.
                  </div>
                ) : (
                  departments.map(dept => {
                    const qs = deptQuestions.filter(q => q.departmentId === dept._id);
                    if (qs.length === 0) return null;
                    return (
                      <div key={dept._id} style={{ marginBottom: 32 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.5px", marginBottom: 16, textTransform: "uppercase", borderBottom: "1px solid var(--border)", paddingBottom: 8 }}>
                          {dept.name}
                        </div>
                        {qs.map(q => (
                          <DeptQItem
                            key={q._id}
                            q={q}
                            answer={deptAnswers[q._id]}
                            onChange={handleDeptAnswer}
                          />
                        ))}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Save button */}
          <div style={{ marginTop: 28, display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving…" : "💾 Save All Answers"}
            </button>
          </div>
        </>
      )}
    </DeptLayout>
  );
}
