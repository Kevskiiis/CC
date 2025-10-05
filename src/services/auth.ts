// src/services/auth.ts
import { supabase } from "../lib/supabase";
import { Credentials, AuthResult } from "../types/auth";

/** Login with email + password (identifier is treated as email). */
export async function verifyUser(creds: Credentials): Promise<AuthResult> {
  const { identifier, password } = creds;

  if (!identifier?.trim() || !password?.trim()) {
    return {
      ok: false,
      code: "VALIDATION",
      message: "Please enter your email/username and password.",
    };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: identifier.trim(),
      password: password.trim(),
    });

    if (error) {
      if (error.message?.toLowerCase().includes("invalid")) {
        return { ok: false, code: "UNAUTHORIZED", message: "Invalid credentials." };
      }
      return { ok: false, code: "SERVER", message: error.message || "Login failed." };
    }

    const u = data.user;
    const token = data.session?.access_token;

    if (!u) return { ok: false, code: "SERVER", message: "Malformed response." };

    const emailString = (u.email ?? identifier).toString();

    return {
      ok: true,
      user: { id: String(u.id), email: emailString, username: undefined },
      token: token ?? undefined,
    };
  } catch {
    return { ok: false, code: "NETWORK", message: "Network error. Try again." };
  }
}

/** Register a new user (email + password). */
export async function registerUser(email: string, password: string): Promise<AuthResult> {
  if (!email?.trim() || !password?.trim()) {
    return { ok: false, code: "VALIDATION", message: "Please enter email and password." };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password.trim(),
    });

    if (error) {
      return { ok: false, code: "SERVER", message: error.message || "Register failed." };
    }

    const u = data.user;
    const token = data.session?.access_token;

    if (!u) return { ok: false, code: "SERVER", message: "Malformed response." };

    const emailString = (u.email ?? email).toString();

    return {
      ok: true,
      user: { id: String(u.id), email: emailString, username: undefined },
      token: token ?? undefined,
    };
  } catch {
    return { ok: false, code: "NETWORK", message: "Network error. Try again." };
  }
}

/** Sign out the current session. */
export async function logout(): Promise<void> {
  await supabase.auth.signOut();
}

/** Get the currently authenticated user (or null). */
export async function getCurrentUser(): Promise<{ id: string; email?: string | null } | null> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return { id: data.user.id, email: data.user.email };
}