"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { doc, setDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Loader2, Camera, User, Phone, MapPin, Building, CreditCard, Key, AlertCircle, CheckCircle2, Eye, EyeOff, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfilePage() {
  const { user, userData, profileData, refreshProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile Form States
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [mobile, setMobile] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [upiId, setUpiId] = useState("");
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("");

  // UI States
  const [isAccountMasked, setIsAccountMasked] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Payments History States
  const [payments, setPayments] = useState<any[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);

  useEffect(() => {
    const fetchPayments = async () => {
      if (!user) return;
      setLoadingPayments(true);
      try {
        const q = query(
          collection(db, "payments"),
          where("employeeId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const list = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        list.sort((a: any, b: any) => {
          const timeA = a.createdTime?.seconds || (a.createdTime instanceof Date ? a.createdTime.getTime() : 0);
          const timeB = b.createdTime?.seconds || (b.createdTime instanceof Date ? b.createdTime.getTime() : 0);
          return timeB - timeA;
        });
        setPayments(list);
      } catch (err) {
        console.error("Error loading payments: ", err);
      } finally {
        setLoadingPayments(false);
      }
    };

    fetchPayments();
  }, [user]);

  // Sync profile data once loaded
  useEffect(() => {
    if (profileData) {
      setName(profileData.name || "");
      setAge(profileData.age || "");
      setGender(profileData.gender || "");
      setMobile(profileData.mobile || "");
      setBankName(profileData.bankName || "");
      setAccountNumber(profileData.accountNumber || "");
      setIfscCode(profileData.ifscCode || "");
      setUpiId(profileData.upiId || "");
      setProfilePhotoUrl(profileData.profilePhotoUrl || "");
    }
  }, [profileData]);

  // Upload Profile Picture via Cloudinary
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate type and size (limit to 3MB)
    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Please upload an image file (PNG, JPG)." });
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setMessage({ type: "error", text: "File size exceeds 3MB limit." });
      return;
    }

    setIsUploading(true);
    setMessage(null);

    try {
      // Upload to Cloudinary (unsigned)
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
      formData.append("folder", `profiles/${user.uid}`);

      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );

      if (!cloudRes.ok) throw new Error("Cloudinary upload failed");
      const cloudData = await cloudRes.json();
      const downloadUrl: string = cloudData.secure_url;

      // Save URL to Firestore
      const profileRef = doc(db, "employee_profiles", user.uid);
      await setDoc(profileRef, { ...profileData, profilePhotoUrl: downloadUrl }, { merge: true });
      setProfilePhotoUrl(downloadUrl);
      await refreshProfile();

      setMessage({ type: "success", text: "Profile picture updated successfully!" });
    } catch (err: any) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to upload photo. Please try again." });
    } finally {
      setIsUploading(false);
    }
  };

  // Submit Profile Changes
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    setMessage(null);

    try {
      const profileRef = doc(db, "employee_profiles", user.uid);
      const updatedProfile = {
        name,
        age,
        gender,
        mobile,
        email: user.email || "",
        bankName,
        accountNumber,
        ifscCode,
        upiId,
        profilePhotoUrl,
      };

      await setDoc(profileRef, updatedProfile, { merge: true });
      await refreshProfile();
      setMessage({ type: "success", text: "Profile saved successfully!" });
    } catch (err: any) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to save profile details. Please try again." });
    } finally {
      setIsSaving(false);
      // Auto dismiss success toast
      setTimeout(() => setMessage(null), 4000);
    }
  };

  return (
    <ProtectedRoute>
      <Navbar />
      <main className="flex-1 w-full bg-[#030014] text-slate-100 py-24 md:py-28 relative overflow-x-hidden">
        {/* Spotlights */}
        <div className="absolute top-[10%] left-[-10%] w-[35%] h-[35%] bg-[#0A4DFF]/8 blur-[100px] rounded-full pointer-events-none z-0" />
        <div className="absolute bottom-[20%] right-[-10%] w-[35%] h-[35%] bg-[#FF7A00]/5 blur-[100px] rounded-full pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl font-display font-extrabold text-white tracking-tight">
              My <span className="text-gradient-blue">Profile</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1.5">
              Manage your personal and banking information.
            </p>
          </div>

          {/* Toast Message Alert */}
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`mb-6 p-4 rounded-xl border flex items-center gap-3 text-sm font-semibold max-w-2xl ${
                  message.type === "success"
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 shrink-0" />
                )}
                <span>{message.text}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Edit Profile Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Card: Avatar and Quick Info */}
            <div className="lg:col-span-1 space-y-6 min-w-0">
              <div className="glass-panel rounded-3xl p-6 border border-white/10 text-center flex flex-col items-center">
                {/* Photo Upload Container */}
                <div className="relative group mb-6">
                  {profilePhotoUrl ? (
                    <img
                      src={profilePhotoUrl}
                      alt="Avatar"
                      className="w-32 h-32 rounded-full object-cover border-2 border-primary/40 shadow-xl"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-3xl font-extrabold border-2 border-white/10 shadow-xl">
                      {name ? name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
                    </div>
                  )}

                  {/* Upload Overlay trigger */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer duration-200"
                    title="Change profile picture"
                  >
                    {isUploading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        <Camera className="w-6 h-6 mb-1" />
                        <span className="text-[10px] font-semibold">Change Photo</span>
                      </>
                    )}
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                <h3 className="text-lg font-bold text-white mb-0.5">{name || "YugAnsh Employee"}</h3>
                <p className="text-xs text-slate-400 mb-3">{user?.email}</p>
                <span className="px-2.5 py-1 bg-primary/20 text-primary text-[10px] font-extrabold uppercase rounded-full tracking-wider mb-6">
                  Employee ID: {user?.uid.substring(0, 8)}...
                </span>

                <div className="w-full border-t border-white/5 pt-6 text-left space-y-3.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-semibold">Verification</span>
                    <span className="font-bold text-emerald-400 uppercase tracking-wide">Approved</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-semibold">Joined Date</span>
                    <span className="font-medium text-slate-300">Active Account</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card: Profile Forms */}
            <div className="lg:col-span-2 min-w-0">
              <form onSubmit={handleSaveProfile} className="space-y-6">
                {/* Personal Details Section */}
                <div className="glass-panel rounded-3xl p-6 md:p-8 border border-white/10 space-y-6">
                  <div className="flex items-center gap-2 pb-4 border-b border-white/5">
                    <User className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-bold text-white">Personal Information</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Full Name</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter full name"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl font-medium text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-all text-sm"
                      />
                    </div>

                    {/* Email (Read only) */}
                    <div className="space-y-1.5 opacity-65">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Email Address (Read-only)</label>
                      <input
                        type="email"
                        readOnly
                        value={user?.email || ""}
                        className="w-full px-4 py-2.5 bg-white/3 border border-white/5 rounded-xl font-medium text-slate-400 placeholder-slate-600 focus:outline-none text-sm cursor-not-allowed"
                      />
                    </div>

                    {/* Age */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Age</label>
                      <input
                        type="number"
                        required
                        min="18"
                        max="90"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="Enter age"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl font-medium text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-all text-sm"
                      />
                    </div>

                    {/* Gender */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Gender</label>
                      <select
                        required
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl font-medium text-white focus:outline-none focus:border-primary transition-all text-sm appearance-none"
                      >
                        <option value="" disabled className="bg-dark-navy text-slate-500">Select Gender</option>
                        <option value="Male" className="bg-dark-navy text-white">Male</option>
                        <option value="Female" className="bg-dark-navy text-white">Female</option>
                        <option value="Other" className="bg-dark-navy text-white">Other</option>
                      </select>
                    </div>

                    {/* Mobile Number */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Mobile Number</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary transition-colors">
                          <Phone className="w-4 h-4" />
                        </div>
                        <input
                          type="tel"
                          required
                          pattern="[0-9]{10}"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                          placeholder="10-digit mobile number"
                          className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl font-medium text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-all text-sm"
                        />
                      </div>
                    </div>


                  </div>
                </div>

                {/* Banking Information Section */}
                <div className="glass-panel rounded-3xl p-6 md:p-8 border border-white/10 space-y-6">
                  <div className="flex items-center gap-2 pb-4 border-b border-white/5">
                    <Building className="w-5 h-5 text-secondary" />
                    <h2 className="text-lg font-bold text-white">Banking Details</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Bank Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Bank Name</label>
                      <input
                        type="text"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        placeholder="e.g. HDFC Bank"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl font-medium text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-all text-sm"
                      />
                    </div>

                    {/* Account Number with Masking */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Account Number</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary transition-colors">
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <input
                          type={isAccountMasked ? "password" : "text"}
                          pattern="[0-9]{9,18}"
                          value={accountNumber}
                          onChange={(e) => setAccountNumber(e.target.value)}
                          placeholder="Enter bank account number"
                          className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl font-medium text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-all text-sm tracking-wide"
                        />
                        <button
                          type="button"
                          onClick={() => setIsAccountMasked(!isAccountMasked)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                          title={isAccountMasked ? "Show account number" : "Hide account number"}
                        >
                          {isAccountMasked ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* IFSC Code */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">IFSC Code</label>
                      <input
                        type="text"
                        pattern="^[A-Z]{4}0[A-Z0-9]{6}$"
                        value={ifscCode}
                        onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                        placeholder="e.g. HDFC0000123"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl font-medium text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-all text-sm uppercase"
                      />
                    </div>

                    {/* UPI ID */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">UPI ID (Optional)</label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="e.g. username@okhdfc"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl font-medium text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-all text-sm"
                      />
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end pt-4 border-t border-white/5 mt-6">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-8 py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover shadow-lg hover:shadow-primary/30 active:scale-[0.98] transition-all cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4.5 h-4.5 animate-spin" />
                          Saving changes...
                        </span>
                      ) : (
                        "Save Profile Details"
                      )}
                    </button>
                  </div>
                </div>

                {/* Payment Notice & History Section */}
                {userData?.role !== "admin" && (
                  <div className="glass-panel rounded-3xl p-6 md:p-8 border border-white/10 space-y-6">
                    <div className="flex items-center gap-2 pb-4 border-b border-white/5">
                      <DollarSign className="w-5 h-5 text-amber-400" />
                      <h2 className="text-lg font-bold text-white">Payment Status & History</h2>
                    </div>

                    {profileData?.paymentSent && (
                      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 flex items-start gap-4 mb-6">
                        <div className="p-3 bg-amber-500/20 rounded-xl text-amber-400">
                          <CreditCard className="w-6 h-6 animate-pulse" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Last Payment Sent Details</p>
                          <p className="text-lg font-extrabold text-white mt-1">{profileData.paymentSent}</p>
                          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                            This payment has been dispatched by the administration to your registered banking details. If you have any questions or find discrepancies, please contact your administrator.
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      <h3 className="text-sm font-bold text-white">All Dispatched Payments</h3>
                      {loadingPayments ? (
                        <div className="py-8 flex items-center justify-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin text-primary" />
                          <p className="text-xs text-slate-500 animate-pulse">Loading transaction records...</p>
                        </div>
                      ) : payments.length === 0 ? (
                        <p className="text-xs text-slate-500 italic bg-white/3 p-4 border border-white/5 rounded-2xl">
                          No payment records logged in history.
                        </p>
                      ) : (
                        <div className="overflow-x-auto border border-white/5 rounded-2xl bg-white/3">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b border-white/5 text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-white/2">
                                <th className="py-3 px-4 font-semibold">Payment Date</th>
                                <th className="py-3 px-4 font-semibold">Recorded Date & Time</th>
                                <th className="py-3 px-4 font-semibold text-right">Amount</th>
                                <th className="py-3 px-4 font-semibold">Method</th>
                                <th className="py-3 px-4 font-semibold">Transaction ID</th>
                                <th className="py-3 px-4 font-semibold">Remarks</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/3">
                              {payments.map((p) => {
                                let formattedRecordedAt = "N/A";
                                if (p.createdTime) {
                                  const dateObj = p.createdTime.seconds
                                    ? new Date(p.createdTime.seconds * 1000)
                                    : new Date(p.createdTime);
                                  
                                  formattedRecordedAt = dateObj.toLocaleString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                  });
                                }

                                return (
                                  <tr key={p.id} className="text-xs hover:bg-white/2 transition-colors">
                                    <td className="py-3.5 px-4 text-slate-300 font-semibold whitespace-nowrap">
                                      {p.paymentDate}
                                    </td>
                                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                                      {formattedRecordedAt}
                                    </td>
                                    <td className="py-3.5 px-4 text-right font-extrabold text-white whitespace-nowrap">
                                      ₹{Number(p.amount).toLocaleString("en-IN")}
                                    </td>
                                    <td className="py-3.5 px-4 text-slate-300">
                                      {p.paymentMethod}
                                    </td>
                                    <td className="py-3.5 px-4 text-slate-400 font-mono whitespace-nowrap" title={p.transactionId}>
                                      {p.transactionId || <span className="text-slate-600 italic">None</span>}
                                    </td>
                                    <td className="py-3.5 px-4 text-slate-400 max-w-[150px] truncate" title={p.remarks}>
                                      {p.remarks || <span className="text-slate-600 italic">-</span>}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </ProtectedRoute>
  );
}
