// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

// This matches your original app's expectation.
export type AuthContextType = {
  isAuthenticated: boolean;
  signIn: () => void;
  signOut: () => void; // <- returns void to match your App.tsx
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Try to restore an existing Supabase session on app start.
  useEffect(() => {
    let isMounted = true;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!isMounted) return;
      setIsAuthenticated(!!data.user);
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      isAuthenticated,
      // Call this after a successful verifyUser/registerUser in your screens.
      signIn: () => setIsAuthenticated(true),
      // Sign out of Supabase and flip state. Returns void (not Promise) to match your app.
      signOut: () => {
        // fire and forget; if you prefer, you can await it in a try/catch
        supabase.auth.signOut().finally(() => setIsAuthenticated(false));
      },
    }),
    [isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}