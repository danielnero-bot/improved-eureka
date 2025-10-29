import React, { useState } from "react";
import { MdLightMode, MdDarkMode } from "react-icons/md";
import { FaRegEye, FaRegEyeSlash, FaGoogle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase/config";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userType, setUserType] = useState("user"); // "user" or "restaurant"

  // Determine role by querying Firestore for the user's email.
  // If a restaurant doc exists with this email we treat them as a restaurant owner.
  const getRoleByEmail = async (emailToCheck) => {
    if (!emailToCheck) return "user";
    try {
      const q = query(
        collection(db, "restaurants"),
        where("email", "==", emailToCheck)
      );
      const snap = await getDocs(q);
      if (!snap.empty) return "restaurant";
      return "user";
    } catch (err) {
      console.error("Error checking role by email:", err);
      return "user";
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      // Auto-detect role by email in Firestore
      const role = await getRoleByEmail(user.email);
      if (role === "restaurant") {
        navigate("/adminDashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err?.message || "Failed to log in");
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);
      // Auto-detect role by email in Firestore
      const role = await getRoleByEmail(user.email);
      if (role === "restaurant") {
        navigate("/adminDashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err?.message || "Google sign-in failed");
    }
    setLoading(false);
  };

  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-white text-text-light-primary dark:text-dark-primary">
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4">
        {/* Dark/Light Mode Toggle */}
        <div className="absolute top-4 right-4">
          <button className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-surface-light dark:bg-surface-dark shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
            <span className="material-symbols-outlined text-text-light-secondary dark:text-dark-secondary block dark:hidden">
              <MdDarkMode />
            </span>
            <span className="material-symbols-outlined text-text-light-secondary dark:text-dark-secondary hidden dark:block">
              <MdLightMode />
            </span>
          </button>
        </div>

        {/* Main Form */}
        <main className="w-full max-w-md mx-auto">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3 text-center">
              <h1 className="text-4xl font-bold tracking-tighter">
                Welcome Back to QuickPlate
              </h1>
              <p className="text-base text-text-light-secondary dark:text-dark-secondary">
                Sign in to continue your journey.
              </p>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                  {error}
                </div>
              )}
              {/* Email Field */}
              <div className="flex flex-col gap-1">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="pb-2 text-base font-medium">Email</p>
                  <input
                    className="form-input flex h-14 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-border-light bg-surface-light p-4 text-base font-normal leading-normal text-text-light-primary placeholder:text-text-light-secondary focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20 dark:border-border-dark dark:bg-surface-dark dark:text-dark-primary dark:placeholder:text-dark-secondary dark:focus:border-primary"
                    placeholder="Enter your email address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </label>
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-1">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="pb-2 text-base font-medium">Password</p>
                  <div className="relative flex w-full flex-1 items-center">
                    <div className="relative flex w-full flex-1 items-stretch">
                      <input
                        className="form-input flex h-14 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-border-light bg-surface-light p-4 text-base font-normal leading-normal text-text-light-primary placeholder:text-text-light-secondary focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20 dark:border-border-dark dark:bg-surface-dark dark:text-dark-primary dark:placeholder:text-dark-secondary dark:focus:border-primary"
                        placeholder="••••••••"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center justify-center pr-4 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                      >
                        {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                      </button>
                    </div>
                  </div>
                </label>
              </div>

              {/* Role Selector & Login Button */}
              <div className="flex h-12 flex-1 items-center justify-center rounded-lg bg-background-light dark:bg-background-dark p-1 border border-border-light dark:border-border-dark">
                <label className="flex h-full flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-md px-2 text-sm font-medium text-text-light-secondary has-checked:bg-surface-light has-checked:text-text-light-primary has-checked:shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:text-dark-secondary dark:has-checked:bg-surface-dark dark:has-checked:text-dark-primary">
                  <span className="truncate">Login as User</span>
                  <input
                    className="invisible w-0"
                    name="role-selector"
                    type="radio"
                    value="user"
                    checked={userType === "user"}
                    onChange={(e) => setUserType(e.target.value)}
                  />
                </label>

                <label className="flex h-full flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-md px-2 text-sm font-medium text-text-light-secondary has-checked:bg-surface-light has-checked:text-text-light-primary has-checked:shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:text-dark-secondary dark:has-checked:bg-surface-dark dark:has-checked:text-dark-primary">
                  <span className="truncate">Login as Restaurant Owner</span>
                  <input
                    className="invisible w-0"
                    name="role-selector"
                    type="radio"
                    value="restaurant"
                    checked={userType === "restaurant"}
                    onChange={(e) => setUserType(e.target.value)}
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex h-12 min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary px-5 text-base font-bold text-text-light-primary transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="truncate">
                  {loading ? "Logging in..." : "Login"}
                </span>
              </button>

              <div className="relative flex items-center justify-center mt-2">
                <div className="absolute w-full border-t border-gray-300 dark:border-gray-700"></div>
                <div className="relative bg-background-light dark:bg-background-dark px-4">
                  <span className="text-sm text-text-light-secondary dark:text-dark-secondary">
                    Or continue with
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="flex items-center justify-center gap-2 w-full h-12 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaGoogle className="w-5 h-5" />
                <span>Sign in with Google</span>
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

        {/* Footer */}
        <footer className="absolute bottom-6 text-center text-sm text-text-light-secondary dark:text-dark-secondary">
          Powered by QuickPlate Open Source
        </footer>
      </div>
    </div>
  );
};

export default Login;
