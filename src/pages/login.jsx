import React, { useState } from "react";
import { MdLightMode, MdDarkMode } from "react-icons/md";
import PasswordChecker from "../components/PasswordChecker";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const Login = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
            <div className="flex flex-col gap-4">
              {/* Email Field */}
              <div className="flex flex-col gap-1">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="pb-2 text-base font-medium">Email</p>
                  <input
                    className="form-input flex h-14 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-border-light bg-surface-light p-4 text-base font-normal leading-normal text-text-light-primary placeholder:text-text-light-secondary focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20 dark:border-border-dark dark:bg-surface-dark dark:text-dark-primary dark:placeholder:text-dark-secondary dark:focus:border-primary"
                    placeholder="Enter your email address"
                    type="email"
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
            </div>

            {/* Role Selector & Login Button */}
            <div className="flex flex-col gap-4">
              <div className="flex h-12 flex-1 items-center justify-center rounded-lg bg-background-light dark:bg-background-dark p-1 border border-border-light dark:border-border-dark">
                <label className="flex h-full flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-md px-2 text-sm font-medium text-text-light-secondary has-checked:bg-surface-light has-checked:text-text-light-primary has-checked:shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:text-dark-secondary dark:has-checked:bg-surface-dark dark:has-checked:text-dark-primary">
                  <span className="truncate">Login as User</span>
                  <input
                    className="invisible w-0"
                    name="role-selector"
                    type="radio"
                    value="Login as User"
                    defaultChecked
                  />
                </label>

                <label className="flex h-full flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-md px-2 text-sm font-medium text-text-light-secondary has-checked:bg-surface-light has-checked:text-text-light-primary has-checked:shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:text-dark-secondary dark:has-checked:bg-surface-dark dark:has-checked:text-dark-primary">
                  <span className="truncate">Login as Restaurant Owner</span>
                  <input
                    className="invisible w-0"
                    name="role-selector"
                    type="radio"
                    value="Login as Restaurant Owner"
                  />
                </label>
              </div>

              <button className="flex h-12 min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary px-5 text-base font-bold text-text-light-primary transition-colors hover:bg-primary/90">
                <span className="truncate">Login</span>
              </button>

              <p className="text-center text-sm text-text-light-secondary dark:text-dark-secondary">
                Don’t have an account?{" "}
                <a
                  className="font-semibold text-primary hover:underline"
                  href="#"
                >
                  Sign up
                </a>
              </p>
            </div>
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
