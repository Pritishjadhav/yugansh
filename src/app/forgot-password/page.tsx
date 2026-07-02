"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Loader2, ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
      setLoading(false);
    } catch (err: any) {
      console.error(err);
      let message = "Failed to send reset link. Please check the email and try again.";
      if (err.code === "auth/user-not-found") {
        message = "There is no account registered with this email.";
      } else if (err.code === "auth/invalid-email") {
        message = "Invalid email address format.";
      }
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative font-sans auth-page-wrapper">
      {/* Background spotlights */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#0A4DFF]/10 blur-[100px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] bg-[#FF7A00]/8 blur-[100px] rounded-full pointer-events-none z-0" />

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-3xl glass-panel p-8 md:p-10 shadow-2xl relative border border-white/10 z-10"
      >
        {/* Back Link */}
        <Link href="/login" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Sign In
        </Link>

        {!success ? (
          /* Form screen */
          <div>
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight mb-2 auth-logo-text">
                Reset <span className="text-gradient-blue">Password</span>
              </h1>
              <p className="text-slate-400 text-sm leading-normal">
                Enter your email address and we'll email you a link to reset your password.
              </p>
            </div>

            <form onSubmit={handleReset} className="space-y-5">
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
                  {error}
                </div>
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover shadow-lg hover:shadow-primary/30 active:scale-[0.98] transition-all cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary disabled:active:scale-100"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending link...
                  </>
                ) : (
                  "Send Recovery Link"
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Success Screen */
          <div className="text-center py-4">
            <div className="mb-4 inline-flex p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full">
              <CheckCircle className="w-12 h-12" />
            </div>
            <h2 className="text-xl md:text-2xl font-display font-extrabold tracking-tight mb-2 auth-logo-text">
              Email Sent!
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              A password reset link has been dispatched to <span className="font-semibold auth-logo-text">{email}</span>. Please check your inbox and spam folders.
            </p>
            <Link
              href="/login"
              className="inline-flex justify-center items-center py-2.5 px-6 bg-primary text-white font-sans text-sm font-semibold rounded-xl hover:bg-primary-hover shadow-lg transition-all"
            >
              Return to Login
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
