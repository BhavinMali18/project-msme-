import { useEffect, useState } from "react";
import api from "../api";
import { CheckCircle, XCircle, FileText, Code, Video } from "lucide-react";

export default function Participants() {
  const [participants, setParticipants] = useState([]);
  const [selectedParticipant, setSelectedParticipant] = useState(null);

  const fetchParticipants = async () => {
    try {
      const res = await api.get("/admin/participants");
      setParticipants(res.data);
    } catch (error) {
      console.error("Error fetching participants:", error);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/participants/${id}/status`, { status });
      fetchParticipants();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Hackathon Participants</h1>
        <p className="page-desc">Review participant profiles, project details, and submissions.</p>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name & Contact</th>
              <th>Category</th>
              <th>Institution / Startup</th>
              <th>Project Title</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((p) => (
              <tr key={p._id}>
                <td>
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-muted text-sm">{p.email}</div>
                </td>
                <td>
                  <span className={`badge badge-${p.category || 'neutral'}`}>
                    {p.category ? p.category.replace('_', ' ') : 'N/A'}
                  </span>
                </td>
                <td>{p.institutionName || p.teamName || p.companyName || 'N/A'}</td>
                <td style={{ maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {p.projectTitle || 'N/A'}
                </td>
                <td>
                  <span className={`badge badge-${p.approvalStatus || 'pending'}`}>
                    {p.approvalStatus || 'pending'}
                  </span>
                </td>
                <td>
                  <div className="flex gap-2">
                    <button 
                      className="btn btn-outline" 
                      onClick={() => setSelectedParticipant(p)}
                      title="View Details"
                    >
                      <FileText size={16} /> Details
                    </button>
                    {(p.approvalStatus === 'pending' || !p.approvalStatus) && (
                      <>
                        <button 
                          className="btn btn-success" 
                          onClick={() => updateStatus(p._id, "approved")}
                        >
                          <CheckCircle size={16} />
                        </button>
                        <button 
                          className="btn btn-danger" 
                          onClick={() => updateStatus(p._id, "rejected")}
                        >
                          <XCircle size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {participants.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "32px", color: "var(--text-muted)" }}>
                  No participants found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {selectedParticipant && (
        <div className="modal-overlay" onClick={() => setSelectedParticipant(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Participant Details</h2>
              <button onClick={() => setSelectedParticipant(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px" }}>&times;</button>
            </div>
            <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <div className="text-muted text-sm">Full Name</div>
                  <div className="font-semibold">{selectedParticipant.name}</div>
                </div>
                <div>
                  <div className="text-muted text-sm">Email</div>
                  <div>{selectedParticipant.email}</div>
                </div>
                <div>
                  <div className="text-muted text-sm">Phone</div>
                  <div>{selectedParticipant.phone || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-muted text-sm">Category</div>
                  <div className="capitalize">{selectedParticipant.category?.replace('_', ' ') || 'N/A'}</div>
                </div>
              </div>

              <hr style={{ border: "none", borderTop: "1px solid var(--border)" }} />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <div className="text-muted text-sm">Institution / Org</div>
                  <div className="font-semibold">{selectedParticipant.institutionName || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-muted text-sm">Team Name</div>
                  <div>{selectedParticipant.teamName || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-muted text-sm">Team Size</div>
                  <div>{selectedParticipant.teamSize || '1'}</div>
                </div>
                {selectedParticipant.stage && (
                  <div>
                    <div className="text-muted text-sm">Startup Stage</div>
                    <div>{selectedParticipant.stage}</div>
                  </div>
                )}
              </div>

              <hr style={{ border: "none", borderTop: "1px solid var(--border)" }} />

              <div>
                <div className="text-muted text-sm mb-1">Project Title</div>
                <div className="font-semibold" style={{ fontSize: "18px", marginBottom: "8px" }}>{selectedParticipant.projectTitle || 'N/A'}</div>
                <div className="text-muted text-sm mb-1">Project Description</div>
                <p style={{ lineHeight: "1.6", background: "#F9FAFB", padding: "12px", borderRadius: "6px", border: "1px solid var(--border)" }}>
                  {selectedParticipant.projectDescription || 'No description provided.'}
                </p>
              </div>

              {/* Links */}
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                {selectedParticipant.githubUrl && (
                  <a href={selectedParticipant.githubUrl} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ textDecoration: "none" }}>
                    <Code size={16} /> View GitHub Repo
                  </a>
                )}
                {selectedParticipant.demoVideoUrl && (
                  <a href={selectedParticipant.demoVideoUrl} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ textDecoration: "none" }}>
                    <Video size={16} /> View Demo Video
                  </a>
                )}
                {selectedParticipant.pitchDeckUrl && (
                  <a href={selectedParticipant.pitchDeckUrl} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ textDecoration: "none" }}>
                    <FileText size={16} /> View Pitch Deck
                  </a>
                )}
              </div>

            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setSelectedParticipant(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
