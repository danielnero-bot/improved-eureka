import React from "react";
import { Link, NavLink } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
const Navbar = () => {
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
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-gray-700 px-4 sm:px-10 py-3">
      {/* Logo Section */}
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

      {/* Navigation */}
      <nav className="hidden md:flex flex-1 justify-end">
        <div className="flex items-center gap-9">
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
        </div>
      </nav>

      {/* Mobile Menu Button */}
      <button className="md:hidden text-[#111714] dark:text-gray-300">
        <FiMenu />
      </button>
    </header>
  );
};

export default Navbar;
