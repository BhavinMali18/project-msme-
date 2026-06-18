import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { Lock } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/admin/login", { email, password });
      if (res.data.token) {
        localStorage.setItem("adminToken", res.data.token);
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", background: "var(--bg-main)" }}>
      <div className="card" style={{ width: "100%", maxWidth: "400px", padding: "40px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "32px" }}>
          <div style={{ background: "rgba(59, 130, 246, 0.1)", padding: "16px", borderRadius: "50%", color: "var(--primary)", marginBottom: "16px" }}>
            <Lock size={32} />
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: "700" }}>Admin Login</h1>
          <p className="text-muted text-sm mt-2">Sign in to access the dashboard</p>
        </div>

        {error && (
          <div style={{ background: "var(--danger)", color: "white", padding: "12px", borderRadius: "6px", marginBottom: "20px", fontSize: "14px", textAlign: "center" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid var(--border)", fontSize: "14px" }}
              placeholder="admin@msme.gov.in"
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid var(--border)", fontSize: "14px" }}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "12px", marginTop: "8px" }}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
