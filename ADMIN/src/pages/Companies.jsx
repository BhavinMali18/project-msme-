import { useEffect, useState } from "react";
import api from "../api";
import { CheckCircle, XCircle, Eye } from "lucide-react";

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const fetchCompanies = async () => {
    try {
      const res = await api.get("/admin/companies");
      setCompanies(res.data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/companies/${id}/status`, { status });
      fetchCompanies();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Companies Management</h1>
        <p className="page-desc">Review registered MSMEs and their assessment responses.</p>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Contact Person</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company._id}>
                <td className="font-semibold">{company.name}</td>
                <td>
                  <div>{company.contactPerson}</div>
                  <div className="text-muted text-sm">{company.phone}</div>
                </td>
                <td>{company.city}, {company.state}</td>
                <td>
                  <span className={`badge badge-${company.approvalStatus || 'pending'}`}>
                    {company.approvalStatus || 'pending'}
                  </span>
                </td>
                <td>
                  <div className="flex gap-2">
                    <button 
                      className="btn btn-outline" 
                      onClick={() => setSelectedCompany(company)}
                      title="View Answers"
                    >
                      <Eye size={16} /> View
                    </button>
                    {(company.approvalStatus === 'pending' || !company.approvalStatus) && (
                      <>
                        <button 
                          className="btn btn-success" 
                          onClick={() => updateStatus(company._id, "approved")}
                        >
                          <CheckCircle size={16} /> Approve
                        </button>
                        <button 
                          className="btn btn-danger" 
                          onClick={() => updateStatus(company._id, "rejected")}
                        >
                          <XCircle size={16} /> Reject
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {companies.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "32px", color: "var(--text-muted)" }}>
                  No companies found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {selectedCompany && (
        <div className="modal-overlay" onClick={() => setSelectedCompany(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{selectedCompany.name} - Company Details</h2>
              <button onClick={() => setSelectedCompany(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px" }}>&times;</button>
            </div>
            <div className="modal-body">
              
              <div style={{ marginBottom: "32px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "16px", paddingBottom: "8px", borderBottom: "1px solid var(--border)" }}>Registered Employees</h3>
                {selectedCompany.employees && selectedCompany.employees.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {selectedCompany.employees.map(emp => (
                      <div key={emp._id} style={{ padding: "12px", background: "var(--bg-main)", borderRadius: "8px", border: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ fontWeight: "500", fontSize: "14px" }}>{emp.name}</div>
                          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{emp.email}</div>
                        </div>
                        <span className={`badge badge-${emp.approvalStatus || 'pending'}`}>{emp.approvalStatus || 'pending'}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted">No employees registered for this company yet.</p>
                )}
              </div>

              <div>
                <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "16px", paddingBottom: "8px", borderBottom: "1px solid var(--border)" }}>Assessment Answers</h3>
                {selectedCompany.responses && selectedCompany.responses.length > 0 ? (
                  selectedCompany.responses.map((response, idx) => (
                    <div key={idx} style={{ marginBottom: "24px", padding: "16px", background: "var(--bg-main)", borderRadius: "8px", border: "1px solid var(--border)" }}>
                      <h4 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px", color: "var(--primary)" }}>Response Set #{idx + 1}</h4>
                      {Object.entries(response.answers).map(([qId, answer]) => (
                        <div key={qId} style={{ marginBottom: "12px" }}>
                          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>Question ID: {qId}</div>
                          <div style={{ fontSize: "14px", fontWeight: "500" }}>{typeof answer === 'object' ? JSON.stringify(answer) : String(answer)}</div>
                        </div>
                      ))}
                    </div>
                  ))
                ) : (
                  <p className="text-muted">No questionnaire responses submitted yet.</p>
                )}
              </div>

            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setSelectedCompany(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
