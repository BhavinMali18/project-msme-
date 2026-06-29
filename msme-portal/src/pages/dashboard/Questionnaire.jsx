import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const Icon = ({ d, size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const Icons = {
  left:   "M15 18l-6-6 6-6",
  right:  "M9 18l6-6-6-6",
  save:   "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM17 21v-8H7v8M7 3v5h8",
  check:  "M20 6 9 17l-5-5",
  back:   "M19 12H5M12 5l-7 7 7 7",
};

// ── Answer Components ────────────────────────────────────────────────────────
function TextAnswer({ value, onChange, multiline }) {
  const Tag = multiline ? "textarea" : "input";
  return (
    <Tag
      className="form-input"
      value={value || ""}
      onChange={e => onChange(e.target.value)}
      rows={multiline ? 4 : undefined}
      placeholder="Type your answer here…"
      style={{ width: "100%", boxSizing: "border-box", resize: multiline ? "vertical" : undefined }}
    />
  );
}

function ScaleAnswer({ value, onChange, min = 1, max = 10 }) {
  const nums = Array.from({ length: max - min + 1 }, (_, i) => i + min);
  return (
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
      {nums.map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          style={{
            width: "44px", height: "44px", borderRadius: "10px",
            border: value === n ? "2px solid var(--accent)" : "1px solid var(--border)",
            background: value === n ? "var(--accent)" : "var(--code-bg)",
            color: value === n ? "#fff" : "var(--text-h)",
            fontWeight: 700, cursor: "pointer", fontSize: "14px",
            transition: "all 0.15s"
          }}
        >{n}</button>
      ))}
    </div>
  );
}

function SingleSelectAnswer({ value, onChange, options = [] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {options.map(opt => (
        <label key={opt.value} style={{
          display: "flex", alignItems: "center", gap: "12px",
          padding: "14px 18px", borderRadius: "10px",
          border: value === opt.value ? "2px solid var(--accent)" : "1px solid var(--border)",
          background: value === opt.value ? "var(--accent-bg)" : "var(--bg)",
          cursor: "pointer", transition: "all 0.15s"
        }}>
          <input type="radio" name="single" value={opt.value}
            checked={value === opt.value} onChange={() => onChange(opt.value)}
            style={{ accentColor: "var(--accent)", width: "16px", height: "16px" }} />
          <span style={{ fontSize: "15px", color: "var(--text-h)", fontWeight: value === opt.value ? 600 : 400 }}>
            {opt.label || opt.value}
          </span>
        </label>
      ))}
    </div>
  );
}

function MultiSelectAnswer({ value = [], onChange, options = [] }) {
  const toggle = (v) => {
    const arr = Array.isArray(value) ? value : [];
    onChange(arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {options.map(opt => {
        const selected = Array.isArray(value) && value.includes(opt.value);
        return (
          <label key={opt.value} style={{
            display: "flex", alignItems: "center", gap: "12px",
            padding: "14px 18px", borderRadius: "10px",
            border: selected ? "2px solid var(--accent)" : "1px solid var(--border)",
            background: selected ? "var(--accent-bg)" : "var(--bg)",
            cursor: "pointer", transition: "all 0.15s"
          }}>
            <input type="checkbox" value={opt.value} checked={selected}
              onChange={() => toggle(opt.value)}
              style={{ accentColor: "var(--accent)", width: "16px", height: "16px" }} />
            <span style={{ fontSize: "15px", color: "var(--text-h)", fontWeight: selected ? 600 : 400 }}>
              {opt.label || opt.value}
            </span>
          </label>
        );
      })}
    </div>
  );
}

// ── Questionnaire Page ───────────────────────────────────────────────────────
export default function QuestionnairePage() {
  const { departmentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [questions, setQuestions]   = useState([]);
  const [department, setDepartment] = useState(null);
  const [answers, setAnswers]       = useState({});   // { questionId: value }
  const [submitted, setSubmitted]   = useState({});   // { questionId: true }
  const [current, setCurrent]       = useState(0);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [savingMsg, setSavingMsg]   = useState("");
  const [submitDone, setSubmitDone] = useState(false);

  const companyId = user?.companyId || user?._id;

  // ── Load questions & existing answers ──────────────────────────────────────
  useEffect(() => {
    Promise.all([
      api.get(`/questions/department/${departmentId}`),
      api.get(`/answers/my/${departmentId}`),
      api.get("/departments").catch(() => ({ data: [] }))
    ])
      .then(([qRes, aRes, dRes]) => {
        const qs = (qRes.data || []).filter(q => q.active !== false);
        setQuestions(qs);

        // Map saved answers
        const saved = {};
        const submittedMap = {};
        (aRes.data?.answers || []).forEach(a => {
          saved[a.questionId]    = a.answer;
          submittedMap[a.questionId] = a.submitted;
        });
        setAnswers(saved);
        setSubmitted(submittedMap);

        // Find department info
        const depts = Array.isArray(dRes.data) ? dRes.data : [];
        const dept = depts.find(d => d._id === departmentId);
        setDepartment(dept || { code: departmentId });
      })
      .catch(err => console.error("Load error", err))
      .finally(() => setLoading(false));
  }, [departmentId]);

  const answeredCount = Object.keys(answers).filter(k => answers[k] !== undefined && answers[k] !== "").length;
  const isAllSubmitted = questions.length > 0 && questions.every(q => submitted[q._id]);

  const handleAnswerChange = (qId, value) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    setSavingMsg("");
    try {
      const promises = Object.entries(answers).map(([qId, val]) => {
        if (val !== undefined && val !== "") {
          return api.post("/answers/save", {
            companyId,
            departmentId,
            questionId: qId,
            answer: val
          });
        }
        return Promise.resolve();
      });
      await Promise.all(promises);
      setSavingMsg("Draft saved ✓");
      setTimeout(() => setSavingMsg(""), 2000);
    } catch (err) {
      setSavingMsg("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    setSavingMsg("Submitting…");
    try {
      // Save all answers first
      const promises = Object.entries(answers).map(([qId, val]) => {
        if (val !== undefined && val !== "") {
          return api.post("/answers/save", {
            companyId,
            departmentId,
            questionId: qId,
            answer: val
          });
        }
        return Promise.resolve();
      });
      await Promise.all(promises);
      
      // Submit all
      await api.post(`/answers/submit/${departmentId}`);
      setSubmitDone(true);
      
      // Update local submitted state
      const newSubmitted = { ...submitted };
      questions.forEach(q => { newSubmitted[q._id] = true; });
      setSubmitted(newSubmitted);

      setSavingMsg("Submitted successfully!");
    } catch (err) {
      setSavingMsg("Submission failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const deptName = (d) => d?.title?.en || d?.code || "Department";
  const qLang    = (q, idx) => q?.question?.en || q?.code || `Question ${idx + 1}`;

  // ── Submitted success screen removed to allow CRUD ────────────────────────

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "var(--bg)", color: "var(--text)", fontSize: "16px" }}>
      Loading questions…
    </div>
  );

  if (questions.length === 0) return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: "16px",
      background: "var(--bg)", color: "var(--text)" }}>
      <div style={{ fontSize: "16px" }}>No questions found for this department.</div>
      <button onClick={() => navigate("/dashboard")} style={{
        padding: "10px 24px", borderRadius: "8px", border: "1px solid var(--border)",
        background: "none", cursor: "pointer", color: "var(--text-h)", fontWeight: 600
      }}>← Back</button>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 48px", borderBottom: "1px solid var(--border)",
        background: "var(--bg)", position: "sticky", top: 0, zIndex: 100
      }}>
        <button onClick={() => navigate("/dashboard")} style={{
          display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px",
          border: "1px solid var(--border)", borderRadius: "8px", background: "none",
          cursor: "pointer", fontSize: "13px", color: "var(--text)", fontWeight: 500
        }}>
          <Icon d={Icons.back} size={14} /> Back
        </button>

        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: 700, fontSize: "15px", color: "var(--text-h)" }}>
            {deptName(department)}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text)" }}>
            {questions.length} questions &nbsp;·&nbsp; {answeredCount} answered
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--text)" }}>
          {savingMsg && (
            <span style={{
              color: savingMsg.includes("✓") || savingMsg.includes("success") ? "#22c55e" : "var(--text)",
              fontWeight: 500
            }}>{savingMsg}</span>
          )}
        </div>
      </header>

      {/* Progress bar */}
      <div style={{ height: "4px", background: "var(--border)" }}>
        <div style={{
          height: "100%", background: "var(--accent)",
          width: `${questions.length ? (answeredCount / questions.length) * 100 : 0}%`,
          transition: "width 0.3s ease"
        }} />
      </div>

      {/* Questions List */}
      <main style={{ flexGrow: 1, padding: "60px 48px", maxWidth: "760px", margin: "0 auto", width: "100%", boxSizing: "border-box" }}>

        <div style={{ display: "flex", flexDirection: "column", gap: "64px", marginBottom: "64px" }}>
          {questions.map((q, i) => {
            const qId = q._id;
            return (
              <div key={qId} style={{ animation: `fadeInUp 0.3s ease ${i * 0.05}s backwards` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <div style={{ fontSize: "13px", color: "var(--accent)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Question {i + 1}
                    {q.required && <span style={{ color: "#ef4444", marginLeft: "4px" }}>*</span>}
                  </div>
                  {submitted[qId] && (
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#22c55e", background: "rgba(34,197,94,0.1)", padding: "2px 8px", borderRadius: "10px" }}>
                      SUBMITTED
                    </span>
                  )}
                </div>
                <h2 style={{ margin: "0 0 24px", fontSize: "22px", fontWeight: 700, lineHeight: 1.4, color: "var(--text-h)", letterSpacing: "-0.3px" }}>
                  {qLang(q, i)}
                </h2>

                {/* Answer input */}
                <div>
                  {q.type === "text" && (
                    <TextAnswer value={answers[qId]} onChange={(v) => handleAnswerChange(qId, v)} />
                  )}
                  {q.type === "textarea" && (
                    <TextAnswer value={answers[qId]} onChange={(v) => handleAnswerChange(qId, v)} multiline />
                  )}
                  {q.type === "scale" && (
                    <ScaleAnswer value={answers[qId]} onChange={(v) => handleAnswerChange(qId, v)} />
                  )}
                  {q.type === "singleSelect" && (
                    <SingleSelectAnswer value={answers[qId]} onChange={(v) => handleAnswerChange(qId, v)} options={q.options} />
                  )}
                  {q.type === "multiSelect" && (
                    <MultiSelectAnswer value={answers[qId]} onChange={(v) => handleAnswerChange(qId, v)} options={q.options} />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "16px", borderTop: "1px solid var(--border)", paddingTop: "32px" }}>
          <button onClick={handleSaveDraft} disabled={saving} style={{
            display: "flex", alignItems: "center", gap: "6px", padding: "12px 24px",
            borderRadius: "10px", border: "1px solid var(--border)",
            background: "var(--code-bg)", cursor: "pointer",
            color: "var(--text-h)", fontWeight: 600, fontSize: "14px",
            transition: "all 0.2s"
          }}>
            <Icon d={Icons.save} size={15} /> Save Draft
          </button>

          <button onClick={handleSubmit} disabled={saving} style={{
            display: "flex", alignItems: "center", gap: "6px", padding: "12px 28px",
            borderRadius: "10px", border: "none",
            background: saving ? "var(--border)" : "#22c55e", color: "#fff",
            fontWeight: 700, fontSize: "14px", cursor: saving ? "not-allowed" : "pointer",
            transition: "all 0.2s"
          }}>
            <Icon d={Icons.check} size={16} color="#fff" />
            {saving ? "Submitting…" : (isAllSubmitted || submitDone ? "Update Assessment" : "Submit Assessment")}
          </button>
        </div>
      </main>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

