import React, { useState, useEffect } from "react";
import { IoIosAddCircle, IoIosAdd } from "react-icons/io";
import { MdMenu, MdDarkMode, MdLightMode } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import Sidebar from "../components/Sidebar";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";

const MenuManagement = () => {
  const { darkMode, toggleTheme } = useTheme();
  const [restaurantData, setRestaurantData] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1️⃣ Get current Supabase user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("❌ No user logged in");
        navigate("/login");
        return;
      }

      // 2️⃣ Fetch restaurant by owner_uid
      const { data: restaurant, error: restaurantError } = await supabase
        .from("restaurants")
        .select("*")
        .eq("owner_uid", user.id)
        .single();

      if (restaurantError) {
        console.error("❌ Error fetching restaurant:", restaurantError);
        setLoading(false);
        return;
      }

      setRestaurantData(restaurant);

      // 3️⃣ Fetch menu items for the restaurant
      const { data: items, error: menuError } = await supabase
        .from("menu_items")
        .select("*")
        .eq("restaurant_id", restaurant.id)
        .order("created_at", { ascending: false });

      if (menuError) {
        console.error("❌ Error fetching menu items:", menuError);
      } else {
        setMenuItems(items || []);
      }
    } catch (error) {
      console.error("❌ Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMenuItem = () => navigate("/addmenuitem");
  const handleEditMenuItem = (itemId) => navigate(`/addmenuitem/${itemId}`);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleDeleteMenuItem = async (itemId, itemName) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setDeleteLoading(itemId);

    try {
      const { error } = await supabase
        .from("menu_items")
        .delete()
        .eq("id", itemId)
        .eq("restaurant_id", restaurantData.id);

      if (error) {
        console.error("❌ Error deleting menu item:", error);
        alert("Failed to delete menu item. Please try again.");
      } else {
        // Remove item from local state
        setMenuItems((prev) => prev.filter((item) => item.id !== itemId));
        alert("Menu item deleted successfully!");
      }
    } catch (error) {
      console.error("❌ Delete error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setDeleteLoading(null);
    }
  };

  const toggleAvailability = async (itemId, currentAvailability, itemName) => {
    try {
      const { error } = await supabase
        .from("menu_items")
        .update({ available: !currentAvailability })
        .eq("id", itemId)
        .eq("restaurant_id", restaurantData.id);

      if (error) {
        console.error("❌ Error updating availability:", error);
        alert("Failed to update availability. Please try again.");
      } else {
        // Update local state
        setMenuItems((prev) =>
          prev.map((item) =>
            item.id === itemId
              ? { ...item, available: !currentAvailability }
              : item
          )
        );
      }
    } catch (error) {
      console.error("❌ Availability toggle error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const filteredMenu = menuItems.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

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
      <div
        className={`flex items-center justify-center min-h-screen transition-colors duration-300 ${
          darkMode
            ? "bg-background-dark text-white"
            : "bg-background-light text-black"
        }`}
      >
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-primary rounded-full mx-auto"></div>
          <p className="mt-4 text-lg">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`font-display min-h-screen flex transition-colors duration-300 ${
        darkMode
          ? "bg-background-dark text-white"
          : "bg-background-light text-black"
      }`}
    >
      {/* Reusable Sidebar Component */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogout}
        restaurantData={restaurantData}
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
            {/* Hamburger Menu Button - Only show on mobile */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <MdMenu className="text-2xl" />
            </button>
            <h1 className="text-xl font-bold">Menu Management</h1>
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

            <button
              onClick={handleAddMenuItem}
              className="flex items-center gap-2 px-4 py-2 h-9 rounded-md bg-primary text-white font-bold hover:scale-105 transition-transform"
            >
              <IoIosAddCircle />
              <span className="hidden sm:inline">Add New Item</span>
            </button>

            {/* Restaurant Info */}
            {restaurantData && (
              <div className="hidden md:flex items-center gap-3">
                {restaurantData.logo_url && (
                  <img
                    src={restaurantData.logo_url}
                    alt={`${restaurantData.name} logo`}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <span className="text-lg font-bold">{restaurantData.name}</span>
              </div>
            )}
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300">
          {menuItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4"
            >
              <IoIosAddCircle className="text-6xl text-primary/70" />
              <h2 className="text-2xl font-bold">No Menu Items Yet</h2>
              <p
                className={`max-w-sm ${
                  darkMode ? "text-text-muted-dark" : "text-text-muted-light"
                }`}
              >
                You haven't added any dishes yet. Start by adding your first
                menu item!
              </p>
              <button
                onClick={handleAddMenuItem}
                className="mt-4 flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-white hover:scale-105 transition-transform"
              >
                <IoIosAdd />
                Add Your First Item
              </button>
            </motion.div>
          ) : (
            <>
              {/* Search Input */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6"
              >
                <input
                  type="text"
                  placeholder="Search for a dish..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`w-full sm:max-w-xs h-10 pl-10 pr-4 rounded-md border focus:ring-2 focus:ring-primary ${
                    darkMode
                      ? "bg-card-dark border-border-dark text-white"
                      : "bg-card-light border-border-light text-black"
                  }`}
                />
                <div className="text-sm text-text-muted-light dark:text-text-muted-dark">
                  {filteredMenu.length} of {menuItems.length} items
                </div>
              </motion.div>

              {/* Menu Grid */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredMenu.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    className={`flex flex-col border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow ${
                      darkMode
                        ? "bg-card-dark border-border-dark"
                        : "bg-card-light border-border-light"
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={
                          item.image_url ||
                          "https://via.placeholder.com/300x200?text=No+Image"
                        }
                        alt={item.name}
                        className="h-48 w-full object-cover"
                      />
                      <button
                        onClick={() =>
                          toggleAvailability(item.id, item.available, item.name)
                        }
                        className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold transition-colors ${
                          item.available
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50"
                        }`}
                      >
                        {item.available ? "Available" : "Out of Stock"}
                      </button>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex items-start justify-between">
                        <h2 className="text-lg font-bold">{item.name}</h2>
                      </div>
                      <p
                        className={`text-sm ${
                          darkMode
                            ? "text-text-muted-dark"
                            : "text-text-muted-light"
                        }`}
                      >
                        {item.category}
                      </p>
                      <p
                        className={`mt-2 text-sm flex-1 ${
                          darkMode
                            ? "text-text-muted-dark"
                            : "text-text-muted-light"
                        }`}
                      >
                        {item.description}
                      </p>
                      <p className="mt-4 text-lg font-semibold text-primary">
                        ${parseFloat(item.price).toFixed(2)}
                      </p>
                    </div>
                    <div
                      className={`flex justify-end gap-2 p-3 border-t ${
                        darkMode ? "border-border-dark" : "border-border-light"
                      }`}
                    >
                      <button
                        onClick={() => handleEditMenuItem(item.id)}
                        className={`h-8 px-3 text-sm font-medium rounded-md transition-colors ${
                          darkMode
                            ? "hover:bg-background-dark/50"
                            : "hover:bg-background-light"
                        }`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteMenuItem(item.id, item.name)}
                        disabled={deleteLoading === item.id}
                        className="h-8 px-3 text-sm font-medium text-red-600 dark:text-red-400 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50"
                      >
                        {deleteLoading === item.id ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600 mx-auto"></div>
                        ) : (
                          "Delete"
                        )}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {filteredMenu.length === 0 && search && (
                <div className="text-center py-12">
                  <p className="text-lg text-text-muted-light dark:text-text-muted-dark">
                    No menu items found matching "{search}"
                  </p>
                  <button
                    onClick={() => setSearch("")}
                    className="mt-2 text-primary hover:underline"
                  >
                    Clear search
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default MenuManagement;
