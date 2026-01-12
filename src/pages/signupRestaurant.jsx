import React, { useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaRegEye, FaRegEyeSlash, FaGoogle, FaCheck } from "react-icons/fa";
import {
  MdDashboard,
  MdRestaurantMenu,
  MdAnalytics,
  MdTrendingUp,
} from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { useTheme } from "../context/ThemeContext";
import PasswordChecker from "../components/PasswordChecker";

const RestaurantSignup = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  // Form states
  const [fullName, setFullName] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Save restaurant info to Supabase
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
            owner_id: userId,
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
      console.error("Error saving to Supabase:", err);
      throw new Error("Failed to save restaurant details: " + err.message);
    }
  };

  // Handle email/password signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password || !restaurantName) {
      return setError("All fields are required.");
    }

    setError("");
    setLoading(true);

    try {
      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/#/auth/callback`,
          data: {
            full_name: fullName,
            role: "restaurant",
          },
        },
      });

      if (signupError) throw signupError;

      if (data?.user && data?.session) {
        await saveRestaurantData(data.user.id, fullName, restaurantName, email);
        navigate("/restaurantsetup");
      } else if (data?.user && !data?.session) {
        setError(
          "Account created! Please check your email to confirm your account before logging in."
        );
      }
    } catch (err) {
      setError(err?.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  // Handle Google signup
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
        },
      });

      if (oauthError) throw oauthError;
      localStorage.setItem("pending_restaurant_name", restaurantName);
    } catch (err) {
      setError(err?.message || "Google sign-in failed");
      setLoading(false);
    }
  };

  const benefits = [
    {
      icon: <MdDashboard className="text-primary" />,
      text: "Powerful dashboard to manage everything",
    },
    {
      icon: <MdRestaurantMenu className="text-primary" />,
      text: "Easy menu and pricing management",
    },
    {
      icon: <MdAnalytics className="text-primary" />,
      text: "Track orders and customer insights",
    },
  ];

  return (
    <div className="relative flex min-h-screen w-full bg-background-light dark:bg-background-dark font-display transition-colors duration-300">
      {/* Back Button */}
      <Link
        to="/getStarted"
        className="absolute top-6 left-6 z-10 inline-flex items-center gap-2 text-text-light dark:text-white hover:text-primary dark:hover:text-primary transition-colors"
      >
        <IoMdArrowRoundBack className="text-xl" />
        <span className="font-medium">Back</span>
      </Link>

      <div className="flex w-full">
        {/* Left Side - Form */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <main className="w-full max-w-md">
            <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-2xl p-8 shadow-lg transition-colors duration-300">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-black text-text-light dark:text-white mb-2">
                  Grow Your Restaurant
                </h1>
                <p className="text-text-secondary-light dark:text-gray-400">
                  Join QuickPlate and reach more customers online
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div
                    className={`px-4 py-3 rounded-lg ${
                      error.includes("created")
                        ? "bg-green-100 dark:bg-green-900/20 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-400"
                        : "bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400"
                    }`}
                  >
                    {error}
                  </div>
                )}

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-text-light dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Jane Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 text-text-light dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    required
                  />
                </div>

                {/* Restaurant Name */}
                <div>
                  <label className="block text-sm font-medium text-text-light dark:text-gray-300 mb-2">
                    Restaurant Name
                  </label>
                  <input
                    type="text"
                    placeholder="The Gourmet Corner"
                    value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 text-text-light dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-text-light dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="restaurant@example.com"
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
                      placeholder="Create a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setIsPasswordFocused(true)}
                      onBlur={() => setIsPasswordFocused(false)}
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
                  <div className="mt-3">
                    <PasswordChecker
                      password={password}
                      onChange={setPassword}
                      isVisible={isPasswordFocused || password.length > 0}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02]"
                >
                  {loading
                    ? "Creating Account..."
                    : "Create Restaurant Account"}
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
                  <span className="font-medium">Sign up with Google</span>
                </button>

                {/* Login Link */}
                <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-semibold text-primary hover:underline"
                  >
                    Log in
                  </Link>
                </p>
              </form>
            </div>

            {/* Terms */}
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-6 px-4">
              By signing up, you agree to our{" "}
              <Link
                to="/terms"
                className="underline hover:text-primary transition-colors"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="underline hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
            </p>
          </main>
        </div>

        {/* Right Side - Benefits (Hidden on mobile) */}
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/5 dark:to-primary/10 items-center justify-center p-12">
          <div className="max-w-md">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-text-light dark:text-white mb-3">
                Why Choose QuickPlate?
              </h2>
              <p className="text-text-secondary-light dark:text-gray-400 text-lg">
                Everything you need to manage and grow your restaurant business
                online
              </p>
            </div>

            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/20 dark:border-white/10"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-white dark:bg-white/10 rounded-lg flex items-center justify-center">
                    {benefit.icon}
                  </div>
                  <div>
                    <p className="text-text-light dark:text-white font-medium">
                      {benefit.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 dark:border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <MdTrendingUp className="text-primary text-2xl" />
                </div>
                <div>
                  <p className="font-bold text-text-light dark:text-white">
                    Grow Your Business
                  </p>
                  <p className="text-sm text-text-secondary-light dark:text-gray-400">
                    Reach more customers online
                  </p>
                </div>
              </div>
              <p className="text-sm text-text-secondary-light dark:text-gray-400">
                QuickPlate helps you build your online presence, manage orders
                efficiently, and grow your customer base with powerful tools
                designed for restaurants.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/20 dark:border-white/10 text-center">
                <p className="text-2xl font-bold text-primary mb-1">Free</p>
                <p className="text-xs text-text-secondary-light dark:text-gray-400">
                  No setup fees
                </p>
              </div>
              <div className="bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/20 dark:border-white/10 text-center">
                <p className="text-2xl font-bold text-primary mb-1">24/7</p>
                <p className="text-xs text-text-secondary-light dark:text-gray-400">
                  Always available
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantSignup;
