import React, { useState, useEffect } from "react";
import { FiHeart, FiBell, FiSearch, FiMapPin, FiTruck } from "react-icons/fi";
import { MdFastfood, MdHistory, MdMenu } from "react-icons/md";
import UserSidebar from "../components/UserSidebar";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const QuickPlateDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) setUser(user);
      } catch {
        // ignore
      }
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="relative flex min-h-screen w-full">
      {/* Desktop Sidebar */}
      <UserSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={user}
        onLogout={handleLogout}
      />

      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div
        className={`flex-1 overflow-y-auto transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-16"
        } ${
          darkMode
            ? "bg-background-dark text-white"
            : "bg-background-light text-black"
        }`}
      >
        {/* Header */}
        <header
          className={`sticky top-0 z-10 flex h-16 items-center justify-between backdrop-blur-md px-4 md:px-8 transition-colors duration-300 ${
            darkMode
              ? "bg-card-dark/80 border-b border-border-dark"
              : "bg-card-light/80 border-b border-border-light"
          }`}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="lg:hidden rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <MdMenu className="text-2xl" />
            </button>
            <div className="relative w-full max-w-md hidden md:block">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light-secondary dark:text-dark-secondary" />
              <input
                className="w-full rounded-full border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark py-2 pl-10 pr-4 focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="Search for restaurants or dishes..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative rounded-full p-2 text-text-light-secondary dark:text-dark-secondary hover:bg-gray-100 dark:hover:bg-white/10">
              <FiBell className="text-lg" />
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            <img
              alt="User profile"
              className="h-10 w-10 rounded-full object-cover"
              src={
                user?.user_metadata?.avatar_url ||
                "https://lh3.googleusercontent.com/aida-public/AB6AXuCuC2LyVfy6uW_KTx1m_sqlJrfn8MhaQTMJ493YKy7EA92tiXfxvclYzvGvFjnRl0mghzRnOt3S6lh7jWGaW-5m0N17Y86WJZlmi7zFSJlBkA0bB0pe-mAZ1sBKOjP7ALJxkqMgl7P6o7kaYsDf7lD6sQ2PMFKhh_a_aG0ZAZSUC7d0esfpbSlaW-jr2bHZ2Z9APfFxZxUZQ-VgeqtDk5nNKkgKuZ6-XuzLA_pRZsUQS7ogiapqd-ilb0RWyT8AaFhU1zNmSgFai0ht"
              }
            />
          </div>
        </header>

        {/* Main Content Sections */}
        <main className="p-4 md:p-8 space-y-8">
          {/* Welcome Section */}
          <section
            className={`rounded-xl p-6 transition-colors duration-300 ${
              darkMode
                ? "bg-card-dark border border-border-dark"
                : "bg-card-light border border-border-light"
            }`}
          >
            <h2 className="text-2xl font-bold">
              Welcome back, {user?.user_metadata?.full_name || "Guest"}!
            </h2>
            <p className="text-text-light-secondary dark:text-dark-secondary mt-1">
              What would you like to eat today?
            </p>
          </section>

          {/* Quick Actions */}
          <section>
            <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: MdFastfood, label: "Order Food", color: "primary" },
                { icon: FiTruck, label: "Track Order", color: "blue" },
                { icon: FiHeart, label: "Saved", color: "red" },
                { icon: MdHistory, label: "Past Orders", color: "purple" },
              ].map((action, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center justify-center gap-2 rounded-xl p-4 text-center cursor-pointer hover:shadow-lg transition-all ${
                    darkMode
                      ? "bg-card-dark border border-border-dark hover:border-primary"
                      : "bg-card-light border border-border-light hover:border-primary"
                  }`}
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full bg-${action.color}-100 dark:bg-${action.color}-900/20`}
                  >
                    <action.icon
                      className={`text-${action.color}-600 dark:text-${action.color}-400 text-2xl`}
                    />
                  </div>
                  <p className="font-semibold">{action.label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Orders */}
          <section>
            <h3 className="text-xl font-bold mb-4">Recent Orders</h3>
            <div
              className={`rounded-xl p-8 text-center transition-colors duration-300 ${
                darkMode
                  ? "bg-card-dark border border-border-dark"
                  : "bg-card-light border border-border-light"
              }`}
            >
              <div className="flex justify-center mb-4">
                <MdHistory className="text-4xl text-text-light-secondary dark:text-dark-secondary opacity-50" />
              </div>
              <p className="text-text-light-secondary dark:text-dark-secondary">
                No recent orders found.
              </p>
            </div>
          </section>

          {/* Saved Restaurants */}
          <section>
            <h3 className="text-xl font-bold mb-4">Your Saved Restaurants</h3>
            <div
              className={`rounded-xl p-8 text-center transition-colors duration-300 ${
                darkMode
                  ? "bg-card-dark border border-border-dark"
                  : "bg-card-light border border-border-light"
              }`}
            >
              <div className="flex justify-center mb-4">
                <FiHeart className="text-4xl text-text-light-secondary dark:text-dark-secondary opacity-50" />
              </div>
              <p className="text-text-light-secondary dark:text-dark-secondary">
                You haven't saved any restaurants yet.
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default QuickPlateDashboard;
