import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(email, password);
      // Route based on role
      if (user.role === "company") {
        navigate("/company/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSent(true);
    setTimeout(() => {
      setShowForgotModal(false);
      setForgotSent(false);
      setForgotEmail("");
    }, 3000);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Log in to manage your assessments and details</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
            />
          </div>

          <div className="form-group">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <label className="form-label" htmlFor="password" style={{ margin: 0 }}>Password</label>
              <button
                type="button"
                className="auth-link"
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                onClick={() => setShowForgotModal(true)}
              >
                Forgot password?
              </button>
            </div>
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
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p style={{ marginTop: "24px", fontSize: "14px", textAlign: "center", color: "var(--text)" }}>
          Don't have a company account?{" "}
          <Link to="/register" className="auth-link">
            Register your company
          </Link>
        </p>
      </div>

      {showForgotModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div className="auth-card" style={{ maxWidth: "400px", position: "relative" }}>
            <button
              onClick={() => setShowForgotModal(false)}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "none",
                border: "none",
                fontSize: "20px",
                color: "var(--text)",
                cursor: "pointer"
              }}
            >
              &times;
            </button>
            <h2 className="auth-title" style={{ fontSize: "24px" }}>Reset Password</h2>
            {forgotSent ? (
              <div style={{
                background: "var(--accent-bg)",
                border: "1px solid var(--accent-border)",
                color: "var(--accent)",
                padding: "16px",
                borderRadius: "8px",
                marginTop: "16px",
                fontSize: "14px"
              }}>
                A password reset link has been simulated and sent to <strong>{forgotEmail}</strong>.
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} style={{ marginTop: "16px" }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="forgot-email">Enter your email address</label>
                  <input
                    id="forgot-email"
                    type="email"
                    className="form-input"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@company.com"
                    required
                  />
                </div>
                <button type="submit" className="btn-primary">
                  Send reset link
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
