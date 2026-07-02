"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Loader2 } from "lucide-react";

export default function DashboardHub() {
  const { userData, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && userData) {
      if (userData.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/work-hours");
      }
    }
  }, [userData, loading, router]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex items-center justify-center bg-[#030014] text-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-slate-400 font-sans tracking-wide text-sm animate-pulse">
            Routing you to your workspace...
          </p>
        </div>
      </div>
    </ProtectedRoute>
  );
}
