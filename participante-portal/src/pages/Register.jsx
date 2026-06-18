import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { registerParticipant } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Basic Account info
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("student"); // student, university, startup_individual

  // Category specific fields
  const [institutionName, setInstitutionName] = useState("");
  const [course, setCourse] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");
  const [teamName, setTeamName] = useState("");
  const [teamSize, setTeamSize] = useState("1");
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [coordinatorName, setCoordinatorName] = useState("");
  const [stage, setStage] = useState("Ideation"); // Ideation, Prototype, Scaling

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Set default category from URL query param if present
  useEffect(() => {
    const urlCat = searchParams.get("category");
    if (urlCat && ["student", "university", "startup_individual"].includes(urlCat)) {
      setCategory(urlCat);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const payload = {
      name,
      email,
      password,
      phone,
      category,
      // Pass category-specific inputs
      institutionName: category === "student" || category === "university" ? institutionName : "",
      teamName: category === "student" ? teamName : category === "startup_individual" ? teamName : "",
      teamSize: category === "student" || category === "university" ? parseInt(teamSize) : 1,
      projectTitle: category === "student" || category === "startup_individual" ? projectTitle : "",
      projectDescription: category === "student" || category === "startup_individual" ? projectDescription : "",
      stage: category === "startup_individual" ? stage : "",
      coordinatorName: category === "university" ? coordinatorName : ""
    };

    try {
      await registerParticipant(payload);
      navigate("/dashboard");
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <div className="glass-panel animate-fade-in" style={{ width: "100%", maxWidth: "600px", padding: "40px" }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h2 style={{ fontSize: "28px", marginBottom: "8px" }}>Join the Hackathon</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
            Select your track and submit details to register
          </p>
        </div>

        {error && (
          <div style={{
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            color: "var(--accent-danger)",
            padding: "12px 16px",
            borderRadius: "8px",
            fontSize: "14px",
            marginBottom: "20px"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          {/* Category Tabs */}
          <div className="form-group">
            <label className="form-label">Registration Category</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginTop: "4px" }}>
              <button
                type="button"
                className={category === "student" ? "btn-primary" : "btn-secondary"}
                style={{ padding: "10px", fontSize: "13px" }}
                onClick={() => setCategory("student")}
              >
                Student
              </button>
              <button
                type="button"
                className={category === "university" ? "btn-primary" : "btn-secondary"}
                style={{ padding: "10px", fontSize: "13px" }}
                onClick={() => setCategory("university")}
              >
                University
              </button>
              <button
                type="button"
                className={category === "startup_individual" ? "btn-primary" : "btn-secondary"}
                style={{ padding: "10px", fontSize: "13px" }}
                onClick={() => setCategory("startup_individual")}
              >
                Startup / Solo
              </button>
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--border-color)", margin: "24px 0" }}></div>

          {/* Account Section */}
          <h3 style={{ fontSize: "16px", marginBottom: "16px", fontWeight: 600, color: "var(--accent-primary)" }}>
            Account Details
          </h3>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: "24px" }}>
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {/* Category-Specific Fields */}
          <h3 style={{ fontSize: "16px", marginBottom: "16px", fontWeight: 600, color: "var(--accent-secondary)" }}>
            Track Information
          </h3>

          {/* Student Fields */}
          {category === "student" && (
            <div className="animate-fade-in">
              <div className="form-group">
                <label className="form-label">College / School Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  placeholder="Indian Institute of Technology"
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div className="form-group">
                  <label className="form-label">Team Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="Team Alpha"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Team Size</label>
                  <input
                    type="number"
                    className="form-input"
                    value={teamSize}
                    onChange={(e) => setTeamSize(e.target.value)}
                    min="1"
                    max="6"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Project Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="AI-powered inventory analyzer"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Brief Project Description</label>
                <textarea
                  className="form-textarea"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Describe your hackathon solution..."
                  rows="3"
                  required
                />
              </div>
            </div>
          )}

          {/* University Fields */}
          {category === "university" && (
            <div className="animate-fade-in">
              <div className="form-group">
                <label className="form-label">University / Institution Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  placeholder="National University"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Faculty Coordinator Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={coordinatorName}
                  onChange={(e) => setCoordinatorName(e.target.value)}
                  placeholder="Dr. S. K. Sharma"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Estimated Number of Participating Teams</label>
                <input
                  type="number"
                  className="form-input"
                  value={teamSize}
                  onChange={(e) => setTeamSize(e.target.value)}
                  min="1"
                  required
                />
              </div>
            </div>
          )}

          {/* Startup/Individual Fields */}
          {category === "startup_individual" && (
            <div className="animate-fade-in">
              <div className="form-group">
                <label className="form-label">Startup / Team Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Innovate X Lab"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Current Stage</label>
                <select
                  className="form-select"
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                >
                  <option value="Ideation">Ideation</option>
                  <option value="Prototype">Working Prototype</option>
                  <option value="Scaling">Scaling / Revenue generating</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Product / Idea Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="Blockchain Supply Chain Tracker"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Brief Description</label>
                <textarea
                  className="form-textarea"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Describe your startup product/idea..."
                  rows="3"
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            style={{ width: "100%", padding: "14px", fontSize: "16px", marginTop: "12px", marginBottom: "20px" }}
            disabled={isLoading}
          >
            {isLoading ? "Submitting Registration..." : "Complete Registration"}
          </button>
        </form>

        <div style={{ textAlign: "center", fontSize: "14px", color: "var(--text-secondary)" }}>
          Already registered?{" "}
          <span
            onClick={() => navigate("/login")}
            style={{ color: "var(--accent-primary)", cursor: "pointer", fontWeight: 600 }}
          >
            Sign In
          </span>
        </div>
      </div>
    </div>
  );
}
