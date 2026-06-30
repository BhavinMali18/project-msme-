"use client";

import { Upload, FileCode2, Clock, CheckCircle } from "lucide-react";

export default function SubmissionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-slate-900">Submissions</h1>
        <p className="text-gray-400 text-sm mt-1">Upload and manage your project submissions</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm text-center">
        <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-5">
          <FileCode2 className="text-blue-500" size={28} />
        </div>
        <h2 className="text-xl font-heading font-bold text-slate-900 mb-2">No submissions yet</h2>
        <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">Submissions will open once the hackathon begins. Prepare your project in the meantime!</p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-100 rounded-full text-amber-700 text-xs font-semibold">
          <Clock size={14} /> Submissions not yet open
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Round 1", deadline: "TBA", status: "Upcoming", color: "border-gray-100" },
          { label: "Round 2", deadline: "TBA", status: "Upcoming", color: "border-gray-100" },
          { label: "Finals", deadline: "TBA", status: "Upcoming", color: "border-gray-100" },
        ].map((round, i) => (
          <div key={i} className={`bg-white border ${round.color} rounded-3xl p-5 shadow-sm`}>
            <h3 className="font-heading font-semibold text-slate-800 mb-1">{round.label}</h3>
            <p className="text-xs text-gray-400 mb-3">Deadline: {round.deadline}</p>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-50 text-gray-400 border border-gray-100">{round.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
