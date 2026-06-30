"use client";

import { motion } from "framer-motion";
import { Users, UserPlus, Link2, Copy, Check, Crown, LogOut, Loader2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface Theme {
  _id: string;
  name: string;
  color: string;
}

interface Member {
  _id: string;
  name: string;
  email: string;
}

interface Team {
  _id: string;
  teamName: string;
  inviteCode: string;
  themeId: Theme;
  leaderId: Member;
  memberIds: Member[];
  maxMembers: number;
}

export default function TeamPage() {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);

  // Forms state
  const [joinCode, setJoinCode] = useState("");
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState("");

  const [createName, setCreateName] = useState("");
  const [createThemeId, setCreateThemeId] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [teamsRes, themesRes] = await Promise.all([
        api.get("/teams/mine"),
        api.get("/themes")
      ]);
      setTeams(teamsRes.data.teams || []);
      setThemes(themesRes.data.themes || []);
    } catch (err) {
      console.error("Error fetching data", err);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode) return;
    setJoinLoading(true);
    setJoinError("");
    try {
      const res = await api.post("/teams/join", { inviteCode: joinCode });
      setTeams(prev => [res.data.team, ...prev]);
      setJoinCode("");
    } catch (err: any) {
      setJoinError(err.response?.data?.message || "Failed to join team.");
    } finally {
      setJoinLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createName || !createThemeId) return;
    setCreateLoading(true);
    setCreateError("");
    try {
      const res = await api.post("/teams", { teamName: createName, themeId: createThemeId });
      setTeams(prev => [res.data.team, ...prev]);
      setCreateName("");
      setCreateThemeId("");
    } catch (err: any) {
      setCreateError(err.response?.data?.message || "Failed to create team.");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleLeave = async (teamId: string) => {
    if (!confirm("Are you sure you want to leave this team?")) return;
    try {
      await api.delete(`/teams/${teamId}/leave`);
      setTeams(prev => prev.filter(t => t._id !== teamId));
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to leave team.");
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-blue-500" size={32} /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-slate-900">My Teams</h1>
        <p className="text-gray-400 text-sm mt-1">Join or create teams based on themes (Max 1 team per theme).</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: List of My Teams */}
        <div className="lg:col-span-2 space-y-6">
          {teams.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-10 text-center">
              <Users size={48} className="text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-heading font-bold text-slate-800 mb-2">You are not in any teams</h2>
              <p className="text-gray-400 text-sm max-w-md mx-auto">
                Create a new team and invite members, or ask a team leader for their invite code to join an existing team.
              </p>
            </div>
          ) : (
            teams.map((team, idx) => (
              <motion.div key={team._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                
                {/* Team Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-md"
                      style={{ background: team.themeId?.color || "#3b82f6" }}>
                      {team.teamName[0].toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-xl font-heading font-bold text-slate-800">{team.teamName}</h2>
                      <p className="text-sm font-semibold mt-1" style={{ color: team.themeId?.color || "#3b82f6" }}>
                        Theme: {team.themeId?.name || "None"}
                      </p>
                    </div>
                  </div>
                  
                  {/* Invite Code Box */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex items-center gap-3">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Invite Code</p>
                      <p className="font-mono font-bold text-slate-700 tracking-wider text-sm">{team.inviteCode}</p>
                    </div>
                    <button onClick={() => copyCode(team.inviteCode)} className="p-2 bg-white rounded-xl shadow-sm border border-slate-200 hover:border-blue-300 transition-colors text-slate-500 hover:text-blue-600">
                      {copiedCode === team.inviteCode ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>

                {/* Members List */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Members</h3>
                  <span className="text-xs font-semibold bg-slate-100 text-slate-500 px-3 py-1 rounded-full">
                    {team.memberIds.length} / {team.maxMembers || 4}
                  </span>
                </div>
                
                <div className="space-y-3">
                  {team.memberIds.map((m, i) => (
                    <div key={m._id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm shadow-sm">
                          {m.name[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">
                            {m.name} {m._id === user?._id ? <span className="text-xs text-slate-400 font-normal ml-1">(You)</span> : ""}
                          </p>
                          <p className="text-xs text-slate-500">{m.email}</p>
                        </div>
                      </div>
                      {team.leaderId._id === m._id ? (
                        <span className="flex items-center gap-1 text-xs font-semibold bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full">
                          <Crown size={14} /> Leader
                        </span>
                      ) : (
                        <span className="text-xs font-semibold bg-white border border-slate-200 text-slate-500 px-3 py-1.5 rounded-full">
                          Member
                        </span>
                      )}
                    </div>
                  ))}
                  
                  {/* Empty Slots */}
                  {Array.from({ length: Math.max(0, (team.maxMembers || 4) - team.memberIds.length) }).map((_, i) => (
                    <div key={`empty-${i}`} className="flex items-center gap-4 p-3 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400">
                      <div className="w-10 h-10 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center bg-slate-50">
                        <UserPlus size={16} />
                      </div>
                      <p className="text-sm font-medium">Waiting for member...</p>
                    </div>
                  ))}
                </div>

                {/* Footer Actions */}
                <div className="mt-6 pt-6 border-t border-gray-50 flex justify-end">
                  <button onClick={() => handleLeave(team._id)} className="flex items-center gap-2 text-sm font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-xl transition-colors">
                    <LogOut size={16} /> {team.leaderId._id === user?._id && team.memberIds.length === 1 ? "Disband Team" : "Leave Team"}
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Right Column: Actions */}
        <div className="space-y-6">
          
          {/* Join Team */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
            <h3 className="font-heading font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Link2 size={18} className="text-blue-500" /> Join Existing Team
            </h3>
            {joinError && <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-xl flex items-start gap-2"><AlertCircle size={14} className="mt-0.5 flex-shrink-0" />{joinError}</div>}
            <form onSubmit={handleJoin} className="space-y-3">
              <input type="text" placeholder="Enter 8-character invite code" value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())} maxLength={8}
                className="w-full border border-gray-200 bg-gray-50 rounded-2xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all uppercase placeholder:normal-case" />
              <button type="submit" disabled={joinLoading || !joinCode} className="w-full bg-slate-900 text-white font-semibold py-3 rounded-2xl hover:bg-slate-800 transition-colors text-sm disabled:opacity-70 flex items-center justify-center gap-2">
                {joinLoading ? <Loader2 size={16} className="animate-spin" /> : "Join Team"}
              </button>
            </form>
          </div>

          {/* Create Team */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-6 shadow-md text-white">
            <h3 className="font-heading font-bold text-xl mb-4 flex items-center gap-2">
              <Users size={20} className="text-blue-200" /> Create New Team
            </h3>
            {createError && <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 text-white text-xs rounded-xl flex items-start gap-2"><AlertCircle size={14} className="mt-0.5 flex-shrink-0" />{createError}</div>}
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-blue-200 uppercase tracking-wider mb-1.5 block">Theme / Track</label>
                <select value={createThemeId} onChange={(e) => setCreateThemeId(e.target.value)} 
                  className="w-full border border-white/20 bg-black/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-white/50 focus:bg-black/20 transition-all text-white [&>option]:text-slate-800">
                  <option value="">Select a Theme</option>
                  {themes.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-blue-200 uppercase tracking-wider mb-1.5 block">Team Name</label>
                <input type="text" placeholder="e.g. Code Ninjas" value={createName} onChange={(e) => setCreateName(e.target.value)}
                  className="w-full border border-white/20 bg-black/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-white/50 focus:bg-black/20 transition-all text-white placeholder-blue-300" />
              </div>
              <button type="submit" disabled={createLoading || !createName || !createThemeId} className="w-full bg-white text-blue-700 font-bold py-3.5 rounded-2xl hover:bg-blue-50 transition-colors text-sm disabled:opacity-90 shadow-lg flex items-center justify-center gap-2">
                {createLoading ? <Loader2 size={16} className="animate-spin" /> : "Create Team"}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
