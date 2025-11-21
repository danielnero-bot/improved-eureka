import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Logging you in...");

  useEffect(() => {
    const handleAuth = async () => {
      // Check for existing session first
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Error getting session:", error);
        setStatus("Error checking session.");
        return;
      }

      if (session) {
        console.log("Session found immediately:", session);
        redirectUser(session.user);
        return;
      }

      // If no session, listen for the auth state change (which handles the URL hash)
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event, session) => {
        console.log("Auth state change:", event, session);
        if (event === "SIGNED_IN" && session) {
          redirectUser(session.user);
        } else if (event === "SIGNED_OUT") {
          setStatus("User signed out. Redirecting to login...");
          setTimeout(() => navigate("/login"), 2000);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    };

    handleAuth();
  }, [navigate]);

  const determineUserRole = async (user) => {
    if (user?.user_metadata?.role) return user.user_metadata.role;

    try {
      const { data: restaurant } = await supabase
        .from("restaurants")
        .select("id")
        .eq("owner_uid", user.id)
        .single();
      if (restaurant) return "restaurant";
    } catch (err) {
      console.error("Role check error:", err);
    }
    return "user";
  };

  const redirectUser = async (user) => {
    const role = await determineUserRole(user);
    console.log("Redirecting as:", role);
    navigate(role === "restaurant" ? "/restaurantDashboard" : "/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <p className="text-lg font-semibold">{status}</p>
      <p className="text-sm text-gray-500 mt-2">
        Please wait while we verify your credentials.
      </p>
    </div>
  );
}
