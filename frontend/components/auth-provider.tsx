"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User
} from "firebase/auth";
import { getFirebaseAuth, getGoogleProvider } from "@/lib/firebase";
import { apiFetch } from "@/lib/api";

type RegisterInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  graduationYear: string;
};

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  registerWithEmail: (input: RegisterInput) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function syncUserProfile(extra?: Partial<RegisterInput>) {
  const currentUser = getFirebaseAuth().currentUser;

  if (!currentUser) {
    return;
  }

  await apiFetch("/api/auth/session", {
    method: "POST",
    body: JSON.stringify({
      firstName: extra?.firstName ?? currentUser.displayName?.split(" ")[0] ?? "",
      lastName: extra?.lastName ?? currentUser.displayName?.split(" ").slice(1).join(" ") ?? "",
      email: currentUser.email,
      graduationYear: extra?.graduationYear ? Number(extra.graduationYear) : undefined,
      avatarUrl: currentUser.photoURL ?? null
    })
  });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getFirebaseAuth();

    return onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);

      if (nextUser) {
        try {
          await syncUserProfile();
        } catch (error) {
          console.error("Failed to sync session", error);
        }
      }

      setLoading(false);
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      registerWithEmail: async ({ firstName, lastName, email, password, graduationYear }) => {
        const auth = getFirebaseAuth();
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(credential.user, {
          displayName: `${firstName} ${lastName}`.trim()
        });
        await sendEmailVerification(credential.user);
        await syncUserProfile({ firstName, lastName, email, graduationYear });
      },
      loginWithEmail: async (email, password) => {
        const auth = getFirebaseAuth();
        await signInWithEmailAndPassword(auth, email, password);
        await syncUserProfile();
      },
      loginWithGoogle: async () => {
        const auth = getFirebaseAuth();
        await signInWithPopup(auth, getGoogleProvider());
        await syncUserProfile();
      },
      logout: async () => {
        await signOut(getFirebaseAuth());
      }
    }),
    [loading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
