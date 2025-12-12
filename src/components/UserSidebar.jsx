import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiHeart,
  FiUser,
  FiLogOut,
  FiShoppingCart,
} from "react-icons/fi";
import { MdStorefront, MdReceiptLong } from "react-icons/md";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";

const UserSidebar = ({ sidebarOpen, setSidebarOpen, user, onLogout }) => {
  const location = useLocation();
  const { darkMode } = useTheme();
  const { getCartItemsCount, setIsCartOpen } = useCart();

  const navItems = [
    { path: "/dashboard", label: "Home", icon: <FiHome /> },
    { path: "/restaurantview", label: "Restaurants", icon: <MdStorefront /> },
    { path: "/userOrders", label: "Your Orders", icon: <MdReceiptLong /> },
    { path: "/favorites", label: "Favorites", icon: <FiHeart /> },
    { path: "/userProfile", label: "Profile", icon: <FiUser /> },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-30 h-screen flex flex-col border-r transition-all duration-300 overflow-hidden group ${
        darkMode
          ? "bg-card-dark border-border-dark text-white"
          : "bg-card-light border-border-light text-text-light"
      } ${
        sidebarOpen
          ? "w-64 translate-x-0"
          : "-translate-x-full lg:translate-x-0 lg:w-16 lg:hover:w-64"
      }`}
    >
      {/* Logo / Header */}
      <div
        className={`flex h-16 items-center gap-3 border-b px-4 ${
          darkMode ? "border-white/10" : "border-black/5"
        }`}
      >
        <div className="shrink-0 text-primary w-8 h-8">
          <svg
            className="w-full h-full"
            fill="none"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#sidebar_logo_clip)">
              <path
                d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z"
                fill="currentColor"
              ></path>
            </g>
            <defs>
              <clipPath id="sidebar_logo_clip">
                <rect fill="white" height="48" width="48"></rect>
              </clipPath>
            </defs>
          </svg>
        </div>
        <span
          className={`text-lg font-bold ${
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
          {navItems.map(({ path, label, icon }) => {
            const active = location.pathname === path;
            return (
              <li key={label}>
                <Link
                  to={path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-lg transition-colors ${
                    sidebarOpen
                      ? "px-3 py-2"
                      : "p-2 lg:p-2 lg:group-hover:px-3 lg:group-hover:py-2"
                  } ${
                    active
                      ? darkMode
                        ? "bg-white/10 text-white"
                        : "bg-primary/10 text-primary font-bold"
                      : darkMode
                      ? "text-white/70 hover:text-white hover:bg-white/5"
                      : "text-text-secondary-light hover:text-text-light hover:bg-gray-100"
                  }`}
                  title={label}
                >
                  <span className="text-xl shrink-0">{icon}</span>
                  <span
                    className={`${
                      sidebarOpen
                        ? "opacity-100"
                        : "opacity-0 lg:opacity-0 lg:group-hover:opacity-100"
                    } transition-opacity duration-300 whitespace-nowrap overflow-hidden text-inherit`}
                  >
                    {label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Cart Button */}
        <div className="mt-4">
          <button
            onClick={() => {
              setIsCartOpen(true);
              setSidebarOpen(false);
            }}
            className={`flex items-center gap-3 rounded-lg transition-colors w-full relative ${
              sidebarOpen
                ? "px-3 py-2"
                : "p-2 lg:p-2 lg:group-hover:px-3 lg:group-hover:py-2"
            } ${
              darkMode
                ? "text-white/70 hover:text-white hover:bg-white/5"
                : "text-text-secondary-light hover:text-text-light hover:bg-gray-100"
            }`}
            title="Cart"
          >
            <span className="text-xl shrink-0 relative">
              <FiShoppingCart />
              {getCartItemsCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {getCartItemsCount()}
                </span>
              )}
            </span>
            <span
              className={`${
                sidebarOpen
                  ? "opacity-100"
                  : "opacity-0 lg:opacity-0 lg:group-hover:opacity-100"
              } transition-opacity duration-300 whitespace-nowrap overflow-hidden text-inherit`}
            >
              Cart {getCartItemsCount() > 0 && `(${getCartItemsCount()})`}
            </span>
          </button>
        </div>

        {/* User Info & Logout */}
        <div className="space-y-4 mt-auto">
          {/* User Info */}
          {user && (
            <div
              className={`p-3 rounded-lg ${
                darkMode ? "bg-white/5" : "bg-gray-100"
              } ${
                sidebarOpen
                  ? "opacity-100"
                  : "opacity-0 lg:opacity-0 lg:group-hover:opacity-100"
              } transition-opacity duration-300`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800 shrink-0">
                  {user?.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="overflow-hidden">
                  <p
                    className={`text-sm font-medium truncate ${
                      darkMode ? "text-white" : "text-text-light"
                    }`}
                  >
                    {user?.user_metadata?.full_name || "Guest User"}
                  </p>
                  <p
                    className={`text-xs truncate ${
                      darkMode ? "text-white/70" : "text-text-muted-light"
                    }`}
                  >
                    {user?.email || "guest@example.com"}
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
                className={`flex items-center gap-3 rounded-lg transition-colors w-full ${
                  sidebarOpen
                    ? "px-3 py-2"
                    : "p-2.5 lg:p-2.5 lg:group-hover:px-3 lg:group-hover:py-2"
                } ${
                  darkMode
                    ? "text-white/70 hover:text-white hover:bg-white/5"
                    : "text-text-secondary-light hover:text-text-light hover:bg-gray-100"
                }`}
                title="Logout"
              >
                <FiLogOut className="text-xl shrink-0" />
                <span
                  className={`${
                    sidebarOpen
                      ? "opacity-100"
                      : "opacity-0 lg:opacity-0 lg:group-hover:opacity-100"
                  } transition-opacity duration-300 whitespace-nowrap overflow-hidden text-inherit`}
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

export default UserSidebar;
