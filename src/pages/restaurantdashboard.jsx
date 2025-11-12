import React, { useState, useEffect } from "react";
import {
  MdLightMode,
  MdDarkMode,
  MdMenu,
  MdPayments,
  MdReceiptLong,
  MdPersonAdd,
  MdAnalytics,
} from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import Sidebar from "../components/Sidebar"; 

const RestaurantDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [restaurantData, setRestaurantData] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({
    todayRevenue: 0,
    todayOrders: 0,
    newCustomers: 0,
  });
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth();

  const toggleTheme = () => setDarkMode((prev) => !prev);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // Format currency function
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        // Fetch restaurant data
        const { data, error } = await supabase
          .from("restaurants")
          .select("*")
          .eq("firebase_uid", user.uid)
          .single();

        if (error) {
          console.error("❌ Error fetching restaurant:", error);
        } else {
          setRestaurantData(data);
          // Fetch dashboard stats if restaurant data is available
          if (data) {
            await fetchDashboardStats(data.id);
          }
        }
      } catch (error) {
        console.error("❌ Error in fetchRestaurantData:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

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

      // New customers (last 24 hours)
      const { data: customersData, error: customersError } = await supabase
        .from("customers")
        .select("id")
        .eq("restaurant_id", restaurantId)
        .gte(
          "created_at",
          new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        );

      if (!customersError && customersData) {
        setDashboardStats((prev) => ({
          ...prev,
          newCustomers: customersData.length,
        }));
      }
    } catch (error) {
      console.error("❌ Error fetching dashboard stats:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  if (loading) {
    return (
      <div
        className={`font-display min-h-screen flex items-center justify-center transition-colors duration-300 ${
          darkMode
            ? "bg-background-light text-black"
            : "bg-background-dark text-white"
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
          ? "bg-background-light text-black"
          : "bg-background-dark text-white"
      }`}
    >
      {/* Reusable Sidebar Component */}
      <Sidebar
        darkMode={darkMode}
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
        <header
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
                <span className="text-lg font-bold">{restaurantData.name}</span>
              </div>
            )}
          </div>
        </header>

        {/* Main Section */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300">
          <div className="mx-auto max-w-7xl space-y-8">
            <div>
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
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
              ].map(({ title, value, icon }) => (
                <div
                  key={title}
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
                </div>
              ))}
            </div>

            {/* Analytics Placeholder */}
            <div
              className={`rounded-2xl border p-6 text-center shadow-md ${
                darkMode
                  ? "bg-card-dark border-border-dark"
                  : "bg-card-light border-border-light"
              }`}
            >
              <div className="flex flex-col items-center justify-center space-y-4 py-16">
                <MdAnalytics className="text-6xl text-primary/70" />
                <h2 className="text-2xl font-bold">Order Analytics</h2>
                <p
                  className={
                    darkMode
                      ? "text-text-muted-dark max-w-md"
                      : "text-text-muted-light max-w-md"
                  }
                >
                  Detailed charts and reports for your order history will be
                  displayed here soon.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RestaurantDashboard;
