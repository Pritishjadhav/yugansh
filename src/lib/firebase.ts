import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyMockApiKeyForNextjsBuildValidation",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "mock-project.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "mock-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "mock-project.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1234567890:web:1234567890",
};

// Check if credentials are set (avoid crashing build if missing initially)
const isConfigured =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Debug: Log storage configuration
if (typeof window !== 'undefined') {
  console.log("[FIREBASE CONFIG] Storage Bucket:", firebaseConfig.storageBucket);
  console.log("[FIREBASE CONFIG] Project ID:", firebaseConfig.projectId);
  console.log("[FIREBASE CONFIG] Full Config:", {
    authDomain: firebaseConfig.authDomain,
    storageBucket: firebaseConfig.storageBucket,
    projectId: firebaseConfig.projectId
  });
}

export { app, auth, db, storage, firebaseConfig, isConfigured };
