"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, UserPlus, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const registerSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  collegeName: z.string().min(2, "College name is required"),
  university: z.string().min(2, "University is required"),
  department: z.string().min(2, "Department is required"),
  year: z.string().min(1, "Year is required"),
  gender: z.string().min(1, "Gender is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password is required"),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions"
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = (data: RegisterFormValues) => {
    setIsLoading(true);
    console.log("Register data:", data);
    // Simulate API Call
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = "/dashboard";
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center relative overflow-hidden py-12 px-6">
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[200px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[800px] h-[800px] bg-secondary/5 rounded-full blur-[200px] pointer-events-none" />

      <Link href="/" className="absolute top-8 left-8 text-gray-600 hover:text-slate-900 flex items-center gap-2 transition-colors z-10">
        <ArrowLeft size={20} />
        <span>Back to Home</span>
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl relative z-10 mt-12"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-heading font-bold mb-2">Create your Account</h1>
          <p className="text-gray-600">Join the biggest hackathon in Gujarat</p>
        </div>

        <div className="bg-black/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Personal Details */}
            <div>
              <h3 className="text-xl font-heading font-semibold mb-4 text-slate-900/90 border-b border-white/10 pb-2">Personal Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-sm text-gray-600">Full Name</label>
                  <input {...register("fullName")} type="text" className="w-full bg-black/50 border border-white/10 focus:border-primary rounded-xl px-4 py-3 text-slate-900 focus:outline-none" placeholder="John Doe" />
                  {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName.message}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-gray-600">Email Address</label>
                  <input {...register("email")} type="email" className="w-full bg-black/50 border border-white/10 focus:border-primary rounded-xl px-4 py-3 text-slate-900 focus:outline-none" placeholder="john@example.com" />
                  {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-gray-600">Phone Number</label>
                  <input {...register("phone")} type="text" className="w-full bg-black/50 border border-white/10 focus:border-primary rounded-xl px-4 py-3 text-slate-900 focus:outline-none" placeholder="+91 9876543210" />
                  {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-gray-600">Gender</label>
                  <select {...register("gender")} className="w-full bg-black/50 border border-white/10 focus:border-primary rounded-xl px-4 py-3 text-slate-900 focus:outline-none appearance-none">
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && <p className="text-red-500 text-xs">{errors.gender.message}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-gray-600">City</label>
                  <input {...register("city")} type="text" className="w-full bg-black/50 border border-white/10 focus:border-primary rounded-xl px-4 py-3 text-slate-900 focus:outline-none" placeholder="Ahmedabad" />
                  {errors.city && <p className="text-red-500 text-xs">{errors.city.message}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-gray-600">State</label>
                  <input {...register("state")} type="text" className="w-full bg-black/50 border border-white/10 focus:border-primary rounded-xl px-4 py-3 text-slate-900 focus:outline-none" placeholder="Gujarat" />
                  {errors.state && <p className="text-red-500 text-xs">{errors.state.message}</p>}
                </div>
              </div>
            </div>

            {/* Academic Details */}
            <div>
              <h3 className="text-xl font-heading font-semibold mb-4 text-slate-900/90 border-b border-white/10 pb-2">Academic Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm text-gray-600">College Name</label>
                  <input {...register("collegeName")} type="text" className="w-full bg-black/50 border border-white/10 focus:border-primary rounded-xl px-4 py-3 text-slate-900 focus:outline-none" placeholder="e.g. L.D. College of Engineering" />
                  {errors.collegeName && <p className="text-red-500 text-xs">{errors.collegeName.message}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-gray-600">University</label>
                  <input {...register("university")} type="text" className="w-full bg-black/50 border border-white/10 focus:border-primary rounded-xl px-4 py-3 text-slate-900 focus:outline-none" placeholder="e.g. GTU" />
                  {errors.university && <p className="text-red-500 text-xs">{errors.university.message}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-gray-600">Department/Branch</label>
                  <input {...register("department")} type="text" className="w-full bg-black/50 border border-white/10 focus:border-primary rounded-xl px-4 py-3 text-slate-900 focus:outline-none" placeholder="e.g. Computer Science" />
                  {errors.department && <p className="text-red-500 text-xs">{errors.department.message}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-gray-600">Year of Study</label>
                  <select {...register("year")} className="w-full bg-black/50 border border-white/10 focus:border-primary rounded-xl px-4 py-3 text-slate-900 focus:outline-none appearance-none">
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                    <option value="5">5th Year</option>
                  </select>
                  {errors.year && <p className="text-red-500 text-xs">{errors.year.message}</p>}
                </div>
                <div className="col-span-1 md:col-span-2 space-y-2 mt-2">
                  <label className="text-sm text-gray-600">Upload Student ID (PDF/Image)</label>
                  <div className="border-2 border-dashed border-white/20 hover:border-primary transition-colors rounded-xl p-6 text-center cursor-pointer bg-white/30">
                    <Upload className="mx-auto text-gray-600 mb-2" size={24} />
                    <p className="text-sm text-gray-700">Click or drag file to upload</p>
                    <p className="text-xs text-gray-500 mt-1">Max file size: 5MB</p>
                    <input type="file" className="hidden" />
                  </div>
                </div>
              </div>
            </div>

            {/* Security */}
            <div>
              <h3 className="text-xl font-heading font-semibold mb-4 text-slate-900/90 border-b border-white/10 pb-2">Security</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm text-gray-600">Password</label>
                  <input {...register("password")} type="password" className="w-full bg-black/50 border border-white/10 focus:border-primary rounded-xl px-4 py-3 text-slate-900 focus:outline-none" placeholder="••••••••" />
                  {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-gray-600">Confirm Password</label>
                  <input {...register("confirmPassword")} type="password" className="w-full bg-black/50 border border-white/10 focus:border-primary rounded-xl px-4 py-3 text-slate-900 focus:outline-none" placeholder="••••••••" />
                  {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>}
                </div>
              </div>
            </div>

            <div className="pt-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" {...register("acceptTerms")} className="mt-1 rounded border-white/10 bg-black/50 text-primary focus:ring-primary/20" />
                <span className="text-sm text-gray-600">
                  I agree to the <Link href="/terms" className="text-slate-900 hover:text-primary transition-colors">Terms of Service</Link> and <Link href="/privacy" className="text-slate-900 hover:text-primary transition-colors">Privacy Policy</Link>. I confirm that the information provided is accurate and I am a current student.
                </span>
              </label>
              {errors.acceptTerms && <p className="text-red-500 text-xs mt-1 ml-7">{errors.acceptTerms.message}</p>}
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-slate-900 font-medium py-4 rounded-xl transition-all flex items-center justify-center gap-2 mt-4 text-lg"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus size={24} />
                  Complete Registration
                </>
              )}
            </button>
            
            <p className="text-center text-gray-600 text-sm mt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-slate-900 hover:text-primary font-medium transition-colors">
                Log in here
              </Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
