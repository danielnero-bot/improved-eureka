import React from "react";
import {
  MdLogout,
  MdDashboard,
  MdRestaurantMenu,
  MdStorefront,
  MdSettings,
} from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const Sidebar = ({ sidebarOpen, setSidebarOpen, onLogout, restaurantData }) => {
  const location = useLocation();
  const { darkMode } = useTheme();

  const navItems = [
    { icon: <MdDashboard />, label: "Dashboard", path: "/restaurantdashboard" },
    { icon: <MdRestaurantMenu />, label: "Menu", path: "/menupage" },
    {
      icon: <MdStorefront />,
      label: "Restaurant Info",
      path: "/restaurant-info",
    },
    { icon: <MdSettings />, label: "Settings", path: "/settings" },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-30 h-screen flex flex-col border-r te transition-all duration-300 overflow-hidden ${
        darkMode
          ? "bg-gray-800 border-border-dark text-white"
          : "bg-indigo-700 border-border-light text-black"
      } ${
        sidebarOpen
          ? "w-64 translate-x-0"
          : "-translate-x-full lg:translate-x-0 lg:w-16 lg:hover:w-64"
      } lg:group`}
    >
      {/* Logo / Header */}
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-4">
        <div className="text-white shrink-0">
          <svg
            fill="none"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8"
          >
            <path
              d="M8.6 8.6a21 21 0 0130.8 0L24 24 8.6 8.6z"
              fill="currentColor"
            />
          </svg>
        </div>
        <span
          className={`text-lg font-bold text-white ${
            sidebarOpen
              ? "opacity-100"
              : "opacity-0 lg:opacity-0 lg:group-hover:opacity-100"
          } transition-opacity duration-300 whitespace-nowrap`}
        >
          QuickPlate
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col justify-between p-4 overflow-y-auto">
        <ul className="space-y-2">
          {navItems.map(({ icon, label, path }) => {
            const active = location.pathname === path;
            return (
              <li key={label}>
                <Link
                  to={path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                    active
                      ? "bg-white/20 text-white"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                  title={label}
                >
                  <span className="text-xl shrink-0">{icon}</span>
                  <span
                    className={`${
                      sidebarOpen
                        ? "opacity-100"
                        : "opacity-0 lg:opacity-0 lg:group-hover:opacity-100"
                    } transition-opacity duration-300 whitespace-nowrap overflow-hidden`}
                  >
                    {label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Restaurant Info & Logout */}
        <div className="space-y-4">
          {/* Restaurant Info */}
          {restaurantData && (
            <div
              className={`p-3 rounded-lg bg-white/10 ${
                sidebarOpen
                  ? "opacity-100"
                  : "opacity-0 lg:opacity-0 lg:group-hover:opacity-100"
              } transition-opacity duration-300`}
            >
              <div className="flex items-center gap-3">
                {restaurantData.logo_url && (
                  <img
                    src={restaurantData.logo_url}
                    alt={`${restaurantData.name} logo`}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <div className="overflow-hidden">
                  <p className="text-white text-sm font-medium truncate">
                    {restaurantData.name}
                  </p>
                  <p className="text-white/70 text-xs truncate">
                    {restaurantData.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Logout */}
          <ul>
            <li>
              <button
                onClick={onLogout}
                className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors w-full text-white/70 hover:text-white hover:bg-white/10"
                title="Logout"
              >
                <MdLogout className="text-xl shrink-0" />
                <span
                  className={`${
                    sidebarOpen
                      ? "opacity-100"
                      : "opacity-0 lg:opacity-0 lg:group-hover:opacity-100"
                  } transition-opacity duration-300 whitespace-nowrap overflow-hidden`}
                >
                  Logout
                </span>
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
