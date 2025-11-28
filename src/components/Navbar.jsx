import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { FaSun, FaMoon } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { darkMode, toggleTheme } = useTheme();

  const navItems = [
    { name: "About", path: "/about" },
    { name: "Docs", path: "/docs" },
    {
      name: "GitHub",
      path: "https://github.com/danielnero-bot/improved-eureka",
      external: true,
    },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="border-b border-solid border-gray-200 dark:border-gray-700 px-4 sm:px-10 py-3 relative z-50">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-4 text-primary">
          <div className="size-6">
            <svg
              fill="none"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_6_319)">
                <path
                  d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z"
                  fill="currentColor"
                ></path>
              </g>
              <defs>
                <clipPath id="clip0_6_319">
                  <rect fill="white" height="48" width="48"></rect>
                </clipPath>
              </defs>
            </svg>
          </div>
          <h2 className="text-[#111714] dark:text-gray-100 text-lg font-bold">
            QuickPlate
          </h2>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-9">
          {navItems.map((item) =>
            item.external ? (
              <a
                key={item.name}
                href={item.path}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#111714] dark:text-gray-300 dark:hover:text-white text-sm font-medium hover:text-primary transition-colors"
              >
                {item.name}
              </a>
            ) : (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive
                      ? "text-primary"
                      : "text-[#111714] dark:text-gray-300 hover:text-primary dark:hover:text-white"
                  }`
                }
              >
                {item.name}
              </NavLink>
            )
          )}

          <Link
            to="/getStarted"
            className="bg-primary text-[#111714] font-bold rounded-lg px-5 h-10 flex items-center justify-center hover:scale-105 transition-transform"
          >
            Get Started
          </Link>
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="ml-3 rounded-full p-2 bg-surface-light dark:bg-surface-dark text-[#111714] dark:text-gray-200 hover:opacity-90"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-[#111714] dark:text-gray-300 z-50"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-40 md:hidden z-40"
            onClick={() => setIsOpen(false)}
          ></div>
          <div
            className={`fixed top-0 right-0 h-full w-2/3 sm:w-1/2 bg-white dark:bg-[#111714] shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
              isOpen ? "translate-x-0" : "translate-x-full"
            } md:hidden`}
          >
            <div className="flex flex-col p-6 gap-6 mt-16">
              <div className="flex justify-end">
                <FaXmark onClick={() => setIsOpen(false)} className="my-2" />
              </div>
              {navItems.map((item) =>
                item.external ? (
                  <a
                    key={item.name}
                    href={item.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className="text-[#111714] dark:text-gray-300 text-lg font-medium hover:text-primary transition-colors"
                  >
                    {item.name}
                  </a>
                ) : (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `text-lg font-medium transition-colors ${
                        isActive
                          ? "text-primary"
                          : "text-[#111714] dark:text-gray-300 hover:text-primary dark:hover:text-white"
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                )
              )}
              <Link
                to="/getStarted"
                onClick={() => setIsOpen(false)}
                className="bg-primary text-[#111714] font-bold rounded-lg px-5 py-3 text-center hover:scale-105 transition-transform"
              >
                Get Started
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Navbar;
