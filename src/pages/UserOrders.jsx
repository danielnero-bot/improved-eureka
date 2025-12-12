import React, { useState, useEffect } from "react";
import UserSidebar from "../components/UserSidebar";
import { FiSearch, FiChevronDown, FiMenu } from "react-icons/fi";
import { MdShoppingBasket } from "react-icons/md";
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

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, delay: 0.2 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay: 0.4 },
  },
};

const UserOrdersPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          fetchOrders(user.id);
        } else {
          setLoading(false);
        }
      } catch {
        setLoading(false);
      }
    };
    getUser();
  }, []);

  const fetchOrders = async (userId) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          *,
          restaurant:restaurants(name, logo_url),
          items:order_items(
             *,
             menu_item:menu_items(name)
          )
        `
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

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
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
              className="flex flex-wrap justify-between gap-4 items-center mb-6"
            >
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
            </motion.div>

            {/* Search and Filter Section */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeIn}
              className="flex flex-col md:flex-row gap-4 mb-6"
            >
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
            </motion.div>

            {/* Orders List */}
            <div className="grid grid-cols-1 gap-6">
              {loading ? (
                <div className="text-center py-10">Loading orders...</div>
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <motion.div
                    key={order.id}
                    variants={scaleIn}
                    initial="hidden"
                    whileInView="visible"
                    className={`p-6 rounded-xl border transition-colors duration-300 ${
                      darkMode
                        ? "bg-card-dark border-gray-700"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        {order.restaurant?.logo_url ? (
                          <img
                            src={order.restaurant.logo_url}
                            alt={order.restaurant.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <MdShoppingBasket className="text-xl" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                            {order.restaurant?.name || "Unknown Restaurant"}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(order.created_at).toLocaleDateString()} at{" "}
                            {new Date(order.created_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-bold capitalize ${
                            order.status === "delivered"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : order.status === "cancelled"
                              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                              : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          }`}
                        >
                          {order.status}
                        </span>
                        <p className="mt-2 font-bold text-primary">
                          ${Number(order.total_amount).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`mt-4 pt-4 border-t ${
                        darkMode ? "border-gray-700" : "border-gray-100"
                      }`}
                    >
                      <p className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Items:
                      </p>
                      <ul className="space-y-1">
                        {order.items?.map((item, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-gray-600 dark:text-gray-400 flex justify-between"
                          >
                            <span>
                              {item.quantity}x{" "}
                              {item.menu_item?.name || "Unknown Item"}
                            </span>
                            <span>${Number(item.price).toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={scaleIn}
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
                </motion.div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserOrdersPage;
