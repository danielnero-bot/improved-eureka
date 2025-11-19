import { useEffect } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const user = data.session?.user;
      if (!user) return;

      const role = user.user_metadata?.role || "user";
      navigate(role === "restaurant" ? "/restaurantDashboard" : "/dashboard");
    });
  }, []);

  return <p>Logging you in...</p>;
}
