"use client";

import { Bell, CheckCheck } from "lucide-react";

const notifications = [
  { title: "Registration successful!", body: "Your account has been created. Welcome to CFG 2026!", time: "Just now", read: false },
  { title: "Team invite received", body: "You have a pending team invitation.", time: "1 hour ago", read: false },
  { title: "New announcement", body: "Track details have been published. Check announcements.", time: "5 days ago", read: true },
];

export default function NotificationsPage() {
  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-slate-900">Notifications</h1>
          <p className="text-gray-400 text-sm mt-1">{unread} unread notification{unread !== 1 ? "s" : ""}</p>
        </div>
        <button className="flex items-center gap-2 text-xs text-gray-400 hover:text-slate-700 transition-colors font-medium">
          <CheckCheck size={15} /> Mark all read
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center shadow-sm">
          <Bell size={36} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 text-sm font-medium">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n, i) => (
            <div key={i} className={`bg-white border rounded-3xl p-5 shadow-sm flex items-start gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer ${!n.read ? "border-blue-100 bg-blue-50/30" : "border-gray-100"}`}>
              <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${!n.read ? "bg-blue-500" : "bg-gray-200"}`} />
              <div className="flex-1">
                <p className="font-semibold text-slate-800 text-sm">{n.title}</p>
                <p className="text-sm text-gray-400 mt-0.5">{n.body}</p>
              </div>
              <span className="text-xs text-gray-300 flex-shrink-0 mt-0.5">{n.time}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
