import React, { useState } from "react";
import { MdLightMode, MdDarkMode } from "react-icons/md";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaRegEye, FaRegEyeSlash, FaGoogle } from "react-icons/fa";
import PasswordChecker from "../components/PasswordChecker";
import { supabase } from "../supabase";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const CreateUserAccount = () => {
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: "user",
          },
        },
      });

      if (signupError) throw signupError;

      if (data?.user && !data?.session) {
        setError(
          "Account created! Please check your email to confirm your account before logging in."
        );
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setError(error.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      const redirectUrl = `${window.location.origin}${window.location.pathname}#/auth/callback`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
        },
      });
      if (error) throw error;
    } catch (error) {
      setError(error.message || "Google sign-in failed");
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background-light dark:bg-background-dark p-4 font-display transition-colors duration-300">
      {/* Back Button */}
      <Link
        to="/getStarted"
        className="flex text-black dark:text-white absolute top-5 left-7"
      >
        <button className="text-primary pr-3 pt-0.5">
          <IoMdArrowRoundBack />
        </button>
        <span className="pt-0.5">Back</span>
      </Link>

      {/* Main Form */}
      <main className="flex w-full max-w-md flex-col items-center">
        <div className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark/50 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col items-center text-center mb-8">
            <p className="text-text-light dark:text-white text-3xl sm:text-4xl font-black leading-tight tracking-[-0.033em]">
              Create Your QuickPlate Account
            </p>
          </div>

          <form onSubmit={handleSignUp} className="flex flex-col gap-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {error}
              </div>
            )}

            {/* Full Name */}
            <label className="flex flex-col">
              <p className="text-text-light dark:text-gray-300 text-base font-medium pb-2">
                Full Name
              </p>
              <input
                className="form-input w-full rounded-lg border border-[#dce5df] dark:border-gray-700 bg-white dark:bg-gray-800 text-text-light dark:text-white placeholder:text-[#648772] dark:placeholder:text-gray-500 focus:outline-0 focus:ring-2 focus:ring-primary/50 h-14 p-[15px]"
                placeholder="Enter your full name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </label>

            {/* Email */}
            <label className="flex flex-col">
              <p className="text-text-light dark:text-gray-300 text-base font-medium pb-2">
                Email Address
              </p>
              <input
                className="form-input w-full rounded-lg border border-[#dce5df] dark:border-gray-700 bg-white dark:bg-gray-800 text-text-light dark:text-white placeholder:text-[#648772] dark:placeholder:text-gray-500 focus:outline-0 focus:ring-2 focus:ring-primary/50 h-14 p-[15px]"
                placeholder="Enter your email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            {/* Password */}
            <label className="flex flex-col">
              <p className="text-text-light dark:text-gray-300 text-base font-medium pb-2">
                Password
              </p>
              <div className="relative flex w-full">
                <input
                  className="form-input w-full rounded-lg border border-[#dce5df] dark:border-gray-700 bg-white dark:bg-gray-800 text-text-light dark:text-white placeholder:text-[#648772] dark:placeholder:text-gray-500 focus:outline-0 focus:ring-2 focus:ring-primary/50 h-14 p-[15px] pr-12"
                  placeholder="Enter your password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 h-full px-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {showPassword ? (
                    <FaRegEyeSlash size={20} />
                  ) : (
                    <FaRegEye size={20} />
                  )}
                </button>
              </div>
              <div className="mt-4">
                <PasswordChecker
                  password={password}
                  onChange={setPassword}
                  isVisible={isPasswordFocused || password.length > 0}
                />
              </div>
            </label>

            {/* Submit Button */}
            <div className="pt-4 flex flex-col gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center h-12 rounded-lg bg-primary text-text-light hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed font-bold"
              >
                {loading ? "Signing up..." : "Sign Up as User"}
              </button>

              <div className="relative flex items-center justify-center mt-2">
                <div className="absolute w-full border-t border-gray-300 dark:border-gray-700"></div>
                <div className="relative bg-white dark:bg-background-dark px-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="flex items-center justify-center gap-2 w-full h-12 px-4 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
              >
                <FaGoogle className="w-5 h-5" />
                <span>Sign up with Google</span>
              </button>

              <Link
                to="/login"
                className="text-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
              >
                Already have an account? Login
              </Link>
            </div>
          </form>
        </div>

        {/* License Notice */}
        <div className="absolute bottom-6 text-center px-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            By signing up, you agree to our{" "}
            <a
              href="../LICENSE"
              className="underline hover:text-primary dark:hover:text-primary"
            >
              Open Source License (MIT)
            </a>
            .
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-0 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-500">
          Powered by QuickPlate Open Source
        </p>
      </footer>
    </div>
  );
};

export default CreateUserAccount;
