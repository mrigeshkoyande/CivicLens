"use client";

import {
  createContext, useContext, useEffect, useState, useCallback, ReactNode,
} from "react";
import {
  onAuthStateChanged, signInWithPopup, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, signOut, updateProfile, type User,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider, firebaseReady, USERS_COLLECTION } from "@/lib/firebase";

interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  civicScore: number;
  district: string;
  createdAt?: unknown;
}

interface AuthCtx {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  firebaseEnabled: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const Ctx = createContext<AuthCtx>({
  user: null, profile: null, loading: false, firebaseEnabled: false,
  loginWithGoogle: async () => {},
  loginWithEmail:  async () => {},
  registerWithEmail: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(Ctx);

async function upsertUserProfile(user: User): Promise<UserProfile> {
  if (!db) return { uid: user.uid, displayName: user.displayName, email: user.email, photoURL: user.photoURL, civicScore: 100, district: "District 4" };
  const ref  = doc(db, USERS_COLLECTION, user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    const profile: UserProfile = {
      uid: user.uid, displayName: user.displayName,
      email: user.email, photoURL: user.photoURL,
      civicScore: 100, district: "District 4",
      createdAt: serverTimestamp(),
    };
    await setDoc(ref, profile);
    return profile;
  }
  return snap.data() as UserProfile;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(firebaseReady); // only show loading if Firebase is configured

  useEffect(() => {
    if (!firebaseReady || !auth) { setTimeout(() => setLoading(false), 0); return; }
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) { try { setProfile(await upsertUserProfile(u)); } catch { /* offline */ } }
      else    { setProfile(null); }
      setLoading(false);
    });
    return unsub;
  }, []);

  const loginWithGoogle = useCallback(async () => {
    if (!auth || !googleProvider) throw new Error("Firebase not configured.");
    const result = await signInWithPopup(auth, googleProvider);
    setProfile(await upsertUserProfile(result.user));
  }, []);

  const loginWithEmail = useCallback(async (email: string, pass: string) => {
    if (!auth) throw new Error("Firebase not configured.");
    const result = await signInWithEmailAndPassword(auth, email, pass);
    setProfile(await upsertUserProfile(result.user));
  }, []);

  const registerWithEmail = useCallback(async (name: string, email: string, pass: string) => {
    if (!auth) throw new Error("Firebase not configured.");
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(result.user, { displayName: name });
    setProfile(await upsertUserProfile(result.user));
  }, []);

  const logout = useCallback(async () => {
    if (!auth) return;
    await signOut(auth);
    setUser(null);
    setProfile(null);
  }, []);

  return (
    <Ctx.Provider value={{ user, profile, loading, firebaseEnabled: firebaseReady, loginWithGoogle, loginWithEmail, registerWithEmail, logout }}>
      {children}
    </Ctx.Provider>
  );
}
