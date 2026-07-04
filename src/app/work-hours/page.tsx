"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { collection, doc, setDoc, getDocs, query, where, updateDoc, serverTimestamp, deleteDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Loader2, Calendar, Clock, FileText, Plus, Edit3, CheckCircle, AlertCircle, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface WorkLog {
  id: string;
  employeeId: string;
  date: string;
  hoursWorked: number;
  workDescription: string;
  createdTime: any;
  updatedTime: any;
}

export default function WorkHoursPage() {
  const { user, profileData, refreshProfile } = useAuth();

  // Logs States
  const [logs, setLogs] = useState<WorkLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);

  // Form States
  const [hours, setHours] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  // PDF Document States
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [pdfError, setPdfError] = useState("");
  const [pdfSuccess, setPdfSuccess] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatusText, setUploadStatusText] = useState("");

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.type !== "application/pdf") {
      setPdfError("Please select a valid PDF file.");
      return;
    }

    if (file.size > 100 * 1024 * 1024) { // 100MB limit
      setPdfError("File size exceeds 100MB limit.");
      return;
    }

    setUploadingPdf(true);
    setPdfError("");
    setPdfSuccess("");
    setUploadProgress(0);
    setUploadStatusText("Initializing upload...");

    try {
      // 1. Upload to Firebase Storage with progress tracking
      const storageRef = ref(storage, `signed_documents/${user.uid}/signed_agreement.pdf`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      await new Promise<void>((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            const transferredMB = (snapshot.bytesTransferred / (1024 * 1024)).toFixed(1);
            const totalMB = (snapshot.totalBytes / (1024 * 1024)).toFixed(1);
            setUploadProgress(Math.round(progress));
            setUploadStatusText(`Uploading... ${transferredMB}MB of ${totalMB}MB (${Math.round(progress)}%)`);
          },
          (error) => {
            reject(error);
          },
          () => {
            resolve();
          }
        );
      });

      const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);

      // Transition UI to success immediately
      setUploadingPdf(false);
      setPdfSuccess("Signed document uploaded successfully!");

      // 2. Perform DB update and refresh in the background
      const profileRef = doc(db, "employee_profiles", user.uid);
      updateDoc(profileRef, {
        signedDocumentUrl: downloadUrl,
        signedDocumentUploadedAt: new Date().toISOString()
      }).then(() => {
        refreshProfile();
      }).catch(err => {
        console.error("Error updating Firestore in background:", err);
      });

    } catch (err: any) {
      console.error("Error uploading PDF:", err);
      setPdfError("Failed to upload PDF. Please try again.");
      setUploadingPdf(false);
    } finally {
      setTimeout(() => {
        setPdfSuccess("");
        setPdfError("");
        setUploadProgress(0);
        setUploadStatusText("");
      }, 5000);
    }
  };

  // Selected Date State
  const [selectedDate, setSelectedDate] = useState("");

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Date helpers
  const getTodayDateString = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getThreeMonthsAgoDateString = () => {
    const d = new Date();
    d.setMonth(d.getMonth() - 3);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const todayStr = getTodayDateString();

  // Initialize selectedDate once todayStr is available
  useEffect(() => {
    if (todayStr && !selectedDate) {
      setSelectedDate(todayStr);
    }
  }, [todayStr]);

  // Load employee logs
  const fetchLogs = async () => {
    if (!user) return;
    setLoadingLogs(true);
    try {
      const q = query(
        collection(db, "work_logs"),
        where("employeeId", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as WorkLog[];
      
      // Sort client-side desc by date to avoid composite index requirement
      data.sort((a, b) => b.date.localeCompare(a.date));

      // Filter and clean up logs older than 3 months
      const threeMonthsAgoLimit = getThreeMonthsAgoDateString();
      const logsToKeep: WorkLog[] = [];
      const deletePromises: Promise<void>[] = [];

      data.forEach((log) => {
        if (log.date < threeMonthsAgoLimit) {
          const docRef = doc(db, "work_logs", log.id);
          deletePromises.push(deleteDoc(docRef));
        } else {
          logsToKeep.push(log);
        }
      });

      if (deletePromises.length > 0) {
        Promise.all(deletePromises)
          .then(() => console.log(`Cleaned up ${deletePromises.length} old logs.`))
          .catch((e) => console.error("Error purging old logs:", e));
      }

      setLogs(logsToKeep);
    } catch (err) {
      console.error("Error loading logs:", err);
    } finally {
      setLoadingLogs(false);
    }
  };

  // Sync form inputs reactively based on selectedDate and logs
  useEffect(() => {
    if (!selectedDate) return;
    const existingLog = logs.find((log) => log.date === selectedDate);
    if (existingLog) {
      setHours(existingLog.hoursWorked.toString());
      setDescription(existingLog.workDescription || "");
    } else {
      setHours("");
      setDescription("");
    }
  }, [selectedDate, logs]);

  useEffect(() => {
    fetchLogs();
  }, [user]);

  // Totals Calculations
  const getHoursTotals = () => {
    let todayHours = 0;
    let weeklyHours = 0;
    let monthlyHours = 0;
    let threeMonthHours = 0;

    const now = new Date();
    const currentMonth = now.getMonth(); // 0-11

    // Find Monday of the current week
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday...
    const distanceToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - distanceToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const threeMonthsAgoLimit = getThreeMonthsAgoDateString();

    logs.forEach((log) => {
      const hoursNum = Number(log.hoursWorked) || 0;
      
      // Parse log date YYYY-MM-DD
      const [year, month, day] = log.date.split("-").map(Number);
      const logDateObj = new Date(year, month - 1, day);

      // 1. Today
      if (log.date === todayStr) {
        todayHours += hoursNum;
      }

      // 2. This Week
      if (logDateObj >= startOfWeek && logDateObj <= now) {
        weeklyHours += hoursNum;
      }

      // 3. This Month
      if (logDateObj >= thirtyDaysAgo && logDateObj <= now) {
        monthlyHours += hoursNum;
      }

      // 4. Last 3 Months
      if (log.date >= threeMonthsAgoLimit) {
        threeMonthHours += hoursNum;
      }
    });

    return { todayHours, weeklyHours, monthlyHours, threeMonthHours };
  };

  const { todayHours, weeklyHours, monthlyHours, threeMonthHours } = getHoursTotals();

  // Submit/Update Log Form
  const handleLogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setFormError("");
    setFormSuccess("");

    const hoursNum = parseFloat(hours);
    if (isNaN(hoursNum) || hoursNum <= 0 || hoursNum > 24) {
      setFormError("Please enter valid hours worked (between 0.1 and 24).");
      return;
    }

    setIsSubmitting(true);

    try {
      const docId = `${user.uid}_${selectedDate}`;
      const docRef = doc(db, "work_logs", docId);
      
      const logData = {
        employeeId: user.uid,
        date: selectedDate,
        hoursWorked: hoursNum,
        workDescription: description.trim(),
        updatedTime: new Date(),
      };

      const existingLog = logs.find((log) => log.date === selectedDate);

      if (existingLog) {
        // Update
        await updateDoc(docRef, logData);
        setFormSuccess(`Work entry for ${formatDisplayDate(selectedDate)} updated successfully!`);
      } else {
        // Create
        await setDoc(docRef, {
          ...logData,
          createdTime: serverTimestamp(),
        });
        setFormSuccess(`Work entry for ${formatDisplayDate(selectedDate)} logged successfully!`);
      }

      await fetchLogs();
    } catch (err: any) {
      console.error(err);
      setFormError("Failed to save entry. Please verify security settings.");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setFormSuccess(""), 4000);
    }
  };

  // Check if today is logged
  const hasLoggedToday = logs.some((log) => log.date === todayStr);

  // Filter history list
  const filteredLogs = logs.filter((log) => {
    return (
      log.date.includes(searchTerm) ||
      log.workDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.hoursWorked.toString().includes(searchTerm)
    );
  });

  // Pagination logs helper
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLogs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  const formatDisplayDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  };

  const getAllowedDates = () => {
    const dates = [];
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const todayDate = now.getDate();

    for (let day = todayDate; day >= 1; day--) {
      const d = new Date(currentYear, currentMonth, day);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const value = `${yyyy}-${mm}-${dd}`;
      
      let label = formatDisplayDate(value);
      if (value === todayStr) {
        label += " (Today)";
      }
      dates.push({ value, label });
    }
    return dates;
  };

  return (
    <ProtectedRoute allowedRoles={["employee"]}>
      <Navbar />
      <main className="flex-1 w-full bg-[#030014] text-slate-100 py-24 md:py-28 relative overflow-x-hidden">
        {/* Spotlights */}
        <div className="absolute top-[10%] left-[-10%] w-[35%] h-[35%] bg-[#0A4DFF]/8 blur-[100px] rounded-full pointer-events-none z-0" />
        <div className="absolute bottom-[20%] right-[-10%] w-[35%] h-[35%] bg-[#FF7A00]/5 blur-[100px] rounded-full pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl font-display font-extrabold text-white tracking-tight">
              Work <span className="text-gradient-orange">Hours Log</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1.5">
              Submit your work hours and review historical activity logs.
            </p>
          </div>

          {/* Quick Stats Dashboard Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
            <div className="glass-panel p-3.5 sm:p-5 rounded-2xl border border-white/10 flex items-center gap-2.5 sm:gap-4 min-w-0">
              <div className="p-2.5 sm:p-3 bg-primary/10 rounded-xl text-primary flex-shrink-0">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-500 tracking-wider truncate">Today's Hours</p>
                <p className="text-lg sm:text-xl font-extrabold text-white mt-0.5">{todayHours} hrs</p>
              </div>
            </div>

            <div className="glass-panel p-3.5 sm:p-5 rounded-2xl border border-white/10 flex items-center gap-2.5 sm:gap-4 min-w-0">
              <div className="p-2.5 sm:p-3 bg-secondary/10 rounded-xl text-secondary flex-shrink-0">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-500 tracking-wider truncate">Weekly Hours</p>
                <p className="text-lg sm:text-xl font-extrabold text-white mt-0.5">{weeklyHours} hrs</p>
              </div>
            </div>

            <div className="glass-panel p-3.5 sm:p-5 rounded-2xl border border-white/10 flex items-center gap-2.5 sm:gap-4 min-w-0">
              <div className="p-2.5 sm:p-3 bg-emerald-500/10 rounded-xl text-emerald-400 flex-shrink-0">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-500 tracking-wider truncate">Monthly Hours</p>
                <p className="text-lg sm:text-xl font-extrabold text-white mt-0.5">{monthlyHours} hrs</p>
              </div>
            </div>

            <div className="glass-panel p-3.5 sm:p-5 rounded-2xl border border-white/10 flex items-center gap-2.5 sm:gap-4 min-w-0">
              <div className="p-2.5 sm:p-3 bg-purple-500/10 rounded-xl text-purple-400 flex-shrink-0">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-500 tracking-wider truncate">3-Month Hours</p>
                <p className="text-lg sm:text-xl font-extrabold text-white mt-0.5">{threeMonthHours} hrs</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Box: Submit Work Log Card */}
            <div className="lg:col-span-1 space-y-6 min-w-0">
              <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    {logs.some((l) => l.date === selectedDate) ? (
                      <>
                        <Edit3 className="w-5 h-5 text-secondary" />
                        Edit Work Log
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5 text-primary" />
                        Log Work Hours
                      </>
                    )}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Select a date in the current month to log or edit your hours.
                  </p>
                </div>

                <form onSubmit={handleLogSubmit} className="space-y-4">
                  {formError && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      <span>{formError}</span>
                    </div>
                  )}

                  {formSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>{formSuccess}</span>
                    </div>
                  )}

                  {/* Date Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Log Date</label>
                    <select
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl font-medium text-white focus:outline-none focus:border-primary transition-all text-sm cursor-pointer"
                    >
                      {getAllowedDates().map((d) => (
                        <option key={d.value} value={d.value} className="bg-[#0f172a] text-white">
                          {d.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Hours Worked */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Hours Worked</label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        max="24"
                        required
                        value={hours}
                        onChange={(e) => setHours(e.target.value)}
                        placeholder="e.g. 8.5"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl font-medium text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-all text-sm"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-bold">hrs</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Work Description (Optional)</label>
                    <textarea
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Detail task updates, completed tickets, or engineering tasks done..."
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl font-medium text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-all text-sm resize-none"
                    />
                  </div>

                  {/* Save/Update Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 text-white font-semibold rounded-xl active:scale-[0.98] transition-all cursor-pointer text-sm flex items-center justify-center gap-2 ${
                      logs.some((l) => l.date === selectedDate)
                        ? "bg-secondary hover:bg-secondary-hover shadow-lg hover:shadow-secondary/30"
                        : "bg-primary hover:bg-primary-hover shadow-lg hover:shadow-primary/30"
                    }`}
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4.5 h-4.5 animate-spin" />
                    ) : logs.some((l) => l.date === selectedDate) ? (
                      "Update Entry"
                    ) : (
                      "Log Hours"
                    )}
                  </button>

                  <p className="text-[10px] text-slate-500 leading-normal text-center bg-white/3 p-2.5 border border-white/5 rounded-lg">
                    Dates from previous months are locked. Select any date from this month to add or modify records.
                  </p>
                </form>
              </div>

              {/* PDF Sign Card */}
              <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-secondary" />
                    Agreement Document
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Download the agreement, sign it, and upload the signed PDF.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Download Template Button */}
                  <div className="p-4 bg-white/3 border border-white/5 rounded-2xl flex flex-col gap-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold text-slate-200">Agreement Template</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Filename: yugansh (1).pdf</p>
                      </div>
                      <a
                        href="/yugansh (1).pdf"
                        download="yugansh_agreement.pdf"
                        className="px-3.5 py-2 bg-secondary/10 hover:bg-secondary/20 text-secondary hover:text-white border border-secondary/20 rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer w-full sm:w-auto justify-center"
                      >
                        Download Template
                      </a>
                    </div>
                  </div>

                  {/* Upload PDF Form */}
                  <div className="p-4 bg-white/3 border border-white/5 rounded-2xl space-y-3.5">
                    <p className="text-xs font-bold text-slate-200">Upload Signed Agreement</p>
                    
                    {pdfError && (
                      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        <span>{pdfError}</span>
                      </div>
                    )}
                    {pdfSuccess && (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>{pdfSuccess}</span>
                      </div>
                    )}

                    <div className="flex flex-col gap-2">
                      {uploadingPdf ? (
                        <div className="w-full border-2 border-dashed border-white/10 rounded-xl py-6 px-4 bg-white/2 flex flex-col items-center justify-center space-y-3">
                          <Loader2 className="w-6 h-6 animate-spin text-primary animate-pulse" />
                          <div className="w-full bg-white/5 rounded-full h-1.5 max-w-[200px] overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-primary to-secondary h-1.5 rounded-full transition-all duration-300" 
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-semibold text-slate-300 text-center">
                            {uploadStatusText}
                          </span>
                        </div>
                      ) : (
                        <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-white/10 hover:border-primary/30 rounded-xl py-6 bg-white/2 hover:bg-white/5 transition-all cursor-pointer relative">
                          <Plus className="w-6 h-6 text-slate-400 mb-1" />
                          <span className="text-xs font-semibold text-slate-300">
                            Choose Signed PDF
                          </span>
                          <span className="text-[9px] text-slate-500 mt-1">PDF max 100MB</span>
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={handlePdfUpload}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>

                    {profileData?.signedDocumentUrl && (
                      <div className="pt-3 border-t border-white/5 flex flex-col gap-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Status:</span>
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Uploaded
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-slate-500">Uploaded on:</span>
                          <span className="text-slate-300">
                            {profileData.signedDocumentUploadedAt 
                              ? new Date(profileData.signedDocumentUploadedAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric" })
                              : "N/A"}
                          </span>
                        </div>
                        <a
                          href={profileData.signedDocumentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 text-center w-full py-2.5 bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary-light hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer block"
                        >
                          View Uploaded PDF
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Box: Work History Table */}
            <div className="lg:col-span-2 space-y-4 min-w-0">
              <div className="glass-panel rounded-3xl p-6 border border-white/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5 mb-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Log History
                  </h3>

                  {/* Search Bar */}
                  <div className="relative w-full sm:w-60 group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary transition-colors">
                      <Search className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                      placeholder="Search description or date..."
                      className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl font-medium text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-all text-xs"
                    />
                  </div>
                </div>

                {loadingLogs ? (
                  <div className="py-20 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-slate-500 text-xs animate-pulse">Loading work logs...</p>
                  </div>
                ) : filteredLogs.length === 0 ? (
                  <div className="py-20 text-center text-slate-500">
                    <AlertCircle className="w-10 h-10 mx-auto mb-2 text-slate-600" />
                    <p className="text-sm font-semibold">No work logs found.</p>
                    <p className="text-xs text-slate-600 mt-1">Logs will show up here once submitted.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Log table container */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-white/5 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                            <th className="pb-3.5 font-bold">Date</th>
                            <th className="pb-3.5 font-bold text-center">Hours</th>
                            <th className="pb-3.5 font-bold pl-4">Work Description</th>
                            <th className="pb-3.5 font-bold text-right">Access</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/3">
                          {currentItems.map((log) => {
                            const isToday = log.date === todayStr;
                            return (
                              <tr key={log.id} className="text-sm hover:bg-white/2 transition-colors">
                                <td className="py-3.5 font-semibold text-slate-200 text-xs">
                                  {formatDisplayDate(log.date)}
                                  {isToday && (
                                    <span className="ml-2 inline-block px-1.5 py-0.5 bg-primary/20 text-primary text-[8px] font-bold rounded">
                                      Today
                                    </span>
                                  )}
                                </td>
                                <td className="py-3.5 text-center font-bold text-white text-xs">
                                  {log.hoursWorked.toFixed(1)}
                                </td>
                                <td className="py-3.5 text-xs text-slate-400 max-w-[180px] truncate pl-4" title={log.workDescription}>
                                  {log.workDescription || <span className="text-slate-600 italic">No description provided</span>}
                                </td>
                                <td className="py-3.5 text-right text-xs">
                                  {selectedDate === log.date ? (
                                    <span className="px-2.5 py-1 bg-amber-500/15 text-amber-400 text-[10px] font-bold rounded-lg border border-amber-500/20">
                                      Editing
                                    </span>
                                  ) : (
                                    (() => {
                                      const [year, month] = log.date.split("-").map(Number);
                                      const nowObj = new Date();
                                      const isCurrentMonth = year === nowObj.getFullYear() && (month - 1) === nowObj.getMonth();
                                      const isEditable = isCurrentMonth && log.date <= todayStr;
                                      
                                      return isEditable ? (
                                        <button
                                          onClick={() => {
                                            setSelectedDate(log.date);
                                            window.scrollTo({ top: 0, behavior: "smooth" });
                                          }}
                                          className="px-2.5 py-1 bg-primary/10 hover:bg-primary/20 text-primary-light hover:text-white text-[10px] font-bold rounded-lg border border-primary/20 cursor-pointer transition-all inline-flex items-center gap-1"
                                          title="Select this log entry to edit"
                                        >
                                          <Edit3 className="w-2.5 h-2.5" />
                                          Edit
                                        </button>
                                      ) : (
                                        <span className="px-2 py-1 bg-slate-500/10 text-slate-500 text-[10px] font-bold rounded-lg border border-white/5">
                                          Locked
                                        </span>
                                      );
                                    })()
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-between items-center pt-4 border-t border-white/5 text-xs">
                        <span className="text-slate-500">
                          Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredLogs.length)} of {filteredLogs.length} entries
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1.5 rounded-lg border border-white/10 text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:text-slate-300 cursor-pointer disabled:cursor-not-allowed text-xs font-semibold"
                          >
                            Prev
                          </button>
                          <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1.5 rounded-lg border border-white/10 text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:text-slate-300 cursor-pointer disabled:cursor-not-allowed text-xs font-semibold"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </ProtectedRoute>
  );
}
