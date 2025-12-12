import React, { useState, useEffect } from "react";
import { FiHeart, FiBell, FiSearch, FiMapPin, FiTruck } from "react-icons/fi";
import { MdFastfood, MdHistory, MdMenu, MdShoppingCart } from "react-icons/md";
import UserSidebar from "../components/UserSidebar";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
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

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
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

const QuickPlateDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
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

  useEffect(() => {
    if (!user) return;
    const fetchFavorites = async () => {
      try {
        setLoadingFavorites(true);
        const { data, error } = await supabase
          .from("favorites")
          .select(
            `
            id,
            restaurants (
              id,
              name,
              logo_url
            )
          `
          )
          .eq("user_id", user.id)
          .limit(3);

        if (error) throw error;

        const validFavorites = (data || [])
          .map((f) => f.restaurants)
          .filter((r) => r !== null);

        setFavorites(validFavorites);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingFavorites(false);
      }
    };
    fetchFavorites();
    fetchFavorites();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const fetchRecentOrders = async () => {
      try {
        setLoadingOrders(true);
        const { data, error } = await supabase
          .from("orders")
          .select(
            `
             *,
             restaurant:restaurants(name, logo_url)
          `
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(3);

        if (error) throw error;
        setRecentOrders(data || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchRecentOrders();
  }, [user]);

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
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted-light dark:text-text-muted-dark" />
              <input
                className="w-full rounded-full border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark py-2 pl-10 pr-4 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                placeholder="Search for restaurants..."
                type="text"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    // Implement search navigation if needed, or just visual
                  }
                }}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative rounded-full p-2 text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-white/10">
              <MdShoppingCart className="text-lg" />
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
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className={`rounded-xl p-6 transition-colors duration-300 ${
              darkMode
                ? "bg-card-dark border border-border-dark"
                : "bg-card-light border border-border-light"
            }`}
          >
            <h2 className="text-2xl font-bold">
              Welcome back, {user?.user_metadata?.full_name || "Guest"}!
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1">
              What would you like to eat today?
            </p>
          </motion.section>

          {/* Quick Actions */}
          <section>
            <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={staggerContainer}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[
                {
                  icon: MdFastfood,
                  label: "Order Food",
                  color: "primary",
                  path: "/restaurantview",
                },
                {
                  icon: FiTruck,
                  label: "Track Order",
                  color: "blue",
                  path: "/userOrders",
                },
                {
                  icon: FiHeart,
                  label: "Saved",
                  color: "red",
                  path: "/favorites",
                },
                {
                  icon: MdHistory,
                  label: "Past Orders",
                  color: "purple",
                  path: "/userOrders",
                },
              ].map((action, index) => (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                  onClick={() => navigate(action.path)}
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
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Recent Orders */}
          <section>
            <h3 className="text-xl font-bold mb-4">Recent Orders</h3>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={scaleIn}
              className={`rounded-xl p-4 md:p-6 transition-colors duration-300 ${
                darkMode
                  ? "bg-card-dark border border-border-dark"
                  : "bg-card-light border border-border-light"
              }`}
            >
              {loadingOrders ? (
                <div className="py-8 text-center">Loading orders...</div>
              ) : recentOrders.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                        darkMode
                          ? "bg-white/5 border-white/10"
                          : "bg-gray-50 border-gray-100"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {order.restaurant?.logo_url ? (
                          <img
                            src={order.restaurant.logo_url}
                            alt={order.restaurant.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                            <MdFastfood className="text-xl text-primary" />
                          </div>
                        )}
                        <div className="text-left">
                          <h4 className="font-bold">
                            {order.restaurant?.name || "Restaurant"}
                          </h4>
                          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                            {new Date(order.created_at).toLocaleDateString()} •{" "}
                            {order.status}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">
                          ${order.total_amount}
                        </p>
                        <button
                          onClick={() => navigate("/userOrders")}
                          className="text-xs hover:underline mt-1 block w-full text-right"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => navigate("/userOrders")}
                    className="mt-2 text-sm text-primary font-bold hover:underline self-center"
                  >
                    View All Orders
                  </button>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <div className="flex justify-center mb-4">
                    <MdHistory className="text-4xl text-text-muted-light dark:text-text-muted-dark opacity-50" />
                  </div>
                  <p className="text-text-secondary-light dark:text-text-secondary-dark">
                    No recent orders found.
                  </p>
                </div>
              )}
            </motion.div>
          </section>

          {/* Saved Restaurants */}
          <section>
            <h3 className="text-xl font-bold mb-4">Your Saved Restaurants</h3>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={scaleIn}
              className={`rounded-xl p-6 transition-colors duration-300 min-h-[150px] flex flex-col justify-center ${
                darkMode
                  ? "bg-card-dark border border-border-dark"
                  : "bg-card-light border border-border-light"
              }`}
            >
              {loadingFavorites ? (
                <p className="text-text-secondary-light dark:text-text-secondary-dark text-center">
                  Loading...
                </p>
              ) : favorites.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {favorites.map((fav) => (
                    <div
                      key={fav.id}
                      className="flex items-center justify-between border-b border-border-light dark:border-border-dark pb-2 last:border-0 last:pb-0"
                    >
                      <span className="font-semibold text-lg">{fav.name}</span>
                      <button
                        onClick={() => navigate(`/restaurant/${fav.id}`)}
                        className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-bold hover:bg-primary hover:text-white transition-colors"
                      >
                        View
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => navigate("/favorites")}
                    className="mt-2 text-sm text-primary font-bold hover:underline self-center"
                  >
                    View All Favorites
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <FiHeart className="text-4xl text-text-muted-light dark:text-text-muted-dark opacity-50" />
                  </div>
                  <p className="text-text-secondary-light dark:text-text-secondary-dark">
                    You haven't saved any restaurants yet.
                  </p>
                </div>
              )}
            </motion.div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default QuickPlateDashboard;
