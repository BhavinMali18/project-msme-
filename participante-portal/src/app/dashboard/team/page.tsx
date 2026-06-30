"use client";

import { motion } from "framer-motion";
import { Users, UserPlus, Link2, Copy, Check, Crown } from "lucide-react";
import { useState } from "react";

export default function TeamPage() {
  const [copied, setCopied] = useState(false);
  const inviteCode = "CFG-2026-TEAM";

  const copyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const members = [
    { name: "You", email: "your@email.com", role: "Leader", initials: "Y" },
    { name: "Rahul Shah", email: "rahul@example.com", role: "Member", initials: "R" },
    { name: "Priya Patel", email: "priya@example.com", role: "Member", initials: "P" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-slate-900">My Team</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your hackathon team</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Card */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-heading font-semibold text-slate-800">Team Members</h2>
              <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">{members.length}/4 members</span>
            </div>
            <div className="space-y-3">
              {members.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                    {m.initials}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-slate-800 text-sm">{m.name}</p>
                      {m.role === "Leader" && <Crown size={13} className="text-amber-400" />}
                    </div>
                    <p className="text-xs text-gray-400">{m.email}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${m.role === "Leader" ? "bg-amber-50 text-amber-700 border border-amber-100" : "bg-gray-100 text-gray-500"}`}>
                    {m.role}
                  </span>
                </motion.div>
              ))}

              {/* Empty slot */}
              <div className="flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed border-gray-200 text-gray-300">
                <div className="w-10 h-10 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center">
                  <UserPlus size={18} className="text-gray-300" />
                </div>
                <p className="text-sm text-gray-300">Open slot — invite a teammate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Invite Panel */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-500 rounded-3xl p-6 text-white">
            <Link2 size={24} className="mb-4 opacity-80" />
            <h3 className="font-heading font-bold text-lg mb-2">Invite Teammates</h3>
            <p className="text-blue-100 text-sm mb-5">Share this code to invite members to your team.</p>
            <div className="bg-white/20 backdrop-blur rounded-2xl px-4 py-3 flex items-center justify-between gap-3">
              <span className="font-mono text-sm font-bold tracking-wider">{inviteCode}</span>
              <button onClick={copyCode} className="bg-white/20 hover:bg-white/30 p-2 rounded-xl transition-colors">
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
            <h3 className="font-heading font-semibold text-slate-800 mb-4">Join a Team</h3>
            <div className="space-y-3">
              <input type="text" placeholder="Enter invite code" className="w-full border border-gray-200 bg-gray-50 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all" />
              <button className="w-full bg-slate-900 text-white font-semibold py-3 rounded-2xl hover:bg-slate-800 transition-colors text-sm">
                Join Team
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
