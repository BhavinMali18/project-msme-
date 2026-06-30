"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Building2, GraduationCap, Rocket, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

const roles = [
  {
    id: "student",
    icon: <GraduationCap size={32} strokeWidth={1.5} />,
    title: "Student",
    subtitle: "University student joining a team",
    description: "Register as an individual student. You must belong to a university already registered in this hackathon.",
    color: "from-blue-500 to-indigo-500",
    bg: "bg-blue-50",
    border: "border-blue-100",
    hover: "hover:border-blue-300 hover:shadow-blue-100",
    href: "/register/student",
  },
  {
    id: "university",
    icon: <Building2 size={32} strokeWidth={1.5} />,
    title: "University",
    subtitle: "Institutional administrator",
    description: "Register your university to allow students to enroll. You can manage students, teams, and assign mentors.",
    color: "from-violet-500 to-purple-600",
    bg: "bg-violet-50",
    border: "border-violet-100",
    hover: "hover:border-violet-300 hover:shadow-violet-100",
    href: "/register/university",
  },
  {
    id: "startup",
    icon: <Rocket size={32} strokeWidth={1.5} />,
    title: "Startup / Community",
    subtitle: "Independent team or community",
    description: "Join as a startup or community member without university affiliation. Open to all innovators.",
    color: "from-orange-400 to-pink-500",
    bg: "bg-orange-50",
    border: "border-orange-100",
    hover: "hover:border-orange-300 hover:shadow-orange-100",
    href: "/register/startup",
  },
];

export default function RegisterPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center relative overflow-hidden py-16 px-6">
      {/* Soft decorative blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50/60 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-violet-50/60 rounded-full blur-[160px] pointer-events-none" />

      <Link href="/" className="absolute top-8 left-8 text-gray-400 hover:text-slate-700 flex items-center gap-2 transition-colors text-sm font-medium z-10">
        <ArrowLeft size={16} />
        Back to Home
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl relative z-10"
      >
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-blue-600 text-xs font-semibold mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            Registration Open
          </div>
          <h1 className="text-5xl font-heading font-bold text-slate-900 mb-4 tracking-tight">
            Who are you?
          </h1>
          <p className="text-gray-400 text-lg max-w-md mx-auto">
            Select your role to get started with the right registration flow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role, i) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.2, duration: 0.4 }}
            >
              <button
                onClick={() => router.push(role.href)}
                className={`group w-full text-left bg-white border-2 ${role.border} ${role.hover} rounded-3xl p-7 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer`}
              >
                {/* Icon */}
                <div className={`w-16 h-16 ${role.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300`}>
                  <div className={`bg-gradient-to-br ${role.color} bg-clip-text text-transparent`}>
                    {role.icon}
                  </div>
                </div>

                {/* Content */}
                <h2 className="text-xl font-heading font-bold text-slate-900 mb-1">{role.title}</h2>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">{role.subtitle}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{role.description}</p>

                {/* Arrow */}
                <div className={`mt-6 flex items-center gap-2 text-sm font-semibold bg-gradient-to-r ${role.color} bg-clip-text text-transparent`}>
                  Get started
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-gray-400 text-sm mt-10">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
            Sign in here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
