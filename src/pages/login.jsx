import React, { useState, useEffect } from "react";
import { MdLightMode, MdDarkMode } from "react-icons/md";
import { FaRegEye, FaRegEyeSlash, FaGoogle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { useTheme } from "../context/ThemeContext";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [userType, setUserType] = useState("user");
  const { darkMode, toggleTheme } = useTheme();

  // Determine role
  const determineUserRole = async (user) => {
    if (user?.user_metadata?.role) return user.user_metadata.role;

    try {
      const { data: restaurant } = await supabase
        .from("restaurants")
        .select("id")
        .eq("owner_uid", user.id)
        .single();
      if (restaurant) return "restaurant";

      const { data: normalUser } = await supabase
        .from("users")
        .select("id")
        .eq("user_uid", user.id)
        .single();
      return normalUser ? "user" : "user";
    } catch {
      return "user";
    }
  };

  // Email/password login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password)
      return setError("Email and password are required.");

    setLoading(true);
    try {
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({ email, password });
      if (loginError) throw loginError;
      if (!data.user) throw new Error("Login failed.");

      const role = await determineUserRole(data.user);
      navigate(role === "restaurant" ? "/restaurantDashboard" : "/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth for GitHub Pages + HashRouter
  const handleGoogleSignIn = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      const redirectUrl = `${window.location.origin}${window.location.pathname}#/auth/callback`;
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: redirectUrl },
      });
      if (oauthError) throw oauthError;
    } catch (err) {
      setError(err.message || "Google login failed");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-black dark:text-white">
      {" "}
      <div className="relative flex min-h-screen flex-col items-center justify-center p-4">
        <main className="w-full max-w-md mx-auto">
          <div className="flex flex-col gap-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tighter">
                Welcome Back to QuickPlate
              </h1>
              <p className="text-base text-text-light-secondary dark:text-dark-secondary">
                Sign in to continue your journey.
              </p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              {error && (
                <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              {/* Email */}
              <label className="flex flex-col gap-1">
                <p className="pb-2 text-base font-medium">Email</p>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 rounded-lg border p-4 bg-surface-light dark:bg-surface-dark focus:ring-2 focus:ring-primary text-black dark:text-white"
                />
              </label>

              {/* Password */}
              <label className="flex flex-col gap-1">
                <p className="pb-2 text-base font-medium">Password</p>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-14 w-full rounded-lg border p-4 bg-surface-light dark:bg-surface-dark text-black dark:text-white focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-gray-400 dark:text-gray-500"
                  >
                    {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                  </button>
                </div>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="h-12 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              <div className="relative flex items-center justify-center mt-2">
                <div className="absolute w-full border-t border-gray-300 dark:border-gray-700"></div>
                <div className="relative bg-background-light dark:bg-background-dark px-4">
                  <span className="text-sm text-text-light-secondary dark:text-dark-secondary">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google Login */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading || loading}
                className="flex items-center justify-center gap-2 h-12 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
              >
                {googleLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2"></div>
                ) : (
                  <FaGoogle className="w-5 h-5" />
                )}
                <span>
                  {googleLoading ? "Signing in..." : "Sign in with Google"}
                </span>
              </button>

              <p className="text-center text-sm text-text-light-secondary dark:text-dark-secondary">
                Don't have an account?{" "}
                <Link
                  to={
                    userType === "restaurant"
                      ? "/signupRestaurant"
                      : "/signupUser"
                  }
                  className="font-semibold text-primary hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </main>
        <footer className="absolute bottom-6 text-center text-sm text-text-light-secondary dark:text-dark-secondary">
          Powered by QuickPlate Open Source
        </footer>
      </div>
    </div>
  );
};

export default Login;
