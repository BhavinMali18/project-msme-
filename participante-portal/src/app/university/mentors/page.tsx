"use client";

import { useState, useEffect } from "react";
import { Users, Plus, X, Check, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface Mentor {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  employeeId?: string;
  createdAt: string;
}

const schema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  employeeId: z.string().min(2, "Employee ID is required"),
  password: z.string().min(6, "Password min 6 characters"),
});
type FormValues = z.infer<typeof schema>;

const inputClass = "w-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-violet-400 rounded-2xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-4 focus:ring-violet-50 transition-all text-sm";

export default function UniversityMentorsPage() {
  const { user } = useAuth();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema)
  });

  useEffect(() => {
    if (user?.universityId) {
      api.get(`/universities/${user.universityId}/mentors`)
        .then(({ data }) => setMentors(data))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    setError("");
    try {
      const { data: res } = await api.post(`/universities/${user?.universityId}/mentors`, data);
      setMentors(prev => [...prev, res.mentor]);
      setSuccess(`${res.mentor.name} added as mentor.`);
      reset();
      setShowForm(false);
      setTimeout(() => setSuccess(""), 4000);
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to add mentor.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-slate-900">Mentors</h1>
          <p className="text-gray-400 text-sm mt-1">Faculty and industry mentors from your university</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setError(""); }}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-5 py-2.5 rounded-2xl transition-all shadow-md shadow-violet-100 hover:shadow-lg hover:-translate-y-0.5"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? "Cancel" : "Add Mentor"}
        </button>
      </div>

      {success && (
        <div className="flex items-center gap-3 px-5 py-3 bg-green-50 border border-green-100 rounded-2xl text-green-700 text-sm font-medium">
          <Check size={16} /> {success}
        </div>
      )}

      {/* Add Mentor Form */}
      {showForm && (
        <div className="bg-white border border-violet-100 rounded-3xl p-6 shadow-sm">
          <h2 className="text-lg font-heading font-semibold text-slate-800 mb-2">Add New Mentor</h2>
          <div className="flex items-start gap-3 mb-5 px-4 py-3 bg-amber-50 border border-amber-100 rounded-2xl">
            <AlertTriangle className="text-amber-500 flex-shrink-0 mt-0.5" size={16} />
            <p className="text-xs text-amber-700">
              Enter the mentor&apos;s real employee ID exactly as it appears in your university records. This prevents fake entries.
            </p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Full Name</label>
              <input {...register("name")} placeholder="Dr. Priya Sharma" className={inputClass} />
              {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email Address</label>
              <input {...register("email")} type="email" placeholder="mentor@university.edu" className={inputClass} />
              {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone (optional)</label>
              <input {...register("phone")} type="tel" placeholder="+91 98765 43210" className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Employee / Faculty ID</label>
              <input {...register("employeeId")} placeholder="e.g. FAC-2024-001" className={inputClass} />
              {errors.employeeId && <p className="text-red-500 text-xs">{errors.employeeId.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Temporary Password</label>
              <input {...register("password")} type="password" placeholder="••••••••" className={inputClass} />
              <p className="text-xs text-gray-300">Mentor can change this on first login</p>
              {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
            </div>
            <div className="flex items-end">
              <button type="submit" disabled={submitting}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-2xl transition-all flex items-center justify-center gap-2">
                {submitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Plus size={18} /> Add Mentor</>}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Mentors List */}
      {loading ? (
        <div className="text-center py-16 text-gray-300 text-sm">Loading mentors...</div>
      ) : mentors.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-100 rounded-3xl">
          <Users size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 text-sm font-medium">No mentors yet</p>
          <p className="text-gray-300 text-xs mt-1">Add mentors using their real faculty/employee ID.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mentors.map(mentor => (
            <div key={mentor._id} className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center font-bold text-violet-600 text-lg">
                  {mentor.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800">{mentor.name}</p>
                  <p className="text-sm text-gray-400 truncate">{mentor.email}</p>
                  {mentor.employeeId && (
                    <span className="text-xs bg-violet-50 text-violet-600 font-mono px-2 py-0.5 rounded-lg mt-1 inline-block">
                      ID: {mentor.employeeId}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
