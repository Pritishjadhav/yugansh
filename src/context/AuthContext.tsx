"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, collection, getDocs, limit, query } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export interface UserData {
  uid: string;
  role: "admin" | "employee";
  email: string;
}

export interface ProfileData {
  name: string;
  age: string;
  gender: string;
  mobile: string;
  email: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  upiId?: string;
  profilePhotoUrl?: string;
  paymentSent?: string;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  profileData: ProfileData | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  profileData: null,
  loading: true,
  logout: async () => {},
  refreshProfile: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    if (!auth.currentUser) return;
    const currentUser = auth.currentUser;
    
    // 1. Try to load cached data from localStorage for instant routing
    const cacheKey = `auth_cache_${currentUser.uid}`;
    let cachedRole: "admin" | "employee" | null = null;
    let cachedProfile: ProfileData | null = null;
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.role) cachedRole = parsed.role;
        if (parsed.profile) cachedProfile = parsed.profile;
      }
    } catch (e) {
      console.warn("Could not read auth cache from localStorage:", e);
    }

    // Determine default/fallback role based on email or cache
    let role: "admin" | "employee" = cachedRole || (currentUser.email === "admin@yugansh.in" ? "admin" : "employee");
    
    // Set initial data immediately from cache or fallback so app can route instantly
    setUserData({
      uid: currentUser.uid,
      role,
      email: currentUser.email || "",
    });

    const defaultProfile: ProfileData = cachedProfile || {
      name: currentUser.displayName || "",
      age: "",
      gender: "",
      mobile: "",
      email: currentUser.email || "",
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      upiId: "",
      profilePhotoUrl: "",
    };
    setProfileData(defaultProfile);

    // 2. Fetch fresh data from Firestore in the background
    // We execute this in an async IIFE so that refreshProfile resolves instantly.
    (async () => {
      try {
        // 1. Get user role from Firestore
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          role = userSnap.data().role || role;
        } else {
          // If the user document doesn't exist yet, check if it is the very first user
          // (with a nested catch to avoid throwing if list rules are restricted)
          let isFirstUser = false;
          try {
            const usersCol = collection(db, "users");
            const q = query(usersCol, limit(1));
            const usersSnap = await getDocs(q);
            isFirstUser = usersSnap.empty;
          } catch (e) {
            console.warn("Could not check if first user due to permission rules, defaulting to false:", e);
          }
          
          if (isFirstUser) {
            role = "admin";
          }
          
          const newUserData = { uid: currentUser.uid, role, email: currentUser.email || "" };
          try {
            await setDoc(userRef, newUserData);
          } catch (e) {
            console.error("Could not write user role document:", e);
          }
        }

        // Update state with fresh role
        setUserData({
          uid: currentUser.uid,
          role,
          email: currentUser.email || "",
        });

        // 2. Get profile data from Firestore
        const profileRef = doc(db, "employee_profiles", currentUser.uid);
        const profileSnap = await getDoc(profileRef);
        let freshProfile = defaultProfile;
        if (profileSnap.exists()) {
          freshProfile = profileSnap.data() as ProfileData;
        } else {
          try {
            await setDoc(profileRef, defaultProfile);
          } catch (e) {
            console.error("Could not create default profile in Firestore:", e);
          }
        }
        setProfileData(freshProfile);

        // Update localStorage cache
        try {
          localStorage.setItem(cacheKey, JSON.stringify({ role, profile: freshProfile }));
        } catch (e) {
          console.warn("Could not save auth cache to localStorage:", e);
        }
      } catch (error) {
        console.error("Error loading fresh user data in background:", error);
      }
    })();
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await refreshProfile();
      } else {
        setUserData(null);
        setProfileData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    setLoading(true);
    if (auth.currentUser) {
      try {
        localStorage.removeItem(`auth_cache_${auth.currentUser.uid}`);
      } catch (e) {
        console.warn("Could not clear auth cache:", e);
      }
    }
    await signOut(auth);
    setUser(null);
    setUserData(null);
    setProfileData(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, userData, profileData, loading, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
