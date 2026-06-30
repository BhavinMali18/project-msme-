"use client";

import { useState, useEffect } from "react";
import { UsersRound, UserCheck, ChevronDown, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";

interface Member { _id: string; name: string; email: string; studentId?: string; }
interface Mentor { _id: string; name: string; email: string; employeeId?: string; }
interface Team {
  _id: string;
  teamName: string;
  approvalStatus: string;
  leaderId: { name: string; email: string } | null;
  memberIds: Member[];
  mentorId: Mentor | null;
}

export default function UniversityTeamsPage() {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user?.universityId) {
      Promise.all([
        api.get(`/universities/${user.universityId}/teams`),
        api.get(`/universities/${user.universityId}/mentors`)
      ]).then(([t, m]) => {
        setTeams(t.data);
        setMentors(m.data);
      }).finally(() => setLoading(false));
    }
  }, [user]);

  const assignMentor = async (teamId: string, mentorId: string) => {
    setAssigning(teamId);
    try {
      const { data } = await api.put(`/universities/${user?.universityId}/teams/${teamId}/assign-mentor`, { mentorId });
      setTeams(prev => prev.map(t => t._id === teamId ? { ...t, mentorId: data.team.mentorId } : t));
      setSuccessMsg(`Mentor assigned successfully!`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (e) {
      alert("Failed to assign mentor.");
    } finally {
      setAssigning(null);
      setDropdownOpen(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-slate-900">Teams</h1>
        <p className="text-gray-400 text-sm mt-1">View teams and assign mentors</p>
      </div>

      {successMsg && (
        <div className="flex items-center gap-3 px-5 py-3 bg-green-50 border border-green-100 rounded-2xl text-green-700 text-sm font-medium">
          <Check size={16} /> {successMsg}
        </div>
      )}

      {loading ? (
        <div className="text-center py-16 text-gray-300 text-sm">Loading teams...</div>
      ) : teams.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-100 rounded-3xl">
          <UsersRound size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 text-sm font-medium">No teams yet</p>
          <p className="text-gray-300 text-xs mt-1">Teams will appear here once students from your university form them.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {teams.map(team => (
            <div key={team._id} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center">
                      <UsersRound className="text-violet-500" size={20} />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-slate-800">{team.teamName}</h3>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        team.approvalStatus === "approved" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                      }`}>{team.approvalStatus}</span>
                    </div>
                  </div>

                  {/* Members */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {[team.leaderId, ...team.memberIds].filter(Boolean).map((m, i) => (
                      <span key={i} className="text-xs bg-gray-50 border border-gray-100 text-gray-600 px-3 py-1 rounded-full">
                        {(m as Member)?.name || (m as { name: string })?.name}
                        {i === 0 && <span className="ml-1 text-violet-500 font-semibold">(Leader)</span>}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Mentor Assignment */}
                <div className="flex-shrink-0 relative">
                  {team.mentorId ? (
                    <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-2">
                      <UserCheck className="text-emerald-600" size={16} />
                      <div>
                        <p className="text-xs font-semibold text-emerald-800">{team.mentorId.name}</p>
                        <p className="text-xs text-emerald-500">{team.mentorId.employeeId}</p>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDropdownOpen(dropdownOpen === team._id ? null : team._id)}
                      className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold px-4 py-2.5 rounded-2xl transition-colors"
                    >
                      Assign Mentor <ChevronDown size={14} />
                    </button>
                  )}

                  {dropdownOpen === team._id && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl z-10 overflow-hidden">
                      {mentors.length === 0 ? (
                        <div className="p-4 text-xs text-gray-400 text-center">No mentors available. Add mentors first.</div>
                      ) : mentors.map(mentor => (
                        <button
                          key={mentor._id}
                          disabled={assigning === team._id}
                          onClick={() => assignMentor(team._id, mentor._id)}
                          className="w-full text-left px-4 py-3 hover:bg-violet-50 transition-colors border-b border-gray-50 last:border-0"
                        >
                          <p className="text-sm font-semibold text-slate-700">{mentor.name}</p>
                          <p className="text-xs text-gray-400">ID: {mentor.employeeId || mentor.email}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
