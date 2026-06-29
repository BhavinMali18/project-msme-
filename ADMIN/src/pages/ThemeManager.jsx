import { useState, useEffect } from "react";
import { Palette, Save, Trash2 } from "lucide-react";
import api from "../api";

export default function ThemeManager() {
  const [themes, setThemes] = useState([]);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#3B82F6");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  const fetchThemes = async () => {
    try {
      const res = await api.get("/themes");
      setThemes(res.data.themes || []);
    } catch (err) {
      console.error("Failed to fetch themes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThemes();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await api.post("/themes", { name, color, description });
      setMessage({ type: "success", text: "Theme added successfully!" });
      setName("");
      setColor("#3B82F6");
      setDescription("");
      fetchThemes();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to add theme." });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this theme?")) return;
    try {
      await api.delete(`/themes/${id}`);
      fetchThemes();
    } catch (err) {
      alert("Failed to delete theme.");
    }
  };

  if (loading) return <div style={{ padding: "40px" }}>Loading themes...</div>;

  return (
    <div className="glass-panel" style={{ padding: "32px" }}>
      <h2 style={{ fontSize: "20px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
        <Palette size={24} color="var(--accent-primary)" /> Hackathon Themes
      </h2>

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

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
        
        {/* Form */}
        <form onSubmit={handleSave} style={{ background: "var(--bg-main)", padding: "24px", borderRadius: "12px", border: "1px solid var(--border)" }}>
          <h3 style={{ fontSize: "16px", marginBottom: "20px" }}>Create New Theme</h3>
          
          <div className="form-group">
            <label className="form-label">Theme Name</label>
            <input 
              type="text" 
              className="form-input" 
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Agritech, AI & ML"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Theme Color</label>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <input 
                type="color" 
                value={color}
                onChange={e => setColor(e.target.value)}
                style={{ width: "50px", height: "40px", padding: "0", border: "none", borderRadius: "4px", cursor: "pointer", background: "none" }}
              />
              <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}>{color}</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description (Optional)</label>
            <textarea 
              className="form-input" 
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Brief description of this problem statement area."
              rows={3}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "16px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <Save size={16} /> Save Theme
          </button>
        </form>

        {/* Existing Themes */}
        <div>
          <h3 style={{ fontSize: "16px", marginBottom: "20px" }}>Active Themes</h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {themes.length === 0 ? (
              <div style={{ color: "var(--text-secondary)", fontStyle: "italic" }}>No themes added yet.</div>
            ) : (
              themes.map(t => (
                <div key={t._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", background: "var(--bg-main)", borderRadius: "8px", border: "1px solid var(--border)", borderLeft: `4px solid ${t.color}` }}>
                  <div>
                    <div style={{ fontWeight: "bold", fontSize: "14px" }}>{t.name}</div>
                    {t.description && <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>{t.description}</div>}
                  </div>
                  <button onClick={() => handleDelete(t._id)} style={{ background: "none", border: "none", color: "var(--accent-danger)", cursor: "pointer", padding: "4px" }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
