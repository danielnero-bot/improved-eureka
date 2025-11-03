import React, { useState } from "react";
import {
  MdLightMode,
  MdDarkMode,
  MdMenu,
  MdLogout,
  MdDashboard,
  MdRestaurantMenu,
  MdStorefront,
  MdSettings,
  MdPayments,
  MdReceiptLong,
  MdPersonAdd,
  MdAnalytics,
} from "react-icons/md";

const RestaurantDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleTheme = () => setDarkMode((prev) => !prev);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div
      className={`font-display min-h-screen flex transition-colors duration-300 ${
        darkMode
          ? "bg-background-light text-black"
          : "bg-background-dark text-white"
      }`}
    >
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform flex-col border-r transition-transform duration-300 ${
          darkMode
            ? "bg-card-dark border-border-dark"
            : "bg-card-light border-border-light"
        } ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static`}
      >
        {/* Logo / Header */}
        <div className="flex h-16 items-center gap-3 border-b px-6">
          <div className="text-primary">
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
          <span className="text-lg font-bold">QuickPlate</span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col justify-between p-4">
          <ul className="space-y-2">
            {[
              { icon: <MdDashboard />, label: "Dashboard", active: true },
              { icon: <MdRestaurantMenu />, label: "Menu" },
              { icon: <MdStorefront />, label: "Restaurant Info" },
              { icon: <MdSettings />, label: "Settings" },
            ].map(({ icon, label, active }) => (
              <li key={label}>
                <button
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                    active
                      ? "bg-primary/10 text-primary"
                      : darkMode
                      ? "text-text-muted-dark hover:text-text-dark"
                      : "text-text-muted-light hover:text-text-light"
                  }`}
                >
                  {icon}
                  <span>{label}</span>
                </button>
              </li>
            ))}
          </ul>

          {/* Logout */}
          <ul>
            <li>
              <button
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                  darkMode
                    ? "text-text-muted-dark hover:text-text-dark"
                    : "text-text-muted-light hover:text-text-light"
                }`}
              >
                <MdLogout />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header
          className={`sticky top-0 z-20 flex h-16 items-center justify-between border-b px-4 sm:px-6 ${
            darkMode
              ? "bg-card-dark border-border-dark"
              : "bg-card-light border-border-light"
          }`}
        >
          <button
            onClick={toggleSidebar}
            className="rounded-full p-2 lg:hidden"
          >
            <MdMenu className="text-2xl" />
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="rounded-full p-2 transition-colors"
            >
              {darkMode ? (
                <MdLightMode className="text-xl" />
              ) : (
                <MdDarkMode className="text-xl" />
              )}
            </button>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 text-primary">
                <svg
                  fill="none"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.6 8.6a21 21 0 0130.8 0L24 24 8.6 8.6z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <span className="text-lg font-bold">Bella Italia</span>
            </div>
          </div>
        </header>

        {/* Main Section */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            {/* Title */}
            <div>
              <h1 className="text-3xl font-bold">Dashboard Overview</h1>
              <p
                className={
                  darkMode ? "text-text-muted-dark" : "text-text-muted-light"
                }
              >
                Welcome back! Here’s an overview of your restaurant’s
                performance.
              </p>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Today's Revenue",
                  value: "$1,250",
                  icon: <MdPayments />,
                },
                {
                  title: "Today's Orders",
                  value: "68",
                  icon: <MdReceiptLong />,
                },
                {
                  title: "New Customers",
                  value: "12",
                  icon: <MdPersonAdd />,
                },
              ].map(({ title, value, icon }) => (
                <div
                  key={title}
                  className={`rounded-2xl border p-6 shadow-md ${
                    darkMode
                      ? "bg-card-dark border-border-dark"
                      : "bg-card-light border-border-light"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          darkMode
                            ? "text-text-muted-dark"
                            : "text-text-muted-light"
                        }`}
                      >
                        {title}
                      </p>
                      <p className="text-3xl font-bold">{value}</p>
                    </div>
                    <div className="rounded-full bg-primary/10 p-2 text-primary text-xl">
                      {icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Analytics Placeholder */}
            <div
              className={`rounded-2xl border p-6 text-center shadow-md ${
                darkMode
                  ? "bg-card-dark border-border-dark"
                  : "bg-card-light border-border-light"
              }`}
            >
              <div className="flex flex-col items-center justify-center space-y-4 py-16">
                <MdAnalytics className="text-6xl text-primary/70" />
                <h2 className="text-2xl font-bold">Order Analytics</h2>
                <p
                  className={
                    darkMode
                      ? "text-text-muted-dark max-w-md"
                      : "text-text-muted-light max-w-md"
                  }
                >
                  Detailed charts and reports for your order history will be
                  displayed here soon.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RestaurantDashboard;
