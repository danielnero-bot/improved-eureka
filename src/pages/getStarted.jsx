import React from "react";
import { FaRegUser } from "react-icons/fa";
import { GiForkKnifeSpoon } from "react-icons/gi";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link } from "react-router-dom";

const JoinQuickPlate = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-gray-900 dark:text-gray-100 min-h-screen flex flex-col items-center justify-center p-4">
      <main className="realative flex w-full max-w-4xl flex-col items-center justify-center gap-8 py-10">
        {/* Page Heading */}
        <Link to="/" className="absolute top-5 left-7 bg-primary rounded-[50%] p-2" type="button"><IoMdArrowRoundBack /></Link>
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="text-4xl font-black tracking-tighter text-[#111714] dark:text-white sm:text-5xl md:text-6xl">
            Join QuickPlate
          </h1>
          <p className="text-base text-[#648772] dark:text-gray-400 md:text-lg">
            Choose how you want to get started.
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Card 1: User */}
          <Link
            to="/signupUser"
            className="group flex flex-col items-start gap-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:border-primary/50 dark:hover:border-primary/70"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
              <FaRegUser />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-bold text-[#111714] dark:text-white">
                Sign up as User
              </h2>
              <p className="text-sm text-[#648772] dark:text-gray-400">
                Explore the open-source restaurant builder, contribute or
                customize templates.
              </p>
            </div>
          </Link>

          {/* Card 2: Restaurant Owner */}
          <Link
            to="/signupRestaurant"
            className="group flex flex-col items-start gap-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:border-primary/50 dark:hover:border-primary/70"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
              <GiForkKnifeSpoon />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-bold text-[#111714] dark:text-white">
                Sign up as Restaurant Owner
              </h2>
              <p className="text-sm text-[#648772] dark:text-gray-400">
                Create and manage your own restaurant website using QuickPlate
                tools.
              </p>
            </div>
          </Link>
        </div>

        {/* Footer MetaText */}
        <div className="pt-8 text-center">
          <p className="text-sm text-[#648772] dark:text-gray-500">
            Powered by QuickPlate Open Source
          </p>
        </div>
      </main>
    </div>
  );
};

export default JoinQuickPlate;
