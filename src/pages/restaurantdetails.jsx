import React, { useEffect, useState, useRef } from "react";
import {
  MdEdit,
  MdRestaurantMenu,
  MdReceiptLong,
  MdPayments,
  MdCheck,
  MdClose,
  MdCameraAlt,
} from "react-icons/md";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";

const RestaurantDetails = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [stats, setStats] = useState({
    menuCount: 0,
    orderCount: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { darkMode } = useTheme();

  // Editing state
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const fileInputRef = useRef(null);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const fetchData = async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;

      if (!user) {
        navigate("/login");
        return;
      }

      const { data: restaurantData, error: restaurantError } = await supabase
        .from("restaurants")
        .select("*")
        .eq("owner_uid", user.id)
        .single();

      if (restaurantError) {
        if (restaurantError.code === "PGRST116") {
          setRestaurant(null);
        } else {
          throw restaurantError;
        }
      } else {
        setRestaurant(restaurantData);

        const [menuRes, ordersRes] = await Promise.all([
          supabase
            .from("menu_items")
            .select("id", { count: "exact", head: true })
            .eq("restaurant_id", restaurantData.id),
          supabase
            .from("orders")
            .select("total_amount")
            .eq("restaurant_id", restaurantData.id)
            .eq("status", "completed"),
        ]);

        const menuCount = menuRes.count || 0;
        const orders = ordersRes.data || [];
        const orderCount = orders.length;
        const totalRevenue = orders.reduce(
          (sum, order) => sum + (parseFloat(order.total_amount) || 0),
          0
        );

        setStats({ menuCount, orderCount, totalRevenue });
      }
    } catch (err) {
      console.error("❌ Error loading data:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

  // Start editing a field
  const startEditing = (field, value) => {
    setEditingField(field);
    setTempValue(value || "");
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingField(null);
    setTempValue("");
  };

  // Save field update
  const saveField = async (field) => {
    if (!restaurant) return;

    try {
      const { error } = await supabase
        .from("restaurants")
        .update({ [field]: tempValue })
        .eq("id", restaurant.id);

      if (error) throw error;

      setRestaurant((prev) => ({ ...prev, [field]: tempValue }));
      setEditingField(null);
    } catch (err) {
      console.error(`❌ Error updating ${field}:`, err.message);
      alert(`Failed to update ${field}. Please try again.`);
    }
  };

  // Handle Logo Upload
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !restaurant) return;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `logo_${Date.now()}.${fileExt}`;
      const filePath = `${restaurant.owner_uid}/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("restaurant-logos")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get Public URL
      const { data: publicUrlData } = supabase.storage
        .from("restaurant-logos")
        .getPublicUrl(filePath);

      const logoURL = publicUrlData.publicUrl;

      // Update Database
      const { error: dbError } = await supabase
        .from("restaurants")
        .update({ logo_url: logoURL })
        .eq("id", restaurant.id);

      if (dbError) throw dbError;

      setRestaurant((prev) => ({ ...prev, logo_url: logoURL }));
    } catch (err) {
      console.error("❌ Error uploading logo:", err.message);
      alert("Failed to upload logo. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // Helper to render editable field
  const renderEditableField = (
    label,
    field,
    value,
    type = "text",
    isTextArea = false
  ) => {
    const isEditing = editingField === field;

    return (
      <div className="group relative">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
          {label}
        </h3>
        {isEditing ? (
          <div className="flex items-start gap-2">
            {isTextArea ? (
              <textarea
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2 text-sm text-text-light dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                rows={4}
                autoFocus
              />
            ) : (
              <input
                type={type}
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2 text-sm text-text-light dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                autoFocus
              />
            )}
            <div className="flex flex-col gap-1">
              <button
                onClick={() => saveField(field)}
                className="p-1 rounded bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
                title="Save"
              >
                <MdCheck size={18} />
              </button>
              <button
                onClick={cancelEditing}
                className="p-1 rounded bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                title="Cancel"
              >
                <MdClose size={18} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <p className="text-base text-text-light dark:text-gray-200 break-words w-full">
              {value || "Not set"}
            </p>
            <button
              onClick={() => startEditing(field, value)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-primary dark:text-gray-500 dark:hover:text-primary"
              title={`Edit ${label}`}
            >
              <MdEdit size={16} />
            </button>
          </div>
        )}
      </div>
    );
  };

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

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-lg text-gray-500 font-display">
        Loading restaurant details...
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-center text-gray-500 font-display">
        <p>No restaurant data found for this account.</p>
        <button
          onClick={() => navigate("/restaurantsetup")}
          className="mt-4 px-5 py-2 rounded-lg bg-primary text-black font-semibold hover:scale-105 transition"
        >
          Create Restaurant
        </button>
      </div>
    );
  }

  return (
    <div
      className={`relative flex min-h-screen w-full flex-col font-display transition-colors duration-300 ${
        darkMode
          ? "bg-background-dark text-gray-200"
          : "bg-background-light text-text-light"
      }`}
    >
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogout}
        restaurantData={restaurant}
      />

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`layout-container flex h-full grow flex-col transition-all duration-300 ${
          sidebarOpen ? "lg:ml-16" : "lg:ml-16"
        }`}
      >
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="mx-auto flex w-full max-w-6xl flex-col gap-8"
          >
            {/* Header & Logo */}
            <motion.header
              variants={itemVariants}
              className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-background-dark p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <div className="flex items-center gap-6 w-full">
                <button
                  onClick={toggleSidebar}
                  className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <MdRestaurantMenu className="text-2xl" />
                </button>

                {/* Logo Upload Section */}
                <div className="relative group shrink-0">
                  <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-800">
                    <img
                      alt="Restaurant Logo"
                      className="h-full w-full object-cover"
                      src={
                        restaurant.logo_url ||
                        "https://via.placeholder.com/150?text=Logo"
                      }
                    />
                    {uploading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-transform hover:scale-105"
                    title="Change Logo"
                  >
                    <MdCameraAlt size={16} />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleLogoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                {/* Title (Editable) */}
                <div className="flex-1 min-w-0">
                  {editingField === "name" ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        className="w-full text-2xl font-bold bg-transparent border-b-2 border-primary outline-none text-text-light dark:text-white"
                        autoFocus
                      />
                      <button
                        onClick={() => saveField("name")}
                        className="text-green-600 hover:text-green-700"
                      >
                        <MdCheck size={24} />
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="text-red-600 hover:text-red-700"
                      >
                        <MdClose size={24} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 group">
                      <h1 className="text-3xl font-bold truncate">
                        {restaurant.name}
                      </h1>
                      <button
                        onClick={() => startEditing("name", restaurant.name)}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-primary transition-opacity"
                      >
                        <MdEdit size={20} />
                      </button>
                    </div>
                  )}
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    ID: {restaurant.id}
                  </p>
                </div>
              </div>
            </motion.header>

            {/* Stats Section */}
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {[
                {
                  icon: <MdRestaurantMenu size={24} />,
                  label: "Total Menu Items",
                  value: stats.menuCount,
                },
                {
                  icon: <MdReceiptLong size={24} />,
                  label: "Total Orders",
                  value: stats.orderCount,
                },
                {
                  icon: <MdPayments size={24} />,
                  label: "Total Revenue",
                  value: new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(stats.totalRevenue),
                },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={itemVariants}
                  className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-background-dark p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold text-text-light dark:text-gray-100">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </section>

            {/* Restaurant Info Grid */}
            <section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* General Info */}
              <motion.div
                variants={itemVariants}
                className="lg:col-span-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-background-dark p-6 shadow-sm"
              >
                <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold border-b border-gray-200 dark:border-gray-700 pb-3">
                  Restaurant Details
                  <span className="text-xs font-normal text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                    Click edit icon to change
                  </span>
                </h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {renderEditableField(
                    "Address",
                    "address",
                    restaurant.address
                  )}
                  {renderEditableField(
                    "Phone Number",
                    "phone_number",
                    restaurant.phone_number,
                    "tel"
                  )}
                  {renderEditableField(
                    "Contact Email",
                    "contact_email",
                    restaurant.contact_email,
                    "email"
                  )}
                  {renderEditableField(
                    "Opening Hours",
                    "opening_hours",
                    restaurant.opening_hours,
                    "time"
                  )}
                  {renderEditableField(
                    "Closing Hours",
                    "closing_hours",
                    restaurant.closing_hours,
                    "time"
                  )}
                </div>
              </motion.div>

              {/* Description */}
              <motion.div
                variants={itemVariants}
                className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-background-dark p-6 shadow-sm h-fit"
              >
                <h2 className="mb-6 text-lg font-semibold border-b border-gray-200 dark:border-gray-700 pb-3">
                  About
                </h2>
                {renderEditableField(
                  "Description / Bio",
                  "description",
                  restaurant.description,
                  "text",
                  true
                )}
              </motion.div>
            </section>

            {/* Action Buttons */}
            <motion.section
              variants={itemVariants}
              className="flex justify-end"
            >
              <button
                onClick={() => navigate("/add-menu-item")}
                className="flex items-center justify-center gap-2 h-12 px-6 rounded-lg bg-primary text-white text-base font-bold hover:bg-primary/90 hover:scale-105 transition-all shadow-md"
              >
                <MdRestaurantMenu size={20} />
                Add New Menu Item
              </button>
            </motion.section>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default RestaurantDetails;
