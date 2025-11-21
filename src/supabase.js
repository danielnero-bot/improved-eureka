import { createClient } from "@supabase/supabase-js";

/* ----------------------------
   🔹 Supabase Configuration
----------------------------- */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
