import { useState, useEffect } from "react";
import { PlusCircle, Save, Trash2, Sliders } from "lucide-react";
import api from "../api";

export default function RubricBuilder() {
  const [roundName, setRoundName] = useState("Round 1");
  const [criteria, setCriteria] = useState([
    { id: 1, name: "Innovation & Novelty", weight: 30, maxScore: 10 },
    { id: 2, name: "Market Potential", weight: 30, maxScore: 10 },
    { id: 3, name: "Technical Feasibility", weight: 20, maxScore: 10 },
    { id: 4, name: "Team Capability", weight: 20, maxScore: 10 }
  ]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [activeEvent, setActiveEvent] = useState(null);

  useEffect(() => {
    api.get("/admin/active-event")
      .then(res => {
        setActiveEvent(res.data);
      })
      .catch(err => {
        console.error("Failed to load active event", err);
      });
  }, []);

  const totalWeight = criteria.reduce((sum, c) => sum + Number(c.weight), 0);

  const addCriteria = () => {
    setCriteria([
      ...criteria, 
      { id: Date.now(), name: "New Criteria", weight: 0, maxScore: 10 }
    ]);
  };

  const updateCriteria = (id, field, value) => {
    setCriteria(criteria.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const removeCriteria = (id) => {
    setCriteria(criteria.filter(c => c.id !== id));
  };

  const handleSave = async () => {
    if (totalWeight !== 100) {
      setMessage({ type: "error", text: "Total weight must exactly equal 100%" });
      return;
    }

    if (!activeEvent) {
      setMessage({ type: "error", text: "No active hackathon event found. Please check database status." });
      return;
    }
    
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const payload = {
        eventId: activeEvent._id,
        roundName,
        criteria: criteria.map(c => ({ name: c.name, weight: c.weight, maxScore: c.maxScore }))
      };
      
      await api.post("/evaluations/rubric", payload);
      setMessage({ type: "success", text: "Rubric saved successfully!" });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to save rubric configuration." }); 
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: "32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2 style={{ fontSize: "20px", display: "flex", alignItems: "center", gap: "12px" }}>
          <Sliders size={24} color="var(--accent-secondary)" /> Dynamic Rubric Builder
        </h2>
        <button onClick={handleSave} className="btn-primary" disabled={saving} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Save size={16} /> {saving ? "Saving..." : "Save Rubric"}
        </button>
      </div>

      {message.text && (
        <div style={{ 
          padding: "12px", 
          borderRadius: "8px", 
          marginBottom: "24px", 
          background: message.type === "success" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
          color: message.type === "success" ? "#10B981" : "#EF4444"
        }}>
          {message.text}
        </div>
      )}

      <div className="form-group" style={{ maxWidth: "300px", marginBottom: "32px" }}>
        <label className="form-label">Evaluation Round</label>
        <select className="form-select" value={roundName} onChange={e => setRoundName(e.target.value)}>
          <option value="Screening">Screening / Idea Phase</option>
          <option value="Round 1">Round 1 (Prototype)</option>
          <option value="Final Pitch">Final Pitch</option>
        </select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: "16px", marginBottom: "12px", fontWeight: "bold", color: "var(--text-secondary)", fontSize: "14px" }}>
        <div>Criteria Name</div>
        <div>Weight (%)</div>
        <div>Max Score</div>
        <div>Actions</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {criteria.map((c, index) => (
          <div key={c.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: "16px", alignItems: "center", background: "var(--bg-main)", padding: "16px", borderRadius: "8px", border: "1px solid var(--border)" }}>
            <input 
              type="text" 
              className="form-input" 
              value={c.name}
              onChange={e => updateCriteria(c.id, "name", e.target.value)}
            />
            <input 
              type="number" 
              className="form-input" 
              value={c.weight}
              onChange={e => updateCriteria(c.id, "weight", Number(e.target.value))}
            />
            <input 
              type="number" 
              className="form-input" 
              value={c.maxScore}
              onChange={e => updateCriteria(c.id, "maxScore", Number(e.target.value))}
            />
            <button onClick={() => removeCriteria(c.id)} style={{ background: "none", border: "none", color: "var(--accent-danger)", cursor: "pointer", padding: "8px" }}>
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "24px", paddingTop: "24px", borderTop: "1px solid var(--border)" }}>
        <button onClick={addCriteria} className="btn-outline" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <PlusCircle size={16} /> Add Criteria
        </button>

        <div style={{ fontSize: "16px", fontWeight: "bold", color: totalWeight === 100 ? "#10B981" : "#EF4444" }}>
          Total Weight: {totalWeight}% {totalWeight !== 100 && "(Must equal 100%)"}
        </div>
      </div>

    </div>
  );
}
