"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, UsersRound, GraduationCap, LogOut, Building2
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { name: "Overview", href: "/university", icon: <LayoutDashboard size={20} /> },
  { name: "Students", href: "/university/students", icon: <GraduationCap size={20} /> },
  { name: "Teams", href: "/university/teams", icon: <UsersRound size={20} /> },
  { name: "Mentors", href: "/university/mentors", icon: <Users size={20} /> },
];

export default function UniversityLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 hidden md:flex flex-col shadow-sm">
        <div className="p-6 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-500 to-purple-600 flex items-center justify-center shadow-md shadow-violet-100">
              <Building2 size={20} className="text-white" />
            </div>
            <div>
              <p className="font-heading font-bold text-slate-800 text-sm leading-tight">University Portal</p>
              <p className="text-xs text-gray-400">CFG 2026</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-5 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all text-sm font-medium ${
                  isActive
                    ? "bg-violet-50 text-violet-700 border border-violet-100"
                    : "text-gray-500 hover:text-slate-700 hover:bg-gray-50"
                }`}
              >
                <span className={isActive ? "text-violet-600" : "text-gray-400"}>{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-50">
          <div className="flex items-center gap-3 px-3 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-700 truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-2xl w-full text-left text-red-400 hover:text-red-600 hover:bg-red-50 transition-all text-sm font-medium"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-10 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
