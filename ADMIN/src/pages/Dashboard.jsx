import { useState, useEffect } from "react";
import { Users, Building, Activity, UserCheck } from "lucide-react";
import api from "../api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalCompanies: 0,
    pendingCompanies: 0,
    totalParticipants: 0,
    pendingParticipants: 0,
    projectsSubmitted: 0,
    evaluatorsActive: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [compRes, partRes, teamsRes, personnelRes] = await Promise.all([
          api.get("/admin/companies"),
          api.get("/admin/participants"),
          api.get("/admin/teams"),
          api.get("/admin/personnel")
        ]);
        
        const companies = compRes.data || [];
        const participants = partRes.data || [];
        const teams = teamsRes.data || [];
        const personnel = personnelRes.data || [];

        setStats({
          totalCompanies: companies.length,
          pendingCompanies: companies.filter(c => c.approvalStatus === "pending").length,
          totalParticipants: participants.length,
          pendingParticipants: participants.filter(p => p.approvalStatus === "pending").length,
          projectsSubmitted: teams.length,
          evaluatorsActive: personnel.filter(p => p.role === "evaluator").length
        });
      } catch (error) {
        console.error("Failed to fetch stats", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div style={{ padding: "40px 20px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        <h1 style={{ fontSize: "28px", color: "var(--text-main)", marginBottom: "4px", fontWeight: "700" }}>Control Center</h1>
        <div style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "40px" }}>
          MSME Hackathon Overview
        </div>
            
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginBottom: "32px" }}>
          <div className="glass-panel" style={{ padding: "24px", display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ padding: "16px", background: "rgba(59, 130, 246, 0.1)", borderRadius: "12px", color: "var(--accent-primary)" }}>
              <Users size={32} />
            </div>
            <div>
              <div style={{ fontSize: "32px", fontWeight: "bold" }}>{stats.totalParticipants}</div>
              <div style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Total Registrations</div>
            </div>
          </div>
          
          <div className="glass-panel" style={{ padding: "24px", display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ padding: "16px", background: "rgba(16, 185, 129, 0.1)", borderRadius: "12px", color: "#10B981" }}>
              <Activity size={32} />
            </div>
            <div>
              <div style={{ fontSize: "32px", fontWeight: "bold" }}>{stats.projectsSubmitted}</div>
              <div style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Projects Submitted</div>
            </div>
          </div>
          
          <div className="glass-panel" style={{ padding: "24px", display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ padding: "16px", background: "rgba(245, 158, 11, 0.1)", borderRadius: "12px", color: "#F59E0B" }}>
              <UserCheck size={32} />
            </div>
            <div>
              <div style={{ fontSize: "32px", fontWeight: "bold" }}>{stats.evaluatorsActive}</div>
              <div style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Evaluators Active</div>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          <div className="glass-panel" style={{ padding: "24px" }}>
            <h3 style={{ marginBottom: "16px", fontSize: "18px" }}>Participant Status</h3>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", color: "var(--text-secondary)" }}>
              <span>Pending Approvals</span>
              <span style={{ color: "var(--accent-warning)", fontWeight: "bold" }}>{stats.pendingParticipants}</span>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: "24px" }}>
            <h3 style={{ marginBottom: "16px", fontSize: "18px" }}>Company/Partner Status</h3>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", color: "var(--text-secondary)" }}>
              <span>Total Registered</span>
              <span style={{ fontWeight: "bold" }}>{stats.totalCompanies}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", color: "var(--text-secondary)" }}>
              <span>Pending Approvals</span>
              <span style={{ color: "var(--accent-warning)", fontWeight: "bold" }}>{stats.pendingCompanies}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
