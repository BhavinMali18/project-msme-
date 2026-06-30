"use client";

import { useState, useEffect } from "react";
import { GraduationCap, Search, UserCheck, UserX } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";

interface Student {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  studentId?: string;
  approvalStatus: string;
  createdAt: string;
  teamId?: { teamName: string; approvalStatus: string } | null;
}

export default function UniversityStudentsPage() {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (user?.universityId) {
      api.get(`/universities/${user.universityId}/students`)
        .then(({ data }) => setStudents(data))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    (s.studentId || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-slate-900">Students</h1>
        <p className="text-gray-400 text-sm mt-1">All students registered under your university</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
        <input
          type="text"
          placeholder="Search by name, email, or student ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full border border-gray-200 bg-white rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-50 transition-all"
        />
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-300 text-sm">Loading students...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-100 rounded-3xl">
          <GraduationCap size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 text-sm font-medium">No students found</p>
          <p className="text-gray-300 text-xs mt-1">
            {students.length === 0 ? "Students will appear here once they register under your university." : "No results for your search."}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-50 text-xs font-semibold text-gray-400 uppercase tracking-wide">
            <div className="col-span-4">Student</div>
            <div className="col-span-2">ID</div>
            <div className="col-span-3">Team</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1">Date</div>
          </div>
          <div className="divide-y divide-gray-50">
            {filtered.map(student => (
              <div key={student._id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors">
                <div className="col-span-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">
                      {student.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{student.name}</p>
                      <p className="text-xs text-gray-400">{student.email}</p>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <span className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded-lg">
                    {student.studentId || "—"}
                  </span>
                </div>
                <div className="col-span-3">
                  {student.teamId ? (
                    <div>
                      <p className="text-sm text-slate-700 font-medium">{student.teamId.teamName}</p>
                      <p className="text-xs text-gray-400">{student.teamId.approvalStatus}</p>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-300">No team yet</span>
                  )}
                </div>
                <div className="col-span-2">
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                    student.approvalStatus === "approved"
                      ? "bg-green-50 text-green-700"
                      : "bg-amber-50 text-amber-700"
                  }`}>
                    {student.approvalStatus === "approved" ? <UserCheck size={12} /> : <UserX size={12} />}
                    {student.approvalStatus}
                  </span>
                </div>
                <div className="col-span-1 text-xs text-gray-300">
                  {new Date(student.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-gray-300 text-right">{filtered.length} of {students.length} students</p>
    </div>
  );
}
