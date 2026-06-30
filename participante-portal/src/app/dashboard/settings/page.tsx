"use client";

import { Settings, User, Lock, Bell, Globe } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-slate-900">Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your account preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <User size={18} className="text-gray-400" />
              <h2 className="text-lg font-heading font-semibold text-slate-800">Profile</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Full Name", placeholder: "Your Name", type: "text" },
                { label: "Email", placeholder: "you@email.com", type: "email" },
                { label: "Phone", placeholder: "+91 XXXXX XXXXX", type: "tel" },
                { label: "City", placeholder: "Ahmedabad", type: "text" },
              ].map((f, i) => (
                <div key={i} className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder}
                    className="w-full border border-gray-200 bg-gray-50 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all text-slate-800" />
                </div>
              ))}
            </div>
            <button className="mt-5 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl text-sm transition-all hover:-translate-y-0.5 shadow-md shadow-blue-100">
              Save Changes
            </button>
          </div>

          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Lock size={18} className="text-gray-400" />
              <h2 className="text-lg font-heading font-semibold text-slate-800">Change Password</h2>
            </div>
            <div className="space-y-4">
              {["Current Password", "New Password", "Confirm New Password"].map((label, i) => (
                <div key={i} className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
                  <input type="password" placeholder="••••••••"
                    className="w-full border border-gray-200 bg-gray-50 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all" />
                </div>
              ))}
              <button className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-2xl text-sm transition-all">
                Update Password
              </button>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <Bell size={18} className="text-gray-400" />
              <h2 className="text-base font-heading font-semibold text-slate-800">Notifications</h2>
            </div>
            <div className="space-y-4">
              {["Email notifications", "Announcement alerts", "Team invites"].map((item, i) => (
                <label key={i} className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-gray-600">{item}</span>
                  <div className="relative">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-blue-500 transition-colors" />
                    <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-5" />
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
