"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { collection, doc, setDoc, getDocs, deleteDoc, updateDoc, query, where } from "firebase/firestore";
import { initializeApp, deleteApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { db, firebaseConfig } from "@/lib/firebase";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Loader2, Users, Clock, Calendar, FileSpreadsheet, FileDown, FileText,
  Search, Plus, Trash2, Edit, Eye, EyeOff, UserPlus, AlertCircle, CheckCircle2,
  User, MapPin, Phone, CreditCard, DollarSign, X, Briefcase, Copy, Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface Employee {
  uid: string;
  name: string;
  email: string;
  age: string;
  gender: string;
  mobile: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  upiId?: string;
  profilePhotoUrl?: string;
  paymentSent?: string;
  signedDocumentUrl?: string;
  signedDocumentUploadedAt?: string;
  // Computed summary
  todayHours: number;
  weeklyHours: number;
  monthlyHours: number;
  threeMonthHours: number;
  totalHours: number;
}

interface WorkLog {
  id: string;
  employeeId: string;
  employeeName?: string;
  date: string;
  hoursWorked: number;
  workDescription: string;
  createdTime: any;
  updatedTime: any;
}

export default function AdminDashboardPage() {
  const { user: currentUser } = useAuth();

  const getTodayDateString = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const todayStr = getTodayDateString();

  // Data States
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [logs, setLogs] = useState<WorkLog[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Tab State
  const [activeTab, setActiveTab] = useState<"stats" | "employees" | "logs">("stats");

  // Search & Filter States
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [logSearch, setLogSearch] = useState("");
  const [filterEmployeeId, setFilterEmployeeId] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };
  
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // New Employee Form
  const [newEmpEmail, setNewEmpEmail] = useState("");
  const [newEmpPassword, setNewEmpPassword] = useState("");
  const [newEmpName, setNewEmpName] = useState("");
  const [newEmpAge, setNewEmpAge] = useState("");
  const [newEmpGender, setNewEmpGender] = useState("");
  const [newEmpMobile, setNewEmpMobile] = useState("");
  const [newEmpBank, setNewEmpBank] = useState("");
  const [newEmpAccount, setNewEmpAccount] = useState("");
  const [newEmpIFSC, setNewEmpIFSC] = useState("");
  const [newEmpUPI, setNewEmpUPI] = useState("");
  const [newEmpPaymentSent, setNewEmpPaymentSent] = useState("");

  // Selected Data for Edit
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
  const [selectedLog, setSelectedLog] = useState<WorkLog | null>(null);
  const [editLogHours, setEditLogHours] = useState("");
  const [editLogDesc, setEditLogDesc] = useState("");

  // Bank display masking state
  const [showAccountsMap, setShowAccountsMap] = useState<{ [key: string]: boolean }>({});

  // Payment Logging States
  const [payAmount, setPayAmount] = useState("");
  const [payDate, setPayDate] = useState("");
  const [payMethod, setPayMethod] = useState("Bank Transfer");
  const [payTxnId, setPayTxnId] = useState("");
  const [payRemarks, setPayRemarks] = useState("");
  const [isLoggingPayment, setIsLoggingPayment] = useState(false);
  const [employeePayments, setEmployeePayments] = useState<any[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [showPayForm, setShowPayForm] = useState(false);

  // Initialize payment date to today once available
  useEffect(() => {
    if (todayStr) {
      setPayDate(todayStr);
    }
  }, [todayStr]);

  const fetchEmployeePayments = async (empId: string) => {
    setLoadingPayments(true);
    try {
      const q = query(collection(db, "payments"), where("employeeId", "==", empId));
      const snap = await getDocs(q);
      const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      list.sort((a: any, b: any) => {
        const timeA = a.createdTime?.seconds || (a.createdTime instanceof Date ? a.createdTime.getTime() : 0);
        const timeB = b.createdTime?.seconds || (b.createdTime instanceof Date ? b.createdTime.getTime() : 0);
        return timeB - timeA;
      });
      setEmployeePayments(list);
    } catch (e) {
      console.error("Error fetching payments: ", e);
    } finally {
      setLoadingPayments(false);
    }
  };

  const handleLogPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmp) return;
    const amountNum = parseFloat(payAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert("Please enter a valid payment amount.");
      return;
    }
    setIsLoggingPayment(true);
    try {
      const paymentRef = doc(collection(db, "payments"));
      const newPayment = {
        employeeId: selectedEmp.uid,
        employeeName: selectedEmp.name,
        amount: amountNum,
        paymentDate: payDate,
        paymentMethod: payMethod,
        transactionId: payTxnId.trim(),
        remarks: payRemarks.trim(),
        createdTime: new Date(),
      };
      await setDoc(paymentRef, newPayment);

      const profileRef = doc(db, "employee_profiles", selectedEmp.uid);
      const summaryString = `₹${amountNum.toLocaleString("en-IN")} via ${payMethod} on ${payDate} (Ref: ${payTxnId || "N/A"})`;
      await setDoc(profileRef, {
        paymentSent: summaryString
      }, { merge: true });

      triggerToast("success", `Logged payment of ₹${amountNum} for ${selectedEmp.name}.`);
      
      setPayAmount("");
      setPayTxnId("");
      setPayRemarks("");
      setPayDate(todayStr);
      setPayMethod("Bank Transfer");
      setShowPayForm(false);

      await fetchEmployeePayments(selectedEmp.uid);
      await loadDashboardData();
    } catch (err: any) {
      console.error(err);
      triggerToast("error", "Failed to record payment details.");
    } finally {
      setIsLoggingPayment(false);
    }
  };

  const toggleAccountVisibility = (uid: string) => {
    setShowAccountsMap(prev => ({ ...prev, [uid]: !prev[uid] }));
  };



  // Load All Firestore Data (Logs & Employees)
  const loadDashboardData = async () => {
    setLoadingData(true);
    try {
      // 1. Fetch Users roles & Employee Profiles
      const profilesSnap = await getDocs(collection(db, "employee_profiles"));
      const usersSnap = await getDocs(collection(db, "users"));
      
      const rolesMap: { [key: string]: string } = {};
      usersSnap.docs.forEach(doc => {
        rolesMap[doc.id] = doc.data().role;
      });

      // 2. Fetch Work Logs
      const logsSnap = await getDocs(collection(db, "work_logs"));
      const rawLogs = logsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as WorkLog[];
      rawLogs.sort((a, b) => b.date.localeCompare(a.date));

      const getThreeMonthsAgoDateString = () => {
        const d = new Date();
        d.setMonth(d.getMonth() - 3);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
      };

      const threeMonthsAgoLimit = getThreeMonthsAgoDateString();

      // Clean up logs older than 3 months in Firestore
      const logsToKeep: WorkLog[] = [];
      const deletePromises: Promise<void>[] = [];

      rawLogs.forEach(log => {
        if (log.date < threeMonthsAgoLimit) {
          const docRef = doc(db, "work_logs", log.id);
          deletePromises.push(deleteDoc(docRef));
        } else {
          logsToKeep.push(log);
        }
      });

      if (deletePromises.length > 0) {
        Promise.all(deletePromises)
          .then(() => console.log(`Admin cleaned up ${deletePromises.length} old logs.`))
          .catch(e => console.error("Error purging old logs:", e));
      }

      // Date helper variables
      const now = new Date();
      const currentMonth = now.getMonth(); // 0-11
      const dayOfWeek = now.getDay();
      const distanceToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - distanceToMonday);
      startOfWeek.setHours(0, 0, 0, 0);

      const thirtyDaysAgo = new Date(now);
      thirtyDaysAgo.setDate(now.getDate() - 30);
      thirtyDaysAgo.setHours(0, 0, 0, 0);

      // 3. Map Employees & calculate summaries in memory to avoid composite indices
      const employeeList = profilesSnap.docs
        .filter(doc => rolesMap[doc.id] === "employee" && !doc.data().isDeleted) // exclude admin roles and soft-deleted profiles
        .map(docSnap => {
          const profile = docSnap.data();
          const uid = docSnap.id;

          // Summarize hours logged
          let todayHours = 0;
          let weeklyHours = 0;
          let monthlyHours = 0;
          let threeMonthHours = 0;
          let totalHours = 0;

          logsToKeep.forEach(log => {
            if (log.employeeId === uid) {
              const hrs = Number(log.hoursWorked) || 0;
              totalHours += hrs;

              const [ly, lm, ld] = log.date.split("-").map(Number);
              const logDate = new Date(ly, lm - 1, ld);

              if (log.date === todayStr) todayHours += hrs;
              if (logDate >= startOfWeek && logDate <= now) weeklyHours += hrs;
              if (logDate >= thirtyDaysAgo && logDate <= now) monthlyHours += hrs;
              if (log.date >= threeMonthsAgoLimit) threeMonthHours += hrs;
            }
          });

          return {
            uid,
            name: profile.name || "",
            email: profile.email || "",
            age: profile.age || "",
            gender: profile.gender || "",
            mobile: profile.mobile || "",
            bankName: profile.bankName || "",
            accountNumber: profile.accountNumber || "",
            ifscCode: profile.ifscCode || "",
            upiId: profile.upiId || "",
            profilePhotoUrl: profile.profilePhotoUrl || "",
            paymentSent: profile.paymentSent || "",
            signedDocumentUrl: profile.signedDocumentUrl || "",
            signedDocumentUploadedAt: profile.signedDocumentUploadedAt || "",
            todayHours,
            weeklyHours,
            monthlyHours,
            threeMonthHours,
            totalHours
          };
        });

      setEmployees(employeeList);

      // Attach Employee Names to Work Logs
      const mappedLogs = logsToKeep.map(log => {
        const emp = employeeList.find(e => e.uid === log.employeeId);
        return {
          ...log,
          employeeName: emp ? emp.name : "System User"
        };
      });

      setLogs(mappedLogs);
    } catch (error) {
      console.error("Error loading admin records:", error);
      triggerToast("error", "Error loading system records. Check credentials.");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadDashboardData();
    }
  }, [currentUser]);

  const triggerToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  // Add Employee (Client-Side Secondary Auth app configuration)
  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setToast(null);
    setIsSaving(true);

    let secondaryApp;
    try {
      // Check if employee profile already exists in Firestore (potentially soft-deleted/archived)
      const q = query(collection(db, "employee_profiles"), where("email", "==", newEmpEmail));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const existingDoc = querySnapshot.docs[0];
        const existingUid = existingDoc.id;

        // Restore in users collection
        await setDoc(doc(db, "users", existingUid), {
          uid: existingUid,
          role: "employee",
          email: newEmpEmail,
          isDeleted: false
        }, { merge: true });

        // Restore/update in employee_profiles collection
        await setDoc(doc(db, "employee_profiles", existingUid), {
          name: newEmpName,
          email: newEmpEmail,
          age: newEmpAge,
          gender: newEmpGender,
          mobile: newEmpMobile,
          bankName: newEmpBank,
          accountNumber: newEmpAccount,
          ifscCode: newEmpIFSC,
          upiId: newEmpUPI,
          profilePhotoUrl: "",
          paymentSent: newEmpPaymentSent,
          isDeleted: false
        }, { merge: true });

        triggerToast("success", `Employee ${newEmpName} restored and details updated successfully!`);
        setShowAddModal(false);
        
        // Reset Form fields
        setNewEmpName("");
        setNewEmpEmail("");
        setNewEmpPassword("");
        setNewEmpAge("");
        setNewEmpGender("");
        setNewEmpMobile("");
        setNewEmpBank("");
        setNewEmpAccount("");
        setNewEmpIFSC("");
        setNewEmpUPI("");
        setNewEmpPaymentSent("");

        await loadDashboardData();
        return;
      }

      // 1. Initialize secondary app to register user without logging current admin out
      secondaryApp = initializeApp(firebaseConfig, "SecondaryAppInstance");
      const secondaryAuth = getAuth(secondaryApp);
      
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, newEmpEmail, newEmpPassword);
      const newUid = userCredential.user.uid;

      // 2. Set employee role in users collection
      await setDoc(doc(db, "users", newUid), {
        uid: newUid,
        role: "employee",
        email: newEmpEmail,
        isDeleted: false
      });

      // 3. Create profile details
      await setDoc(doc(db, "employee_profiles", newUid), {
        name: newEmpName,
        email: newEmpEmail,
        age: newEmpAge,
        gender: newEmpGender,
        mobile: newEmpMobile,
        bankName: newEmpBank,
        accountNumber: newEmpAccount,
        ifscCode: newEmpIFSC,
        upiId: newEmpUPI,
        profilePhotoUrl: "",
        paymentSent: newEmpPaymentSent,
        isDeleted: false
      });

      triggerToast("success", `Employee ${newEmpName} registered successfully!`);
      setShowAddModal(false);
      
      // Reset Form fields
      setNewEmpName("");
      setNewEmpEmail("");
      setNewEmpPassword("");
      setNewEmpAge("");
      setNewEmpGender("");
      setNewEmpMobile("");
      setNewEmpBank("");
      setNewEmpAccount("");
      setNewEmpIFSC("");
      setNewEmpUPI("");
      setNewEmpPaymentSent("");

      await loadDashboardData();
    } catch (err: any) {
      console.error(err);
      let errorMsg = err.message || "Failed to register employee.";
      if (err.code === "auth/email-already-in-use" || err.message?.includes("email-already-in-use")) {
        errorMsg = "This email is already registered in Firebase Authentication. Since Firebase client SDK doesn't allow admins to delete authentication accounts directly, please either delete the user from your Firebase Auth Console manually, or use a different email.";
      }
      triggerToast("error", errorMsg);
    } finally {
      if (secondaryApp) {
        await deleteApp(secondaryApp);
      }
      setIsSaving(false);
    }
  };

  // Edit Employee Profile details (Admin modification)
  const handleEditEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmp) return;
    setIsSaving(true);

    try {
      const docRef = doc(db, "employee_profiles", selectedEmp.uid);
      await setDoc(docRef, {
        name: selectedEmp.name,
        age: selectedEmp.age,
        gender: selectedEmp.gender,
        mobile: selectedEmp.mobile,
        bankName: selectedEmp.bankName,
        accountNumber: selectedEmp.accountNumber,
        ifscCode: selectedEmp.ifscCode,
        upiId: selectedEmp.upiId || "",
        profilePhotoUrl: selectedEmp.profilePhotoUrl || "",
        paymentSent: selectedEmp.paymentSent || "",
      }, { merge: true });

      triggerToast("success", `Updated ${selectedEmp.name}'s profile.`);
      setShowEditModal(false);
      await loadDashboardData();
    } catch (err) {
      console.error(err);
      triggerToast("error", "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Employee account documents (Soft Delete / Archive)
  const handleDeleteEmployee = async (uid: string, name: string) => {
    if (!confirm(`Are you sure you want to delete employee ${name}? This will hide their profile and restrict access.`)) return;

    try {
      // Soft delete: update both users and employee_profiles records with isDeleted: true
      await setDoc(doc(db, "employee_profiles", uid), { isDeleted: true }, { merge: true });
      await setDoc(doc(db, "users", uid), { isDeleted: true }, { merge: true });
      triggerToast("success", `Employee ${name} deleted successfully.`);
      await loadDashboardData();
    } catch (err) {
      console.error(err);
      triggerToast("error", "Failed to delete database record.");
    }
  };

  // Edit Work Entry (Admin override)
  const handleEditWorkLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLog) return;
    const hoursNum = parseFloat(editLogHours);
    if (isNaN(hoursNum) || hoursNum <= 0 || hoursNum > 24) {
      alert("Invalid hours format.");
      return;
    }

    setIsSaving(true);
    try {
      const docRef = doc(db, "work_logs", selectedLog.id);
      await updateDoc(docRef, {
        hoursWorked: hoursNum,
        workDescription: editLogDesc,
        updatedTime: new Date(),
      });

      triggerToast("success", "Work log entry adjusted successfully.");
      setShowLogModal(false);
      await loadDashboardData();
    } catch (err) {
      console.error(err);
      triggerToast("error", "Failed to adjust work log.");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Work Entry
  const handleDeleteWorkLog = async (logId: string) => {
    if (!confirm("Are you sure you want to delete this work log entry?")) return;

    try {
      await deleteDoc(doc(db, "work_logs", logId));
      triggerToast("success", "Work entry deleted.");
      await loadDashboardData();
    } catch (err) {
      console.error(err);
      triggerToast("error", "Failed to delete work log.");
    }
  };

  // Global Statistics Banner calculations
  const getGlobalStats = () => {
    let totalEmpCount = employees.length;
    let activeTodayCount = 0;
    let sumHoursToday = 0;
    let sumHoursWeek = 0;
    let sumHoursMonth = 0;
    let sumHours3Months = 0;

    employees.forEach(emp => {
      if (emp.todayHours > 0) activeTodayCount++;
      sumHoursToday += emp.todayHours;
      sumHoursWeek += emp.weeklyHours;
      sumHoursMonth += emp.monthlyHours;
      sumHours3Months += emp.threeMonthHours;
    });

    return { totalEmpCount, activeTodayCount, sumHoursToday, sumHoursWeek, sumHoursMonth, sumHours3Months };
  };

  const { totalEmpCount, activeTodayCount, sumHoursToday, sumHoursWeek, sumHoursMonth, sumHours3Months } = getGlobalStats();

  // Filter lists based on inputs
  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(employeeSearch.toLowerCase()) ||
    emp.email.toLowerCase().includes(employeeSearch.toLowerCase()) ||
    emp.mobile.includes(employeeSearch)
  );

  const getThreeMonthsAgoDateString = () => {
    const d = new Date();
    d.setMonth(d.getMonth() - 3);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const threeMonthsAgoStr = getThreeMonthsAgoDateString();

  const filteredLogs = logs.filter(log => {
    // Search match
    const searchMatch = 
      log.workDescription.toLowerCase().includes(logSearch.toLowerCase()) ||
      (log.employeeName && log.employeeName.toLowerCase().includes(logSearch.toLowerCase())) ||
      log.date.includes(logSearch);
    
    // Employee filter match
    const empMatch = filterEmployeeId === "" || log.employeeId === filterEmployeeId;

    // Date range match
    let dateMatch = true;
    if (filterStartDate) {
      dateMatch = dateMatch && log.date >= filterStartDate;
    } else {
      // Default to last 3 months
      dateMatch = dateMatch && log.date >= threeMonthsAgoStr;
    }
    if (filterEndDate) {
      dateMatch = dateMatch && log.date <= filterEndDate;
    }

    return searchMatch && empMatch && dateMatch;
  });

  // Mask Bank details Helper
  const maskBankAccount = (num: string) => {
    if (!num) return "";
    if (num.length <= 4) return num;
    return `•••• •••• ${num.substring(num.length - 4)}`;
  };

  // Export to Excel (using sheetjs)
  const handleExportExcel = () => {
    const exportData = filteredLogs.map(log => ({
      "Date": log.date,
      "Employee Name": log.employeeName || "Unknown",
      "Hours Logged": log.hoursWorked,
      "Task Description": log.workDescription || "None",
      "Employee Database ID": log.employeeId,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Work Logs Report");
    XLSX.writeFile(wb, `yugansh_ems_report_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  // Export to PDF (using jspdf and jspdf-autotable)
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("YugAnsh IT Solutions - Employee Operations Report", 14, 15);
    doc.setFontSize(8);
    doc.text(`Generated Date: ${new Date().toLocaleDateString()} | Total Logs Count: ${filteredLogs.length}`, 14, 21);

    const headers = [["Date", "Employee Name", "Hours Worked", "Task Description"]];
    const body = filteredLogs.map(log => [
      log.date,
      log.employeeName || "Unknown",
      `${log.hoursWorked.toFixed(1)} hrs`,
      log.workDescription || "No description"
    ]);

    (doc as any).autoTable({
      head: headers,
      body: body,
      startY: 26,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [10, 77, 255] },
    });

    doc.save(`yugansh_ems_report_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <Navbar />
      <main className="flex-1 w-full bg-[#030014] text-slate-100 py-24 md:py-28 relative overflow-x-hidden">
        {/* Spotlights */}
        <div className="absolute top-[10%] left-[-10%] w-[35%] h-[35%] bg-[#0A4DFF]/8 blur-[100px] rounded-full pointer-events-none z-0" />
        <div className="absolute bottom-[20%] right-[-10%] w-[35%] h-[35%] bg-[#FF7A00]/5 blur-[100px] rounded-full pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-extrabold text-white tracking-tight">
                Admin <span className="text-gradient-blue">Dashboard</span>
              </h1>
              <p className="text-slate-400 text-sm mt-1.5">
                Centralized monitoring, employee directories, and timecard adjustments.
              </p>
            </div>
            
            {/* Tab switch control */}
            <div className="flex bg-white/5 border border-white/10 p-1.5 rounded-full self-start md:self-auto shadow-md">
              {(["stats", "employees", "logs"] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === tab
                      ? "bg-primary text-white shadow-lg"
                      : "text-slate-400 hover:text-white hover:bg-white/3"
                  }`}
                >
                  {tab === "stats" ? "Metrics" : tab === "employees" ? "Employees" : "Work Logs"}
                </button>
              ))}
            </div>
          </div>

          {/* Toast Notification Alert Banner */}
          <AnimatePresence>
            {toast && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`mb-6 p-4 rounded-xl border flex items-center gap-3 text-sm font-semibold max-w-2xl ${
                  toast.type === "success"
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                }`}
              >
                {toast.type === "success" ? (
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 shrink-0" />
                )}
                <span>{toast.text}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {loadingData ? (
            <div className="py-32 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
              <p className="text-slate-500 font-medium animate-pulse text-sm">Aggregating database summaries...</p>
            </div>
          ) : (
            <>
              {/* TAB 1: METRICS AND STATISTICS */}
              {activeTab === "stats" && (
                <div className="space-y-8">
                  {/* KPI Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
                    <div className="glass-panel p-4 sm:p-6 rounded-3xl border border-white/10 flex items-center gap-3.5 sm:gap-5 min-w-0">
                      <div className="p-3 sm:p-4 bg-primary/10 rounded-2xl text-primary flex-shrink-0">
                        <Users className="w-6 h-6 sm:w-8 sm:h-8" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-500 tracking-wider truncate">Total Employees</p>
                        <p className="text-xl sm:text-2xl font-extrabold text-white mt-1">{totalEmpCount}</p>
                      </div>
                    </div>

                    <div className="glass-panel p-4 sm:p-6 rounded-3xl border border-white/10 flex items-center gap-3.5 sm:gap-5 min-w-0">
                      <div className="p-3 sm:p-4 bg-emerald-500/10 rounded-2xl text-emerald-400 flex-shrink-0">
                        <Users className="w-6 h-6 sm:w-8 sm:h-8" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-500 tracking-wider truncate">Active Today</p>
                        <p className="text-xl sm:text-2xl font-extrabold text-white mt-1">{activeTodayCount} / {totalEmpCount}</p>
                      </div>
                    </div>

                    <div className="glass-panel p-4 sm:p-6 rounded-3xl border border-white/10 flex items-center gap-3.5 sm:gap-5 min-w-0">
                      <div className="p-3 sm:p-4 bg-secondary/10 rounded-2xl text-secondary flex-shrink-0">
                        <Clock className="w-6 h-6 sm:w-8 sm:h-8" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-500 tracking-wider truncate">Hours Logged Today</p>
                        <p className="text-xl sm:text-2xl font-extrabold text-white mt-1">{sumHoursToday.toFixed(1)} hrs</p>
                      </div>
                    </div>

                    <div className="glass-panel p-4 sm:p-6 rounded-3xl border border-white/10 flex items-center gap-3.5 sm:gap-5 min-w-0">
                      <div className="p-3 sm:p-4 bg-purple-500/10 rounded-2xl text-purple-400 flex-shrink-0">
                        <Calendar className="w-6 h-6 sm:w-8 sm:h-8" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-500 tracking-wider truncate">This Week's Hours</p>
                        <p className="text-xl sm:text-2xl font-extrabold text-white mt-1">{sumHoursWeek.toFixed(1)} hrs</p>
                      </div>
                    </div>

                    <div className="glass-panel p-4 sm:p-6 rounded-3xl border border-white/10 flex items-center gap-3.5 sm:gap-5 min-w-0">
                      <div className="p-3 sm:p-4 bg-indigo-500/10 rounded-2xl text-indigo-400 flex-shrink-0">
                        <Clock className="w-6 h-6 sm:w-8 sm:h-8" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-500 tracking-wider truncate">This Month's Hours</p>
                        <p className="text-xl sm:text-2xl font-extrabold text-white mt-1">{sumHoursMonth.toFixed(1)} hrs</p>
                      </div>
                    </div>

                    <div className="glass-panel p-4 sm:p-6 rounded-3xl border border-white/10 flex items-center gap-3.5 sm:gap-5 min-w-0">
                      <div className="p-3 sm:p-4 bg-amber-500/10 rounded-2xl text-amber-400 flex-shrink-0">
                        <Calendar className="w-6 h-6 sm:w-8 sm:h-8" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-500 tracking-wider truncate">3-Month Hours</p>
                        <p className="text-xl sm:text-2xl font-extrabold text-white mt-1">{sumHours3Months.toFixed(1)} hrs</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Metics quick instructions */}
                  <div className="p-6 rounded-3xl glass-panel border border-white/10">
                    <h3 className="font-bold text-white mb-2">Metrics Calculation Details</h3>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      All calculations are performed dynamically. "Active Today" represents employees who logged work entries matching {todayStr}. The current calendar week begins on Monday. Excel and PDF exports contain actual work logging descriptions and historical tables. Use the switch tabs above to browse directories or manage work log corrections.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: EMPLOYEE LIST DIRECTORY */}
              {activeTab === "employees" && (
                <div className="space-y-6">
                  {/* Actions Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative w-full sm:w-80 group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary transition-colors">
                        <Search className="w-4.5 h-4.5" />
                      </div>
                      <input
                        type="text"
                        value={employeeSearch}
                        onChange={(e) => setEmployeeSearch(e.target.value)}
                        placeholder="Search by name, email, or mobile..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl font-medium text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-all text-xs"
                      />
                    </div>

                    <button
                      onClick={() => setShowAddModal(true)}
                      className="px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover shadow-lg hover:shadow-primary/30 flex items-center gap-1.5 transition-all text-xs cursor-pointer self-start sm:self-auto"
                    >
                      <UserPlus className="w-4.5 h-4.5" />
                      Add Employee
                    </button>
                  </div>

                  {/* Employee Cards list */}
                  {filteredEmployees.length === 0 ? (
                    <div className="py-20 text-center glass-panel rounded-3xl border border-white/5 text-slate-500">
                      <Users className="w-10 h-10 mx-auto mb-2 text-slate-600" />
                      <p className="text-sm font-semibold">No employees found.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredEmployees.map(emp => (
                        <div key={emp.uid} className="glass-panel rounded-3xl p-6 border border-white/10 flex flex-col justify-between space-y-5">
                          {/* Top part: details */}
                          <div>
                            <div className="flex items-center gap-3.5 mb-4">
                              {emp.profilePhotoUrl ? (
                                <img
                                  src={emp.profilePhotoUrl}
                                  alt="Avatar"
                                  className="w-12 h-12 rounded-full object-cover border border-white/10"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-base font-extrabold border border-white/5">
                                  {emp.name.charAt(0).toUpperCase()}
                                </div>
                              )}
                              <div className="min-w-0">
                                <h4 className="font-bold text-white truncate text-sm">{emp.name}</h4>
                                <p className="text-[10px] text-slate-500 truncate">{emp.email}</p>
                              </div>
                            </div>

                            <div className="space-y-2 border-t border-white/5 pt-4 text-xs">
                              <div className="flex justify-between">
                                <span className="text-slate-500">Phone:</span>
                                <span className="text-slate-300 font-medium">{emp.mobile || "N/A"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">Bank:</span>
                                <span className="text-slate-300 font-medium">
                                  {emp.bankName ? `${emp.bankName} - ` : ""}
                                  {showAccountsMap[emp.uid] ? emp.accountNumber : maskBankAccount(emp.accountNumber) || "N/A"}
                                  {emp.accountNumber && (
                                    <button
                                      onClick={() => toggleAccountVisibility(emp.uid)}
                                      className="ml-1.5 text-primary hover:text-primary-hover inline-block"
                                    >
                                      {showAccountsMap[emp.uid] ? <EyeOff className="w-3 h-3 align-middle" /> : <Eye className="w-3 h-3 align-middle" />}
                                    </button>
                                  )}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">IFSC Code:</span>
                                <span className="text-slate-300 font-medium uppercase">{emp.ifscCode || "N/A"}</span>
                              </div>
                            </div>

                            {/* Hours Summary */}
                            <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-4 mt-4 text-center">
                              <div className="bg-white/3 p-1.5 rounded-lg border border-white/5">
                                <p className="text-[9px] text-slate-500 uppercase font-bold">Week</p>
                                <p className="font-extrabold text-white text-xs mt-0.5">{emp.weeklyHours.toFixed(1)}</p>
                              </div>
                              <div className="bg-white/3 p-1.5 rounded-lg border border-white/5">
                                <p className="text-[9px] text-slate-500 uppercase font-bold">Month</p>
                                <p className="font-extrabold text-white text-xs mt-0.5">{emp.monthlyHours.toFixed(1)}</p>
                              </div>
                              <div className="bg-white/3 p-1.5 rounded-lg border border-white/5">
                                <p className="text-[9px] text-slate-500 uppercase font-bold">3 Months</p>
                                <p className="font-extrabold text-white text-xs mt-0.5">{emp.threeMonthHours.toFixed(1)}</p>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2 pt-2 border-t border-white/5">
                            <button
                              onClick={() => {
                                setSelectedEmp(emp);
                                setShowViewModal(true);
                                fetchEmployeePayments(emp.uid);
                              }}
                              className="flex-1 py-2 bg-primary/10 hover:bg-primary/20 text-primary-light hover:text-white border border-primary/20 rounded-xl transition-all text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              View Profile
                            </button>

                            <button
                              onClick={() => {
                                setSelectedEmp(emp);
                                setShowEditModal(true);
                              }}
                              className="py-2 px-3 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 rounded-xl transition-all text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
                              title="Edit Profile"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            
                            <button
                              onClick={() => handleDeleteEmployee(emp.uid, emp.name)}
                              className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/10 rounded-xl transition-all text-xs cursor-pointer flex items-center justify-center"
                              title="Delete database records"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "logs" && (
                <div className="space-y-6">
                  {/* Default Filter Indicator Banner */}
                  {!filterStartDate && (
                    <div className="px-4.5 py-2.5 bg-primary/10 border border-primary/20 rounded-2xl text-primary-light text-xs font-semibold flex items-center gap-2 max-w-max">
                      <Clock className="w-4 h-4 shrink-0 text-primary" />
                      <span>Showing logs from the previous 3 months by default ({threeMonthsAgoStr} to today). To view older records, select a custom start date.</span>
                    </div>
                  )}
                  {/* Filters Banner */}
                  <div className="glass-panel p-5 rounded-3xl border border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 flex-1">
                      {/* Search description */}
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary transition-colors">
                          <Search className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          value={logSearch}
                          onChange={(e) => setLogSearch(e.target.value)}
                          placeholder="Search description/name..."
                          className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl font-medium text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-all text-xs"
                        />
                      </div>

                      {/* Employee Dropdown filter */}
                      <select
                        value={filterEmployeeId}
                        onChange={(e) => setFilterEmployeeId(e.target.value)}
                        className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl font-medium text-white focus:outline-none focus:border-primary transition-all text-xs appearance-none"
                      >
                        <option value="" className="bg-dark-navy text-slate-400">All Employees</option>
                        {employees.map(e => (
                          <option key={e.uid} value={e.uid} className="bg-dark-navy text-white">{e.name}</option>
                        ))}
                      </select>

                      {/* Start Date */}
                      <input
                        type="date"
                        value={filterStartDate}
                        onChange={(e) => setFilterStartDate(e.target.value)}
                        className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl font-medium text-white focus:outline-none focus:border-primary transition-all text-xs"
                      />

                      {/* End Date */}
                      <input
                        type="date"
                        value={filterEndDate}
                        onChange={(e) => setFilterEndDate(e.target.value)}
                        className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl font-medium text-white focus:outline-none focus:border-primary transition-all text-xs"
                      />
                    </div>

                    {/* Export triggers */}
                    <div className="flex gap-2 shrink-0 self-start md:self-auto">
                      <button
                        onClick={handleExportExcel}
                        className="px-4 py-2 border border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-semibold rounded-xl shadow transition-all text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <FileSpreadsheet className="w-4 h-4" />
                        Excel
                      </button>
                      
                      <button
                        onClick={handleExportPDF}
                        className="px-4 py-2 border border-primary/20 bg-primary/10 hover:bg-primary/20 text-primary font-semibold rounded-xl shadow transition-all text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <FileDown className="w-4 h-4" />
                        PDF
                      </button>
                    </div>
                  </div>

                  {/* Logs Table */}
                  <div className="glass-panel rounded-3xl p-6 border border-white/10">
                    {filteredLogs.length === 0 ? (
                      <div className="py-20 text-center text-slate-500">
                        <AlertCircle className="w-10 h-10 mx-auto mb-2 text-slate-600" />
                        <p className="text-sm font-semibold">No work logs match your filter criteria.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-white/5 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                              <th className="pb-3.5 font-bold">Employee</th>
                              <th className="pb-3.5 font-bold">Date</th>
                              <th className="pb-3.5 font-bold text-center">Hours</th>
                              <th className="pb-3.5 font-bold pl-4">Work Description</th>
                              <th className="pb-3.5 font-bold text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/3">
                            {filteredLogs.map(log => (
                              <tr key={log.id} className="text-sm hover:bg-white/2 transition-colors">
                                <td className="py-3.5 font-bold text-white text-xs">
                                  {log.employeeName || "System User"}
                                </td>
                                <td className="py-3.5 text-slate-300 text-xs">
                                  {log.date}
                                </td>
                                <td className="py-3.5 text-center font-bold text-white text-xs">
                                  {log.hoursWorked.toFixed(1)} hrs
                                </td>
                                <td className="py-3.5 text-xs text-slate-400 max-w-[220px] truncate pl-4" title={log.workDescription}>
                                  {log.workDescription || <span className="text-slate-600 italic">No description</span>}
                                </td>
                                <td className="py-3.5 text-right text-xs">
                                  <div className="inline-flex gap-1.5">
                                    <button
                                      onClick={() => {
                                        setSelectedLog(log);
                                        setEditLogHours(log.hoursWorked.toString());
                                        setEditLogDesc(log.workDescription || "");
                                        setShowLogModal(true);
                                      }}
                                      className="p-1.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 rounded-lg cursor-pointer transition-all"
                                      title="Edit work entry"
                                    >
                                      <Edit className="w-3.5 h-3.5" />
                                    </button>
                                    
                                    <button
                                      onClick={() => handleDeleteWorkLog(log.id)}
                                      className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/10 rounded-lg cursor-pointer transition-all"
                                      title="Delete entry"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* MODAL 1: ADD EMPLOYEE */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl rounded-3xl glass-panel p-6 md:p-8 border border-white/10 shadow-2xl space-y-6 my-8"
            >
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-primary" />
                  Add New Employee
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Registers Auth account and default profile parameters.
                </p>
              </div>

              <form onSubmit={handleAddEmployee} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Account credentials */}
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/3 p-4 border border-white/5 rounded-2xl">
                    <p className="md:col-span-2 text-xs font-bold uppercase tracking-wider text-primary">Auth Credentials</p>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-400">Email Address</label>
                      <input
                        type="email"
                        required
                        value={newEmpEmail}
                        onChange={(e) => setNewEmpEmail(e.target.value)}
                        placeholder="e.g. employee@yugansh.in"
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-primary transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-400">Temporary Password</label>
                      <input
                        type="password"
                        required
                        value={newEmpPassword}
                        onChange={(e) => setNewEmpPassword(e.target.value)}
                        placeholder="Min 6 characters"
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-primary transition-all"
                      />
                    </div>
                  </div>

                  {/* Personal details */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400">Full Name</label>
                    <input
                      type="text"
                      required
                      value={newEmpName}
                      onChange={(e) => setNewEmpName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400">Age</label>
                    <input
                      type="number"
                      required
                      min="18"
                      value={newEmpAge}
                      onChange={(e) => setNewEmpAge(e.target.value)}
                      placeholder="e.g. 25"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400">Gender</label>
                    <select
                      required
                      value={newEmpGender}
                      onChange={(e) => setNewEmpGender(e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-primary transition-all"
                    >
                      <option value="" disabled className="bg-dark-navy text-slate-500">Select Gender</option>
                      <option value="Male" className="bg-dark-navy text-white">Male</option>
                      <option value="Female" className="bg-dark-navy text-white">Female</option>
                      <option value="Other" className="bg-dark-navy text-white">Other</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400">Mobile Number</label>
                    <input
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      value={newEmpMobile}
                      onChange={(e) => setNewEmpMobile(e.target.value)}
                      placeholder="10-digit number"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-primary transition-all"
                    />
                  </div>



                  {/* Bank info */}
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/3 p-4 border border-white/5 rounded-2xl">
                    <p className="md:col-span-2 text-xs font-bold uppercase tracking-wider text-secondary">Bank Credentials</p>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-400">Bank Name</label>
                      <input
                        type="text"
                        required
                        value={newEmpBank}
                        onChange={(e) => setNewEmpBank(e.target.value)}
                        placeholder="e.g. HDFC Bank"
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-primary transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-400">Account Number</label>
                      <input
                        type="text"
                        required
                        pattern="[0-9]{9,18}"
                        value={newEmpAccount}
                        onChange={(e) => setNewEmpAccount(e.target.value)}
                        placeholder="Enter account number"
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-primary transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-400">IFSC Code</label>
                      <input
                        type="text"
                        required
                        pattern="^[A-Z]{4}0[A-Z0-9]{6}$"
                        value={newEmpIFSC}
                        onChange={(e) => setNewEmpIFSC(e.target.value.toUpperCase())}
                        placeholder="e.g. HDFC0000123"
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-primary transition-all uppercase"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-400">UPI ID (Optional)</label>
                      <input
                        type="text"
                        value={newEmpUPI}
                        onChange={(e) => setNewEmpUPI(e.target.value)}
                        placeholder="e.g. username@okhdfc"
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-primary transition-all"
                      />
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="md:col-span-2 grid grid-cols-1 gap-4 bg-white/3 p-4 border border-white/5 rounded-2xl">
                    <p className="text-xs font-bold uppercase tracking-wider text-amber-400">Payment Information</p>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-400">Payment Sent Details (visible to employee)</label>
                      <input
                        type="text"
                        value={newEmpPaymentSent}
                        onChange={(e) => setNewEmpPaymentSent(e.target.value)}
                        placeholder="e.g. ₹15,000 sent on 1st July, or 12000 INR"
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-white/10 text-slate-300 hover:text-white rounded-xl hover:bg-white/5 transition-all text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary-hover shadow-lg transition-all text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                    Save Employee
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: EDIT EMPLOYEE PROFILE */}
      <AnimatePresence>
        {showEditModal && selectedEmp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl rounded-3xl glass-panel p-6 md:p-8 border border-white/10 shadow-2xl space-y-6 my-8"
            >
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Edit className="w-5 h-5 text-primary" />
                  Edit Employee Profile
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Database override for {selectedEmp.name} ({selectedEmp.email}).
                </p>
              </div>

              <form onSubmit={handleEditEmployee} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Personal details */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400">Full Name</label>
                    <input
                      type="text"
                      required
                      value={selectedEmp.name}
                      onChange={(e) => setSelectedEmp({ ...selectedEmp, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400">Age</label>
                    <input
                      type="number"
                      required
                      min="18"
                      value={selectedEmp.age}
                      onChange={(e) => setSelectedEmp({ ...selectedEmp, age: e.target.value })}
                      placeholder="e.g. 25"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400">Gender</label>
                    <select
                      required
                      value={selectedEmp.gender}
                      onChange={(e) => setSelectedEmp({ ...selectedEmp, gender: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-primary transition-all"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400">Mobile Number</label>
                    <input
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      value={selectedEmp.mobile}
                      onChange={(e) => setSelectedEmp({ ...selectedEmp, mobile: e.target.value })}
                      placeholder="10-digit number"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-primary transition-all"
                    />
                  </div>



                  {/* Bank info */}
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/3 p-4 border border-white/5 rounded-2xl">
                    <p className="md:col-span-2 text-xs font-bold uppercase tracking-wider text-secondary">Bank Credentials</p>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-400">Bank Name</label>
                      <input
                        type="text"
                        required
                        value={selectedEmp.bankName}
                        onChange={(e) => setSelectedEmp({ ...selectedEmp, bankName: e.target.value })}
                        placeholder="e.g. HDFC Bank"
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-primary transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-400">Account Number</label>
                      <input
                        type="text"
                        required
                        pattern="[0-9]{9,18}"
                        value={selectedEmp.accountNumber}
                        onChange={(e) => setSelectedEmp({ ...selectedEmp, accountNumber: e.target.value })}
                        placeholder="Enter account number"
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-primary transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-400">IFSC Code</label>
                      <input
                        type="text"
                        required
                        pattern="^[A-Z]{4}0[A-Z0-9]{6}$"
                        value={selectedEmp.ifscCode}
                        onChange={(e) => setSelectedEmp({ ...selectedEmp, ifscCode: e.target.value.toUpperCase() })}
                        placeholder="e.g. HDFC0000123"
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-primary transition-all uppercase"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-400">UPI ID (Optional)</label>
                      <input
                        type="text"
                        value={selectedEmp.upiId || ""}
                        onChange={(e) => setSelectedEmp({ ...selectedEmp, upiId: e.target.value })}
                        placeholder="e.g. username@okhdfc"
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-primary transition-all"
                      />
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="md:col-span-2 grid grid-cols-1 gap-4 bg-white/3 p-4 border border-white/5 rounded-2xl">
                    <p className="text-xs font-bold uppercase tracking-wider text-amber-400">Payment Information</p>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-400">Payment Sent Details (visible to employee)</label>
                      <input
                        type="text"
                        value={selectedEmp.paymentSent || ""}
                        onChange={(e) => setSelectedEmp({ ...selectedEmp, paymentSent: e.target.value })}
                        placeholder="e.g. ₹15,000 sent on 1st July, or 12000 INR"
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 border border-white/10 text-slate-300 hover:text-white rounded-xl hover:bg-white/5 transition-all text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary-hover shadow-lg transition-all text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: ADJUST WORK LOG ENTRY */}
      <AnimatePresence>
        {showLogModal && selectedLog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-3xl glass-panel p-6 border border-white/10 shadow-2xl space-y-6"
            >
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Edit className="w-5 h-5 text-primary" />
                  Adjust Work Log
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Adjusting {selectedLog.employeeName}'s log for {selectedLog.date}.
                </p>
              </div>

              <form onSubmit={handleEditWorkLog} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Hours Worked</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="24"
                    required
                    value={editLogHours}
                    onChange={(e) => setEditLogHours(e.target.value)}
                    placeholder="e.g. 8.0"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl font-medium text-white focus:outline-none focus:border-primary transition-all text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Work Description</label>
                  <textarea
                    rows={4}
                    value={editLogDesc}
                    onChange={(e) => setEditLogDesc(e.target.value)}
                    placeholder="Describe tasks completed..."
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl font-medium text-white focus:outline-none focus:border-primary transition-all text-sm resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowLogModal(false)}
                    className="px-4 py-2 border border-white/10 text-slate-300 hover:text-white rounded-xl hover:bg-white/5 transition-all text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary-hover shadow-lg transition-all text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                    Save Log
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 4: VIEW EMPLOYEE PROFILE */}
      <AnimatePresence>
        {showViewModal && selectedEmp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl rounded-3xl glass-panel p-6 md:p-8 border border-white/10 shadow-2xl relative my-8"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowViewModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-all cursor-pointer"
                title="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-white/5">
                {selectedEmp.profilePhotoUrl ? (
                  <img
                    src={selectedEmp.profilePhotoUrl}
                    alt={selectedEmp.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-primary/50 shadow-lg"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-3xl font-extrabold border-2 border-white/5 shadow-lg">
                    {selectedEmp.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="text-center sm:text-left">
                  <h3 className="text-2xl font-display font-extrabold text-white tracking-tight">{selectedEmp.name}</h3>
                  <p className="text-slate-400 text-sm mt-0.5">{selectedEmp.email}</p>
                  <p className="text-[10px] text-slate-500 uppercase font-mono tracking-wider mt-1.5 bg-white/5 px-2.5 py-1 rounded-full inline-block border border-white/5">
                    ID: {selectedEmp.uid}
                  </p>
                </div>
              </div>

              {/* Details Body */}
              <div className="space-y-6 py-6 max-h-[60vh] overflow-y-auto pr-1">
                {/* Section 1: Personal Details */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                    <User className="w-4 h-4" />
                    Personal Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/3 p-4 border border-white/5 rounded-2xl">
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-500 uppercase font-bold">Age</p>
                      <p className="text-xs font-semibold text-slate-200 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {selectedEmp.age || "N/A"} years
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-500 uppercase font-bold">Gender</p>
                      <p className="text-xs font-semibold text-slate-200 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {selectedEmp.gender || "N/A"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-500 uppercase font-bold">Mobile Phone</p>
                      <p className="text-xs font-semibold text-slate-200 flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {selectedEmp.mobile || "N/A"}
                      </p>
                    </div>

                  </div>
                </div>

                {/* Section 2: Bank Details */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4" />
                    Payment & Bank Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/3 p-4 border border-white/5 rounded-2xl">
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-500 uppercase font-bold">Bank Name</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-semibold text-slate-200">
                          {selectedEmp.bankName || "N/A"}
                        </p>
                        {selectedEmp.bankName && (
                          <button
                            onClick={() => handleCopy(selectedEmp.bankName, "bankName")}
                            className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer flex items-center justify-center"
                            title="Copy Bank Name"
                          >
                            {copiedField === "bankName" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-500 uppercase font-bold">Account Number</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-semibold text-slate-200 font-mono">
                          {selectedEmp.accountNumber || "N/A"}
                        </p>
                        {selectedEmp.accountNumber && (
                          <button
                            onClick={() => handleCopy(selectedEmp.accountNumber, "accountNumber")}
                            className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer flex items-center justify-center"
                            title="Copy Account Number"
                          >
                            {copiedField === "accountNumber" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-500 uppercase font-bold">IFSC Code</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-semibold text-slate-200 font-mono uppercase">
                          {selectedEmp.ifscCode || "N/A"}
                        </p>
                        {selectedEmp.ifscCode && (
                          <button
                            onClick={() => handleCopy(selectedEmp.ifscCode, "ifscCode")}
                            className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer flex items-center justify-center"
                            title="Copy IFSC Code"
                          >
                            {copiedField === "ifscCode" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-500 uppercase font-bold">UPI ID</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-semibold text-slate-200 font-mono">
                          {selectedEmp.upiId || "N/A"}
                        </p>
                        {selectedEmp.upiId && (
                          <button
                            onClick={() => handleCopy(selectedEmp.upiId || "", "upiId")}
                            className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer flex items-center justify-center"
                            title="Copy UPI ID"
                          >
                            {copiedField === "upiId" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Signed Agreement Document */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                    <FileText className="w-4 h-4" />
                    Signed Agreement Document
                  </h4>
                  <div className="bg-white/3 p-4 border border-white/5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    {selectedEmp.signedDocumentUrl ? (
                      <>
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-slate-200">signed_agreement.pdf</p>
                          <p className="text-[10px] text-slate-500">
                            Uploaded on: {selectedEmp.signedDocumentUploadedAt 
                              ? new Date(selectedEmp.signedDocumentUploadedAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric" })
                              : "N/A"}
                          </p>
                        </div>
                        <a
                          href={selectedEmp.signedDocumentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-semibold shadow-lg transition-all cursor-pointer w-full sm:w-auto text-center"
                        >
                          View Signed PDF
                        </a>
                      </>
                    ) : (
                      <div className="flex items-center gap-2 py-1 text-slate-500">
                        <AlertCircle className="w-4 h-4 text-amber-500" />
                        <span className="text-xs font-semibold italic">No signed agreement uploaded yet.</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Section 3: Performance Hours Summary */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4" />
                    Work Hours Summary
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-white/3 p-3.5 rounded-2xl border border-white/5 text-center">
                      <p className="text-[9px] text-slate-500 uppercase font-bold">Today</p>
                      <p className="font-extrabold text-white text-lg mt-1">{selectedEmp.todayHours.toFixed(1)} <span className="text-[10px] font-normal text-slate-400">hrs</span></p>
                    </div>
                    <div className="bg-white/3 p-3.5 rounded-2xl border border-white/5 text-center">
                      <p className="text-[9px] text-slate-500 uppercase font-bold">This Week</p>
                      <p className="font-extrabold text-white text-lg mt-1">{selectedEmp.weeklyHours.toFixed(1)} <span className="text-[10px] font-normal text-slate-400">hrs</span></p>
                    </div>
                    <div className="bg-white/3 p-3.5 rounded-2xl border border-white/5 text-center">
                      <p className="text-[9px] text-slate-500 uppercase font-bold">This Month</p>
                      <p className="font-extrabold text-white text-lg mt-1">{selectedEmp.monthlyHours.toFixed(1)} <span className="text-[10px] font-normal text-slate-400">hrs</span></p>
                    </div>
                    <div className="bg-white/3 p-3.5 rounded-2xl border border-white/5 text-center">
                      <p className="text-[9px] text-slate-500 uppercase font-bold">3 Months</p>
                      <p className="font-extrabold text-white text-lg mt-1">{selectedEmp.threeMonthHours.toFixed(1)} <span className="text-[10px] font-normal text-slate-400">hrs</span></p>
                    </div>
                  </div>
                </div>

                {/* Section 4: Work Logs History (Previous 3 Months) */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    Work Logs History (Previous 3 Months)
                  </h4>
                  {(() => {
                    const empLogs = logs.filter(log => {
                      if (log.employeeId !== selectedEmp.uid) return false;
                      // Only show logs from previous 3 months
                      return log.date >= threeMonthsAgoStr;
                    });

                    return empLogs.length === 0 ? (
                      <p className="text-xs text-slate-500 italic bg-white/3 p-4 border border-white/5 rounded-2xl">
                        No work logs found in the previous 3 months.
                      </p>
                    ) : (
                      <div className="overflow-x-auto max-h-60 border border-white/5 rounded-2xl bg-white/3">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-white/5 text-[9px] font-bold uppercase tracking-wider text-slate-500 bg-white/2">
                              <th className="py-2.5 px-4 font-semibold">Date</th>
                              <th className="py-2.5 px-4 font-semibold text-center">Hours</th>
                              <th className="py-2.5 px-4 font-semibold">Work Description</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/3">
                            {empLogs.map(log => (
                              <tr key={log.id} className="text-xs hover:bg-white/2 transition-colors">
                                <td className="py-2.5 px-4 font-semibold text-slate-300 whitespace-nowrap">
                                  {log.date}
                                </td>
                                <td className="py-2.5 px-4 text-center font-bold text-white">
                                  {log.hoursWorked.toFixed(1)} hrs
                                </td>
                                <td className="py-2.5 px-4 text-slate-400 max-w-[200px] truncate" title={log.workDescription}>
                                  {log.workDescription || <span className="text-slate-600 italic">No description</span>}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })()}
                </div>

                {/* Section 5: Payment History & Log Payment */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4" />
                      Payment History & Actions
                    </h4>
                    <button
                      type="button"
                      onClick={() => setShowPayForm(!showPayForm)}
                      className="px-3 py-1 bg-primary/20 hover:bg-primary/30 text-primary-light hover:text-white rounded-lg border border-primary/30 transition-all text-[10px] font-bold cursor-pointer"
                    >
                      {showPayForm ? "View History" : "Log New Payment"}
                    </button>
                  </div>

                  {showPayForm ? (
                    /* LOG NEW PAYMENT FORM */
                    <form onSubmit={handleLogPayment} className="bg-white/3 border border-white/5 rounded-2xl p-4 space-y-4">
                      <p className="text-[11px] font-bold text-slate-300">Log New Payment to {selectedEmp.name}</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase text-slate-400">Amount (₹) *</label>
                          <input
                            type="number"
                            required
                            min="1"
                            value={payAmount}
                            onChange={(e) => setPayAmount(e.target.value)}
                            placeholder="e.g. 15000"
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-primary transition-all"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase text-slate-400">Payment Date *</label>
                          <input
                            type="date"
                            required
                            value={payDate}
                            onChange={(e) => setPayDate(e.target.value)}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-primary transition-all cursor-pointer"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase text-slate-400">Payment Method *</label>
                          <select
                            value={payMethod}
                            onChange={(e) => setPayMethod(e.target.value)}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-primary transition-all cursor-pointer"
                          >
                            <option value="Bank Transfer" className="bg-slate-900 text-white">Bank Transfer</option>
                            <option value="UPI" className="bg-slate-900 text-white">UPI</option>
                            <option value="Cash" className="bg-slate-900 text-white">Cash</option>
                            <option value="Other" className="bg-slate-900 text-white">Other</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase text-slate-400">Transaction/Reference ID</label>
                          <input
                            type="text"
                            value={payTxnId}
                            onChange={(e) => setPayTxnId(e.target.value)}
                            placeholder="e.g. TXN12345678"
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-primary transition-all"
                          />
                        </div>

                        <div className="sm:col-span-2 space-y-1">
                          <label className="text-[9px] font-bold uppercase text-slate-400">Remarks / Note</label>
                          <input
                            type="text"
                            value={payRemarks}
                            onChange={(e) => setPayRemarks(e.target.value)}
                            placeholder="e.g. June 2026 Monthly Salary"
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-primary transition-all"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setShowPayForm(false)}
                          className="px-3.5 py-1.5 border border-white/10 text-slate-300 hover:text-white rounded-lg hover:bg-white/5 transition-all text-[11px] font-semibold cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isLoggingPayment}
                          className="px-4 py-1.5 bg-primary text-white rounded-lg hover:bg-primary-hover shadow-lg transition-all text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          {isLoggingPayment && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                          Record Payment
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* PAYMENT HISTORY LIST */
                    <div className="space-y-2">
                      {loadingPayments ? (
                        <div className="py-6 flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-primary" />
                          <span className="text-[11px] text-slate-500">Loading payment history...</span>
                        </div>
                      ) : employeePayments.length === 0 ? (
                        <p className="text-xs text-slate-500 italic bg-white/3 p-4 border border-white/5 rounded-2xl">
                          No logged payments found for this employee.
                        </p>
                      ) : (
                        <div className="overflow-x-auto max-h-52 border border-white/5 rounded-2xl bg-white/3">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b border-white/5 text-[9px] font-bold uppercase tracking-wider text-slate-500 bg-white/2">
                                <th className="py-2 px-3 font-semibold">Payment Date</th>
                                <th className="py-2 px-3 font-semibold">Recorded At</th>
                                <th className="py-2 px-3 font-semibold text-right">Amount</th>
                                <th className="py-2 px-3 font-semibold">Method</th>
                                <th className="py-2 px-3 font-semibold">Transaction ID</th>
                                <th className="py-2 px-3 font-semibold">Remarks</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/3">
                              {employeePayments.map((p) => {
                                // Formatted updated time
                                let formattedRecordedAt = "N/A";
                                if (p.createdTime) {
                                  const dateObj = p.createdTime.seconds
                                    ? new Date(p.createdTime.seconds * 1000)
                                    : new Date(p.createdTime);
                                  
                                  formattedRecordedAt = dateObj.toLocaleString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                  });
                                }

                                return (
                                  <tr key={p.id} className="text-[11px] hover:bg-white/2 transition-colors">
                                    <td className="py-2 px-3 text-slate-300 font-semibold whitespace-nowrap">
                                      {p.paymentDate}
                                    </td>
                                    <td className="py-2 px-3 text-slate-400 whitespace-nowrap">
                                      {formattedRecordedAt}
                                    </td>
                                    <td className="py-2 px-3 text-right font-extrabold text-white whitespace-nowrap">
                                      ₹{Number(p.amount).toLocaleString("en-IN")}
                                    </td>
                                    <td className="py-2 px-3 text-slate-300">
                                      {p.paymentMethod}
                                    </td>
                                    <td className="py-2 px-3 text-slate-400 font-mono" title={p.transactionId}>
                                      {p.transactionId || <span className="text-slate-600 italic">None</span>}
                                    </td>
                                    <td className="py-2 px-3 text-slate-400 max-w-[120px] truncate" title={p.remarks}>
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
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowViewModal(false)}
                  className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-all text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </ProtectedRoute>
  );
}
