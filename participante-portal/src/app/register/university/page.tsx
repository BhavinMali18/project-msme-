"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Building2, UserPlus, CheckCircle, AlertTriangle } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

// Real Gujarat university list for autocomplete
const KNOWN_UNIVERSITIES = [
  "Gujarat Technological University",
  "Charotar University of Science and Technology",
  "Nirma University",
  "Ahmedabad University",
  "Gujarat University",
  "Sardar Patel University",
  "Veer Narmad South Gujarat University",
  "Hemchandracharya North Gujarat University",
  "Saurashtra University",
  "Marwadi University",
  "Parul University",
  "GLS University",
  "Pandit Deendayal Energy University",
  "Dr. Babasaheb Ambedkar Open University",
  "CEPT University",
  "Dhirubhai Ambani Institute of Information and Communication Technology",
  "Indian Institute of Technology Gandhinagar",
  "National Institute of Design",
  "NIFT Gandhinagar",
  "Institute of Infrastructure Technology Research and Management",
];

const schema = z.object({
  universityName: z.string().min(3, "University name is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  websiteUrl: z.string().url("Enter a valid URL (e.g. https://university.edu)").optional().or(z.literal("")),
  contactEmail: z.string().email("Valid contact email is required"),
  contactPhone: z.string().optional(),
  adminName: z.string().min(2, "Your full name is required"),
  adminEmail: z.string().email("Valid admin email is required"),
  adminPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm your password"),
}).refine((d) => d.adminPassword === d.confirmPassword, {
  message: "Passwords don't match", path: ["confirmPassword"]
});

type FormValues = z.infer<typeof schema>;

function FormInput({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
      {hint && <p className="text-xs text-gray-400 -mt-1">{hint}</p>}
      {children}
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}

const inputClass = "w-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-violet-400 rounded-2xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-4 focus:ring-violet-50 transition-all text-sm";

export default function UniversityRegisterPage() {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isKnown, setIsKnown] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { state: "Gujarat" }
  });

  const universityName = watch("universityName");

  const handleUniversityInput = (val: string) => {
    setValue("universityName", val);
    if (val.length >= 2) {
      const matches = KNOWN_UNIVERSITIES.filter(u => u.toLowerCase().includes(val.toLowerCase()));
      setSuggestions(matches);
      setShowSuggestions(true);
      setIsKnown(KNOWN_UNIVERSITIES.some(u => u.toLowerCase() === val.toLowerCase()));
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsKnown(null);
    }
  };

  const selectSuggestion = (name: string) => {
    setValue("universityName", name);
    setIsKnown(true);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setError("");
    try {
      const { data: res } = await api.post("/auth/register-university", {
        universityName: data.universityName,
        city: data.city, state: data.state,
        websiteUrl: data.websiteUrl, contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        adminName: data.adminName, adminEmail: data.adminEmail,
        adminPassword: data.adminPassword
      });
      localStorage.setItem("hackathon_token", res.token);
      localStorage.setItem("hackathon_user", JSON.stringify(res.user));
      setSuccess(true);
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-500" size={40} />
          </div>
          <h2 className="text-3xl font-heading font-bold text-slate-900 mb-3">Registration Submitted!</h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            Your university has been registered and is <strong>pending approval</strong> from the hackathon admin. 
            Once approved, students from your university can begin enrolling.
          </p>
          <button onClick={() => router.push("/university")}
            className="px-8 py-3 bg-gradient-to-r from-violet-600 to-purple-500 text-white font-semibold rounded-2xl hover:shadow-lg hover:-translate-y-0.5 transition-all">
            Go to University Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-50/50 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        <Link href="/register" className="inline-flex items-center gap-2 text-gray-400 hover:text-slate-700 transition-colors text-sm font-medium mb-8">
          <ArrowLeft size={16} /> Back
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-violet-50 rounded-2xl flex items-center justify-center">
              <Building2 className="text-violet-600" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-heading font-bold text-slate-900">University Registration</h1>
              <p className="text-gray-400 text-sm">Register your institution for the hackathon</p>
            </div>
          </div>

          <div className="mb-6 px-5 py-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3">
            <AlertTriangle className="text-amber-500 flex-shrink-0 mt-0.5" size={18} />
            <div>
              <p className="text-sm font-semibold text-amber-800">Approval Required</p>
              <p className="text-xs text-amber-600 mt-0.5">University registrations are reviewed by the hackathon admin before students can enroll. Known Gujarat universities are prioritized.</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 px-4 py-3 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* University Info */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-heading font-semibold text-slate-800 mb-5">University Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-1.5 relative">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">University Name</label>
                  <p className="text-xs text-gray-400">Start typing to see suggestions from known Gujarat universities</p>
                  <input
                    type="text"
                    value={universityName || ""}
                    onChange={e => handleUniversityInput(e.target.value)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder="e.g. Gujarat Technological University"
                    className={`w-full border ${isKnown === false && universityName ? 'border-amber-300 bg-amber-50' : isKnown ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'} focus:border-violet-400 rounded-2xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-4 focus:ring-violet-50 transition-all text-sm`}
                  />
                  <input type="hidden" {...register("universityName")} />
                  {isKnown === true && (
                    <p className="text-green-600 text-xs flex items-center gap-1.5"><CheckCircle size={12} /> Recognized Gujarat university</p>
                  )}
                  {isKnown === false && universityName && (
                    <p className="text-amber-600 text-xs flex items-center gap-1.5"><AlertTriangle size={12} /> Not in our known list — will require manual review</p>
                  )}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full mt-1 w-full bg-white border border-gray-100 rounded-2xl shadow-xl z-20 overflow-hidden max-h-48 overflow-y-auto">
                      {suggestions.map(s => (
                        <button key={s} type="button" onMouseDown={() => selectSuggestion(s)}
                          className="w-full text-left px-4 py-3 text-sm hover:bg-violet-50 hover:text-violet-700 transition-colors border-b border-gray-50 last:border-0">
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                  {errors.universityName && <p className="text-red-500 text-xs">{errors.universityName.message}</p>}
                </div>

                <FormInput label="City" error={errors.city?.message}>
                  <input {...register("city")} type="text" placeholder="Ahmedabad" className={inputClass} />
                </FormInput>
                <FormInput label="State" error={errors.state?.message}>
                  <input {...register("state")} type="text" placeholder="Gujarat" className={inputClass} />
                </FormInput>
                <FormInput label="Official Website" error={errors.websiteUrl?.message}>
                  <input {...register("websiteUrl")} type="url" placeholder="https://university.edu" className={inputClass} />
                </FormInput>
                <FormInput label="Contact Email" error={errors.contactEmail?.message}>
                  <input {...register("contactEmail")} type="email" placeholder="admin@university.edu" className={inputClass} />
                </FormInput>
                <FormInput label="Contact Phone" error={errors.contactPhone?.message}>
                  <input {...register("contactPhone")} type="tel" placeholder="+91 79 XXXX XXXX" className={inputClass} />
                </FormInput>
              </div>
            </div>

            {/* Admin Account */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-heading font-semibold text-slate-800 mb-2">Your Admin Account</h2>
              <p className="text-sm text-gray-400 mb-5">This will be the university administrator account.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <FormInput label="Your Full Name" error={errors.adminName?.message}>
                    <input {...register("adminName")} type="text" placeholder="Dr. Rajesh Patel" className={inputClass} />
                  </FormInput>
                </div>
                <FormInput label="Admin Email" error={errors.adminEmail?.message}>
                  <input {...register("adminEmail")} type="email" placeholder="you@university.edu" className={inputClass} />
                </FormInput>
                <div />
                <FormInput label="Password" error={errors.adminPassword?.message}>
                  <input {...register("adminPassword")} type="password" placeholder="••••••••" className={inputClass} />
                </FormInput>
                <FormInput label="Confirm Password" error={errors.confirmPassword?.message}>
                  <input {...register("confirmPassword")} type="password" placeholder="••••••••" className={inputClass} />
                </FormInput>
              </div>
            </div>

            <button type="submit" disabled={isLoading}
              className="w-full bg-gradient-to-r from-violet-600 to-purple-500 hover:from-violet-700 hover:to-purple-600 text-white font-semibold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-md shadow-violet-100 hover:shadow-lg hover:shadow-violet-200 hover:-translate-y-0.5 active:translate-y-0">
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><UserPlus size={20} /> Register University</>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
