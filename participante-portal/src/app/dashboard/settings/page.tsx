"use client";

import { Settings, UserIcon, Lock, Bell, Mail, Phone, MapPin, Building2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-slate-900">Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your account profile and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <UserIcon size={20} className="text-blue-500" />
              </div>
              <h2 className="text-lg font-heading font-semibold text-slate-800">My Profile</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5"><UserIcon size={12}/> Full Name</label>
                <div className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm text-slate-700 font-medium">
                  {user?.name || "—"}
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5"><Mail size={12}/> Email Address</label>
                <div className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm text-slate-700 font-medium truncate">
                  {user?.email || "—"}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5"><Building2 size={12}/> University / College</label>
                <div className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm text-slate-700 font-medium truncate">
                  {user?.college || "—"}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5"><UserIcon size={12}/> Role Category</label>
                <div className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm text-slate-700 font-medium capitalize">
                  {user?.category || user?.role || "—"}
                </div>
              </div>
            </div>
            <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 mt-5 font-medium">
              Profile details are locked after registration to prevent fraud. Contact admin to update them.
            </p>
          </div>

          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm opacity-60">
            <div className="flex items-center gap-3 mb-6">
              <Lock size={18} className="text-gray-400" />
              <h2 className="text-lg font-heading font-semibold text-slate-800">Change Password (Coming Soon)</h2>
            </div>
            <div className="space-y-4 pointer-events-none">
              {["Current Password", "New Password", "Confirm New Password"].map((label, i) => (
                <div key={i} className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
                  <input type="password" placeholder="••••••••" disabled
                    className="w-full border border-gray-200 bg-gray-50 rounded-2xl px-4 py-3 text-sm text-gray-400" />
                </div>
              ))}
              <button disabled className="px-6 py-2.5 bg-gray-200 text-gray-400 font-semibold rounded-2xl text-sm">
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
