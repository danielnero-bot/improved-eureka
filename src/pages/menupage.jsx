import React, { useState, useEffect } from "react";
import { IoIosAddCircle, IoIosAdd } from "react-icons/io";
import {
  MdDashboard,
  MdRestaurantMenu,
  MdStorefront,
  MdSettings,
  MdLogout,
  MdMenu,
} from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { getAuth } from "firebase/auth";

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [restaurantData, setRestaurantData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // 🔹 Get restaurant details from Supabase
  useEffect(() => {
    const fetchRestaurant = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        console.error("❌ No user logged in");
        setLoading(false);
        return;
      }

      try {
        // Get restaurant details using Firebase UID
        const { data, error } = await supabase
          .from("restaurants")
          .select("*")
          .eq("firebase_uid", user.uid)
          .single();

        if (error) {
          console.error("❌ Error fetching restaurant:", error);
        } else {
          console.log("✅ Restaurant data:", data);
          setRestaurantData(data);
        }
      } catch (error) {
        console.error("❌ Error in fetchRestaurant:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, []);

  const handleAddMenuItem = () => {
    navigate("/addmenuitem");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const navItems = [
    { icon: <MdDashboard />, label: "Dashboard", path: "/restaurantdashboard" },
    { icon: <MdRestaurantMenu />, label: "Menu", path: "/menupage" },
    {
      icon: <MdStorefront />,
      label: "Restaurant Info",
      path: "/restaurant-info",
    },
    { icon: <MdSettings />, label: "Settings", path: "/settings" },
  ];

  const filteredMenu = menuItems.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  // Loading spinner component
  if (loading) {
    return (
      <div className="bg-background-light dark:bg-background-dark font-display text-black dark:text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-black dark:text-white min-h-screen flex">
      {/* Sidebar - Hidden on mobile, visible on desktop */}
      <aside
        className={`fixed top-0 left-0 z-30 h-screen flex flex-col border-r transition-all duration-300 overflow-hidden ${
          darkMode
            ? "bg-gray-800 border-border-dark"
            : "bg-indigo-700 border-border-light"
        } ${
          sidebarOpen
            ? "w-64 translate-x-0"
            : "-translate-x-full lg:translate-x-0 lg:w-16 lg:hover:w-64"
        } lg:group`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-4">
          <div className="text-white shrink-0">
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
          <span
            className={`text-lg font-bold text-white ${
              sidebarOpen
                ? "opacity-100"
                : "opacity-0 lg:opacity-0 lg:group-hover:opacity-100"
            } transition-opacity duration-300 whitespace-nowrap`}
          >
            QuickPlate
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col justify-between p-4 overflow-y-auto">
          <ul className="space-y-2">
            {navItems.map(({ icon, label, path }) => {
              const active = location.pathname === path;
              return (
                <li key={label}>
                  <Link
                    to={path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                      active
                        ? "bg-white/20 text-white pl-1.5"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                    title={label}
                  >
                    <span className="text-xl shrink-0">{icon}</span>
                    <span
                      className={`${
                        sidebarOpen
                          ? "opacity-100"
                          : "opacity-0 lg:opacity-0 lg:group-hover:opacity-100"
                      } transition-opacity duration-300 whitespace-nowrap overflow-hidden`}
                    >
                      {label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Logout */}
          <ul>
            <li>
              <button className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors w-full text-white/70 hover:text-white hover:bg-white/10">
                <MdLogout className="text-xl shrink-0" />
                <span
                  className={`${
                    sidebarOpen
                      ? "opacity-100"
                      : "opacity-0 lg:opacity-0 lg:group-hover:opacity-100"
                  } transition-opacity duration-300 whitespace-nowrap overflow-hidden`}
                >
                  Logout
                </span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

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
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border-light/80 dark:border-border-dark/80 bg-background-light/80 dark:bg-background-dark/80 px-4 sm:px-6 lg:px-8 backdrop-blur-md">
          <div className="flex items-center gap-4">
            {/* Hamburger Menu Button - Only show on mobile */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <MdMenu className="text-2xl" />
            </button>
            <h1 className="text-xl font-bold tracking-tight">
              Menu Management
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Add New Item Button */}
            <button
              onClick={handleAddMenuItem}
              className="flex min-w-[84px] items-center justify-center gap-2 rounded-md h-9 px-4 bg-primary text-text-light text-sm font-bold leading-normal transition-transform hover:scale-105"
            >
              <IoIosAddCircle className="text-base" />
              <span className="hidden sm:inline">Add New Item</span>
            </button>

            {/* Restaurant name from Supabase */}
            {restaurantData && (
              <div className="hidden md:flex items-center gap-3">
                {restaurantData.logo_url && (
                  <img
                    src={restaurantData.logo_url}
                    alt="Logo"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <span className="text-lg font-bold">{restaurantData.name}</span>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {filteredMenu.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
              <IoIosAddCircle className="text-6xl text-primary/70" />
              <h2 className="text-2xl font-bold">No Menu Items Yet</h2>
              <p className="text-text-secondary-light dark:text-text-secondary-dark max-w-sm">
                You haven't added any dishes yet. Start by adding your first
                menu item to showcase what your restaurant offers!
              </p>
              <button
                onClick={handleAddMenuItem}
                className="mt-4 flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-bold text-text-light transition-transform hover:scale-105"
              >
                <IoIosAdd />
                Add Your First Item
              </button>
            </div>
          ) : (
            <>
              {/* Search + Filter Section */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                <div className="relative w-full sm:max-w-xs">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="Search for a dish..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 rounded-md border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  />
                </div>

                <div className="relative w-full sm:w-auto">
                  <button className="flex h-10 w-full items-center justify-between gap-2 rounded-md border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark px-4 text-sm transition-colors hover:bg-background-light dark:hover:bg-background-dark/50">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-base text-text-secondary-light dark:text-text-secondary-dark">
                        filter_list
                      </span>
                      <span>All Categories</span>
                    </div>
                    <span className="material-symbols-outlined text-base text-text-secondary-light dark:text-text-secondary-dark">
                      expand_more
                    </span>
                  </button>
                </div>
              </div>

              {/* Menu Grid */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredMenu.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col overflow-hidden rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark shadow-sm transition-shadow hover:shadow-lg"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-48 w-full object-cover"
                    />
                    <div className="flex flex-1 flex-col p-4">
                      <div className="flex items-start justify-between">
                        <h2 className="text-lg font-bold">{item.name}</h2>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            item.available
                              ? "bg-success/10 text-success"
                              : "bg-error/10 text-error"
                          }`}
                        >
                          {item.available ? "Available" : "Out of Stock"}
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                        {item.category}
                      </p>
                      <p className="mt-2 flex-1 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                        {item.description}
                      </p>
                      <p className="mt-4 text-lg font-semibold text-primary">
                        {item.price}
                      </p>
                    </div>
                    <div className="flex items-center justify-end gap-2 border-t border-border-light dark:border-border-dark p-3">
                      <button className="h-8 px-3 text-sm font-medium rounded-md hover:bg-background-light dark:hover:bg-background-dark/50 transition-colors">
                        Edit
                      </button>
                      <button className="h-8 px-3 text-sm font-medium text-error rounded-md hover:bg-error/10 transition-colors">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default MenuManagement;
