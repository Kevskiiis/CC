// NPM Modules:
import dotenv from 'dotenv';
import { createClient } from "@supabase/supabase-js";

// Enviroment Variables:
dotenv.config({path: '../../../.env'});

// Supbase configuration:
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

// Start Supabase Client:
export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);