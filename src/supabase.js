import { createClient } from "@supabase/supabase-js";
import { getAuth } from "firebase/auth";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getSupabaseWithAuth = async () => {
  const auth = getAuth();
  const firebaseUser = auth.currentUser;

  if (firebaseUser) {
    const token = await firebaseUser.getIdToken();
    supabase.auth.setSession({ access_token: token });
  }

  return supabase;
};  