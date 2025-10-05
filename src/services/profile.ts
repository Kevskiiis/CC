// src/services/profile.ts
import { supabase } from "../lib/supabase";

export type ProfileUpsert = {
  userId: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  phoneNumber?: string;
  avatarUrl?: string;
  bio?: string;
};

export async function upsertProfile(p: ProfileUpsert) {
  const payload = {
    id: p.userId,                                // FK to auth.users.id
    first_name: p.firstName ?? null,
    last_name: p.lastName ?? null,
    username: p.username ?? null,
    phone_number: p.phoneNumber ?? null,
    avatar_url: p.avatarUrl ?? null,
    bio: p.bio ?? null,
  };

  const { error } = await supabase
    .from("profiles")
    .upsert(payload, { onConflict: "id" });

  if (error) {
    console.log("upsertProfile error:", error.message);
    return { ok: false as const, message: error.message };
  }
  return { ok: true as const };
}

export async function getMyProfile() {
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id;
  if (!userId) return { ok: false as const, message: "Not signed in" };

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.log("getMyProfile error:", error.message);
    return { ok: false as const, message: error.message };
  }
  return { ok: true as const, profile: data ?? null };
}