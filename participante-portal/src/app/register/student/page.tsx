"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, GraduationCap, UserPlus, Search, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface University {
  _id: string;
  name: string;
  city: string;
}

const schema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your password"),
  universityId: z.string().min(1, "Please select your university"),
  studentId: z.string().min(1, "Enrollment/Student ID is required"),
  department: z.string().min(2, "Department is required"),
  year: z.string().min(1, "Year of study is required"),
  gender: z.string().min(1, "Gender is required"),
  city: z.string().min(2, "City is required"),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof schema>;

function FormInput({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}

const inputClass = "w-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-400 rounded-2xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-50 transition-all text-sm";

export default function StudentRegisterPage() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loadingUnis, setLoadingUnis] = useState(true);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema)
  });

  const selectedUniId = watch("universityId");

  useEffect(() => {
    api.get("/universities").then(({ data }) => {
      setUniversities(data);
    }).catch(() => {}).finally(() => setLoadingUnis(false));
  }, []);

  const filteredUnis = universities.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.city.toLowerCase().includes(search.toLowerCase())
  );

  const selectedUni = universities.find(u => u._id === selectedUniId);

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setError("");
    try {
      const { data: res } = await api.post("/auth/register-student", {
        name: data.name, email: data.email, phone: data.phone,
        password: data.password, universityId: data.universityId,
        studentId: data.studentId, department: data.department,
        year: data.year, gender: data.gender, city: data.city
      });
      localStorage.setItem("hackathon_token", res.token);
      localStorage.setItem("hackathon_user", JSON.stringify(res.user));
      router.push("/dashboard");
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        <Link href="/register" className="inline-flex items-center gap-2 text-gray-400 hover:text-slate-700 transition-colors text-sm font-medium mb-8">
          <ArrowLeft size={16} /> Back
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
              <GraduationCap className="text-blue-600" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-heading font-bold text-slate-900">Student Registration</h1>
              <p className="text-gray-400 text-sm">Join the hackathon through your university</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 px-4 py-3 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* University Selection */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-heading font-semibold text-slate-800 mb-1">Select Your University</h2>
              <p className="text-sm text-gray-400 mb-5">Only registered & approved universities are shown below.</p>

              {selectedUni ? (
                <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-2xl mb-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-blue-600" size={20} />
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{selectedUni.name}</p>
                      <p className="text-xs text-gray-400">{selectedUni.city}</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => { setValue("universityId", ""); setSearch(""); }}
                    className="text-xs text-blue-500 hover:text-blue-700 font-medium">
                    Change
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                    <input
                      type="text"
                      placeholder="Search university name or city..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="w-full border border-gray-200 bg-gray-50 rounded-2xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all"
                    />
                  </div>
                  <input type="hidden" {...register("universityId")} />
                  {loadingUnis ? (
                    <div className="text-center py-8 text-gray-300 text-sm">Loading universities...</div>
                  ) : filteredUnis.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-400 text-sm">No registered universities found.</p>
                      <p className="text-xs text-gray-300 mt-1">Ask your university to register first.</p>
                    </div>
                  ) : (
                    <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
                      {filteredUnis.map(uni => (
                        <button key={uni._id} type="button"
                          onClick={() => setValue("universityId", uni._id)}
                          className="w-full text-left p-4 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all group">
                          <p className="font-semibold text-slate-700 text-sm group-hover:text-blue-700">{uni.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{uni.city}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {errors.universityId && <p className="text-red-500 text-xs mt-2">{errors.universityId.message}</p>}
            </div>

            {/* Personal Details */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-heading font-semibold text-slate-800 mb-5">Personal Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label="Full Name" error={errors.name?.message}>
                  <input {...register("name")} type="text" placeholder="John Doe" className={inputClass} />
                </FormInput>
                <FormInput label="Email Address" error={errors.email?.message}>
                  <input {...register("email")} type="email" placeholder="john@university.edu" className={inputClass} />
                </FormInput>
                <FormInput label="Phone Number" error={errors.phone?.message}>
                  <input {...register("phone")} type="tel" placeholder="+91 98765 43210" className={inputClass} />
                </FormInput>
                <FormInput label="Gender" error={errors.gender?.message}>
                  <select {...register("gender")} className={inputClass}>
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Prefer not to say</option>
                  </select>
                </FormInput>
                <FormInput label="City" error={errors.city?.message}>
                  <input {...register("city")} type="text" placeholder="Ahmedabad" className={inputClass} />
                </FormInput>
              </div>
            </div>

            {/* Academic Details */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-heading font-semibold text-slate-800 mb-5">Academic Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label="Enrollment / Student ID" error={errors.studentId?.message}>
                  <input {...register("studentId")} type="text" placeholder="e.g. 21CEENL001" className={inputClass} />
                </FormInput>
                <FormInput label="Department / Branch" error={errors.department?.message}>
                  <input {...register("department")} type="text" placeholder="e.g. Computer Engineering" className={inputClass} />
                </FormInput>
                <FormInput label="Year of Study" error={errors.year?.message}>
                  <select {...register("year")} className={inputClass}>
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                    <option value="5">5th Year (PG/Diploma)</option>
                  </select>
                </FormInput>
              </div>
            </div>

            {/* Security */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-heading font-semibold text-slate-800 mb-5">Create Password</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label="Password" error={errors.password?.message}>
                  <input {...register("password")} type="password" placeholder="••••••••" className={inputClass} />
                </FormInput>
                <FormInput label="Confirm Password" error={errors.confirmPassword?.message}>
                  <input {...register("confirmPassword")} type="password" placeholder="••••••••" className={inputClass} />
                </FormInput>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white font-semibold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-100 hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 active:translate-y-0"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus size={20} />
                  Complete Registration
                </>
              )}
            </button>

            <p className="text-center text-gray-400 text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
