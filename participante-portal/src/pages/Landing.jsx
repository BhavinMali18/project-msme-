import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  const categories = [
    {
      id: "student",
      title: "Students Track",
      desc: "For young minds in colleges and schools. Showcase fresh ideas, build prototypes, and get direct mentorship from MSME industry experts.",
      benefits: ["Cash prizes up to ₹2,00,000", "Direct Internship opportunities", "Free Cloud credits & toolkits"],
      tag: "Students",
      badgeClass: "badge-student"
    },
    {
      id: "university",
      title: "University Track",
      desc: "For institutional delegations, academic research groups, and lab teams. Partner with MSMEs to solve complex technological challenges.",
      benefits: ["R&D Grants up to ₹5,00,000", "MSME Center of Excellence setup support", "IP & Patent registration guidance"],
      tag: "University",
      badgeClass: "badge-university"
    },
    {
      id: "startup_individual",
      title: "Startups & Individuals",
      desc: "For early-stage startups, solo founders, and professional innovators. Fast-track your solution into production and commercialization.",
      benefits: ["Seed Funding up to ₹10,00,000", "Direct MSME vendor onboarding", "Venture Capital pitch sessions"],
      tag: "Startups / Solo",
      badgeClass: "badge-startup"
    }
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", padding: "20px 40px", boxSizing: "border-box" }}>
      {/* Navbar */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0 30px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "18px" }}>M</div>
          <span style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "-0.5px" }}>MSME <span className="gradient-text">Hackathon</span></span>
        </div>
        <div style={{ display: "flex", gap: "16px" }}>
          <button className="btn-secondary" onClick={() => navigate("/login")}>Sign In</button>
          <button className="btn-primary" onClick={() => navigate("/register")}>Register Now</button>
        </div>
      </nav>

      {/* Hero Section */}
      <main style={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", maxWidth: "1200px", margin: "0 auto", padding: "40px 0" }}>
        <div className="animate-fade-in" style={{ maxWidth: "800px" }}>
          <span className="badge badge-student" style={{ marginBottom: "16px", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "bold" }}>National Innovation Challenge 2026</span>
          <h1 style={{ fontSize: "56px", lineHeight: "1.1", marginBottom: "20px" }}>
            Shape the Future of <br />
            <span className="gradient-text">Indian MSMEs</span>
          </h1>
          <p style={{ fontSize: "18px", color: "var(--text-secondary)", lineHeight: "1.6", marginBottom: "40px" }}>
            Join the national movement to bridge academic innovation and grassroots enterprise. Solve real-world industrial challenges, secure seed funding, and scale your solutions.
          </p>
        </div>

        {/* Categories Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "30px", width: "100%", marginTop: "20px" }}>
          {categories.map((cat, idx) => (
            <div key={cat.id} className="glass-panel glass-card animate-fade-in" style={{ animationDelay: `${idx * 0.1}s`, textAlign: "left", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <span className={`badge ${cat.badgeClass}`} style={{ marginBottom: "16px" }}>{cat.tag}</span>
                <h3 style={{ fontSize: "24px", marginBottom: "12px" }}>{cat.title}</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.5", marginBottom: "20px" }}>{cat.desc}</p>
                
                <h4 style={{ fontSize: "14px", color: "#FFFFFF", marginBottom: "10px", fontWeight: 600 }}>Key Rewards:</h4>
                <ul style={{ paddingLeft: "20px", color: "var(--text-secondary)", fontSize: "13px", lineHeight: "1.8", marginBottom: "24px" }}>
                  {cat.benefits.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              </div>

              <button className="btn-secondary" style={{ width: "100%" }} onClick={() => navigate(`/register?category=${cat.id}`)}>
                Join as {cat.tag}
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--border-color)", padding: "30px 0", textAlign: "center", color: "var(--text-muted)", fontSize: "14px", marginTop: "60px" }}>
        © 2026 Ministry of Micro, Small & Medium Enterprises. All rights reserved.
      </footer>
    </div>
  );
}
