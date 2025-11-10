import { createClient } from "@supabase/supabase-js";
import { getAuth } from "firebase/auth";

/* ----------------------------
   🔹 Supabase Configuration
----------------------------- */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/* ----------------------------
   🔐 Sync Firebase Auth → Supabase Session
----------------------------- */
export const getSupabaseWithAuth = async () => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    // Check if user is signed in
    if (!user) {
      console.warn("⚠️ No Firebase user found. Please sign in first.");
      return supabase;
    }

    // Get Firebase ID token
    const token = await user.getIdToken(true);

    // Set Supabase session with Firebase token
    const { error } = await supabase.auth.setSession({
      access_token: token,
      refresh_token: token,
    });

    if (error) {
      console.error("🚨 Failed to sync Firebase auth with Supabase:", error);
    } else {
      console.debug("✅ Supabase session synced with Firebase user.");
    }

    return supabase;
  } catch (err) {
    console.error("❌ Error initializing Supabase with Firebase auth:", err);
    return supabase;
  }
};
