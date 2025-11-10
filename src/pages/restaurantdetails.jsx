import React, { useEffect, useState } from "react";
import {
  MdEdit,
  MdRestaurantMenu,
  MdReceiptLong,
  MdPayments,
} from "react-icons/md";
import { supabase } from "../supabase"; // ✅ Make sure this is correctly initialized
import { useNavigate } from "react-router-dom";

const RestaurantDetails = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        // ✅ Get the logged-in user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError) throw userError;

        if (!user) {
          console.error("❌ No user is signed in");
          setLoading(false);
          return;
        }

        // ✅ Fetch the restaurant belonging to this user
        const { data, error } = await supabase
          .from("restaurants")
          .select(
            `
            id,
            name,
            category,
            address,
            hours,
            phone,
            email,
            description,
            logo_url,
            gallery_urls,
            menu_count,
            order_count,
            total_revenue
          `
          )
          .eq("user_id", user.id)
          .single(); // assuming one restaurant per user

        if (error) throw error;
        setRestaurant(data);
      } catch (err) {
        console.error("❌ Error loading restaurant data:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-lg text-gray-500">
        Loading restaurant details...
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-center text-gray-500">
        <p>No restaurant data found for this account.</p>
        <button
          onClick={() => navigate("/restaurant-setup")}
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
                    #{restaurant.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate("/restaurant-setup")}
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
                  value: restaurant.menu_count || "0",
                },
                {
                  icon: <MdReceiptLong size={24} />,
                  label: "Total Orders",
                  value: restaurant.order_count || "0",
                },
                {
                  icon: <MdPayments size={24} />,
                  label: "Total Revenue",
                  value: `₦${restaurant.total_revenue || "0"}`,
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
                    { label: "Category", value: restaurant.category },
                    { label: "Address", value: restaurant.address },
                    { label: "Hours", value: restaurant.hours || "N/A" },
                    { label: "Phone", value: restaurant.phone || "N/A" },
                    { label: "Email", value: restaurant.email || "N/A" },
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

            {/* Image Gallery */}
            <section>
              <h2 className="mb-4 text-lg font-semibold">Image Gallery</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {(restaurant.gallery_urls?.length
                  ? restaurant.gallery_urls
                  : [
                      "https://via.placeholder.com/300x200?text=Image+1",
                      "https://via.placeholder.com/300x200?text=Image+2",
                      "https://via.placeholder.com/300x200?text=Image+3",
                    ]
                ).map((src, idx) => (
                  <img
                    key={idx}
                    alt={`Restaurant image ${idx + 1}`}
                    className="aspect-square w-full rounded-lg object-cover"
                    src={src}
                  />
                ))}
              </div>
            </section>

            {/* Buttons */}
            <section className="flex flex-wrap items-center justify-end gap-4">
              <button
                onClick={() => navigate("/restaurant-setup")}
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
