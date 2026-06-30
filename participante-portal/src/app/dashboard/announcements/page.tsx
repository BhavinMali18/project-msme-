"use client";

import { Megaphone } from "lucide-react";

const announcements = [
  {
    id: 1, type: "Important", title: "Welcome to Code for Gujarat 2026!",
    body: "We're excited to have you join the biggest student hackathon in Gujarat. Please complete your profile and form your team before the deadline.",
    date: "2 days ago"
  },
  {
    id: 2, type: "General", title: "Track details have been updated",
    body: "Check out the 6 exciting tracks for this year — from AI/ML to Sustainability. Visit the Tracks page for full details.",
    date: "5 days ago"
  },
  {
    id: 3, type: "General", title: "Mentorship sessions scheduled",
    body: "Mentor office hours will begin once teams are finalized. Check back here for session details.",
    date: "1 week ago"
  },
];

const typeColors: Record<string, string> = {
  Important: "bg-red-500",
  General: "bg-blue-500",
};

export default function AnnouncementsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-slate-900">Announcements</h1>
        <p className="text-gray-400 text-sm mt-1">Stay updated with the latest hackathon news</p>
      </div>

      <div className="space-y-4">
        {announcements.map((a) => (
          <div key={a.id} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex gap-5">
            <div className={`w-1 rounded-full flex-shrink-0 ${typeColors[a.type] || "bg-gray-300"}`} />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${a.type === "Important" ? "bg-red-50 text-red-600 border border-red-100" : "bg-blue-50 text-blue-600 border border-blue-100"}`}>
                  {a.type}
                </span>
                <span className="text-xs text-gray-400">{a.date}</span>
              </div>
              <h3 className="font-heading font-semibold text-slate-800 mb-2">{a.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{a.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
