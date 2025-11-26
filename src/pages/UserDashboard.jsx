import React from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { useTheme } from "../context/ThemeContext";
import {
  MdLightMode,
  MdDarkMode,
  MdSearch,
  MdNotifications,
  MdSettings,
  MdReceiptLong,
  MdStorefront,
  MdRestaurant,
  MdLocalShipping,
  MdPayments,
  MdCalendarMonth,
} from "react-icons/md";

const UserDashboard = () => {
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="font-display bg-background-light dark:bg-background-dark min-h-screen">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <div className="flex flex-col flex-1">
          {/* Header */}
          <header className="flex items-center justify-between border-b border-gray-200/10 dark:border-white/10 px-4 py-3 md:px-6">
            <div className="flex items-center gap-4 md:gap-8">
              <div className="flex items-center gap-3 text-white">
                <svg
                  className="size-6 text-primary"
                  fill="none"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z"
                    fill="currentColor"
                  ></path>
                </svg>
                <h2 className="text-black dark:text-white text-lg font-bold">
                  QuickPlate
                </h2>
              </div>

              <label className="hidden md:flex flex-col min-w-40 max-w-64 h-10">
                <div className="flex w-full items-stretch rounded-lg h-full">
                  <div className="text-gray-400 flex items-center justify-center pl-3 rounded-l-lg bg-gray-100 dark:bg-white/5">
                    <MdSearch className="text-2xl" />
                  </div>
                  <input
                    className="form-input flex-1 bg-gray-100 dark:bg-white/5 text-black dark:text-white border-none focus:ring-0 px-4"
                    placeholder="Search..."
                  />
                </div>
              </label>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-2 md:gap-4">
              <button className="rounded-full h-10 w-10 hover:bg-gray-100 dark:hover:bg-white/5 text-gray-800 dark:text-gray-300 flex items-center justify-center">
                <MdNotifications className="text-2xl" />
              </button>

              <button className="rounded-full h-10 w-10 hover:bg-gray-100 dark:hover:bg-white/5 text-gray-800 dark:text-gray-300 flex items-center justify-center">
                <MdSettings className="text-2xl" />
              </button>

              <div
                className="bg-center bg-cover rounded-full size-10"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCoTlw4fX7-nkxB5vGAofrEFuhWXtAEdm527cIZudGpKTVbhrYg51n9UGOfwvEz2mK0O3fjx-fUFnJ7sy8xdRQAfG8CDVhBj_-iC8886liS0ImoNwtbAcPeEbO4t6q1byVijzIZRLTnhlVdfwBzOqz_9jim3-E3zuEG-bpkOLri9qDenseiY7I35O1EBr2mJ2JfNcZ7ZUdS1PvK7N0gg7rGX4Dv6b-pP_e2QhMvnwqlXCb9sHWra7y1UWXd2dCCwBePXPQ6zXDp_8MH')",
                }}
              ></div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-4 md:p-6">
            <h1 className="text-black dark:text-white text-3xl md:text-4xl font-black mb-6">
              Your Dashboard
            </h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 sm:gap-6">
              {/* Stat Card */}
              <div className="dashboard-card">
                <MdReceiptLong className="text-primary text-3xl" />
                <p className="stat-number">124</p>
                <p className="stat-label">Total Orders</p>
              </div>

              <div className="dashboard-card">
                <MdStorefront className="text-primary text-3xl" />
                <p className="stat-number">3</p>
                <p className="stat-label">Favorite Restaurants</p>
              </div>

              <div className="dashboard-card">
                <MdRestaurant className="text-primary text-3xl" />
                <p className="stat-number">5</p>
                <p className="stat-label">Favorite Dishes</p>
              </div>

              <div className="dashboard-card">
                <MdLocalShipping className="text-primary text-3xl" />
                <p className="stat-number">1</p>
                <p className="stat-label">Active Orders</p>
              </div>

              <div className="dashboard-card">
                <MdPayments className="text-primary text-3xl" />
                <p className="stat-number">$2,450.75</p>
                <p className="stat-label">Total Spent</p>
              </div>

              <div className="dashboard-card">
                <MdCalendarMonth className="text-primary text-3xl" />
                <p className="stat-number">Oct 26</p>
                <p className="stat-label">Last Order</p>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Tailwind Helpers */}
      <style>
        {`
          .dashboard-card {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            padding: 1.5rem;
            background: white;
            color: black;
            border-radius: 0.75rem;
            border: 1px solid transparent;
            transition: transform .2s;
          }
          .dark .dashboard-card {
            background: rgba(255,255,255,0.05);
            border-color: rgba(255,255,255,0.1);
            color: white;
          }
          .dashboard-card:hover {
            transform: scale(1.02);
          }
          .stat-number {
            font-size: 1.875rem;
            font-weight: bold;
          }
          .stat-label {
            font-size: .875rem;
            color: #6b7280;
          }
          .dark .stat-label {
            color: #9ca3af;
          }
        `}
      </style>
    </div>
  );
};

export default UserDashboard;
