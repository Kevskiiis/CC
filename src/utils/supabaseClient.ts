import { createClient, SupabaseClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import { SUPABASE_URL as DOTENV_SUPABASE_URL, SUPABASE_ANON_KEY as DOTENV_SUPABASE_ANON_KEY } from '@env';

type SupabaseEnv = {
    supabaseUrl: string;
    supabaseAnonKey: string;
};

const clean = (value?: string | null) => {
    if (!value) return undefined;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
};

const resolveSupabaseEnv = (): SupabaseEnv => {
    // Prefer Expo public env (EXPO_PUBLIC_*) since it works in Expo Go and builds
    const supabaseUrl =
        clean(process.env.EXPO_PUBLIC_SUPABASE_URL) ||
        clean((Constants?.expoConfig?.extra as any)?.supabaseUrl) ||
        clean(process.env.SUPABASE_URL) ||
        clean(DOTENV_SUPABASE_URL);

    const supabaseAnonKey =
        clean(process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY) ||
        clean((Constants?.expoConfig?.extra as any)?.supabaseAnonKey) ||
        clean(process.env.SUPABASE_ANON_KEY) ||
        clean(DOTENV_SUPABASE_ANON_KEY);

    const missing: string[] = [];
    if (!supabaseUrl) missing.push('EXPO_PUBLIC_SUPABASE_URL');
    if (!supabaseAnonKey) missing.push('EXPO_PUBLIC_SUPABASE_ANON_KEY');

    if (missing.length) {
        throw new Error(
            `Supabase configuration missing: ${missing.join(
                ' and '
            )}. Define them in a .env file (using the EXPO_PUBLIC_ prefix) or expose them via app.config.ts -> extra.`
        );
    }

    return { supabaseUrl, supabaseAnonKey };
};

let cachedClient: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient => {
    if (cachedClient) return cachedClient;
    const { supabaseUrl, supabaseAnonKey } = resolveSupabaseEnv();
    cachedClient = createClient(supabaseUrl, supabaseAnonKey);
    return cachedClient;
};

export const ensureSupabaseClient = (): SupabaseClient => getSupabaseClient();
