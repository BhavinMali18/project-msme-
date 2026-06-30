"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, Lock, LogIn, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = (data: LoginFormValues) => {
    setIsLoading(true);
    console.log("Login data:", data);
    // Simulate API Call
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = "/dashboard";
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center relative overflow-hidden p-6">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[150px] pointer-events-none" />

      <Link href="/" className="absolute top-8 left-8 text-gray-600 hover:text-slate-900 flex items-center gap-2 transition-colors">
        <ArrowLeft size={20} />
        <span>Back to Home</span>
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center font-heading font-bold text-2xl mx-auto mb-4">
            C
          </div>
          <h1 className="text-3xl font-heading font-bold mb-2">Welcome Back</h1>
          <p className="text-gray-600">Log in to your Code for Gujarat account</p>
        </div>

        <div className="bg-black/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
          <div className="flex gap-4 mb-6">
            <button className="flex-1 bg-black/5 hover:bg-black/5 border border-white/10 flex items-center justify-center gap-2 py-3 rounded-xl transition-colors">
              <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                  <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                  <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                  <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                  <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                </g>
              </svg>
              Google
            </button>
            <button className="flex-1 bg-black/5 hover:bg-black/5 border border-white/10 flex items-center justify-center gap-2 py-3 rounded-xl transition-colors">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.24c3-.34 6-1.54 6-6.36 0-1.4-.5-2.6-1.3-3.5.1-.3.6-1.7-.1-3.5 0 0-1-.3-3.3 1.2a11.5 11.5 0 0 0-6 0c-2.3-1.5-3.3-1.2-3.3-1.2-.7 1.8-.2 3.2-.1 3.5-0.8.9-1.3 2.1-1.3 3.5 0 4.8 3 6 6 6.36a4.8 4.8 0 0 0-1 3.24v4"></path></svg>
              GitHub
            </button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-black/5" />
            <span className="text-gray-500 text-sm">or login with email</span>
            <div className="flex-1 h-px bg-black/5" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
                <input 
                  type="email" 
                  {...register("email")}
                  className={`w-full bg-black/50 border ${errors.email ? 'border-red-500' : 'border-white/10 focus:border-primary'} rounded-xl pl-12 pr-4 py-3 text-slate-900 focus:outline-none transition-colors`} 
                  placeholder="Email Address" 
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs pl-2">{errors.email.message}</p>}
            </div>

            <div className="space-y-1">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
                <input 
                  type="password" 
                  {...register("password")}
                  className={`w-full bg-black/50 border ${errors.password ? 'border-red-500' : 'border-white/10 focus:border-primary'} rounded-xl pl-12 pr-4 py-3 text-slate-900 focus:outline-none transition-colors`} 
                  placeholder="Password" 
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs pl-2">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                <input type="checkbox" className="rounded border-white/10 bg-black/50 text-primary focus:ring-primary/20 focus:ring-offset-0" />
                Remember me
              </label>
              <Link href="/forgot-password" className="text-primary hover:text-primary/80 transition-colors">
                Forgot password?
              </Link>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-slate-900 font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={20} />
                  Login
                </>
              )}
            </button>
          </form>

          <p className="text-center text-gray-600 text-sm mt-6">
            Don't have an account?{" "}
            <Link href="/register" className="text-slate-900 hover:text-primary font-medium transition-colors">
              Create one now
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
