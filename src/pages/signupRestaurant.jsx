import React, { useState, useEffect } from "react";
import { MdLightMode, MdDarkMode } from "react-icons/md";
import { FaRegEye, FaRegEyeSlash, FaGoogle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { useTheme } from "../context/ThemeContext";
import PasswordChecker from "../components/PasswordChecker";

const RestaurantSignup = () => {
  const navigate = useNavigate();

  // 🔹 Form states
  const [fullName, setFullName] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { darkMode, toggleTheme } = useTheme();

  // 🔹 Save restaurant info to Supabase
  const saveRestaurantData = async (
    userId,
    ownerName,
    restaurantName,
    contactEmail
  ) => {
    try {
      const { data, error: insertError } = await supabase
        .from("restaurants")
        .insert([
          {
            owner_uid: userId, // Changed from firebase_uid to owner_uid to match schema
            owner_name: ownerName,
            name: restaurantName,
            contact_email: contactEmail,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select();

      if (insertError) throw insertError;
      return data;
    } catch (err) {
      console.error("❌ Error saving to Supabase:", err);
      throw new Error("Failed to save restaurant details: " + err.message);
    }
  };

  // 🔹 Handle email/password signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password || !restaurantName) {
      return setError("All fields are required.");
    }

    setError("");
    setLoading(true);

    try {
      // 1. Sign up with Supabase
      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: "restaurant", // Removing this as it might be causing the 400 error if restricted
          },
        },
      });

      if (signupError) throw signupError;

      if (data?.user && data?.session) {
        // 2. User is logged in, save data and navigate
        await saveRestaurantData(data.user.id, fullName, restaurantName, email);
        navigate("/restaurantsetup");
      } else if (data?.user && !data?.session) {
        // 3. User created but email confirmation required
        setError(
          "Account created! Please check your email to confirm your account before logging in."
        );
        // Optional: You could navigate to a specific "check email" page
      } else {
        setError("Something went wrong during signup.");
      }
    } catch (err) {
      setError(err?.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Handle Google signup
  const handleGoogleSignIn = async () => {
    if (!restaurantName) {
      setError("Please enter your restaurant name before continuing.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const redirectUrl = `${window.location.origin}${window.location.pathname}#/auth/callback`;
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            // We can't strictly force metadata here for existing users,
            // but for new users, we might want to handle this in the callback or via a trigger.
            // However, we can pass custom params to handle in the callback if needed.
            // For now, we rely on the callback to check/create the restaurant entry.
          },
        },
      });

      if (oauthError) throw oauthError;

      // Note: We can't immediately save restaurant data here because OAuth redirects.
      // The saving must happen in AuthCallback or via a database trigger/function.
      // For this specific flow, we might need to store the intended restaurant name in localStorage
      // to retrieve it after the callback.
      localStorage.setItem("pending_restaurant_name", restaurantName);
    } catch (err) {
      setError(err?.message || "Google sign-in failed");
      setLoading(false);
    }
  };

  return (
    <div
      className={`relative flex min-h-screen w-full flex-col items-center justify-center transition-colors duration-300 ${
        darkMode
          ? "bg-background-dark text-white"
          : "bg-background-light text-black"
      }`}
    >
      <main className="w-full max-w-md space-y-8 px-4 sm:px-0 transition-all">
        <div
          className={`p-8 sm:p-10 rounded-xl shadow-lg border transition-colors duration-300 ${
            darkMode
              ? "bg-background-dark text-white"
              : "bg-background-light text-black"
          }`}
        >
          <h1 className="text-center text-3xl sm:text-4xl font-black mb-6">
            Create Your Restaurant Account
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="block mb-2 font-medium">Full Name</label>
              <input
                type="text"
                placeholder="Jane Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent h-14 p-4 focus:ring-2 focus:ring-primary/60"
                required
              />
            </div>

            {/* Restaurant Name */}
            <div>
              <label className="block mb-2 font-medium">Restaurant Name</label>
              <input
                type="text"
                placeholder="The Gourmet Corner"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent h-14 p-4 focus:ring-2 focus:ring-primary/60"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-2 font-medium">Email</label>
              <input
                type="email"
                placeholder="jane.doe@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent h-14 p-4 focus:ring-2 focus:ring-primary/60"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block mb-2 font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent h-14 p-4 pr-12 focus:ring-2 focus:ring-primary/60"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                </button>
              </div>

              {isPasswordFocused && (
                <div className="mt-4">
                  <PasswordChecker
                    password={password}
                    onChange={setPassword}
                    isVisible
                  />
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center mt-6">
              <div className="absolute w-full border-t border-slate-300 dark:border-slate-700"></div>
              <div
                className={`relative px-4 ${
                  darkMode ? "bg-slate-800" : "bg-white"
                }`}
              >
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full h-12 mt-3 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition disabled:opacity-50"
            >
              <FaGoogle className="w-5 h-5" />
              <span>Sign up with Google</span>
            </button>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-lg bg-primary text-black font-bold hover:bg-opacity-90 focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Sign Up as Restaurant Owner"}
            </button>
          </form>

          <p className="text-center text-sm mt-6">
            By signing up, you agree to our{" "}
            <Link
              to="/license"
              className="font-medium text-primary/80 hover:text-primary"
            >
              Open Source License (MIT)
            </Link>
            .
          </p>

          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-primary/80 hover:text-primary"
            >
              Login
            </Link>
          </p>
        </div>

        <footer className="text-center">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Powered by QuickPlate Open Source
          </p>
        </footer>
      </main>
    </div>
  );
};

export default RestaurantSignup;
