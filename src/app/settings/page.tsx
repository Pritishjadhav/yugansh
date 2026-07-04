"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  updatePassword, 
  reauthenticateWithCredential, 
  EmailAuthProvider 
} from "firebase/auth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Loader2, Key, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SettingsPage() {
  const { user } = useAuth();

  // Form States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassMap, setShowPassMap] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const toggleShowPass = (field: string) => {
    setShowPassMap(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!user || !user.email) return;

    setLoading(true);

    try {
      // 1. Re-authenticate first to prevent requires-recent-login errors
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      // 2. Perform password update
      await updatePassword(user, newPassword);
      
      setSuccess("Your password has been changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error(err);
      let message = "Failed to update password. Please check your current password.";
      if (err.code === "auth/wrong-password") {
        message = "Incorrect current password. Re-authentication failed.";
      } else if (err.code === "auth/weak-password") {
        message = "The new password is too weak.";
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <Navbar />
      <main className="flex-1 w-full bg-[#030014] text-slate-100 py-24 md:py-28 relative overflow-x-hidden">
        {/* Spotlights */}
        <div className="absolute top-[10%] left-[-10%] w-[35%] h-[35%] bg-[#0A4DFF]/8 blur-[100px] rounded-full pointer-events-none z-0" />
        <div className="absolute bottom-[20%] right-[-10%] w-[35%] h-[35%] bg-[#FF7A00]/5 blur-[100px] rounded-full pointer-events-none z-0" />

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl font-display font-extrabold text-white tracking-tight">
              Portal <span className="text-gradient-blue">Settings</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1.5">
              Securely update account credentials and settings configurations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sidebar quick links */}
            <div className="md:col-span-1 min-w-0">
              <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-2">
                <button className="w-full text-left px-4 py-2.5 rounded-xl bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                  Security Settings
                </button>
                <div className="px-4 py-2 text-[10px] text-slate-500 leading-normal">
                  Password updates require validation of your current credentials. Your account details remain fully encrypted.
                </div>
              </div>
            </div>

            {/* Password update form */}
            <div className="md:col-span-2 min-w-0">
              <div className="glass-panel rounded-3xl p-6 md:p-8 border border-white/10 space-y-6">
                <div className="flex items-center gap-2 pb-4 border-b border-white/5">
                  <Key className="w-5 h-5 text-secondary" />
                  <h2 className="text-lg font-bold text-white">Change Password</h2>
                </div>

                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  {error && (
                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {success && (
                    <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                      <CheckCircle className="w-4.5 h-4.5 shrink-0" />
                      <span>{success}</span>
                    </div>
                  )}

                  {/* Current Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPassMap.current ? "text" : "password"}
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        className="w-full pl-4 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl font-medium text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-all text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => toggleShowPass("current")}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        {showPassMap.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">New Password</label>
                    <div className="relative">
                      <input
                        type={showPassMap.new ? "text" : "password"}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password (Min 6 characters)"
                        className="w-full pl-4 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl font-medium text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-all text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => toggleShowPass("new")}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        {showPassMap.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showPassMap.confirm ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full pl-4 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl font-medium text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-all text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => toggleShowPass("confirm")}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        {showPassMap.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover shadow-lg hover:shadow-primary/30 active:scale-[0.98] transition-all cursor-pointer text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <span className="flex items-center gap-1.5">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Changing...
                        </span>
                      ) : (
                        "Change Password"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </ProtectedRoute>
  );
}
