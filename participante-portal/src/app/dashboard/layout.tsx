"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  FileCode2, 
  Award, 
  Bell, 
  Trophy, 
  Megaphone, 
  Settings,
  LogOut
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "My Team", href: "/dashboard/team", icon: <Users size={20} /> },
    { name: "Submissions", href: "/dashboard/submissions", icon: <FileCode2 size={20} /> },
    { name: "Leaderboard", href: "/dashboard/leaderboard", icon: <Trophy size={20} /> },
    { name: "Certificates", href: "/dashboard/certificates", icon: <Award size={20} /> },
    { name: "Announcements", href: "/dashboard/announcements", icon: <Megaphone size={20} /> },
    { name: "Notifications", href: "/dashboard/notifications", icon: <Bell size={20} /> },
    { name: "Settings", href: "/dashboard/settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-dark flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-dark/50 backdrop-blur-md hidden md:flex flex-col">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center font-heading font-bold text-lg">
              C
            </div>
            <span className="font-heading font-bold text-xl tracking-tight hidden lg:block">CFG 2026</span>
          </Link>
        </div>

        <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? "bg-primary text-white" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-white/10">
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left text-red-400 hover:bg-red-500/10 transition-colors">
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[url('/grid.svg')] bg-center bg-no-repeat bg-cover bg-fixed">
        <div className="absolute inset-0 bg-dark/90 -z-10" />
        <div className="p-6 md:p-10 max-w-6xl mx-auto">
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-heading font-bold">Dashboard</h1>
            <div className="flex items-center gap-4">
              <button className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Bell size={18} />
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent to-primary flex items-center justify-center font-bold">
                JD
              </div>
            </div>
          </header>
          {children}
        </div>
      </main>
    </div>
  );
}
