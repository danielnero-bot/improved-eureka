import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash, FaGoogle } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { useTheme } from "../context/ThemeContext";

const Login = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

      return "user";
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

  // Google OAuth
  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      const redirectUrl = `${window.location.origin}${window.location.pathname}#/auth/callback`;
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: redirectUrl },
      });
      if (oauthError) throw oauthError;
    } catch (err) {
      setError(err.message || "Google login failed");
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full bg-background-light dark:bg-background-dark font-display transition-colors duration-300">
      {/* Back Button */}
      <Link
        to="/"
        className="absolute top-6 left-6 z-10 inline-flex items-center gap-2 text-text-light dark:text-white hover:text-primary dark:hover:text-primary transition-colors"
      >
        <IoMdArrowRoundBack className="text-xl" />
        <span className="font-medium">Back</span>
      </Link>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <main className="w-full max-w-md">
          <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-2xl p-8 shadow-lg transition-colors duration-300">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-black text-text-light dark:text-white mb-2">
                Welcome Back
              </h1>
              <p className="text-text-secondary-light dark:text-gray-400">
                Sign in to continue to QuickPlate
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="px-4 py-3 rounded-lg bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400">
                  {error}
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-text-light dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 text-text-light dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-text-light dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 text-text-light dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  >
                    {showPassword ? (
                      <FaRegEyeSlash size={20} />
                    ) : (
                      <FaRegEye size={20} />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02]"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-6">
                <div className="absolute w-full border-t border-gray-300 dark:border-gray-700"></div>
                <div className="relative bg-card-light dark:bg-card-dark px-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google Sign In */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg text-text-light dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 transition-colors"
              >
                <FaGoogle className="w-5 h-5" />
                <span className="font-medium">Sign in with Google</span>
              </button>

              {/* Sign Up Link */}
              <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
                Don't have an account?{" "}
                <Link
                  to="/getStarted"
                  className="font-semibold text-primary hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>

          {/* Footer */}
          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-6">
            Powered by QuickPlate Open Source
          </p>
        </main>
      </div>
    </div>
  );
};

export default Login;
