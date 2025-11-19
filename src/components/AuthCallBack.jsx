import { useEffect } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      // 1. Tell Supabase to read the hash manually (important for GitHub Pages!)
      const { data } = await supabase.auth
        .getSessionFromUrl({
          storeSession: true,
        })
        .catch(() => ({ data: { session: null } }));

      console.log("SESSION FROM URL:", data.session);

      if (!data?.session) {
        console.log("Callback failed — session is null.");
        return;
      }

      const user = data.session.user;
      const role = user.user_metadata?.role || "user";

      navigate(role === "restaurant" ? "/restaurantDashboard" : "/dashboard");
    };

    handleCallback();
  }, []);

  return <p>Logging you in...</p>;
}
