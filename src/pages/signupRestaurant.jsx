import React, { useState, useEffect } from "react";
import { MdLightMode, MdDarkMode } from "react-icons/md";
import { FaRegEye, FaRegEyeSlash, FaGoogle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase/config";
import { supabase } from "../supabase";
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

  // 🔹 Theme state (Light / Dark)
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    // Apply Tailwind dark mode class to root HTML
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // 🔹 Save restaurant info to Supabase
  const saveRestaurantData = async (
    firebaseUid,
    ownerName,
    restaurantName,
    contactEmail
  ) => {
    try {
      const { data, error: insertError } = await supabase
        .from("restaurants")
        .insert([
          {
            firebase_uid: firebaseUid,
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
      throw new Error("Failed to save restaurant details");
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
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await saveRestaurantData(user.uid, fullName, restaurantName, email);

      navigate("/restaurantsetup");
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
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await saveRestaurantData(
        user.uid,
        user.displayName || "Restaurant Owner",
        restaurantName,
        user.email
      );

      navigate("/restaurantsetup");
    } catch (err) {
      setError(err?.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`relative flex min-h-screen w-full flex-col items-center justify-center transition-colors duration-300 ${
        theme === "dark"
          ? "bg-background-light text-black"
          : "bg-background-dark text-white"
      }`}
    >
      {/* 🌗 Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 h-10 w-10 flex items-center justify-center rounded-full bg-white/70 dark:bg-black/40 text-slate-700 dark:text-slate-300 backdrop-blur-md shadow-md hover:scale-105 transition-transform"
      >
        {theme === "dark" ? (
          <MdLightMode className="text-yellow-400 text-xl" />
        ) : (
          <MdDarkMode className="text-slate-700 text-xl" />
        )}
      </button>

      <main className="w-full max-w-md space-y-8 px-4 sm:px-0 transition-all">
        <div
          className={`p-8 sm:p-10 rounded-xl shadow-lg border transition-colors duration-300 ${
            theme === "dark"
              ? "bg-background-light text-black"
              : "bg-background-dark text-white"
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
                  theme === "dark" ? "bg-slate-800" : "bg-white"
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
