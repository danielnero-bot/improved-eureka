import React, { useState, useEffect } from "react";
import UserSidebar from "../components/UserSidebar";
import { FiSearch, FiChevronDown, FiMenu } from "react-icons/fi";
import { MdShoppingBasket } from "react-icons/md";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const UserOrdersPage = () => {
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
    <div className="relative flex min-h-screen w-full flex-col">
      <div className="flex h-full w-full">
        {/* SideNavBar */}
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
        <main
          className={`flex-1 p-6 lg:p-8 transition-all duration-300 ${
            sidebarOpen ? "lg:ml-64" : "lg:ml-16"
          } ${
            darkMode
              ? "bg-background-dark text-white"
              : "bg-background-light text-black"
          }`}
        >
          <div className="mx-auto max-w-4xl">
            {/* PageHeading */}
            <div className="flex flex-wrap justify-between gap-4 items-center mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleSidebar}
                  className="lg:hidden rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <FiMenu className="text-2xl" />
                </button>
                <div className="flex flex-col gap-1">
                  <p className="text-3xl lg:text-4xl font-black leading-tight tracking-[-0.033em] text-gray-900 dark:text-white">
                    Your Orders
                  </p>
                  <p className="text-base font-normal leading-normal text-gray-500 dark:text-gray-400">
                    Track all your past and ongoing food orders.
                  </p>
                </div>
              </div>
            </div>

            {/* Search and Filter Section */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* SearchBar */}
              <div className="flex-1">
                <label className="flex flex-col h-12 w-full">
                  <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                    <div
                      className={`flex items-center justify-center pl-4 rounded-l-lg border-r-0 transition-colors duration-300 ${
                        darkMode
                          ? "text-gray-400 bg-black/20 border-gray-700"
                          : "text-gray-500 bg-white border-gray-200"
                      }`}
                    >
                      <FiSearch className="text-xl" />
                    </div>
                    <input
                      className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg focus:outline-0 focus:ring-2 focus:ring-primary/50 h-full px-4 pl-2 text-base font-normal leading-normal transition-colors duration-300 ${
                        darkMode
                          ? "text-white bg-black/20 border-gray-700 placeholder:text-gray-400"
                          : "text-gray-900 bg-white border-gray-200 placeholder:text-gray-500"
                      }`}
                      placeholder="Search by restaurant or item..."
                      defaultValue=""
                    />
                  </div>
                </label>
              </div>

              {/* Chips / Filter */}
              <div className="flex items-center">
                <button
                  className={`flex h-12 w-full md:w-auto shrink-0 items-center justify-between gap-x-2 rounded-lg px-4 transition-colors duration-300 ${
                    darkMode
                      ? "bg-black/20 border border-gray-700"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  <p
                    className={`text-sm font-medium leading-normal ${
                      darkMode ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    All Orders
                  </p>
                  <FiChevronDown
                    className={`text-xl ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Orders List */}
            <div className="grid grid-cols-1 gap-6">
              {/* Empty State */}
              <div
                className={`flex flex-col items-center justify-center text-center gap-4 py-16 px-6 rounded-xl border-2 border-dashed transition-colors duration-300 ${
                  darkMode ? "border-gray-700" : "border-gray-300"
                }`}
              >
                <div className="flex items-center justify-center size-16 bg-primary/20 rounded-full">
                  <MdShoppingBasket className="text-3xl text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  You have no orders yet.
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-xs">
                  Start exploring restaurants to place your first order.
                </p>
                <button className="flex items-center justify-center rounded-lg h-10 px-4 bg-primary text-background-dark text-sm font-medium leading-normal hover:opacity-90 mt-2">
                  <span>Browse Restaurants</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserOrdersPage;
