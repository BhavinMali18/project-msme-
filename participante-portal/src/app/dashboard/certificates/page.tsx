"use client";

import { Award, Download, Lock } from "lucide-react";

export default function CertificatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-slate-900">Certificates</h1>
        <p className="text-gray-400 text-sm mt-1">Download your participation and achievement certificates</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm text-center">
        <div className="w-16 h-16 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-5">
          <Award className="text-indigo-500" size={28} />
        </div>
        <h2 className="text-xl font-heading font-bold text-slate-900 mb-2">Certificates not yet available</h2>
        <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">
          Certificates will be issued after the hackathon concludes. Complete your participation to be eligible.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-full text-gray-400 text-xs font-semibold">
          <Lock size={14} /> Locked until event completion
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {["Participation Certificate", "Achievement Certificate"].map((cert, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex items-center justify-between gap-4 opacity-50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                <Award className="text-indigo-400" size={22} />
              </div>
              <div>
                <p className="font-semibold text-slate-800 text-sm">{cert}</p>
                <p className="text-xs text-gray-400">Not yet issued</p>
              </div>
            </div>
            <button disabled className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-400 text-xs font-semibold rounded-2xl cursor-not-allowed">
              <Download size={14} /> Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
