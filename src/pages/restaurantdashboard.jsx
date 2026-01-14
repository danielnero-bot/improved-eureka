import React, { useState, useEffect } from "react";
import {
  MdPayments,
  MdReceiptLong,
  MdPersonAdd,
  MdMenu,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import Sidebar from "../components/Sidebar";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

const RestaurantDashboard = () => {
  const { darkMode } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [restaurantData, setRestaurantData] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({
    todayRevenue: 0,
    todayOrders: 0,
    newCustomers: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // Format currency function
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  useEffect(() => {
    const fetchRestaurantData = async (user) => {
      try {
        // Fetch restaurant data
        const { data, error } = await supabase
          .from("restaurants")
          .select("*")
          .eq("owner_id", user.id)
          .maybeSingle(); // Use maybeSingle to avoid error if no row exists

        if (error) {
          console.error("❌ Error fetching restaurant:", error);
        } else if (!data) {
          // No restaurant found, redirect to setup
          console.log("⚠️ No restaurant found, redirecting to setup...");
          navigate("/restaurantsetup");
        } else {
          setRestaurantData(data);
          // Fetch dashboard stats if restaurant data is available
          await Promise.all([
            fetchDashboardStats(data.id),
            fetchRecentOrders(data.id),
            fetchRecentReviews(data.id),
          ]);
        }
      } catch (error) {
        console.error("❌ Error in fetchRestaurantData:", error);
      } finally {
        setLoading(false);
      }
    };

    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        fetchRestaurantData(session.user);
      } else {
        navigate("/login");
      }
    };

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Fetch dashboard statistics
  const fetchDashboardStats = async (restaurantId) => {
    try {
      // Today's revenue
      const { data: revenueData, error: revenueError } = await supabase
        .from("orders")
        .select("total_amount")
        .eq("restaurant_id", restaurantId)
        .gte("created_at", new Date().toISOString().split("T")[0])
        .eq("status", "completed");

      if (!revenueError && revenueData) {
        const totalRevenue = revenueData.reduce(
          (sum, order) => sum + parseFloat(order.total_amount || 0),
          0
        );
        setDashboardStats((prev) => ({ ...prev, todayRevenue: totalRevenue }));
      }

      // Today's orders
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("id")
        .eq("restaurant_id", restaurantId)
        .gte("created_at", new Date().toISOString().split("T")[0]);

      if (!ordersError && ordersData) {
        setDashboardStats((prev) => ({
          ...prev,
          todayOrders: ordersData.length,
        }));
      }

      setDashboardStats((prev) => ({
        ...prev,
        newCustomers: 0, // Set to 0 since 'customers' table does not exist
      }));
    } catch (error) {
      console.error("❌ Error fetching dashboard stats:", error);
    }
  };

  const fetchRecentOrders = async (restaurantId) => {
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .order("created_at", { ascending: false })
        .limit(10);

      if (ordersError) throw ordersError;
      if (!ordersData) return setRecentOrders([]);

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

      setRecentOrders(ordersWithItems);
    } catch (err) {
      console.error("Error fetching recent orders:", err);
    }
  };

  const fetchRecentReviews = async (restaurantId) => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;

      // Manually fetch user details for each review to avoid join error
      const reviewsWithUsers = await Promise.all(
        data.map(async (review) => {
          const { data: userData } = await supabase
            .from("user_details")
            .select("full_name, avatar_url")
            .eq("user_id", review.user_id)
            .single();
          return { ...review, user: userData };
        })
      );

      setRecentReviews(reviewsWithUsers);
    } catch (err) {
      console.error("Error fetching recent reviews:", err);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;

      // Update local state
      setRecentOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
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
      <div
        className={`font-display min-h-screen flex items-center justify-center transition-colors duration-300 ${
          darkMode
            ? "bg-background-dark text-text-dark"
            : "bg-background-light text-text-light"
        }`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading restaurant details...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`font-display min-h-screen flex transition-colors duration-300 ${
        darkMode
          ? "bg-background-dark text-text-dark"
          : "bg-background-light text-text-light"
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
            <div className="hidden lg:inline">Dashboard</div>
          </div>

          <div className="flex items-center gap-4">
            {/* Restaurant Info */}
            {restaurantData && (
              <div className="flex items-center gap-3">
                {restaurantData.logo_url && (
                  <img
                    src={restaurantData.logo_url}
                    alt={`${restaurantData.name} logo`}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <div className="flex flex-col items-end">
                  <span className="text-lg font-bold">{restaurantData.name}</span>
                  <div className="flex items-center gap-1 text-sm">
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < Math.floor(restaurantData.rating || 0) ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="font-bold text-primary">{restaurantData.rating?.toFixed(1) || "0.0"}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.header>

        {/* Main Section */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="mx-auto max-w-7xl space-y-8"
          >
            <motion.div variants={itemVariants}>
              <h1 className="text-3xl font-bold">Dashboard Overview</h1>
              <p
                className={
                  darkMode ? "text-text-muted-dark" : "text-text-muted-light"
                }
              >
                {restaurantData
                  ? `Welcome back to ${restaurantData.name}! Here's an overview of your restaurant's performance.`
                  : "Welcome back! Here's an overview of your restaurant's performance."}
              </p>
            </motion.div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "Today's Revenue",
                  value: formatCurrency(dashboardStats.todayRevenue),
                  icon: <MdPayments />,
                },
                {
                  title: "Today's Orders",
                  value: dashboardStats.todayOrders.toString(),
                  icon: <MdReceiptLong />,
                },
                {
                  title: "New Customers",
                  value: dashboardStats.newCustomers.toString(),
                  icon: <MdPersonAdd />,
                },
                {
                  title: "Rating",
                  value: `${restaurantData.rating?.toFixed(1) || "0.0"} / 5`,
                  icon: (
                    <div className="text-yellow-500 fill-current">
                      <svg className="w-6 h-6" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  ),
                },
              ].map(({ title, value, icon }) => (
                <motion.div
                  key={title}
                  variants={itemVariants}
                  className={`rounded-2xl border p-6 shadow-md ${
                    darkMode
                      ? "bg-card-dark border-border-dark"
                      : "bg-card-light border-border-light"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          darkMode
                            ? "text-text-muted-dark"
                            : "text-text-muted-light"
                        }`}
                      >
                        {title}
                      </p>
                      <p className="text-3xl font-bold">{value}</p>
                    </div>
                    <div className="rounded-full bg-primary/10 p-2 text-primary text-xl">
                      {icon}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Recent Incoming Orders */}
            <motion.div
              variants={itemVariants}
              className={`rounded-2xl border p-6 shadow-md ${
                darkMode
                  ? "bg-card-dark border-border-dark"
                  : "bg-card-light border-border-light"
              }`}
            >
              <h2 className="text-2xl font-bold mb-6">
                Recent Incoming Orders
              </h2>
              {recentOrders.length === 0 ? (
                <div className="text-center py-10 opacity-60">
                  No orders found.
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className={`p-4 rounded-xl border transition-colors ${
                        darkMode
                          ? "bg-white/5 border-white/10"
                          : "bg-gray-50 border-gray-100"
                      }`}
                    >
                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                        <div>
                          <p className="font-bold text-lg">
                            Order #{order.id.slice(0, 8)}
                          </p>
                          <p
                            className={`text-sm ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {new Date(order.created_at).toLocaleString()}
                          </p>
                          <div className="mt-2 text-sm">
                            <span className="font-medium mr-2">Status:</span>
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold uppercase ${
                                order.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : order.status === "confirmed"
                                  ? "bg-blue-100 text-blue-800"
                                  : order.status === "preparing"
                                  ? "bg-purple-100 text-purple-800"
                                  : order.status === "out_for_delivery"
                                  ? "bg-indigo-100 text-indigo-800"
                                  : order.status === "delivered"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>
                        </div>

                        {/* Order Items Summary */}
                        <div className="flex-1 md:mx-6">
                          <div className="space-y-1">
                            {order.items?.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex justify-between text-sm"
                              >
                                <span>
                                  {item.quantity}x{" "}
                                  {item.menu_item?.name || "Item"}
                                </span>
                                <span>${Number(item.price).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-2 text-right font-bold text-primary border-t pt-1 border-gray-200 dark:border-gray-700">
                            Total: ${Number(order.total_amount).toFixed(2)}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2">
                          {order.status === "pending" && (
                            <button
                              onClick={() =>
                                updateOrderStatus(order.id, "confirmed")
                              }
                              className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600"
                            >
                              Confirm
                            </button>
                          )}
                          {order.status === "confirmed" && (
                            <button
                              onClick={() =>
                                updateOrderStatus(order.id, "preparing")
                              }
                              className="px-3 py-1 bg-purple-500 text-white rounded-lg text-sm font-medium hover:bg-purple-600"
                            >
                              Start Preparing
                            </button>
                          )}
                          {order.status === "preparing" && (
                            <button
                              onClick={() =>
                                updateOrderStatus(order.id, "out_for_delivery")
                              }
                              className="px-3 py-1 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600"
                            >
                              Out for Delivery
                            </button>
                          )}
                          {order.status === "out_for_delivery" && (
                            <button
                              onClick={() =>
                                updateOrderStatus(order.id, "delivered")
                              }
                              className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600"
                            >
                              Complete
                            </button>
                          )}
                        </div>
                      </div>
                      {order.special_instructions && (
                        <div className="mt-3 text-sm italic text-orange-500 bg-orange-50 dark:bg-orange-900/10 p-2 rounded">
                          Note: {order.special_instructions}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Recent Reviews */}
            <motion.div
              variants={itemVariants}
              className={`rounded-2xl border p-6 shadow-md ${
                darkMode
                  ? "bg-card-dark border-border-dark"
                  : "bg-card-light border-border-light"
              }`}
            >
              <h2 className="text-2xl font-bold mb-6">Recent Customer Feedback</h2>
              {recentReviews.length === 0 ? (
                <div className="text-center py-10 opacity-60">No reviews yet.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recentReviews.map((review) => (
                    <div
                      key={review.id}
                      className={`p-4 rounded-xl border transition-colors ${
                        darkMode
                          ? "bg-white/5 border-white/10"
                          : "bg-gray-50 border-gray-100"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        {review.user?.avatar_url ? (
                          <img
                            src={review.user.avatar_url}
                            className="w-10 h-10 rounded-full object-cover"
                            alt=""
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                            {(review.user?.full_name || "G")[0]}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-sm">
                            {review.user?.full_name || "Guest"}
                          </p>
                          <div className="flex text-yellow-500">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-3 h-3 ${
                                  i < review.rating ? "fill-current" : "text-gray-300"
                                }`}
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <span className="ml-auto text-xs opacity-50">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm italic opacity-80 line-clamp-2">
                        "{review.comment || "No comment provided."}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default RestaurantDashboard;
