"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Loader2, ArrowRight, ShieldCheck, Mail, Lock, User, CheckCircle, Info, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function SignUpPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Form validations & UI
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: "Weak", color: "bg-rose-500" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  // Calculate password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength({ score: 0, text: "None", color: "bg-slate-700" });
      return;
    }

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    let text = "Weak";
    let color = "bg-rose-500";

    if (score === 2 || score === 3) {
      text = "Medium";
      color = "bg-amber-500";
    } else if (score >= 4) {
      text = "Strong";
      color = "bg-emerald-500";
    }

    setPasswordStrength({ score, text, color });
  }, [password]);

  // Live fields validation
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!fullName.trim()) newErrors.name = "Full name is required";
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
    }
    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!acceptTerms) {
      newErrors.terms = "You must accept the terms & conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      // 1. Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Set profile display name
      await updateProfile(user, { displayName: fullName });

      // Helper to write to Firestore with retries to handle initial auth state latency
      const writeWithRetry = async (docRef: any, data: any, retries = 3, delay = 500) => {
        for (let i = 0; i < retries; i++) {
          try {
            await setDoc(docRef, data);
            return;
          } catch (err) {
            console.warn(`Write attempt ${i + 1} failed:`, err);
            if (i === retries - 1) throw err;
            await new Promise((res) => setTimeout(res, delay));
          }
        }
      };

      // 3. Write User details to `users` collection (Defaults to employee role)
      // Check if this is the admin setup domain or general
      const role = email === "admin@yugansh.in" ? "admin" : "employee";
      const userRef = doc(db, "users", user.uid);
      await writeWithRetry(userRef, {
        uid: user.uid,
        role,
        email,
      });

      // 4. Create Employee Profile record in `employee_profiles` collection
      const profileRef = doc(db, "employee_profiles", user.uid);
      await writeWithRetry(profileRef, {
        name: fullName,
        email: email,
        age: "",
        gender: "",
        mobile: "",
        bankName: "",
        accountNumber: "",
        ifscCode: "",
        upiId: "",
        profilePhotoUrl: "",
      });

      // 5. Show Success Screen
      setSuccess(true);
      setLoading(false);
      
      // 6. Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login");
      }, 3000);

    } catch (err: any) {
      console.error(err);
      let message = "Failed to create account. Please try again.";
      if (err.code === "auth/email-already-in-use") {
        message = "This email is already registered.";
      } else if (err.code === "auth/invalid-email") {
        message = "Invalid email address format.";
      } else if (err.code === "auth/weak-password") {
        message = "The password is too weak.";
      }
      setErrors({ global: message });
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
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#0A4DFF]/15 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#FF7A00]/10 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Main split viewport */}
      <div className="flex-1 flex max-w-7xl mx-auto z-10 w-full">
        {/* Left Side: Register Card Form */}
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

          {/* Form container */}
          <div className="my-auto py-8">
            <AnimatePresence mode="wait">
              {!success ? (
                /* Registration State */
                <motion.div
                  key="signup-form"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="mb-6">
                    <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight mb-2 auth-logo-text">
                      Join <span className="text-gradient-orange">YugAnsh</span>
                    </h1>
                    <p className="text-slate-400 text-sm">
                      Create your employee account to start tracking work logs.
                    </p>
                  </div>

                  <form onSubmit={handleSignUp} className="space-y-4">
                    {errors.global && (
                      <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
                        {errors.global}
                      </div>
                    )}

                    {/* Name Input */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold tracking-wider uppercase text-slate-400">Full Name</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary transition-colors">
                          <User className="w-4.5 h-4.5" />
                        </div>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => {
                            setFullName(e.target.value);
                            if (errors.name) setErrors({ ...errors, name: "" });
                          }}
                          placeholder="John Doe"
                          className={`w-full pl-10 pr-4 py-2.5 bg-white/5 border ${errors.name ? 'border-rose-500/50' : 'border-white/10'} rounded-xl font-medium text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-sm`}
                        />
                      </div>
                      {errors.name && <p className="text-[10px] text-rose-400 font-semibold">{errors.name}</p>}
                    </div>

                    {/* Email Input */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold tracking-wider uppercase text-slate-400">Email Address</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary transition-colors">
                          <Mail className="w-4.5 h-4.5" />
                        </div>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) setErrors({ ...errors, email: "" });
                          }}
                          placeholder="name@yugansh.in"
                          className={`w-full pl-10 pr-4 py-2.5 bg-white/5 border ${errors.email ? 'border-rose-500/50' : 'border-white/10'} rounded-xl font-medium text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-sm`}
                        />
                      </div>
                      {errors.email && <p className="text-[10px] text-rose-400 font-semibold">{errors.email}</p>}
                    </div>

                    {/* Passwords */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Password */}
                      <div className="space-y-1">
                        <label className="text-xs font-semibold tracking-wider uppercase text-slate-400">Password</label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary transition-colors">
                            <Lock className="w-4.5 h-4.5" />
                          </div>
                          <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                              if (errors.password) setErrors({ ...errors, password: "" });
                            }}
                            placeholder="Min 6 chars"
                            className={`w-full pl-10 pr-4 py-2.5 bg-white/5 border ${errors.password ? 'border-rose-500/50' : 'border-white/10'} rounded-xl font-medium text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-sm`}
                          />
                        </div>
                      </div>

                      {/* Confirm Password */}
                      <div className="space-y-1">
                        <label className="text-xs font-semibold tracking-wider uppercase text-slate-400">Confirm Password</label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary transition-colors">
                            <Lock className="w-4.5 h-4.5" />
                          </div>
                          <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => {
                              setConfirmPassword(e.target.value);
                              if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: "" });
                            }}
                            placeholder="Re-enter password"
                            className={`w-full pl-10 pr-4 py-2.5 bg-white/5 border ${errors.confirmPassword ? 'border-rose-500/50' : 'border-white/10'} rounded-xl font-medium text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-sm`}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {errors.password && <p className="text-[10px] text-rose-400 font-semibold">{errors.password}</p>}
                    {errors.confirmPassword && <p className="text-[10px] text-rose-400 font-semibold">{errors.confirmPassword}</p>}

                    {/* Password Strength Indicator */}
                    {password && (
                      <div className="space-y-1.5 p-3.5 rounded-xl auth-info-card">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400 font-semibold">Password Strength:</span>
                          <span className={`font-bold uppercase tracking-wider ${
                            passwordStrength.text === 'Weak' ? 'text-rose-400' :
                            passwordStrength.text === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
                          }`}>
                            {passwordStrength.text}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex gap-0.5">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className={`h-full flex-1 transition-all duration-300 ${
                                i <= passwordStrength.score ? passwordStrength.color : "bg-transparent"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-[10px] text-slate-500 leading-normal flex items-start gap-1">
                          <Info className="w-3 h-3 mt-0.5 shrink-0" />
                          To make it strong, include uppercase/lowercase letters, numbers, and special symbols (!@#$).
                        </p>
                      </div>
                    )}

                    {/* Terms Checklist */}
                    <div className="space-y-1">
                      <div className="flex items-start">
                        <input
                          id="accept-terms"
                          type="checkbox"
                          checked={acceptTerms}
                          onChange={(e) => {
                            setAcceptTerms(e.target.checked);
                            if (errors.terms) setErrors({ ...errors, terms: "" });
                          }}
                          className="mt-0.5 w-4.5 h-4.5 rounded border-white/10 bg-white/5 text-primary focus:ring-primary/20 cursor-pointer"
                        />
                        <label htmlFor="accept-terms" className="ml-2.5 text-xs text-slate-400 select-none cursor-pointer leading-normal">
                          I agree to YugAnsh's terms of service and declare that my profile details are accurate.
                        </label>
                      </div>
                      {errors.terms && <p className="text-[10px] text-rose-400 font-semibold">{errors.terms}</p>}
                    </div>

                    {/* Action Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-secondary text-white font-semibold rounded-xl hover:bg-secondary-hover shadow-lg hover:shadow-secondary/30 active:scale-[0.98] transition-all cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-secondary disabled:active:scale-100"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4.5 h-4.5 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        <>
                          Create Account
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>

                  <p className="mt-6 text-center text-xs text-slate-400">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary hover:text-primary-hover font-semibold transition-colors">
                      Sign In
                    </Link>
                  </p>
                </motion.div>
              ) : (
                /* Registration Success State */
                <motion.div
                  key="signup-success"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <motion.div
                    initial={{ rotate: -15, scale: 0.8 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full"
                  >
                    <CheckCircle className="w-16 h-16" />
                  </motion.div>
                  <h2 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight mb-2 auth-logo-text">
                    Registration Successful!
                  </h2>
                  <p className="text-slate-400 text-sm max-w-sm mb-6 leading-relaxed">
                    Your employee account has been created. We are directing you to the login screen to access your dashboard.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-primary font-semibold">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Redirecting...
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer copyright */}
          <div className="text-slate-600 text-[10px] self-start">
            &copy; {new Date().getFullYear()} YugAnsh IT Solutions. All rights reserved.
          </div>
        </div>

        {/* Right Side: Graphic branding (Hidden on mobile) */}
        <div className="hidden lg:flex w-[52%] relative items-center justify-center p-12 overflow-hidden auth-graphic-panel">
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
          
          {/* Tech lines / floating visuals */}
          <div className="absolute w-[400px] h-[400px] rounded-full border border-white/5 bg-secondary/2 animate-float pointer-events-none" />
          <div className="absolute w-[250px] h-[250px] rounded-full border border-white/5 bg-primary/1 animate-pulse-slow pointer-events-none" />
          
          <div className="text-center z-10 max-w-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-6 inline-flex p-3 rounded-2xl bg-white/5 border border-white/10"
            >
              <ShieldCheck className="w-10 h-10 text-secondary" />
            </motion.div>
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-2xl md:text-3xl font-display font-extrabold tracking-tight mb-3 auth-logo-text"
            >
              Employee Portal Enrollment
            </motion.h2>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-slate-400 text-sm leading-relaxed"
            >
              Configure your profile information and access real-time dashboards immediately. Work logging simplified for high-growth tech engineering teams.
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}
