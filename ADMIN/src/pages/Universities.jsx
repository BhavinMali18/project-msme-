import { useEffect, useState } from "react";
import api from "../api";
import { CheckCircle, XCircle, Clock, Building2, GraduationCap, Users, Eye, ChevronDown } from "lucide-react";

export default function Universities() {
  const [universities, setUniversities] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchUniversities = async () => {
    try {
      const res = await api.get("/universities/admin/all");
      setUniversities(res.data);
    } catch (err) {
      console.error("Error fetching universities:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUniversities(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/universities/${id}/status`, { status });
      setUniversities(prev => prev.map(u => u._id === id ? { ...u, approvalStatus: status } : u));
      if (selected?._id === id) setSelected(prev => ({ ...prev, approvalStatus: status }));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const filtered = universities.filter(u =>
    statusFilter === "all" ? true : u.approvalStatus === statusFilter
  );

  const statusBadge = (status) => {
    const map = {
      approved: "bg-green-50 text-green-700 border-green-100",
      pending: "bg-amber-50 text-amber-700 border-amber-100",
      rejected: "bg-red-50 text-red-700 border-red-100"
    };
    const icons = {
      approved: <CheckCircle size={12} />,
      pending: <Clock size={12} />,
      rejected: <XCircle size={12} />
    };
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${map[status] || "bg-gray-50 text-gray-500 border-gray-100"}`}>
        {icons[status]} {status}
      </span>
    );
  };

  return (
    <div style={{ padding: "32px", fontFamily: "var(--font-sans)" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#0f172a", marginBottom: "4px" }}>Universities</h1>
          <p style={{ color: "#94a3b8", fontSize: "0.875rem" }}>Manage university registrations and approvals</p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {["all", "pending", "approved", "rejected"].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              style={{
                padding: "6px 16px", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 600,
                border: statusFilter === s ? "1.5px solid #7c3aed" : "1.5px solid #e5e7eb",
                background: statusFilter === s ? "#7c3aed" : "white",
                color: statusFilter === s ? "white" : "#6b7280",
                cursor: "pointer", transition: "all 0.2s"
              }}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
        {[
          { label: "Total", value: universities.length, color: "#7c3aed", bg: "#f5f3ff" },
          { label: "Pending", value: universities.filter(u => u.approvalStatus === "pending").length, color: "#d97706", bg: "#fffbeb" },
          { label: "Approved", value: universities.filter(u => u.approvalStatus === "approved").length, color: "#059669", bg: "#ecfdf5" },
          { label: "Rejected", value: universities.filter(u => u.approvalStatus === "rejected").length, color: "#dc2626", bg: "#fef2f2" },
        ].map(stat => (
          <div key={stat.label} style={{ background: "white", border: "1px solid #f1f5f9", borderRadius: "20px", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 600, marginTop: "2px" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 380px" : "1fr", gap: "20px" }}>
        {/* Table */}
        <div style={{ background: "white", border: "1px solid #f1f5f9", borderRadius: "24px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          {loading ? (
            <div style={{ padding: "60px", textAlign: "center", color: "#cbd5e1", fontSize: "0.875rem" }}>Loading...</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: "60px", textAlign: "center", color: "#cbd5e1", fontSize: "0.875rem" }}>No universities found</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #f8fafc" }}>
                  {["University", "City", "Contact", "Students", "Status", "Actions"].map(h => (
                    <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: "0.7rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((uni, i) => (
                  <tr key={uni._id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid #f8fafc" : "none", transition: "background 0.1s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                    onMouseLeave={e => e.currentTarget.style.background = "white"}>
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "36px", height: "36px", background: "#f5f3ff", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Building2 size={18} color="#7c3aed" />
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, color: "#0f172a", fontSize: "0.875rem" }}>{uni.name}</p>
                          {uni.isKnownUniversity && <span style={{ fontSize: "0.65rem", color: "#059669", fontWeight: 600, background: "#ecfdf5", padding: "1px 6px", borderRadius: "6px" }}>✓ Known University</span>}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "16px 20px", color: "#64748b", fontSize: "0.875rem" }}>{uni.city}</td>
                    <td style={{ padding: "16px 20px", color: "#64748b", fontSize: "0.8rem" }}>{uni.contactEmail}</td>
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.75rem", color: "#64748b" }}>
                          <GraduationCap size={13} /> {uni.totalStudents}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.75rem", color: "#64748b" }}>
                          <Users size={13} /> {uni.totalMentors}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "16px 20px" }}>{statusBadge(uni.approvalStatus)}</td>
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button onClick={() => setSelected(selected?._id === uni._id ? null : uni)}
                          style={{ padding: "6px 10px", borderRadius: "10px", border: "1px solid #e5e7eb", background: "white", cursor: "pointer", color: "#7c3aed", display: "flex", alignItems: "center", gap: "4px", fontSize: "0.75rem", fontWeight: 600 }}>
                          <Eye size={13} /> View
                        </button>
                        {uni.approvalStatus === "pending" && (
                          <>
                            <button onClick={() => updateStatus(uni._id, "approved")}
                              style={{ padding: "6px 10px", borderRadius: "10px", border: "none", background: "#ecfdf5", cursor: "pointer", color: "#059669", fontSize: "0.75rem", fontWeight: 600 }}>
                              Approve
                            </button>
                            <button onClick={() => updateStatus(uni._id, "rejected")}
                              style={{ padding: "6px 10px", borderRadius: "10px", border: "none", background: "#fef2f2", cursor: "pointer", color: "#dc2626", fontSize: "0.75rem", fontWeight: 600 }}>
                              Reject
                            </button>
                          </>
                        )}
                        {uni.approvalStatus === "approved" && (
                          <button onClick={() => updateStatus(uni._id, "rejected")}
                            style={{ padding: "6px 10px", borderRadius: "10px", border: "none", background: "#fef2f2", cursor: "pointer", color: "#dc2626", fontSize: "0.75rem", fontWeight: 600 }}>
                            Revoke
                          </button>
                        )}
                        {uni.approvalStatus === "rejected" && (
                          <button onClick={() => updateStatus(uni._id, "approved")}
                            style={{ padding: "6px 10px", borderRadius: "10px", border: "none", background: "#ecfdf5", cursor: "pointer", color: "#059669", fontSize: "0.75rem", fontWeight: 600 }}>
                            Re-approve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Detail Panel */}
        {selected && (
          <div style={{ background: "white", border: "1px solid #f1f5f9", borderRadius: "24px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", height: "fit-content" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
              <div>
                <h2 style={{ fontWeight: 700, color: "#0f172a", fontSize: "1.125rem", marginBottom: "4px" }}>{selected.name}</h2>
                {statusBadge(selected.approvalStatus)}
              </div>
              <button onClick={() => setSelected(null)} style={{ padding: "4px", background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
                <XCircle size={20} />
              </button>
            </div>

            <div style={{ display: "grid", gap: "12px" }}>
              {[
                { label: "City", value: selected.city },
                { label: "State", value: selected.state },
                { label: "Contact Email", value: selected.contactEmail },
                { label: "Phone", value: selected.contactPhone || "—" },
                { label: "Website", value: selected.websiteUrl || "—" },
                { label: "Admin", value: selected.adminUserId?.name || "—" },
                { label: "Registered", value: new Date(selected.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) },
                { label: "Known University", value: selected.isKnownUniversity ? "✓ Yes" : "No (review needed)" },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", paddingBottom: "10px", borderBottom: "1px solid #f8fafc" }}>
                  <span style={{ color: "#94a3b8", fontWeight: 500 }}>{label}</span>
                  <span style={{ color: "#334155", fontWeight: 600, textAlign: "right", maxWidth: "60%" }}>{value}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginTop: "20px" }}>
              {[
                { label: "Students", value: selected.totalStudents, icon: <GraduationCap size={16} />, color: "#2563eb" },
                { label: "Teams", value: selected.totalTeams, icon: <Users size={16} />, color: "#7c3aed" },
                { label: "Mentors", value: selected.totalMentors, icon: <Users size={16} />, color: "#059669" },
              ].map(s => (
                <div key={s.label} style={{ textAlign: "center", padding: "14px", background: "#fafafa", borderRadius: "16px" }}>
                  <div style={{ color: s.color, display: "flex", justifyContent: "center", marginBottom: "6px" }}>{s.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: "1.25rem", color: "#0f172a" }}>{s.value}</div>
                  <div style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: 600 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
