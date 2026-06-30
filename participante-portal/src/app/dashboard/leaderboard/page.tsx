"use client";

import { Trophy, Medal, Crown, Loader2, UsersRound } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/api";

interface Theme {
  name: string;
  color: string;
}

interface Team {
  _id: string;
  teamName: string;
  themeId: Theme | null;
  universityId?: { name: string };
  score?: number; // Might not exist yet
}

export default function LeaderboardPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/teams/all")
      .then(({ data }) => {
        // Sort teams by score descending (if scores exist, otherwise they stay as is)
        const sorted = (data.teams || []).sort((a: Team, b: Team) => (b.score || 0) - (a.score || 0));
        setTeams(sorted);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-slate-900">Leaderboard</h1>
        <p className="text-gray-400 text-sm mt-1">Live rankings across all participating teams.</p>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-3xl px-5 py-3 flex items-center gap-3">
        <Trophy className="text-amber-500" size={18} />
        <p className="text-sm text-amber-700 font-medium">Scoring will begin after Round 1 submissions are evaluated.</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-50 text-xs font-semibold text-gray-400 uppercase tracking-wide">
          <div className="col-span-1">Rank</div>
          <div className="col-span-4">Team</div>
          <div className="col-span-3">Theme / Track</div>
          <div className="col-span-2 text-right">Score</div>
        </div>
        
        {loading ? (
          <div className="py-12 flex justify-center"><Loader2 className="animate-spin text-amber-500" /></div>
        ) : teams.length === 0 ? (
           <div className="py-12 text-center text-gray-400 text-sm flex flex-col items-center">
             <UsersRound size={32} className="mb-3 text-gray-200" />
             No teams registered yet.
           </div>
        ) : (
          teams.map((team, i) => (
            <div key={team._id} className={`grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-gray-50 last:border-0 transition-colors hover:bg-gray-50 ${i < 3 ? "bg-gradient-to-r from-amber-50/40 to-transparent" : ""}`}>
              <div className="col-span-1">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm ${i === 0 ? "bg-amber-100 text-amber-700" : i === 1 ? "bg-gray-200 text-gray-600" : i === 2 ? "bg-orange-100 text-orange-700" : "bg-gray-50 text-gray-400"}`}>
                  {i + 1}
                </div>
              </div>
              <div className="col-span-4 flex items-center gap-2">
                <span className="font-semibold text-slate-800 text-sm">{team.teamName}</span>
                {i === 0 && <Crown size={16} className="text-amber-400" />}
                {i === 1 && <Medal size={16} className="text-slate-400" />}
                {i === 2 && <Medal size={16} className="text-orange-600" />}
              </div>
              <div className="col-span-3">
                {team.themeId ? (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-white shadow-sm" style={{ borderColor: team.themeId.color, color: team.themeId.color }}>
                    {team.themeId.name}
                  </span>
                ) : (
                  <span className="text-xs text-gray-400">None</span>
                )}
              </div>
              <div className="col-span-2 text-right">
                <span className="font-bold text-slate-800">{team.score || 0}</span>
                <span className="text-xs text-gray-400">/100</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
