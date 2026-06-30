"use client";

import { motion } from "framer-motion";
import { Users, UserPlus, CheckCircle, Clock } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { title: "Total Participants", value: "3,450", change: "+12%", icon: <Users className="text-blue-400" /> },
    { title: "Teams Formed", value: "850", change: "+5%", icon: <UserPlus className="text-green-400" /> },
    { title: "Pending Approvals", value: "45", change: "-10%", icon: <Clock className="text-yellow-400" /> },
    { title: "Submissions", value: "0", change: "0%", icon: <CheckCircle className="text-purple-400" /> },
  ];

  return (
    <div className="space-y-8">
      <header className="mb-8">
        <h1 className="text-2xl font-heading font-bold">Analytics Dashboard</h1>
        <p className="text-gray-600">Overview of Code for Gujarat 2026 Hackathon</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl bg-black/5 border border-white/10"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-black/5 rounded-xl">{stat.icon}</div>
              <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-400' : stat.change.startsWith('-') ? 'text-red-400' : 'text-gray-600'}`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
            <span className="text-3xl font-bold">{stat.value}</span>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="bg-black/5 border border-white/10 rounded-3xl p-6 h-96 flex items-center justify-center">
          <p className="text-gray-500">Registration Timeline Chart Area</p>
        </div>
        <div className="bg-black/5 border border-white/10 rounded-3xl p-6 h-96 flex items-center justify-center">
          <p className="text-gray-500">Track Demographics Chart Area</p>
        </div>
      </div>
    </div>
  );
}
