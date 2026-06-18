import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Local state for forms
  const [githubUrl, setGithubUrl] = useState(user?.githubUrl || "");
  const [demoVideoUrl, setDemoVideoUrl] = useState(user?.demoVideoUrl || "");
  const [pitchDeckUrl, setPitchDeckUrl] = useState(user?.pitchDeckUrl || "");
  const [projectTitle, setProjectTitle] = useState(user?.projectTitle || "");
  const [projectDescription, setProjectDescription] = useState(user?.projectDescription || "");
  const [stage, setStage] = useState(user?.stage || "Ideation");
  
  // Status message
  const [statusMsg, setStatusMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMsg("");

    try {
      const payload = {
        userId: user._id,
        githubUrl,
        demoVideoUrl,
        pitchDeckUrl,
        projectTitle,
        projectDescription,
        stage
      };

      const response = await api.put("/auth/profile", payload);
      const updatedUser = response.data.user;
      
      // Update localStorage & state by recreating token / user objects
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setStatusMsg("Changes saved successfully!");
      setTimeout(() => setStatusMsg(""), 3000);
    } catch (err) {
      setStatusMsg("Error saving changes. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <div>Loading profile...</div>
      </div>
    );
  }

  // Get track info
  const categoryNames = {
    student: "Students Track",
    university: "University Track",
    startup_individual: "Startups & Individuals Track"
  };
  const currentCategoryName = categoryNames[user.category] || "Hackathon Track";

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header className="glass-panel" style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 40px",
        borderRadius: "0 0 16px 16px",
        margin: "0 0 30px 0"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "28px", height: "28px", borderRadius: "6px", background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>M</div>
          <span style={{ fontWeight: 800 }}>MSME Hackathon Portal</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontWeight: 600, fontSize: "14px" }}>{user.name}</div>
            <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{currentCategoryName}</div>
          </div>
          <button className="btn-secondary" style={{ padding: "8px 16px", fontSize: "13px" }} onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flexGrow: 1, padding: "0 40px 40px 40px", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
        
        {/* Welcome Section */}
        <section className="glass-panel" style={{ padding: "30px", marginBottom: "30px", background: "radial-gradient(circle at top right, rgba(59, 130, 246, 0.1), transparent 70%)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <span className={`badge ${user.category === "student" ? "badge-student" : user.category === "university" ? "badge-university" : "badge-startup"}`} style={{ marginBottom: "12px" }}>
                {user.category?.toUpperCase() || "PARTICIPANT"}
              </span>
              <h2 style={{ fontSize: "32px", marginBottom: "8px" }}>Welcome, {user.name}!</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "15px", maxWidth: "700px" }}>
                You are registered under the <strong>{currentCategoryName}</strong>. Use this dashboard to manage your submission, request mentorship, and check evaluation results.
              </p>
            </div>
            <div className="glass-card" style={{ padding: "16px 24px", minWidth: "200px" }}>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase" }}>Portal Status</div>
              <div style={{ fontSize: "18px", fontWeight: "bold", color: "var(--accent-success)", marginTop: "4px" }}>Registration Approved</div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>ID: #{user._id?.substring(18)}</div>
            </div>
          </div>
        </section>

        {statusMsg && (
          <div style={{
            background: statusMsg.includes("Error") ? "rgba(239, 68, 68, 0.1)" : "rgba(16, 185, 129, 0.1)",
            border: statusMsg.includes("Error") ? "1px solid rgba(239, 68, 68, 0.2)" : "1px solid rgba(16, 185, 129, 0.2)",
            color: statusMsg.includes("Error") ? "var(--accent-danger)" : "var(--accent-success)",
            padding: "12px 20px",
            borderRadius: "8px",
            fontSize: "14px",
            marginBottom: "20px",
            fontWeight: 500
          }}>
            {statusMsg}
          </div>
        )}

        {/* Dashboard Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "30px" }}>
          
          {/* Main Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
            
            {/* STUDENTS TRACK */}
            {user.category === "student" && (
              <div className="glass-panel" style={{ padding: "30px" }}>
                <h3 style={{ fontSize: "20px", marginBottom: "20px", color: "#FFFFFF" }}>Submission Portal</h3>
                
                <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div className="form-group">
                    <label className="form-label">Project Title</label>
                    <input
                      type="text"
                      className="form-input"
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      placeholder="Project name"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Project Description</label>
                    <textarea
                      className="form-textarea"
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      placeholder="Briefly describe the technology stack and solution..."
                      rows="4"
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                    <div className="form-group">
                      <label className="form-label">GitHub Repository URL</label>
                      <input
                        type="url"
                        className="form-input"
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        placeholder="https://github.com/..."
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Demo Video Link (Loom/Drive)</label>
                      <input
                        type="url"
                        className="form-input"
                        value={demoVideoUrl}
                        onChange={(e) => setDemoVideoUrl(e.target.value)}
                        placeholder="https://loom.com/..."
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn-primary" style={{ alignSelf: "flex-start" }} disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Project Details"}
                  </button>
                </form>
              </div>
            )}

            {/* UNIVERSITY TRACK */}
            {user.category === "university" && (
              <div className="glass-panel" style={{ padding: "30px" }}>
                <h3 style={{ fontSize: "20px", marginBottom: "20px" }}>University Delegate Console</h3>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px" }}>
                  <div className="glass-card">
                    <h4 style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Faculty Coordinator</h4>
                    <p style={{ fontSize: "20px", fontWeight: "bold", marginTop: "4px" }}>{user.coordinatorName || "Not Assigned"}</p>
                  </div>
                  <div className="glass-card">
                    <h4 style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Registered Teams</h4>
                    <p style={{ fontSize: "24px", fontWeight: "bold", marginTop: "4px", color: "var(--accent-primary)" }}>{user.teamSize || 0}</p>
                  </div>
                </div>

                <div className="glass-card" style={{ marginBottom: "20px" }}>
                  <h4 style={{ fontSize: "16px", marginBottom: "8px" }}>MSME Incubation & Funding Partnership</h4>
                  <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.5", marginBottom: "16px" }}>
                    Apply for co-funding to setup a specialized **MSME Innovation & Skill Development Lab** at your university campus.
                  </p>
                  <button className="btn-primary" onClick={() => alert("Funding proposal request sent to MSME department.")}>
                    Submit Partnership Proposal
                  </button>
                </div>
              </div>
            )}

            {/* STARTUPS / INDIVIDUALS TRACK */}
            {user.category === "startup_individual" && (
              <div className="glass-panel" style={{ padding: "30px" }}>
                <h3 style={{ fontSize: "20px", marginBottom: "20px" }}>Startup pitch & Investment Hub</h3>
                
                <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                    <div className="form-group">
                      <label className="form-label">Startup / Product Name</label>
                      <input
                        type="text"
                        className="form-input"
                        value={user.teamName || ""}
                        readOnly
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Current Stage</label>
                      <select className="form-select" value={stage} onChange={(e) => setStage(e.target.value)}>
                        <option value="Ideation">Ideation</option>
                        <option value="Prototype">Working Prototype</option>
                        <option value="Scaling">Scaling / Revenue generating</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Pitch Deck Drive/Doc Link</label>
                    <input
                      type="url"
                      className="form-input"
                      value={pitchDeckUrl}
                      onChange={(e) => setPitchDeckUrl(e.target.value)}
                      placeholder="https://drive.google.com/..."
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Product/Idea Description</label>
                    <textarea
                      className="form-textarea"
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      placeholder="Detail your product value proposition, market size, and target MSME sector..."
                      rows="4"
                    />
                  </div>

                  <button type="submit" className="btn-primary" style={{ alignSelf: "flex-start" }} disabled={isLoading}>
                    {isLoading ? "Saving..." : "Update Startup Profile"}
                  </button>
                </form>
              </div>
            )}
            
            {/* Timeline Checklist */}
            <div className="glass-panel" style={{ padding: "30px" }}>
              <h3 style={{ fontSize: "18px", marginBottom: "20px" }}>Hackathon Timeline & Status</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "var(--accent-success)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontSize: "12px", fontWeight: "bold" }}>✓</div>
                  <div>
                    <h4 style={{ fontSize: "14px", fontWeight: 600 }}>Registration & Profile Submission</h4>
                    <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>Completed successfully. Your profile is active.</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "var(--accent-primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontSize: "12px", fontWeight: "bold" }}>2</div>
                  <div>
                    <h4 style={{ fontSize: "14px", fontWeight: 600 }}>Prototype Submission Window</h4>
                    <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>Open until August 15, 2026. Submit your GitHub repository and video demo link.</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "rgba(255, 255, 255, 0.05)", border: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: "12px", fontWeight: "bold" }}>3</div>
                  <div>
                    <h4 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-muted)" }}>Grand Finale & Winner Announcement</h4>
                    <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>August 28, 2026. Top teams present to Ministry Officials.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
            
            {/* Resources Box */}
            <div className="glass-panel" style={{ padding: "24px" }}>
              <h4 style={{ fontSize: "16px", marginBottom: "16px" }}>MSME Reference Material</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <a href="#" style={{ color: "var(--accent-primary)", fontSize: "14px", textDecoration: "none" }}>→ Hackathon Guidelines.pdf</a>
                <a href="#" style={{ color: "var(--accent-primary)", fontSize: "14px", textDecoration: "none" }}>→ MSME Real-world Problem Statements</a>
                <a href="#" style={{ color: "var(--accent-primary)", fontSize: "14px", textDecoration: "none" }}>→ APIs and Sandbox Integrations</a>
                <a href="#" style={{ color: "var(--accent-primary)", fontSize: "14px", textDecoration: "none" }}>→ Grading Rubric & Criteria</a>
              </div>
            </div>

            {/* Mentorship / Help Box */}
            <div className="glass-panel" style={{ padding: "24px" }}>
              <h4 style={{ fontSize: "16px", marginBottom: "12px" }}>Request Mentorship</h4>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.5", marginBottom: "16px" }}>
                Connect with industry leaders, software architects, and MSME consultants for guidance on technical or business challenges.
              </p>
              <button className="btn-secondary" style={{ width: "100%", fontSize: "13px" }} onClick={() => alert("Mentoring request logged. You will receive an email confirmation.")}>
                Request Call Slot
              </button>
            </div>

            {/* User Profile Summary */}
            <div className="glass-panel" style={{ padding: "24px" }}>
              <h4 style={{ fontSize: "16px", marginBottom: "16px" }}>Profile Information</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
                <div>
                  <span style={{ color: "var(--text-secondary)" }}>Email:</span> <span style={{ color: "#FFFFFF" }}>{user.email}</span>
                </div>
                {user.phone && (
                  <div>
                    <span style={{ color: "var(--text-secondary)" }}>Phone:</span> <span style={{ color: "#FFFFFF" }}>{user.phone}</span>
                  </div>
                )}
                {user.institutionName && (
                  <div>
                    <span style={{ color: "var(--text-secondary)" }}>Institution:</span> <span style={{ color: "#FFFFFF" }}>{user.institutionName}</span>
                  </div>
                )}
                {user.teamName && (
                  <div>
                    <span style={{ color: "var(--text-secondary)" }}>Team Name:</span> <span style={{ color: "#FFFFFF" }}>{user.teamName}</span>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
