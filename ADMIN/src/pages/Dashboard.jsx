import { useEffect, useState } from "react";
import api from "../api";
import { Users, Building, AlertCircle } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalCompanies: 0,
    pendingCompanies: 0,
    totalParticipants: 0,
    pendingParticipants: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [compRes, partRes] = await Promise.all([
          api.get("/admin/companies"),
          api.get("/admin/participants")
        ]);
        
        const companies = compRes.data;
        const participants = partRes.data;

        setStats({
          totalCompanies: companies.length,
          pendingCompanies: companies.filter(c => c.approvalStatus === "pending").length,
          totalParticipants: participants.length,
          pendingParticipants: participants.filter(p => p.approvalStatus === "pending").length
        });
      } catch (error) {
        console.error("Failed to fetch stats", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-desc">Overview of MSME Portal registrations and pending approvals.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px" }}>
        
        <div className="card">
          <div className="flex items-center gap-4">
            <div style={{ padding: "12px", background: "rgba(59, 130, 246, 0.1)", borderRadius: "8px", color: "var(--primary)" }}>
              <Building size={24} />
            </div>
            <div>
              <div className="text-muted text-sm font-semibold">Total Companies</div>
              <div style={{ fontSize: "28px", fontWeight: "700" }}>{stats.totalCompanies}</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div style={{ padding: "12px", background: "rgba(245, 158, 11, 0.1)", borderRadius: "8px", color: "var(--warning)" }}>
              <AlertCircle size={24} />
            </div>
            <div>
              <div className="text-muted text-sm font-semibold">Pending Companies</div>
              <div style={{ fontSize: "28px", fontWeight: "700" }}>{stats.pendingCompanies}</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div style={{ padding: "12px", background: "rgba(16, 185, 129, 0.1)", borderRadius: "8px", color: "var(--success)" }}>
              <Users size={24} />
            </div>
            <div>
              <div className="text-muted text-sm font-semibold">Total Participants</div>
              <div style={{ fontSize: "28px", fontWeight: "700" }}>{stats.totalParticipants}</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div style={{ padding: "12px", background: "rgba(239, 68, 68, 0.1)", borderRadius: "8px", color: "var(--danger)" }}>
              <AlertCircle size={24} />
            </div>
            <div>
              <div className="text-muted text-sm font-semibold">Pending Participants</div>
              <div style={{ fontSize: "28px", fontWeight: "700" }}>{stats.pendingParticipants}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
