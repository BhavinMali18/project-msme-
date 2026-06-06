import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function RegisterEmployee() {
  const [searchParams] = useSearchParams();
  const companyName = searchParams.get("company") || "Simulated MSME Corp";
  const inviteEmail = searchParams.get("email") || "";

  const [name, setName] = useState("");
  const [email, setEmail] = useState(inviteEmail);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { registerEmployee } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Please fill in all details.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      await registerEmployee({
        name,
        email,
        password,
        companyName,
      });
      // Route participant to the assessment portal
      navigate("/dashboard");
    } catch (err) {
      setError(err || "Failed to accept invite. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1 className="auth-title">Accept Invite</h1>
        <p className="auth-subtitle">Create your personal employee account to start your assessment</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="company">Company Name</label>
            <input
              id="company"
              type="text"
              className="form-input"
              value={companyName}
              readOnly
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="employee@company.com"
              required
              readOnly={!!inviteEmail}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="name">Your Full Name</label>
            <input
              id="name"
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Johnson"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Set Password</label>
            <input
              id="password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: "12px" }}>
            {loading ? "Registering Account..." : "Accept Invite & Set Up"}
          </button>
        </form>

        <p style={{ marginTop: "24px", fontSize: "14px", textAlign: "center", color: "var(--text)" }}>
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}
