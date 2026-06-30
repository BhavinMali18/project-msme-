"use client";

import { motion } from "framer-motion";
import { Clock, Users, CheckCircle, AlertTriangle, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const stats = [
    { title: "Hackathon Status", value: "Upcoming", subtext: "Starts in 100 days", icon: <Clock className="text-secondary" />, color: "border-secondary/30 bg-secondary/5" },
    { title: "Team Members", value: "3/4", subtext: "1 pending invite", icon: <Users className="text-primary" />, color: "border-primary/30 bg-primary/5" },
    { title: "Profile Completion", value: "85%", subtext: "Upload ID pending", icon: <AlertTriangle className="text-yellow-400" />, color: "border-yellow-400/30 bg-yellow-400/5" },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-6 rounded-2xl border ${stat.color}`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-black/5 rounded-xl">{stat.icon}</div>
            </div>
            <h3 className="text-gray-600 font-medium mb-1">{stat.title}</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold">{stat.value}</span>
              <span className="text-sm text-gray-500 mb-1">{stat.subtext}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-black/5 border border-white/10 rounded-3xl p-6">
            <h2 className="text-xl font-heading font-bold mb-6">Recent Announcements</h2>
            <div className="space-y-4">
              {[
                { title: "Welcome to Code for Gujarat 2026!", date: "2 days ago", type: "General" },
                { title: "Track details have been updated.", date: "5 days ago", type: "Important" }
              ].map((announcement, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl bg-black/50 border border-white/5 hover:border-white/10 transition-colors">
                  <div className={`w-2 h-full rounded-full min-h-[40px] ${announcement.type === 'Important' ? 'bg-red-500' : 'bg-primary'}`} />
                  <div>
                    <h4 className="font-semibold">{announcement.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{announcement.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-3 text-sm text-gray-600 hover:text-slate-900 transition-colors flex items-center justify-center gap-2">
              View all announcements <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Action Panel */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 rounded-3xl p-6 relative overflow-hidden group cursor-pointer">
            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <h2 className="text-xl font-heading font-bold mb-2">Form your Team</h2>
            <p className="text-sm text-gray-700 mb-6">Create a team or join an existing one to participate.</p>
            <Link href="/dashboard/team" className="inline-block bg-white text-dark px-6 py-2 rounded-lg font-medium text-sm">
              Manage Team
            </Link>
          </div>
          
          <div className="bg-black/5 border border-white/10 rounded-3xl p-6">
            <h2 className="text-lg font-heading font-bold mb-4">Quick Links</h2>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-gray-600 hover:text-primary transition-colors flex items-center justify-between">Submission Guidelines <ChevronRight size={14} /></Link></li>
              <li><Link href="#" className="text-sm text-gray-600 hover:text-primary transition-colors flex items-center justify-between">Join Discord Server <ChevronRight size={14} /></Link></li>
              <li><Link href="#" className="text-sm text-gray-600 hover:text-primary transition-colors flex items-center justify-between">Contact Support <ChevronRight size={14} /></Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
