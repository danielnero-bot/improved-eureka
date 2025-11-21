import React, { useEffect, useState } from "react";
import {
  MdEdit,
  MdRestaurantMenu,
  MdReceiptLong,
  MdPayments,
} from "react-icons/md";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

const RestaurantDetails = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [stats, setStats] = useState({
    menuCount: 0,
    orderCount: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Get current user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError) throw userError;

        if (!user) {
          navigate("/login");
          return;
        }

        // 2. Fetch restaurant details
        const { data: restaurantData, error: restaurantError } = await supabase
          .from("restaurants")
          .select("*")
          .eq("owner_uid", user.id)
          .single();

        if (restaurantError) {
          if (restaurantError.code === "PGRST116") {
            // No restaurant found
            setRestaurant(null);
          } else {
            throw restaurantError;
          }
        } else {
          setRestaurant(restaurantData);

          // 3. Fetch Stats (Parallel)
          const [menuRes, ordersRes] = await Promise.all([
            // Menu Items Count
            supabase
              .from("menu_items")
              .select("id", { count: "exact", head: true })
              .eq("restaurant_id", restaurantData.id),

            // Orders (Count & Revenue)
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

    fetchData();
  }, [navigate]);

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
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-[#111714] dark:text-gray-200">
      <div className="layout-container flex h-full grow flex-col">
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
            {/* Header */}
            <header className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <img
                  alt="Restaurant Logo"
                  className="h-16 w-16 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                  src={
                    restaurant.logo_url ||
                    "https://via.placeholder.com/100?text=Logo"
                  }
                />
                <div>
                  <h1 className="text-3xl font-bold">{restaurant.name}</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    #{restaurant.id.slice(0, 8)}...
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate("/restaurantsetup")}
                className="flex items-center gap-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <MdEdit size={18} />
                Edit Details
              </button>
            </header>

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
                <div
                  key={stat.label}
                  className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-background-dark p-5"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 text-primary">
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold text-[#111714] dark:text-gray-100">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* Restaurant Info */}
            <section className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-background-dark p-6 md:col-span-2">
                <h2 className="mb-4 border-b border-gray-200 dark:border-gray-700 pb-3 text-lg font-semibold">
                  Restaurant Information
                </h2>
                <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-2">
                  {[
                    { label: "Name", value: restaurant.name },
                    { label: "Address", value: restaurant.address },
                    {
                      label: "Opening Hours",
                      value: restaurant.opening_hours || "N/A",
                    },
                    {
                      label: "Closing Hours",
                      value: restaurant.closing_hours || "N/A",
                    },
                    { label: "Phone", value: restaurant.phone_number || "N/A" },
                    {
                      label: "Email",
                      value: restaurant.contact_email || "N/A",
                    },
                  ].map((info) => (
                    <div key={info.label}>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {info.label}
                      </h3>
                      <p className="mt-1 text-base text-[#111714] dark:text-gray-200">
                        {info.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-background-dark p-6">
                <h2 className="mb-4 border-b border-gray-200 dark:border-gray-700 pb-3 text-lg font-semibold">
                  Description / Bio
                </h2>
                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                  {restaurant.description ||
                    "No description provided yet. Add details about your restaurant, menu style, or story."}
                </p>
              </div>
            </section>

            {/* Buttons */}
            <section className="flex flex-wrap items-center justify-end gap-4">
              <button
                onClick={() => navigate("/restaurantsetup")}
                className="flex items-center justify-center gap-2 h-11 px-5 rounded-lg bg-white dark:bg-gray-800 text-[#111714] dark:text-gray-200 border border-gray-200 dark:border-gray-700 text-sm font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <MdEdit size={18} />
                Edit Restaurant Info
              </button>
              <button
                onClick={() => navigate("/add-menu-item")}
                className="flex items-center justify-center gap-2 h-11 px-5 rounded-lg bg-primary text-black text-sm font-bold hover:scale-105 transition"
              >
                <MdRestaurantMenu size={18} />
                Add Menu Item
              </button>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RestaurantDetails;
