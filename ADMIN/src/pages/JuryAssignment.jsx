import { useState, useEffect } from "react";
import { Users, UserCheck } from "lucide-react";
import api from "../api";

export default function JuryAssignment() {
  const [mentors, setMentors] = useState([]);
  const [teams, setTeams] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for assignment selections
  const [selectedMentor, setSelectedMentor] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [newPersonnel, setNewPersonnel] = useState({ name: "", email: "", password: "", role: "evaluator", category: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [personnelRes, teamsRes, assignmentsRes] = await Promise.all([
          api.get("/admin/personnel"),
          api.get("/admin/teams"),
          api.get("/admin/assignments")
        ]);
        setMentors(personnelRes.data || []);
        setTeams(teamsRes.data || []);
        setAssignments(assignmentsRes.data || []);
      } catch (err) {
        console.error("Failed to fetch delegation data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAssign = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!selectedMentor || !selectedTeam) {
      setMessage({ type: "error", text: "Please select both a person and a team." });
      return;
    }

    try {
      const payload = { mentorId: selectedMentor, teamId: selectedTeam, round: "Initial" };
      const res = await api.post("/admin/assignments", payload);
      setAssignments([...assignments, res.data.assignment]);

      setMessage({ type: "success", text: "Assignment created successfully!" });
      setSelectedMentor("");
      setSelectedTeam("");
    } catch (err) {
      setMessage({ type: "error", text: "Failed to create assignment." });
    }
  };

  const handleAddPersonnel = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/personnel", newPersonnel);
      setMessage({ type: "success", text: "Personnel added successfully!" });
      setNewPersonnel({ name: "", email: "", password: "", role: "evaluator", category: "" });
      // Refresh list
      const res = await api.get("/admin/personnel");
      setMentors(res.data || []);
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to add personnel" });
    }
  };

  if (loading) return <div style={{ padding: "40px" }}>Loading delegation data...</div>;

  return (
    <div className="glass-panel" style={{ padding: "32px" }}>
      <h2 style={{ fontSize: "20px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
        <UserCheck size={24} color="var(--accent-primary)" /> Delegation & Assignments
      </h2>

      <p style={{ color: "var(--text-secondary)", marginBottom: "32px", fontSize: "14px" }}>
        Add new Evaluators/Mentors to the platform, and assign them to specific Teams for scoring or mentoring.
      </p>

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
        
        {/* Left Column: Forms */}
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          
          <form onSubmit={handleAddPersonnel} style={{ background: "var(--bg-main)", padding: "24px", borderRadius: "12px", border: "1px solid var(--border)" }}>
            <h3 style={{ fontSize: "16px", marginBottom: "20px" }}>Add New Jury / Mentor</h3>
            
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" required value={newPersonnel.name} onChange={e => setNewPersonnel({...newPersonnel, name: e.target.value})} />
            </div>
            
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-input" required value={newPersonnel.email} onChange={e => setNewPersonnel({...newPersonnel, email: e.target.value})} />
            </div>

            <div className="form-group">
              <label className="form-label">Temporary Password</label>
              <input type="text" className="form-input" required value={newPersonnel.password} onChange={e => setNewPersonnel({...newPersonnel, password: e.target.value})} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select className="form-select" value={newPersonnel.role} onChange={e => setNewPersonnel({...newPersonnel, role: e.target.value})}>
                  <option value="evaluator">Evaluator</option>
                  <option value="mentor">Mentor</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Expertise / Category</label>
                <input type="text" className="form-input" placeholder="e.g. Fintech" value={newPersonnel.category} onChange={e => setNewPersonnel({...newPersonnel, category: e.target.value})} />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "8px" }}>
              Create Account
            </button>
          </form>

          <form onSubmit={handleAssign} style={{ background: "var(--bg-main)", padding: "24px", borderRadius: "12px", border: "1px solid var(--border)" }}>
            <h3 style={{ fontSize: "16px", marginBottom: "20px" }}>Create Assignment</h3>
            
            <div className="form-group">
              <label className="form-label">Select Mentor / Evaluator</label>
              <select className="form-select" value={selectedMentor} onChange={e => setSelectedMentor(e.target.value)}>
                <option value="">-- Choose Person --</option>
                {mentors.map(m => (
                  <option key={m._id} value={m._id}>{m.name} ({m.role}) - {m.category || 'General'}</option>
                ))}
              </select>
            </div>

          <div className="form-group">
            <label className="form-label">Select Team</label>
            <select className="form-select" value={selectedTeam} onChange={e => setSelectedTeam(e.target.value)}>
              <option value="">-- Choose Team --</option>
              {teams.map(t => (
                <option key={t._id} value={t._id}>{t.teamName} [{t.industry}]</option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "16px" }}>
            Create Assignment
          </button>
        </form>
        </div> {/* End Left Column */}

        {/* Right Column: Assignments Overview */}
        <div>
          <h3 style={{ fontSize: "16px", marginBottom: "20px" }}>Current Assignments Overview</h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {assignments.length > 0 ? assignments.map(a => (
              <div key={a._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", background: "var(--bg-main)", borderRadius: "8px", border: "1px solid var(--border)" }}>
                <div>
                  <div style={{ fontWeight: "bold", fontSize: "14px" }}>{a.mentorId?.name || "Unknown Mentor"}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>Assigned Team: {a.teamId?.teamName || "Unknown"}</div>
                </div>
                <div style={{ fontSize: "12px", color: "var(--accent-primary)", padding: "4px 8px", background: "rgba(59, 130, 246, 0.1)", borderRadius: "12px" }}>
                  {a.round || "Active"}
                </div>
              </div>
            )) : (
              <div style={{ padding: "16px", color: "var(--text-muted)", fontSize: "14px", border: "1px dashed var(--border)", borderRadius: "8px", textAlign: "center" }}>
                No assignments yet. Select a mentor and a team to create one.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
