import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// ── Guard: only init when we have a real API key ──────────────────────────────
const isConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== "your-api-key" &&
  firebaseConfig.projectId
);

let app:            FirebaseApp | null = null;
let _auth:          Auth | null        = null;
let _db:            Firestore | null   = null;
let _googleProvider: GoogleAuthProvider | null = null;

if (isConfigured) {
  try {
    app            = getApps().length ? getApp() : initializeApp(firebaseConfig);
    _auth          = getAuth(app);
    _db            = getFirestore(app);
    _googleProvider = new GoogleAuthProvider();
  } catch {
    // Firebase init failed — continue with null (demo mode)
  }
}

export const auth           = _auth;
export const db             = _db;
export const googleProvider = _googleProvider;
export const firebaseReady  = isConfigured && app !== null;

// ── Firestore collection names ────────────────────────────────────────────────
export const BOOTHS_COLLECTION = "pollingBooths";
export const USERS_COLLECTION  = "users";
