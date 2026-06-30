"use client";

import { motion } from "framer-motion";
import { UsersRound, FileCode2, ChevronRight, Bell, GraduationCap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";

interface MyTeam {
  _id: string;
  teamName: string;
  inviteCode: string;
  memberIds: { name: string }[];
  themeId: { name: string; color: string } | null;
  approvalStatus: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [teams, setTeams] = useState<MyTeam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/teams/mine")
      .then(({ data }) => setTeams(data.teams || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    {
      title: "My Teams",
      value: loading ? "..." : teams.length.toString(),
      subtext: teams.length === 0 ? "Create or join a team" : `Across ${teams.length} theme${teams.length !== 1 ? "s" : ""}`,
      icon: <UsersRound className="text-blue-600" size={20} />,
      color: "border-blue-100 bg-blue-50/40",
      href: "/dashboard/team",
    },
    {
      title: "Submissions",
      value: "0",
      subtext: "Not yet open",
      icon: <FileCode2 className="text-violet-600" size={20} />,
      color: "border-violet-100 bg-violet-50/40",
      href: "/dashboard/submissions",
    },
    {
      title: "University",
      value: user?.college ? "Enrolled" : "Not linked",
      subtext: user?.college || "Register via your university",
      icon: <GraduationCap className="text-emerald-600" size={20} />,
      color: "border-emerald-100 bg-emerald-50/40",
      href: "#",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-slate-900">
          Welcome back, {user?.name?.split(" ")[0] || "Participant"} 👋
        </h1>
        <p className="text-gray-400 text-sm mt-1">Here&apos;s what&apos;s happening with your hackathon journey.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {stats.map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Link href={stat.href} className={`block p-5 rounded-3xl border ${stat.color} hover:shadow-md hover:-translate-y-0.5 transition-all group`}>
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-white rounded-2xl shadow-sm border border-white">{stat.icon}</div>
              </div>
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-1">{stat.title}</p>
              <p className="text-3xl font-bold text-slate-900 mb-0.5">{stat.value}</p>
              <p className="text-xs text-gray-400">{stat.subtext}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Teams Quick View */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-heading font-semibold text-slate-800">My Teams</h2>
              <Link href="/dashboard/team" className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
                Manage <ChevronRight size={14} />
              </Link>
            </div>
            {loading ? (
              <div className="text-center py-8 text-gray-300 text-sm">Loading...</div>
            ) : teams.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-2xl">
                <UsersRound size={32} className="text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 text-sm font-medium">No teams yet</p>
                <p className="text-gray-300 text-xs mt-1">Create a team or join one with an invite code</p>
                <Link href="/dashboard/team" className="inline-block mt-4 px-5 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition-colors">
                  Go to Teams
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {teams.slice(0, 3).map(team => (
                  <div key={team._id} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                        style={{ background: team.themeId?.color || "#6366f1" }}>
                        {team.teamName[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{team.teamName}</p>
                        <p className="text-xs text-gray-400">{team.themeId?.name || "No theme"} · {team.memberIds.length} member{team.memberIds.length !== 1 ? "s" : ""}</p>
                      </div>
                    </div>
                    <span className="font-mono text-xs bg-white border border-gray-100 px-2.5 py-1 rounded-lg text-gray-500">{team.inviteCode}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <Link href="/dashboard/team" className="block bg-gradient-to-br from-blue-600 to-indigo-500 rounded-3xl p-6 text-white hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 transition-all group">
            <UsersRound size={24} className="mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-heading font-bold text-lg mb-1">Team Management</h3>
            <p className="text-blue-100 text-sm">Create teams per theme or join with an invite code.</p>
          </Link>

          <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
            <h3 className="font-heading font-semibold text-slate-800 mb-3 text-sm">Quick Links</h3>
            <ul className="space-y-2.5">
              <li><Link href="/dashboard/leaderboard" className="text-sm text-gray-500 hover:text-blue-600 transition-colors flex items-center justify-between group">Live Leaderboard <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" /></Link></li>
              <li><Link href="/dashboard/submissions" className="text-sm text-gray-500 hover:text-blue-600 transition-colors flex items-center justify-between group">Submissions <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" /></Link></li>
              <li><Link href="/dashboard/announcements" className="text-sm text-gray-500 hover:text-blue-600 transition-colors flex items-center justify-between group">Announcements <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" /></Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
