import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { useTheme } from "../context/ThemeContext";
import Sidebar from "../components/Sidebar";
import { MdMenu, MdLightMode, MdDarkMode } from "react-icons/md";
import { motion } from "framer-motion";

export default function Settings() {
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [user, setUser] = useState(null);
  const [restaurantData, setRestaurantData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Form states
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  // Password states
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Notification states
  const [notifications, setNotifications] = useState({
    order: true,
    marketing: false,
    system: true,
  });

  // Messages
  const [message, setMessage] = useState({ type: "", text: "" });

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUser(user);
        setEmail(user.email);
        setRole(user.user_metadata?.role || "User");
        setFullName(user.user_metadata?.full_name || "");
        setUsername(user.user_metadata?.username || "");
        setPhone(user.user_metadata?.phone || "");

        // Fetch restaurant data for sidebar
        const { data: restaurant } = await supabase
          .from("restaurants")
          .select("*")
          .eq("owner_uid", user.id)
          .maybeSingle();

        if (restaurant) {
          setRestaurantData(restaurant);
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setMessage({ type: "", text: "" });

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          username: username,
          phone: phone,
        },
      });

      if (error) throw error;
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    setUpdating(true);
    setMessage({ type: "", text: "" });

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
      setMessage({ type: "success", text: "Password updated successfully!" });
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center font-display">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-black dark:text-white min-h-screen flex transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogout}
        restaurantData={restaurantData}
      />

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div
        className={`flex flex-1 flex-col transition-all duration-300 ${
          sidebarOpen ? "lg:ml-16" : "lg:ml-16"
        }`}
      >
        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`sticky top-0 z-20 flex h-16 items-center justify-between border-b px-4 sm:px-6 backdrop-blur-md bg-opacity-80 ${
            darkMode
              ? "bg-card-dark border-border-dark"
              : "bg-card-light border-border-light"
          }`}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="lg:hidden rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <MdMenu className="text-2xl" />
            </button>
            <h1 className="text-xl font-bold tracking-tight">Settings</h1>
          </div>

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
          </div>
        </motion.header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="w-full max-w-4xl mx-auto"
          >
            {message.text && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  message.type === "success"
                    ? "bg-green-100 text-green-700 border border-green-400"
                    : "bg-red-100 text-red-700 border border-red-400"
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="flex flex-col gap-8">
              {/* ================= PROFILE SECTION ================= */}
              <motion.section
                variants={itemVariants}
                className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm transition-colors duration-300"
              >
                <div className="p-6 border-b border-border-light dark:border-border-dark">
                  <h2 className="text-xl font-semibold">Profile</h2>
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">
                    Manage your public profile information.
                  </p>
                </div>

                {/* User Info */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <h3 className="font-medium">User Information</h3>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">
                      Current user details from our system.
                    </p>
                  </div>

                  <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                        Full Name
                      </label>
                      <p className="mt-1 font-medium">
                        {fullName || "Not set"}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                        Email Address
                      </label>
                      <p className="mt-1 font-medium">{email}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                        Role
                      </label>
                      <p className="mt-1 font-medium capitalize">{role}</p>
                    </div>
                  </div>
                </div>

                {/* Edit Profile Form */}
                <form
                  onSubmit={handleUpdateProfile}
                  className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-border-light dark:border-border-dark"
                >
                  <div className="md:col-span-1">
                    <h3 className="font-medium">Edit Profile</h3>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">
                      Update your name, username and phone.
                    </p>
                  </div>

                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <label
                        htmlFor="fullName"
                        className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark"
                      >
                        Full Name
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="mt-1 block w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-2.5 focus:border-primary focus:ring-primary outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="username"
                        className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark"
                      >
                        Username
                      </label>
                      <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="mt-1 block w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-2.5 focus:border-primary focus:ring-primary outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark"
                      >
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="mt-1 block w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-2.5 focus:border-primary focus:ring-primary outline-none transition-colors"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={updating}
                        className="flex h-10 px-4 min-w-[84px] cursor-pointer items-center justify-center rounded-lg bg-primary text-[#111714] text-sm font-bold hover:scale-105 transition-transform disabled:opacity-50"
                      >
                        {updating ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </div>
                </form>
              </motion.section>

              {/* ================= ACCOUNT SECTION ================= */}
              <motion.section
                variants={itemVariants}
                className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm transition-colors duration-300"
              >
                <div className="p-6 border-b border-border-light dark:border-border-dark">
                  <h2 className="text-xl font-semibold">Account</h2>
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">
                    Manage your account security and data.
                  </p>
                </div>

                {/* Change Password */}
                <form
                  onSubmit={handleUpdatePassword}
                  className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                  <div className="md:col-span-1">
                    <h3 className="font-medium">Change Password</h3>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">
                      Update your password for better security.
                    </p>
                  </div>

                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <label
                        htmlFor="newPassword"
                        className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark"
                      >
                        New Password
                      </label>
                      <input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="mt-1 block w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-2.5 focus:border-primary focus:ring-primary outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark"
                      >
                        Confirm New Password
                      </label>
                      <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="mt-1 block w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-2.5 focus:border-primary focus:ring-primary outline-none transition-colors"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={updating}
                        className="flex h-10 px-4 min-w-[84px] cursor-pointer items-center justify-center rounded-lg bg-primary text-[#111714] text-sm font-bold hover:scale-105 transition-transform disabled:opacity-50"
                      >
                        {updating ? "Updating..." : "Update Password"}
                      </button>
                    </div>
                  </div>
                </form>

                {/* Delete Account */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-border-light dark:border-border-dark">
                  <div className="md:col-span-1">
                    <h3 className="font-medium text-danger">Delete Account</h3>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">
                      Permanently remove your account and all data.
                    </p>
                  </div>

                  <div className="md:col-span-2 flex items-start">
                    <button
                      type="button"
                      onClick={() => alert("This feature is coming soon.")}
                      className="flex h-10 px-4 min-w-[84px] cursor-pointer items-center justify-center rounded-lg bg-danger text-white text-sm font-bold hover:scale-105 transition-transform"
                    >
                      Delete My Account
                    </button>
                  </div>
                </div>
              </motion.section>

              {/* ================= PREFERENCES SECTION ================= */}
              <motion.section
                variants={itemVariants}
                className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm transition-colors duration-300"
              >
                <div className="p-6 border-b border-border-light dark:border-border-dark">
                  <h2 className="text-xl font-semibold">Preferences</h2>
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">
                    Customize your app experience.
                  </p>
                </div>

                {/* Appearance */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <h3 className="font-medium">Appearance</h3>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">
                      Choose between light and dark mode.
                    </p>
                  </div>

                  <div className="md:col-span-2 flex items-center">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={darkMode}
                      onClick={toggleTheme}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background-dark ${
                        darkMode ? "bg-primary" : "bg-gray-200"
                      }`}
                    >
                      <span className="sr-only">Toggle Dark Mode</span>
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                          darkMode ? "translate-x-5" : "translate-x-0"
                        }`}
                      ></span>
                    </button>
                    <span className="ml-3 text-sm font-medium">
                      {darkMode ? "Dark Mode" : "Light Mode"}
                    </span>
                  </div>
                </div>

                {/* Notifications */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-border-light dark:border-border-dark">
                  <div className="md:col-span-1">
                    <h3 className="font-medium">Notifications</h3>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">
                      Manage how you receive notifications.
                    </p>
                  </div>

                  <div className="md:col-span-2 space-y-3">
                    <div className="flex items-center">
                      <input
                        id="order-notifications"
                        type="checkbox"
                        checked={notifications.order}
                        onChange={(e) =>
                          setNotifications({
                            ...notifications,
                            order: e.target.checked,
                          })
                        }
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:bg-background-dark dark:border-border-dark"
                      />
                      <label
                        htmlFor="order-notifications"
                        className="ml-3 text-sm font-medium"
                      >
                        Order notifications
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="marketing-emails"
                        type="checkbox"
                        checked={notifications.marketing}
                        onChange={(e) =>
                          setNotifications({
                            ...notifications,
                            marketing: e.target.checked,
                          })
                        }
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:bg-background-dark dark:border-border-dark"
                      />
                      <label
                        htmlFor="marketing-emails"
                        className="ml-3 text-sm font-medium"
                      >
                        Marketing emails
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="system-alerts"
                        type="checkbox"
                        checked={notifications.system}
                        onChange={(e) =>
                          setNotifications({
                            ...notifications,
                            system: e.target.checked,
                          })
                        }
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:bg-background-dark dark:border-border-dark"
                      />
                      <label
                        htmlFor="system-alerts"
                        className="ml-3 text-sm font-medium"
                      >
                        System alerts
                      </label>
                    </div>
                  </div>
                </div>
              </motion.section>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
