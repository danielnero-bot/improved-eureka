import React, { useState, useEffect } from "react";
import UserSidebar from "../components/UserSidebar";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

const UserProfilePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useTheme();

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          // Load avatar from storage
          loadAvatar(user.id);
        }
      } catch {
        // ignore
      }
    };
    getUser();
  }, []);

  const loadAvatar = async (userId) => {
    try {
      // Check if avatar exists in storage
      const { data, error } = await supabase.storage
        .from("avatars")
        .list(userId, {
          limit: 1,
        });

      if (error) {
        console.error("Error loading avatar:", error);
        return;
      }

      if (data && data.length > 0) {
        // Get public URL for the avatar
        const { data: urlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(`${userId}/${data[0].name}`);

        if (urlData) {
          setAvatarUrl(urlData.publicUrl);
        }
      }
    } catch (error) {
      console.error("Error loading avatar:", error);
    }
  };

  const handleAvatarUpload = async (file) => {
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      alert("File size must be less than 2MB");
      return;
    }

    try {
      setUploading(true);

      // Generate filename with extension
      const fileExt = file.name.split(".").pop();
      const fileName = `avatar.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          upsert: true, // Replace if exists
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      if (urlData) {
        setAvatarUrl(urlData.publicUrl);

        // Update user metadata
        await supabase.auth.updateUser({
          data: { avatar_url: urlData.publicUrl },
        });
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert("Error uploading photo. Please try again.");
    } finally {
      setUploading(false);
    }
  };

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
        className={`flex-1 p-6 transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-16"
        } ${
          darkMode
            ? "bg-background-dark text-white"
            : "bg-background-light text-black"
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
            <div
              className={`rounded-xl shadow-sm transition-colors duration-300 ${
                darkMode
                  ? "bg-card-dark border border-border-dark"
                  : "bg-card-light border border-border-light"
              }`}
            >
              <div className="p-6 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="relative group cursor-pointer">
                  <img
                    alt="User profile image"
                    className="h-24 w-24 rounded-full object-cover"
                    src={
                      avatarUrl ||
                      user?.user_metadata?.avatar_url ||
                      "https://ui-avatars.com/api/?name=" +
                        encodeURIComponent(
                          user?.user_metadata?.full_name || "User"
                        ) +
                        "&background=38e07b&color=fff&size=200"
                    }
                  />
                  <div
                    className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() =>
                      document.getElementById("avatar-upload").click()
                    }
                  >
                    <span className="text-white text-xs font-medium">
                      {uploading ? "Uploading..." : "Change"}
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
                      handleAvatarUpload(file);
                    }
                  }}
                  disabled={uploading}
                />
                <button
                  className="text-sm px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors disabled:opacity-50"
                  onClick={() =>
                    document.getElementById("avatar-upload").click()
                  }
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Edit photo"}
                </button>
              </div>
            </div>

            {/* Profile Form */}
            <div
              className={`rounded-xl shadow-sm transition-colors duration-300 ${
                darkMode
                  ? "bg-card-dark border border-border-dark"
                  : "bg-card-light border border-border-light"
              }`}
            >
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
            <div
              className={`rounded-xl shadow-sm transition-colors duration-300 ${
                darkMode
                  ? "bg-card-dark border border-border-dark"
                  : "bg-card-light border border-border-light"
              }`}
            >
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
