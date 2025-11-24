import React, { useState, useEffect } from "react";
import {
  MdMenu,
  MdLightMode,
  MdDarkMode,
  MdRefresh,
  MdRestaurant,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import Sidebar from "../components/Sidebar";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";

const Orders = () => {
  const { darkMode, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [restaurantData, setRestaurantData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  useEffect(() => {
    const fetchRestaurantAndOrders = async () => {
      try {
        setLoading(true);
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          navigate("/login");
          return;
        }

        // Fetch restaurant data
        const { data: restaurant, error: restaurantError } = await supabase
          .from("restaurants")
          .select("*")
          .eq("owner_uid", user.id)
          .maybeSingle();

        if (restaurantError) throw restaurantError;

        if (!restaurant) {
          navigate("/restaurantsetup");
          return;
        }

        setRestaurantData(restaurant);

        // Fetch orders
        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select("*")
          .eq("restaurant_id", restaurant.id)
          .order("created_at", { ascending: false });

        if (ordersError) throw ordersError;

        setOrders(ordersData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantAndOrders();
  }, [navigate]);

  const filteredOrders = orders.filter((order) => {
    if (filter === "All") return true;
    return order.status?.toLowerCase() === filter.toLowerCase();
  });

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "preparing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "ready":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

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
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center font-display">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-text-light dark:text-text-dark min-h-screen flex transition-colors duration-300">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        restaurantData={restaurantData}
        onLogout={async () => {
          await supabase.auth.signOut();
          navigate("/login");
        }}
      />

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

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
          className="sticky top-0 z-20 flex h-16 items-center justify-between border-b px-4 sm:px-6 backdrop-blur-md bg-opacity-80 bg-card-light dark:bg-card-dark border-border-light dark:border-border-dark"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="lg:hidden rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <MdMenu className="text-2xl" />
            </button>
            <h1 className="text-xl font-bold tracking-tight">
              Orders Management
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {darkMode ? (
                <MdLightMode className="text-xl" />
              ) : (
                <MdDarkMode className="text-xl" />
              )}
            </button>
            {restaurantData && (
              <div className="hidden sm:flex items-center gap-3">
                <span className="text-sm font-medium">
                  {restaurantData.name}
                </span>
                {restaurantData.logo_url && (
                  <img
                    src={restaurantData.logo_url}
                    alt="Logo"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
              </div>
            )}
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mx-auto max-w-7xl"
          >
            {/* Stats / Filter Header */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold">Incoming Orders</h2>
                <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1">
                  Manage and track your restaurant orders in real-time.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <MdRefresh className="text-lg" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="mb-6 overflow-x-auto pb-2">
              <div className="flex gap-2">
                {[
                  "All",
                  "Pending",
                  "Preparing",
                  "Ready",
                  "Completed",
                  "Cancelled",
                ].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      filter === status
                        ? "bg-primary text-black"
                        : "bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            <div className="rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-border-light dark:border-border-dark">
                    <tr>
                      <th className="px-6 py-4 font-medium text-text-secondary-light dark:text-text-secondary-dark">
                        Order ID
                      </th>
                      <th className="px-6 py-4 font-medium text-text-secondary-light dark:text-text-secondary-dark">
                        Customer
                      </th>
                      <th className="px-6 py-4 font-medium text-text-secondary-light dark:text-text-secondary-dark">
                        Items
                      </th>
                      <th className="px-6 py-4 font-medium text-text-secondary-light dark:text-text-secondary-dark">
                        Total
                      </th>
                      <th className="px-6 py-4 font-medium text-text-secondary-light dark:text-text-secondary-dark">
                        Status
                      </th>
                      <th className="px-6 py-4 font-medium text-text-secondary-light dark:text-text-secondary-dark">
                        Date
                      </th>
                      <th className="px-6 py-4 font-medium text-text-secondary-light dark:text-text-secondary-dark">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-light dark:divide-border-dark">
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((order) => (
                        <motion.tr
                          key={order.id}
                          variants={itemVariants}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                          <td className="px-6 py-4 font-medium">
                            #{order.id.slice(0, 8)}
                          </td>
                          <td className="px-6 py-4">
                            {order.customer_name || "Guest"}
                          </td>
                          <td className="px-6 py-4 max-w-xs truncate">
                            {/* Assuming items is stored as JSON or we just show count */}
                            {order.items
                              ? Array.isArray(order.items)
                                ? `${order.items.length} items`
                                : "View details"
                              : "No items"}
                          </td>
                          <td className="px-6 py-4 font-medium">
                            {formatCurrency(order.total_amount)}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {order.status || "Pending"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-text-secondary-light dark:text-text-secondary-dark">
                            {formatDate(order.created_at)}
                          </td>
                          <td className="px-6 py-4">
                            <button className="text-primary hover:text-primary-dark font-medium text-sm">
                              View Details
                            </button>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="7"
                          className="px-6 py-12 text-center text-text-secondary-light dark:text-text-secondary-dark"
                        >
                          <div className="flex flex-col items-center justify-center">
                            <MdRestaurant className="text-4xl mb-3 opacity-20" />
                            <p>No orders found matching this filter.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Orders;
