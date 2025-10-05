// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

export type AuthContextType = {
  isAuthenticated: boolean;
  signIn: () => void;          // call after successful login/register
  signOut: () => void;         // returns void to match your App.tsx
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [ready, setReady] = useState(false); // avoid initial flicker

  useEffect(() => {
    let mounted = true;

    // 1) Restore any existing session on app start
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setIsAuthenticated(!!data.session);
      setReady(true);
    })();

    // 2) Stay in sync with any auth changes (login, logout, token refresh)
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      isAuthenticated,
      signIn: () => setIsAuthenticated(true),
      signOut: () => {
        // fire-and-forget; you kept this API returning void
        supabase.auth.signOut().finally(() => setIsAuthenticated(false));
      },
    }),
    [isAuthenticated]
  );

  // Hide navigators until we know session state, to prevent a flash
  if (!ready) return null;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}