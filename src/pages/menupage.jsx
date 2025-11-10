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
  const [restaurantData, setRestaurantData] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        console.error("❌ No user logged in");
        setLoading(false);
        return;
      }

      try {
        // 1️⃣ Fetch restaurant by Firebase UID
        const { data: restaurant, error: restaurantError } = await supabase
          .from("restaurants")
          .select("*")
          .eq("firebase_uid", user.uid)
          .single();

        if (restaurantError) {
          console.error("❌ Error fetching restaurant:", restaurantError);
          setLoading(false);
          return;
        }

        setRestaurantData(restaurant);

        // 2️⃣ Fetch menu items for the restaurant
        const { data: items, error: menuError } = await supabase
          .from("menu_items")
          .select("*")
          .eq("restaurant_id", restaurant.id);

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

    fetchData();
  }, []);

  const handleAddMenuItem = () => navigate("/addmenuitem");
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-primary rounded-full mx-auto"></div>
          <p className="mt-4 text-lg text-black dark:text-white">
            Loading menu...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark text-black dark:text-white">
      {/* Sidebar omitted for brevity (same as your original code) */}

      <div className="flex flex-1 flex-col transition-all duration-300">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b px-4 bg-background-light/80 dark:bg-background-dark/80">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <MdMenu className="text-2xl" />
            </button>
            <h1 className="text-xl font-bold">Menu Management</h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleAddMenuItem}
              className="flex items-center gap-2 px-4 py-2 h-9 rounded-md bg-primary text-text-light font-bold hover:scale-105 transition-transform"
            >
              <IoIosAddCircle />
              <span className="hidden sm:inline">Add New Item</span>
            </button>

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
          {menuItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
              <IoIosAddCircle className="text-6xl text-primary/70" />
              <h2 className="text-2xl font-bold">No Menu Items Yet</h2>
              <p className="text-text-secondary-light dark:text-text-secondary-dark max-w-sm">
                You haven't added any dishes yet. Start by adding your first
                menu item!
              </p>
              <button
                onClick={handleAddMenuItem}
                className="mt-4 flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-text-light hover:scale-105 transition-transform"
              >
                <IoIosAdd />
                Add Your First Item
              </button>
            </div>
          ) : (
            <>
              {/* Search Input */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                <input
                  type="text"
                  placeholder="Search for a dish..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full sm:max-w-xs h-10 pl-10 pr-4 rounded-md border bg-card-light dark:bg-card-dark focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Menu Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMenu.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col border rounded-lg bg-card-light dark:bg-card-dark overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-48 w-full object-cover"
                    />
                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex items-start justify-between">
                        <h2 className="text-lg font-bold">{item.name}</h2>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
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
                      <p className="mt-2 text-sm text-text-secondary-light dark:text-text-secondary-dark flex-1">
                        {item.description}
                      </p>
                      <p className="mt-4 text-lg font-semibold text-primary">
                        {item.price}
                      </p>
                    </div>
                    <div className="flex justify-end gap-2 p-3 border-t border-border-light dark:border-border-dark">
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
