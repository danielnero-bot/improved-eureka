import React, { useState } from "react";
import { MdLightMode, MdDarkMode } from "react-icons/md";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import PasswordChecker from "../components/PasswordChecker";
import { Link } from "react-router-dom";

const RestaurantSignup = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background-light dark:bg-background-dark p-4 font-display text-slate-800 dark:text-slate-200">
      {/* Dark/Light Mode Toggle */}
      <div className="absolute top-6 right-6">
        <button className="h-10 w-10 flex items-center justify-center rounded-full bg-white/50 dark:bg-black/50 text-slate-700 dark:text-slate-300 backdrop-blur-sm">
          <span className="material-symbols-outlined dark:hidden">
            <MdDarkMode />
          </span>
          <span className="material-symbols-outlined hidden dark:inline">
            <MdLightMode />
          </span>
        </button>
      </div>

      {/* Main Content */}
      <main className="w-full max-w-md space-y-8 px-4 sm:px-0">
        <div className="bg-white dark:bg-slate-900/50 p-8 sm:p-10 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800">
          {/* Heading */}
          <div className="text-center mb-8">
            <p className="text-slate-900 dark:text-white text-3xl sm:text-4xl font-black leading-tight tracking-[-0.033em]">
              Create Your Restaurant Account
            </p>
          </div>

          {/* Signup Form */}
          <form className="space-y-6">
            <div className="space-y-4">
              {/* Full Name */}
              <label className="flex flex-col">
                <p className="text-slate-800 dark:text-slate-200 text-base font-medium leading-normal pb-2">
                  Full Name
                </p>
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-800 dark:text-slate-200 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-700 bg-background-light dark:bg-background-dark h-14 placeholder:text-slate-400 dark:placeholder:text-slate-500 p-[15px] text-base font-normal leading-normal"
                  placeholder="Jane Doe"
                  type="text"
                />
              </label>

              {/* Restaurant Name */}
              <label className="flex flex-col">
                <p className="text-slate-800 dark:text-slate-200 text-base font-medium leading-normal pb-2">
                  Restaurant Name
                </p>
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-800 dark:text-slate-200 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-700 bg-background-light dark:bg-background-dark h-14 placeholder:text-slate-400 dark:placeholder:text-slate-500 p-[15px] text-base font-normal leading-normal"
                  placeholder="The Gourmet Corner"
                  type="text"
                />
              </label>

              {/* Email */}
              <label className="flex flex-col">
                <p className="text-slate-800 dark:text-slate-200 text-base font-medium leading-normal pb-2">
                  Email
                </p>
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-800 dark:text-slate-200 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-700 bg-background-light dark:bg-background-dark h-14 placeholder:text-slate-400 dark:placeholder:text-slate-500 p-[15px] text-base font-normal leading-normal"
                  placeholder="jane.doe@example.com"
                  type="email"
                />
              </label>

              {/* Password */}
              <label className="flex flex-col">
                <p className="text-slate-800 dark:text-slate-200 text-base font-medium leading-normal pb-2">
                  Password
                </p>
                <div className="relative flex w-full flex-1 items-stretch">
                  <input
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-800 dark:text-slate-200 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-700 bg-background-light dark:bg-background-dark h-14 placeholder:text-slate-400 dark:placeholder:text-slate-500 p-[15px] text-base font-normal leading-normal pr-12"
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center justify-center pr-4 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
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
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="flex h-14 w-full items-center justify-center gap-2 rounded-lg bg-primary px-8 py-4 text-base font-bold leading-normal text-black transition-all duration-200 hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                Sign Up as Restaurant Owner
              </button>
            </div>
          </form>

          {/* Info Text */}
          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            By signing up, you agree to our{" "}
            <a
              href="#"
              className="font-medium text-primary/80 hover:text-primary"
            >
              Open Source License (MIT)
            </a>
            .
          </p>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
            Already have an account?{" "}
            <Link 
              to="/login"
              className="font-medium text-primary/80 hover:text-primary"
            >
              Login
            </Link>
          </p>
        </div>

        {/* Footer */}
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
