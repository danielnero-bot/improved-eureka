import React, { useState, useEffect } from "react";
import UserSidebar from "../components/UserSidebar";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5 },
  },
};

const UserProfilePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: "",
    phone: "",
    address_line1: "",
    city: "",
    country: "United States",
    delivery_instructions: "",
    email_notifications: true,
    push_notifications: false,
    order_updates: true,
  });
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
          // Load user details from table
          loadUserDetails(user.id, user);
        }
      } catch {
        // ignore
      }
    };
    getUser();
  }, []);

  const loadUserDetails = async (userId, authUser) => {
    try {
      setLoadingProfile(true);
      const { data, error } = await supabase
        .from("user_details")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error loading user details:", error);
      }

      if (data) {
        setProfileData({
          full_name: data.full_name || authUser.user_metadata?.full_name || "",
          phone: data.phone || authUser.phone || "",
          address_line1: data.address_line1 || "",
          city: data.city || "",
          country: data.country || "United States",
          delivery_instructions: data.delivery_instructions || "",
          email_notifications: data.email_notifications ?? true,
          push_notifications: data.push_notifications ?? false,
          order_updates: data.order_updates ?? true,
        });
        if (data.avatar_url) {
          setAvatarUrl(data.avatar_url);
        }
      } else {
        // Initialize with auth data if no record exists
        setProfileData((prev) => ({
          ...prev,
          full_name: authUser.user_metadata?.full_name || "",
          phone: authUser.phone || "",
        }));
      }
    } catch (error) {
      console.error("Error loading user details:", error);
    } finally {
      setLoadingProfile(false);
    }
  };

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

        // Update user_details table
        await supabase.from("user_details").upsert(
          {
            user_id: user.id,
            avatar_url: urlData.publicUrl,
            updated_at: new Date(),
          },
          { onConflict: "user_id" }
        );
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert("Error uploading photo. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleToggleChange = (field) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoadingProfile(true);

      const updates = {
        user_id: user.id,
        full_name: profileData.full_name,
        phone: profileData.phone,
        address_line1: profileData.address_line1,
        city: profileData.city,
        country: profileData.country,
        delivery_instructions: profileData.delivery_instructions,
        email_notifications: profileData.email_notifications,
        push_notifications: profileData.push_notifications,
        order_updates: profileData.order_updates,
        updated_at: new Date(),
      };

      const { error } = await supabase.from("user_details").upsert(updates, {
        onConflict: "user_id",
      });

      if (error) throw error;

      // Also update auth metadata for full_name consistency
      if (profileData.full_name !== user.user_metadata?.full_name) {
        await supabase.auth.updateUser({
          data: { full_name: profileData.full_name },
        });
      }

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    } finally {
      setLoadingProfile(false);
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
            <h1 className="text-xl font-bold text-black dark:text-white">
              Your Profile
            </h1>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="mb-8 hidden lg:block"
          >
            <h1 className="text-3xl font-bold text-black dark:text-white">
              Your Profile
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage your personal information and account settings.
            </p>
          </motion.div>

          <div className="space-y-8">
            {/* Profile Header */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={scaleIn}
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
                    {profileData.full_name ||
                      user?.user_metadata?.full_name ||
                      "Guest User"}
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
            </motion.div>

            {/* Profile Form */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={scaleIn}
              className={`rounded-xl shadow-sm transition-colors duration-300 ${
                darkMode
                  ? "bg-card-dark border border-border-dark"
                  : "bg-card-light border border-border-light"
              }`}
            >
              <div className="p-6">
                <form
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  onSubmit={handleSaveProfile}
                >
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      htmlFor="full_name"
                    >
                      Full Name
                    </label>
                    <input
                      className="w-full p-3 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      id="full_name"
                      type="text"
                      value={profileData.full_name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
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
                      value={profileData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      htmlFor="address_line1"
                    >
                      Delivery Address
                    </label>
                    <input
                      className="w-full p-3 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      id="address_line1"
                      type="text"
                      value={profileData.address_line1}
                      onChange={handleInputChange}
                      placeholder="123 Main St"
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
                      value={profileData.city}
                      onChange={handleInputChange}
                      placeholder="New York"
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
                      value={profileData.country}
                      onChange={handleInputChange}
                      placeholder="United States"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      htmlFor="delivery_instructions"
                    >
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      className="w-full p-3 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      id="delivery_instructions"
                      placeholder="e.g., gate code, delivery instructions"
                      rows="3"
                      value={profileData.delivery_instructions}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                </form>
              </div>
            </motion.div>

            {/* Preferences */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={scaleIn}
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
                      aria-checked={profileData.email_notifications}
                      onClick={() => handleToggleChange("email_notifications")}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        profileData.email_notifications
                          ? "bg-green-600"
                          : "bg-gray-200 dark:bg-gray-600"
                      }`}
                      role="switch"
                      type="button"
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          profileData.email_notifications
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      ></span>
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
                      aria-checked={profileData.push_notifications}
                      onClick={() => handleToggleChange("push_notifications")}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        profileData.push_notifications
                          ? "bg-green-600"
                          : "bg-gray-200 dark:bg-gray-600"
                      }`}
                      role="switch"
                      type="button"
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          profileData.push_notifications
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      ></span>
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
                      aria-checked={profileData.order_updates}
                      onClick={() => handleToggleChange("order_updates")}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        profileData.order_updates
                          ? "bg-green-600"
                          : "bg-gray-200 dark:bg-gray-600"
                      }`}
                      role="switch"
                      type="button"
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          profileData.order_updates
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      ></span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Save Button */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
              className="flex justify-end"
            >
              <button
                className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50"
                type="submit"
                onClick={handleSaveProfile}
                disabled={loadingProfile}
              >
                {loadingProfile ? "Saving..." : "Save Changes"}
              </button>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfilePage;
