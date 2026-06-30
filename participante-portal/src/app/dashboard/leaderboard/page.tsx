"use client";

import { Trophy, Medal, Crown } from "lucide-react";

const mockTeams = [
  { rank: 1, name: "AlphaCoders", university: "Nirma University", score: 94, icon: <Crown size={16} className="text-amber-400" /> },
  { rank: 2, name: "ByteBuilders", university: "GTU", score: 91, icon: <Medal size={16} className="text-slate-400" /> },
  { rank: 3, name: "InnovatorsX", university: "Ahmedabad University", score: 88, icon: <Medal size={16} className="text-amber-600" /> },
  { rank: 4, name: "CodeForward", university: "CHARUSAT", score: 85, icon: null },
  { rank: 5, name: "TechNova", university: "Parul University", score: 82, icon: null },
];

export default function LeaderboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-slate-900">Leaderboard</h1>
        <p className="text-gray-400 text-sm mt-1">Live rankings — updated after each round</p>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-3xl px-5 py-3 flex items-center gap-3">
        <Trophy className="text-amber-500" size={18} />
        <p className="text-sm text-amber-700 font-medium">Leaderboard is not yet live. Rankings shown below are sample data.</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-50 text-xs font-semibold text-gray-400 uppercase tracking-wide">
          <div className="col-span-1">Rank</div>
          <div className="col-span-5">Team</div>
          <div className="col-span-4">University</div>
          <div className="col-span-2 text-right">Score</div>
        </div>
        {mockTeams.map((team, i) => (
          <div key={i} className={`grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-gray-50 last:border-0 transition-colors hover:bg-gray-50 ${team.rank <= 3 ? "bg-gradient-to-r from-amber-50/40 to-transparent" : ""}`}>
            <div className="col-span-1">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm ${team.rank === 1 ? "bg-amber-100 text-amber-700" : team.rank === 2 ? "bg-gray-100 text-gray-600" : team.rank === 3 ? "bg-orange-100 text-orange-700" : "bg-gray-50 text-gray-400"}`}>
                {team.rank}
              </div>
            </div>
            <div className="col-span-5 flex items-center gap-2">
              <span className="font-semibold text-slate-800 text-sm">{team.name}</span>
              {team.icon}
            </div>
            <div className="col-span-4 text-sm text-gray-400">{team.university}</div>
            <div className="col-span-2 text-right">
              <span className="font-bold text-slate-800">{team.score}</span>
              <span className="text-xs text-gray-400">/100</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
