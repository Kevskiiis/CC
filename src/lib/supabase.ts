import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

function readExtra(name: string): string | undefined {
  const extra = (Constants.expoConfig?.extra ??
                 Constants.manifest?.extra) as Record<string, any> | undefined;
  return extra?.[name];
}

const SUPABASE_URL =
  (process.env.EXPO_PUBLIC_SUPABASE_URL || readExtra("EXPO_PUBLIC_SUPABASE_URL") || "").trim();

const SUPABASE_ANON =
  (process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || readExtra("EXPO_PUBLIC_SUPABASE_ANON_KEY") || "").trim();

if (!SUPABASE_URL || !SUPABASE_ANON) {
  console.log("DEBUG Supabase envs", {
    SUPABASE_URL,
    hasAnon: Boolean(SUPABASE_ANON),
    extra: Constants.expoConfig?.extra ?? Constants.manifest?.extra,
  });
  throw new Error("supabaseUrl and anon key are required");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: {
    storage: AsyncStorage as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});