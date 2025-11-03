import React, { useState, useEffect } from "react";
import { MdLightMode, MdDarkMode } from "react-icons/md";
import { FaRegEye, FaRegEyeSlash, FaGoogle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase/config";
import { supabase } from "../supabase";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userType, setUserType] = useState("user");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // 🌓 Apply theme preference on mount
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // 🧠 Check role from Supabase
  const getRoleFromSupabase = async (uid) => {
    try {
      const { data: restaurant } = await supabase
        .from("restaurants")
        .select("id")
        .eq("firebase_uid", uid)
        .single();
      if (restaurant) return "restaurant";

      const { data: user } = await supabase
        .from("users")
        .select("id")
        .eq("firebase_uid", uid)
        .single();
      if (user) return "user";

      return "user";
    } catch {
      return "user";
    }
  };

  // 🔐 Handle Email/Password Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password)
      return setError("Email and password are required.");

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;
      await firebaseUser.getIdToken(true);
      const role = await getRoleFromSupabase(firebaseUser.uid);

      navigate(role === "restaurant" ? "/restaurantDashboard" : "/dashboard");
    } catch (err) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔐 Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const firebaseUser = userCredential.user;
      await firebaseUser.getIdToken(true);
      const role = await getRoleFromSupabase(firebaseUser.uid);

      navigate(role === "restaurant" ? "/restaurantDashboard" : "/dashboard");
    } catch (err) {
      setError(err?.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-white text-text-light-primary dark:text-dark-primary">
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4">
        {/* 🌓 Theme Toggle Button */}
        <div className="absolute top-4 right-4">
          <button
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-light dark:bg-surface-dark shadow"
          >
            <MdDarkMode className="block dark:hidden text-text-light-secondary" />
            <MdLightMode className="hidden dark:block text-dark-secondary" />
          </button>
        </div>

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
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <label className="flex flex-col gap-1">
                <p className="pb-2 text-base font-medium">Email</p>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 rounded-lg border border-gray-300 dark:border-gray-700 bg-surface-light dark:bg-surface-dark p-4 text-base focus:ring-2 focus:ring-primary"
                />
              </label>

              <label className="flex flex-col gap-1">
                <p className="pb-2 text-base font-medium">Password</p>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-14 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-surface-light dark:bg-surface-dark p-4 text-base focus:ring-2 focus:ring-primary"
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

              {/* Role toggle for UX (optional) */}
              <div className="flex items-center justify-center border border-gray-300 dark:border-gray-700 rounded-lg p-1">
                <label className="flex-1 text-center cursor-pointer">
                  <input
                    type="radio"
                    name="role-selector"
                    value="user"
                    checked={userType === "user"}
                    onChange={(e) => setUserType(e.target.value)}
                    className="hidden"
                  />
                  <span
                    className={`block py-2 rounded-md ${
                      userType === "user" ? "bg-primary text-white" : ""
                    }`}
                  >
                    Login as User
                  </span>
                </label>

                <label className="flex-1 text-center cursor-pointer">
                  <input
                    type="radio"
                    name="role-selector"
                    value="restaurant"
                    checked={userType === "restaurant"}
                    onChange={(e) => setUserType(e.target.value)}
                    className="hidden"
                  />
                  <span
                    className={`block py-2 rounded-md ${
                      userType === "restaurant" ? "bg-primary text-white" : ""
                    }`}
                  >
                    Login as Restaurant Owner
                  </span>
                </label>
              </div>

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

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="flex items-center justify-center gap-2 h-12 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <FaGoogle className="w-5 h-5" />
                <span>Sign in with Google</span>
              </button>

              <p className="text-center text-sm text-text-light-secondary dark:text-dark-secondary">
                Don’t have an account?{" "}
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
