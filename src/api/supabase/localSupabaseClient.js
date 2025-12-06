// NPM Modules:
import dotenv from 'dotenv';
import { createClient } from "@supabase/supabase-js";

// Enviroment Variables:
dotenv.config({path: '../../../.env'});

export async function getSupabaseUserClient(bearerToken) {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${bearerToken}` } },
  });
}
