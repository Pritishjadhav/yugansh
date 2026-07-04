"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  signInWithEmailAndPassword, 
  setPersistence, 
  browserLocalPersistence, 
  browserSessionPersistence 
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Eye, EyeOff, Loader2, ArrowRight, ShieldCheck, Mail, Lock, X } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Set Auth Persistence depending on "Remember Me"
      await setPersistence(
        auth, 
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      );
      
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      let message = "Invalid email or password. Please try again.";
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        message = "Invalid email or password.";
      } else if (err.code === "auth/invalid-email") {
        message = "Please enter a valid email address.";
      } else if (err.code === "auth/too-many-requests") {
        message = "Too many login attempts. Please try again later.";
      }
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-x-hidden overflow-y-auto relative font-sans auth-page-wrapper">
      {/* Close button in top-right */}
      <Link
        href="/"
        className="absolute top-6 right-6 z-50 p-2.5 rounded-full hover:scale-105 active:scale-95 transition-all duration-200 shadow-md flex items-center justify-center cursor-pointer auth-close-btn"
        aria-label="Close and return to homepage"
      >
        <X className="w-5 h-5" />
      </Link>
      {/* Background spotlights */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#0A4DFF]/15 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#FF7A00]/10 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Split Screen Container */}
      <div className="flex-1 flex max-w-7xl mx-auto z-10 w-full">
        {/* Left Side: Login Form */}
        <div className="w-full lg:w-[48%] flex flex-col justify-between p-6 md:p-12 md:max-w-xl lg:max-w-none mx-auto">
          {/* Logo & Brand Header */}
          <Link href="/" className="flex flex-col items-start leading-none group self-start">
            <span className="font-display text-2xl font-bold tracking-tight flex items-center leading-none auth-logo-text">
              <span className="text-primary">Yug</span><span className="text-secondary">Ansh</span>
            </span>
            <span className="text-[8px] font-sans font-extrabold uppercase tracking-[0.25em] bg-gradient-to-r bg-clip-text text-transparent mt-1 auth-logo-sub">
              Technology Services
            </span>
          </Link>

          {/* Form Card Panel */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="my-auto py-8"
          >
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight mb-2 auth-logo-text">
                Welcome <span className="text-gradient-blue">Back</span>
              </h1>
              <p className="text-slate-400 text-sm">
                Access your YugAnsh employee account and work logs.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <motion.div 
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping shrink-0" />
                  {error}
                </motion.div>
              )}

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold tracking-wider uppercase text-slate-400">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@yugansh.in"
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl font-medium text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-sm"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold tracking-wider uppercase text-slate-400">Password</label>
                  <Link href="/forgot-password" className="text-xs font-medium text-primary hover:text-primary-hover transition-colors">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary transition-colors">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl font-medium text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Keep Logged In */}
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4.5 h-4.5 rounded border-white/10 bg-white/5 text-primary focus:ring-primary/20 cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2.5 text-xs font-medium text-slate-400 select-none cursor-pointer">
                  Remember Me
                </label>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover shadow-lg hover:shadow-primary/30 active:scale-[0.98] transition-all cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary disabled:active:scale-100"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4.5 h-4.5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-xs text-slate-400">
              Don't have an employee account?{" "}
              <Link href="/signup" className="text-primary hover:text-primary-hover font-semibold transition-colors">
                Register Here
              </Link>
            </p>
          </motion.div>

          {/* Footer copyright */}
          <div className="text-slate-600 text-[10px] self-start">
            &copy; {new Date().getFullYear()} YugAnsh IT Solutions. All rights reserved.
          </div>
        </div>

        {/* Right Side: Graphic branding (Hidden on mobile) */}
        <div className="hidden lg:flex w-[52%] relative items-center justify-center p-12 overflow-hidden auth-graphic-panel">
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
          
          {/* Tech lines / floating circle visuals */}
          <div className="absolute w-[400px] h-[400px] rounded-full border border-white/5 bg-primary/2 animate-float pointer-events-none" />
          <div className="absolute w-[250px] h-[250px] rounded-full border border-white/5 bg-secondary/1 animate-pulse-slow pointer-events-none" />
          
          <div className="text-center z-10 max-w-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-6 inline-flex p-3 rounded-2xl bg-white/5 border border-white/10"
            >
              <ShieldCheck className="w-10 h-10 text-primary" />
            </motion.div>
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-2xl md:text-3xl font-display font-extrabold text-white tracking-tight mb-3"
            >
              Secure Operations Workspace
            </motion.h2>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-slate-400 text-sm leading-relaxed"
            >
              YugAnsh Employee Portal provides centralized time entry, profiles, role security, and real-time dashboard tracking. Seamless. Transparent. Secure.
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}
