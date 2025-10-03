import { Credentials, AuthResult } from "../types/auth";
import { httpPostJSON } from "./http";

const API_BASE = process.env.EXPO_PUBLIC_API_BASE ?? ""; // set in app config or .env

export async function verifyUser(creds: Credentials): Promise<AuthResult> {
  // Basic client-side validation (don’t rely on this; server must validate too)
  const { identifier, password } = creds;
  if (!identifier?.trim() || !password?.trim()) {
    return { ok: false, code: "VALIDATION", message: "Please enter your email/username and password." };
  }
  if (!API_BASE) {
    return { ok: false, code: "UNAVAILABLE", message: "Login service is not configured yet." };
    // When ready, set EXPO_PUBLIC_API_BASE and this will call your server.
  }

  const url = `${API_BASE}/auth/login`;
  try {
    // Typical payload; adjust keys to your API contract
    const { ok, status, json } = await httpPostJSON<any>(url, {
      identifier,
      password,
    });

    // Interpret common status codes
    if (!ok) {
      if (status === 400) {
        return { ok: false, code: "VALIDATION", message: json?.message ?? "Invalid request." };
      }
      if (status === 401) {
        return { ok: false, code: "UNAUTHORIZED", message: json?.message ?? "Invalid credentials." };
      }
      if (status === 429) {
        return { ok: false, code: "RATE_LIMIT", message: "Too many attempts. Try again later." };
      }
      return { ok: false, code: "SERVER", message: json?.message ?? "Server error. Please try again." };
    }

    // Success path: map the server payload to your app model.
    // Example expected JSON (adjust to your API):
    // { user: { id, email, username }, token: "jwt..." }
    const user = json?.user ?? null;
    if (!user) {
      return { ok: false, code: "SERVER", message: "Malformed response." };
    }

    return {
      ok: true,
      user: {
        id: String(user.id),
        email: String(user.email),
        username: user.username ? String(user.username) : undefined,
      },
      token: json?.token ? String(json.token) : undefined,
    };
  } catch (e: any) {
    if (e?.name === "AbortError") {
      return { ok: false, code: "NETWORK", message: "Request timed out. Check your connection." };
    }
    return { ok: false, code: "NETWORK", message: "Network error. Try again." };
  }
}