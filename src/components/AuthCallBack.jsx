import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Logging you in...");

  useEffect(() => {
    const handleAuth = async () => {
      console.log("Full URL:", window.location.href);

      // 1. Try standard Supabase detection
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (session) {
        console.log("Session found via getSession:", session);
        redirectUser(session.user);
        return;
      }

      // 2. Manual Token Parsing (Fix for HashRouter + OAuth)
      // Look for access_token in the entire URL string because HashRouter can mess up window.location.hash
      const urlStr = window.location.href;
      if (
        urlStr.includes("access_token=") &&
        urlStr.includes("refresh_token=")
      ) {
        console.log("Manual token detection triggered");
        try {
          // Extract tokens using regex or string manipulation to handle double hashes
          const accessTokenMatch = urlStr.match(/access_token=([^&]+)/);
          const refreshTokenMatch = urlStr.match(/refresh_token=([^&]+)/);

          if (accessTokenMatch && refreshTokenMatch) {
            const access_token = accessTokenMatch[1];
            const refresh_token = refreshTokenMatch[1];

            const { data, error: setSessionError } =
              await supabase.auth.setSession({
                access_token,
                refresh_token,
              });

            if (setSessionError) throw setSessionError;

            if (data.session) {
              console.log("Manually set session:", data.session);
              redirectUser(data.session.user);
              return;
            }
          }
        } catch (err) {
          console.error("Manual session parsing failed:", err);
          setStatus("Error processing login details.");
        }
      }

      // 3. Fallback listener
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event, session) => {
        console.log("Auth state change:", event, session);
        if (event === "SIGNED_IN" && session) {
          redirectUser(session.user);
        } else if (event === "SIGNED_OUT") {
          setStatus("User signed out. Redirecting to login...");
          setTimeout(() => navigate("/login"), 2000);
        } else if (event === "INITIAL_SESSION" && !session) {
          // If we are here, it means getSession failed AND manual parsing failed (or wasn't needed)
          // But if we are on the callback page, we EXPECT a session.
          console.log("No initial session found.");
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
        .maybeSingle();
      if (restaurant) return "restaurant";
    } catch (err) {
      console.error("Role check error:", err);
    }
    return "user";
  };

  const redirectUser = async (user) => {
    // Check if we have a pending restaurant creation (from Google Signup)
    const pendingRestaurantName = localStorage.getItem(
      "pending_restaurant_name"
    );

    if (pendingRestaurantName) {
      console.log("Found pending restaurant creation:", pendingRestaurantName);
      try {
        // Create the restaurant
        const { error } = await supabase.from("restaurants").insert([
          {
            owner_uid: user.id,
            owner_name: user.user_metadata?.full_name || user.email,
            name: pendingRestaurantName,
            contact_email: user.email,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);

        if (error) {
          // Ignore duplicate key error if they already created it
          if (error.code !== "23505") {
            console.error("Error creating restaurant:", error);
          }
        }

        // Update user metadata to include role (if not already there)
        await supabase.auth.updateUser({
          data: { role: "restaurant" },
        });
      } catch (err) {
        console.error("Failed to process pending restaurant:", err);
      } finally {
        localStorage.removeItem("pending_restaurant_name");
      }

      navigate("/restaurantsetup");
      return;
    }

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
