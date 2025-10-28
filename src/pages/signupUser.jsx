import React from "react";
import { MdLightMode,  MdDarkMode } from "react-icons/md";
import { IoMdArrowRoundBack } from "react-icons/io";

import { Link } from "react-router-dom";
const CreateUserAccount = () => {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background-light dark:bg-background-dark p-4 font-display">
      <Link to="/" className="flex text-white absolute top-5 left-7">
        <Link to="/" className=" text-primary pr-3 pt-1">
          <IoMdArrowRoundBack />
        </Link>
        <span>Back</span>
      </Link>

      {/* Dark/Light Mode Button */}
      <div className="absolute top-4 right-4">
        <button className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white dark:bg-background-dark/50 text-gray-700 dark:text-gray-300">
          <span className="material-symbols-outlined dark:hidden">
            <MdLightMode />
          </span>
          <span className="material-symbols-outlined hidden dark:inline">
            <MdDarkMode />
          </span>
        </button>
      </div>

      {/* Main Form Section */}
      <main className="flex w-full max-w-md flex-col items-center">
        <div className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark/50 p-6 sm:p-8 shadow-sm">
          {/* Heading */}
          <div className="flex flex-col items-center text-center mb-8">
            <p className="text-[#111714] dark:text-white text-3xl sm:text-4xl font-black leading-tight tracking-[-0.033em]">
              Create Your QuickPlate Account
            </p>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-4">
            {/* Full Name */}
            <label className="flex flex-col">
              <p className="text-[#111714] dark:text-gray-300 text-base font-medium leading-normal pb-2">
                Full Name
              </p>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111714] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dce5df] dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary/50 h-14 placeholder:text-[#648772] dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                placeholder="Enter your full name"
                type="text"
              />
            </label>

            {/* Email Address */}
            <label className="flex flex-col">
              <p className="text-[#111714] dark:text-gray-300 text-base font-medium leading-normal pb-2">
                Email Address
              </p>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111714] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dce5df] dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary/50 h-14 placeholder:text-[#648772] dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                placeholder="Enter your email address"
                type="email"
              />
            </label>

            {/* Password */}
            <label className="flex flex-col">
              <p className="text-[#111714] dark:text-gray-300 text-base font-medium leading-normal pb-2">
                Password
              </p>
              <div className="flex w-full flex-1 items-stretch rounded-lg">
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111714] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dce5df] dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary/50 h-14 placeholder:text-[#648772] dark:placeholder:text-gray-500 p-[15px] pr-2 text-base font-normal leading-normal"
                  placeholder="Enter your password"
                  type="password"
                />
              </div>
            </label>

            {/* Submit Button */}
            <div className="pt-4 flex flex-col gap-4">
              <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 p-3.5 flex-1 bg-primary text-[#111714] hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-light dark:focus:ring-offset-background-dark focus:ring-primary text-base font-bold leading-normal tracking-[0.015em]">
                <span className="truncate">Sign Up as User</span>
              </button>
              <a
                href="#"
                className="text-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
              >
                Already have an account? Login
              </a>
            </div>
          </form>
        </div>

        {/* License Notice */}
        <div className="absolute bottom-6 text-center mt-6 px-4">
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
