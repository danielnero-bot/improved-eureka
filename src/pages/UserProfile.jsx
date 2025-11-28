import React, { useState, useEffect } from "react";
import UserSidebar from "../components/UserSidebar";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

const UserProfilePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useTheme();

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
      {/* Sidebar */}
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
        className={`flex-1 p-6 bg-gray-50 dark:bg-gray-900 transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-16"
        }`}
      >
        <div className="max-w-4xl mx-auto">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center mb-6">
            <button
              onClick={toggleSidebar}
              className="mr-4 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <FiMenu className="text-2xl text-gray-700 dark:text-gray-300" />
            </button>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
              Your Profile
            </h1>
          </div>

          <div className="mb-8 hidden lg:block">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Your Profile
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage your personal information and account settings.
            </p>
          </div>

          <div className="space-y-8">
            {/* Profile Header */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <div className="p-6 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="relative group cursor-pointer">
                  <img
                    alt="User profile image"
                    className="h-24 w-24 rounded-full object-cover"
                    src={
                      user?.user_metadata?.avatar_url ||
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuBRJUfDw1o7j4QSFBNpFzknkgHS6jfFfnP8DE4S5DTiAZ83SAZSxp8wMW-WEnUP0HEs9gB9hQ72wllB4O-VrMn1N7fpucVJODVOb8LQBnYIjNxIcLAz5L5QeE2WHrd9p9EovH2aSlnnx8RN_627TsYldHB3SSuFThRtBw4qAk_m_xchl5YnOOtPJ2heBijtua5f8xMlShQq1Sqh8fQ5o1XcNhpswU3caHWk1VmHblXg9_lfCAHz_Ewv--I1cvDWUSndJ6WEmNoMGapc"
                    }
                  />
                  <div
                    className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() =>
                      document.getElementById("avatar-upload").click()
                    }
                  >
                    <span className="text-white text-xs font-medium">
                      Change
                    </span>
                  </div>
                </div>
                <div className="text-center sm:text-left flex-1">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                    {user?.user_metadata?.full_name || "Guest User"}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400">
                    {user?.email || "No email provided"}
                  </p>
                </div>
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      // Handle file upload here
                      console.log("File selected:", file);
                    }
                  }}
                />
                <button
                  className="text-sm px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                  onClick={() =>
                    document.getElementById("avatar-upload").click()
                  }
                >
                  Edit photo
                </button>
              </div>
            </div>

            {/* Profile Form */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <div className="p-6">
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      htmlFor="full-name"
                    >
                      Full Name
                    </label>
                    <input
                      className="w-full p-3 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      id="full-name"
                      type="text"
                      defaultValue={user?.user_metadata?.full_name || ""}
                      key={user?.user_metadata?.full_name} // Force re-render when data loads
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      htmlFor="email"
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      defaultValue={user?.email || ""}
                      readOnly
                      className="w-full p-3 rounded-lg border border-gray-300 dark:border-white/10 bg-gray-100 dark:bg-white/5 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      htmlFor="phone"
                    >
                      Phone Number
                    </label>
                    <input
                      className="w-full p-3 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      id="phone"
                      type="tel"
                      defaultValue={user?.phone || ""}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      htmlFor="address"
                    >
                      Delivery Address
                    </label>
                    <input
                      className="w-full p-3 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      id="address"
                      type="text"
                      defaultValue="123 Flavor Street" // Placeholder as we don't have address in metadata yet
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      htmlFor="city"
                    >
                      City
                    </label>
                    <input
                      className="w-full p-3 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      id="city"
                      type="text"
                      defaultValue="Foodville"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      htmlFor="country"
                    >
                      Country
                    </label>
                    <input
                      className="w-full p-3 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      id="country"
                      type="text"
                      defaultValue="United States"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      htmlFor="notes"
                    >
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      className="w-full p-3 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      id="notes"
                      placeholder="e.g., gate code, delivery instructions"
                      rows="3"
                    ></textarea>
                  </div>
                </form>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Preferences
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-700 dark:text-gray-300">
                        Dark Mode
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Switch between light and dark themes.
                      </p>
                    </div>
                    <button
                      aria-checked={darkMode}
                      onClick={toggleTheme}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        darkMode
                          ? "bg-green-600"
                          : "bg-gray-200 dark:bg-gray-600"
                      }`}
                      role="switch"
                      type="button"
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          darkMode ? "translate-x-6" : "translate-x-1"
                        }`}
                      ></span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-700 dark:text-gray-300">
                        Email Notifications
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Get emails about your orders and offers.
                      </p>
                    </div>
                    <button
                      aria-checked="true"
                      className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-600"
                      role="switch"
                      type="button"
                    >
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-700 dark:text-gray-300">
                        Push Notifications
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Receive alerts on your mobile device.
                      </p>
                    </div>
                    <button
                      aria-checked="false"
                      className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-600"
                      role="switch"
                      type="button"
                    >
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1"></span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-700 dark:text-gray-300">
                        Order Updates
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Get real-time updates on your order status.
                      </p>
                    </div>
                    <button
                      aria-checked="true"
                      className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-600"
                      role="switch"
                      type="button"
                    >
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                type="submit"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfilePage;
