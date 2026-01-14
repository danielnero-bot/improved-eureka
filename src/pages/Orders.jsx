import React, { useState, useEffect } from "react";
import {
  MdMenu,
  MdRefresh,
  MdRestaurant,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import Sidebar from "../components/Sidebar";
import { useTheme } from "../context/ThemeContext";

const Orders = () => {
  const { darkMode } = useTheme();
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
          .eq("owner_id", user.id)
          .maybeSingle();

        if (restaurantError) throw restaurantError;

        if (!restaurant) {
          navigate("/restaurantsetup");
          return;
        }

        setRestaurantData(restaurant);

        // Fetch bases orders
        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select("*")
          .eq("restaurant_id", restaurant.id)
          .order("created_at", { ascending: false });

        if (ordersError) throw ordersError;
        if (!ordersData) return setOrders([]);

        // Fetch items for each order sequentially to avoid join errors
        const ordersWithItems = await Promise.all(
          ordersData.map(async (order) => {
            const { data: itemsData } = await supabase
              .from("order_items")
              .select("*")
              .eq("order_id", order.id);

            const itemsWithMenuNames = itemsData ? await Promise.all(
              itemsData.map(async (item) => {
                const { data: menuItem } = await supabase
                  .from("menu_items")
                  .select("name")
                  .eq("id", item.menu_item_id)
                  .single();
                return { ...item, menu_item: menuItem };
              })
            ) : [];

            return { ...order, items: itemsWithMenuNames };
          })
        );

        setOrders(ordersWithItems);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantAndOrders();
  }, [navigate]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;

      // Update local state
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      // Create notification for the user
      const order = orders.find((o) => o.id === orderId);
      if (order && order.user_id) {
        const statusMessages = {
          confirmed: "Your order has been confirmed!",
          preparing: "Your order is being prepared.",
          out_for_delivery: "Your order is out for delivery!",
          delivered: "Your order has been delivered. Enjoy your meal!",
          cancelled: "Your order has been cancelled.",
        };

        await supabase.from("notifications").insert([
          {
            user_id: order.user_id,
            title: "Order Update",
            message: statusMessages[newStatus] || `Your order status is now ${newStatus}.`,
            type: "order_status",
            link: "/userOrders",
          },
        ]);
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status");
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "All") return true;
    return order.status?.toLowerCase() === filter.toLowerCase();
  });

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "confirmed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "preparing":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300";
      case "out_for_delivery":
      case "ready":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "delivered":
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
      <div className="flex h-screen items-center justify-center font-display bg-background-light dark:bg-background-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div
      className={`font-display min-h-screen flex transition-colors duration-300 ${
        darkMode
          ? "bg-background-dark text-gray-200"
          : "bg-background-light text-text-light"
      }`}
    >
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
          className={`sticky top-0 z-20 flex h-16 items-center justify-between border-b px-4 sm:px-6 backdrop-blur-md bg-opacity-80 ${
            darkMode
              ? "bg-card-dark border-border-dark"
              : "bg-card-light border-border-light"
          }`}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className={`lg:hidden rounded-full p-2 transition-colors ${
                darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
              }`}
            >
              <MdMenu className="text-2xl" />
            </button>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight">
              Orders
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
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
        <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 overflow-x-hidden">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mx-auto max-w-7xl"
          >
            {/* Header Section */}
            <div className="mb-6 sm:mb-8 flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">
                  Incoming Orders
                </h2>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">
                  Manage and track your restaurant orders in real-time.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => window.location.reload()}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border transition-colors text-sm ${
                    darkMode
                      ? "bg-card-dark border-border-dark hover:bg-gray-800"
                      : "bg-card-light border-border-light hover:bg-gray-50"
                  }`}
                >
                  <MdRefresh className="text-lg" />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="mb-4 sm:mb-6 overflow-x-auto pb-2 -mx-3 px-3 sm:mx-0 sm:px-0">
              <div className="flex gap-2 min-w-max sm:min-w-0">
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
                    className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                      filter === status
                        ? "bg-primary text-black"
                        : darkMode
                        ? "bg-card-dark border border-border-dark hover:bg-gray-800"
                        : "bg-card-light border border-border-light hover:bg-gray-50"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop Table View */}
            <div
              className={`hidden md:block rounded-xl border overflow-hidden shadow-sm ${
                darkMode
                  ? "border-border-dark bg-card-dark"
                  : "border-border-light bg-card-light"
              }`}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead
                    className={`border-b ${
                      darkMode
                        ? "bg-gray-800/50 border-border-dark"
                        : "bg-gray-50 border-border-light"
                    }`}
                  >
                    <tr>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 font-medium text-text-secondary-light dark:text-text-secondary-dark">
                        Order ID
                      </th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 font-medium text-text-secondary-light dark:text-text-secondary-dark">
                        Customer
                      </th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 font-medium text-text-secondary-light dark:text-text-secondary-dark">
                        Items
                      </th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 font-medium text-text-secondary-light dark:text-text-secondary-dark">
                        Total
                      </th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 font-medium text-text-secondary-light dark:text-text-secondary-dark">
                        Status
                      </th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 font-medium text-text-secondary-light dark:text-text-secondary-dark">
                        Date
                      </th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 font-medium text-text-secondary-light dark:text-text-secondary-dark">
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
                          <td className="px-4 lg:px-6 py-3 lg:py-4 font-medium">
                            #{order.id.slice(0, 8)}
                          </td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4">
                            {order.customer_name || "Guest"}
                          </td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4 max-w-xs truncate">
                            {order.items
                              ? Array.isArray(order.items)
                                ? `${order.items.length} items`
                                : "View details"
                              : "No items"}
                          </td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4 font-medium">
                            {formatCurrency(order.total_amount)}
                          </td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {order.status || "Pending"}
                            </span>
                          </td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4 text-text-secondary-light dark:text-text-secondary-dark text-xs lg:text-sm">
                            {formatDate(order.created_at)}
                          </td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4">
                            <div className="flex flex-wrap gap-2">
                              {order.status === "pending" && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, "confirmed")}
                                  className="px-3 py-1 bg-blue-500 text-white rounded text-xs font-medium hover:bg-blue-600 transition-colors"
                                >
                                  Confirm
                                </button>
                              )}
                              {order.status === "confirmed" && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, "preparing")}
                                  className="px-3 py-1 bg-indigo-500 text-white rounded text-xs font-medium hover:bg-indigo-600 transition-colors"
                                >
                                  Prepare
                                </button>
                              )}
                              {order.status === "preparing" && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, "out_for_delivery")}
                                  className="px-3 py-1 bg-purple-500 text-white rounded text-xs font-medium hover:bg-purple-600 transition-colors"
                                >
                                  Deliver
                                </button>
                              )}
                              {order.status === "out_for_delivery" && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, "delivered")}
                                  className="px-3 py-1 bg-green-500 text-white rounded text-xs font-medium hover:bg-green-600 transition-colors"
                                >
                                  Complete
                                </button>
                              )}
                              {order.status !== "cancelled" && order.status !== "delivered" && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, "cancelled")}
                                  className="px-3 py-1 bg-red-500 text-white rounded text-xs font-medium hover:bg-red-600 transition-colors"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
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

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <motion.div
                    key={order.id}
                    variants={itemVariants}
                    className="rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium text-sm">
                          #{order.id.slice(0, 8)}
                        </p>
                        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-0.5">
                          {order.customer_name || "Guest"}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status || "Pending"}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-text-secondary-light dark:text-text-secondary-dark">
                          Items:
                        </span>
                        <span>
                          <div className="flex flex-col gap-1 text-right">
                            {order.items?.map((item, idx) => (
                              <span key={idx} className="block text-xs">
                                {item.quantity}x{" "}
                                {item.menu_item?.name || "Item"}
                              </span>
                            ))}
                          </div>
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary-light dark:text-text-secondary-dark">
                          Total:
                        </span>
                        <span className="font-medium">
                          {formatCurrency(order.total_amount)}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-text-secondary-light dark:text-text-secondary-dark">
                          Date:
                        </span>
                        <span className="text-text-secondary-light dark:text-text-secondary-dark">
                          {formatDate(order.created_at)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex gap-2">
                      {order.status === "pending" && (
                        <button
                          onClick={() =>
                            updateOrderStatus(order.id, "confirmed")
                          }
                          className="flex-1 py-1.5 bg-blue-500 text-white rounded-lg text-xs font-medium hover:bg-blue-600"
                        >
                          Confirm Order
                        </button>
                      )}
                      {order.status === "confirmed" && (
                        <button
                          onClick={() =>
                            updateOrderStatus(order.id, "preparing")
                          }
                          className="flex-1 py-1.5 bg-purple-500 text-white rounded-lg text-xs font-medium hover:bg-purple-600"
                        >
                          Start Preparing
                        </button>
                      )}
                      {order.status === "preparing" && (
                        <button
                          onClick={() =>
                            updateOrderStatus(order.id, "out_for_delivery")
                          }
                          className="flex-1 py-1.5 bg-indigo-500 text-white rounded-lg text-xs font-medium hover:bg-indigo-600"
                        >
                          Out for Delivery
                        </button>
                      )}
                      {order.status === "out_for_delivery" && (
                        <button
                          onClick={() =>
                            updateOrderStatus(order.id, "delivered")
                          }
                          className="flex-1 py-1.5 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600"
                        >
                          Mark Completed
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-12 text-center">
                  <MdRestaurant className="text-4xl mb-3 opacity-20 mx-auto" />
                  <p className="text-text-secondary-light dark:text-text-secondary-dark">
                    No orders found matching this filter.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Orders;
