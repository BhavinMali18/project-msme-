"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart3, 
  Users, 
  CheckSquare, 
  UserCog, 
  Gavel, 
  FileCode2, 
  ClipboardList, 
  Megaphone,
  Mail,
  Settings,
  LogOut
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { name: "Analytics Dashboard", href: "/admin", icon: <BarChart3 size={20} /> },
    { name: "Manage Participants", href: "/admin/participants", icon: <Users size={20} /> },
    { name: "Approve Teams", href: "/admin/teams", icon: <CheckSquare size={20} /> },
    { name: "Mentors", href: "/admin/mentors", icon: <UserCog size={20} /> },
    { name: "Judges", href: "/admin/judges", icon: <Gavel size={20} /> },
    { name: "Submissions", href: "/admin/submissions", icon: <FileCode2 size={20} /> },
    { name: "Scoring", href: "/admin/scoring", icon: <ClipboardList size={20} /> },
    { name: "Announcements", href: "/admin/announcements", icon: <Megaphone size={20} /> },
    { name: "Email Broadcast", href: "/admin/email", icon: <Mail size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-white/80 backdrop-blur-md hidden md:flex flex-col">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center font-heading font-bold text-lg text-slate-900">
              A
            </div>
            <span className="font-heading font-bold text-xl tracking-tight text-slate-900">Admin Panel</span>
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
                    ? "bg-red-500 text-slate-900" 
                    : "text-gray-600 hover:text-slate-900 hover:bg-black/5"
                }`}
              >
                {item.icon}
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-white/10">
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left text-gray-600 hover:text-slate-900 hover:bg-black/5 transition-colors mb-2">
            <Settings size={20} />
            <span className="font-medium text-sm">Settings</span>
          </Link>
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left text-red-400 hover:bg-red-500/10 transition-colors">
            <LogOut size={20} />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-white">
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
