import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import {
  MdOutlineDeliveryDining,
  MdOutlineLocationOn,
  MdOutlineSchedule,
  MdOutlineCall,
  MdStorefront,
} from "react-icons/md";
import { IoStar, IoStarHalfOutline } from "react-icons/io5";
import { supabase } from "../supabase";
import UserSidebar from "../components/UserSidebar";
import Cart from "../components/Cart";
import { useCart } from "../context/CartContext";

const RestaurantPublicView = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart, getCartItemsCount, setIsCartOpen } = useCart();

  const [restaurant, setRestaurant] = useState(
    location.state?.restaurant || null
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(!restaurant);
  const [menuItems, setMenuItems] = useState([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [user, setUser] = useState(null);

  const details = [
    {
      icon: (
        <MdOutlineLocationOn className="text-gray-500 dark:text-gray-400 mt-1" />
      ),
      title: "Address",
      description:
        restaurant?.location || restaurant?.address || "Not specified",
    },
    {
      icon: <MdOutlineCall className="text-gray-500 dark:text-gray-400 mt-1" />,
      title: "Phone",
      description:
        restaurant?.phone || restaurant?.contact_phone || "Not specified",
    },
    {
      icon: (
        <MdOutlineSchedule className="text-gray-500 dark:text-gray-400 mt-1" />
      ),
      title: "Opening Hours",
      description: restaurant?.opening_hours || "Mon-Sun: 11:00 AM - 10:00 PM",
    },
    {
      icon: (
        <MdOutlineDeliveryDining className="text-gray-500 dark:text-gray-400 mt-1" />
      ),
      title: "Delivery",
      description:
        restaurant?.delivery_info || "Est. 30-45 min • Delivery available",
    },
  ];

  useEffect(() => {
    const load = async () => {
      if (restaurant) return;
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("restaurants")
          .select("*")
          .eq("id", id)
          .single();
        if (error) throw error;

        // attempt to load logo from storage
        try {
          const { data: list } = await supabase.storage
            .from("restaurant-logos")
            .list(data.id, { limit: 1 });

          if (list && list.length > 0) {
            const { data: urlData } = supabase.storage
              .from("restaurant-logos")
              .getPublicUrl(`${data.id}/${list[0].name}`);
            data.logo_url = urlData?.publicUrl || data.logo_url;
          }
        } catch {
          // ignore storage errors
        }

        setRestaurant(data);
      } catch (err) {
        console.error("Error loading restaurant:", err);
        setRestaurant(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, restaurant]);

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
    if (!restaurant?.id) return;

    const fetchMenuItems = async () => {
      try {
        setMenuLoading(true);
        const { data, error } = await supabase
          .from("menu_items")
          .select("*")
          .eq("restaurant_id", restaurant.id)
          .order("created_at", { ascending: true });

        if (error) throw error;
        setMenuItems(data || []);
      } catch (err) {
        console.error("Error fetching menu items:", err);
        setMenuItems([]);
      } finally {
        setMenuLoading(false);
      }
    };

    fetchMenuItems();
  }, [restaurant?.id]);

  const renderStars = () => {
    const rating = restaurant?.rating || 4.5;
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<IoStar key={i} className="text-primary" />);
    }
    if (hasHalfStar) {
      stars.push(<IoStarHalfOutline key="half" className="text-primary" />);
    }
    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <IoStar
          key={`empty-${i}`}
          className="text-gray-300 dark:text-gray-600"
        />
      );
    }

    return stars;
  };

  const handleAddToCart = (item) => {
    if (!user) {
      // Redirect to login if not authenticated
      navigate("/login");
      return;
    }
    addToCart(item, restaurant);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading restaurant...</div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
        <p className="text-lg">Restaurant not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-white"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-row bg-gray-50 dark:bg-gray-900">
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
      <main className="flex-1 p-6 md:p-10 overflow-y-auto lg:ml-16">
        <div className="max-w-7xl mx-auto">
          {/* HeaderImage - Prioritize logo_url over cover_image_url */}
          {restaurant.logo_url || restaurant.cover_image_url ? (
            <div
              className="w-full h-60 md:h-72 rounded-xl bg-cover bg-center mb-6"
              style={{
                backgroundImage: `url('${
                  restaurant.logo_url || restaurant.cover_image_url
                }')`,
              }}
            ></div>
          ) : (
            <div className="w-full h-60 md:h-72 rounded-xl bg-gradient-to-r from-primary/20 to-blue-500/20 mb-6 flex items-center justify-center">
              <MdStorefront className="text-6xl text-gray-400" />
            </div>
          )}

          {/* PageHeading */}
          <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-gray-900 dark:text-white text-4xl font-bold leading-tight">
                {restaurant.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-base font-normal leading-normal">
                {restaurant.cuisine || "Restaurant"}
              </p>

              {/* RatingSummary (inline) */}
              <div className="flex items-center gap-2 mt-1">
                <div className="flex gap-0.5">{renderStars()}</div>
                <p className="text-gray-800 dark:text-gray-200 text-sm font-medium">
                  {restaurant.rating || 4.5}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-normal">
                  ({restaurant.review_count || 0} reviews)
                </p>
              </div>
            </div>

            <button className="flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
              <FiHeart />
              <span className="truncate">Favorite</span>
            </button>
          </div>

          {/* Restaurant Info Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: About & Details */}
            <div className="flex flex-col gap-8">
              <div className="p-6 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm">
                <h2 className="text-gray-900 dark:text-white text-xl font-bold mb-4">
                  About {restaurant.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {restaurant.description ||
                    restaurant.about ||
                    "No description provided."}
                </p>
              </div>

              <div className="p-6 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm">
                <h2 className="text-gray-900 dark:text-white text-xl font-bold mb-4">
                  Details
                </h2>
                <ul className="space-y-4">
                  {details.map((detail, index) => (
                    <li key={index} className="flex items-start gap-4">
                      {detail.icon}
                      <div className="flex flex-col">
                        <span className="text-gray-800 dark:text-gray-200 text-sm font-medium">
                          {detail.title}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400 text-sm">
                          {detail.description}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column: Menu Items */}
            <div className="p-6 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm lg:col-span-2">
              <h2 className="text-gray-900 dark:text-white text-xl font-bold mb-6">
                Menu
              </h2>
              {menuLoading ? (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Loading menu...
                </p>
              ) : menuItems.length === 0 ? (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  No menu items available.
                </p>
              ) : (
                <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {menuItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/10 hover:shadow-lg transition-shadow overflow-hidden"
                    >
                      {item.image_url ? (
                        <div
                          className="w-full h-40 bg-cover bg-center"
                          style={{
                            backgroundImage: `url('${item.image_url}')`,
                          }}
                        ></div>
                      ) : (
                        <div className="w-full h-40 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          <MdStorefront className="text-4xl text-gray-400 dark:text-gray-600" />
                        </div>
                      )}
                      <div className="p-4 flex flex-col grow">
                        <h3 className="text-gray-800 dark:text-gray-200 font-bold">
                          {item.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mt-2">
                          {item.description || "No description"}
                        </p>
                        <div className="mt-auto pt-4 flex items-center justify-between">
                          <p className="text-gray-800 dark:text-gray-200 font-semibold">
                            {item.price
                              ? `$${Number(item.price).toFixed(2)}`
                              : "—"}
                          </p>
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="bg-primary/10 text-primary text-sm font-bold py-1 px-3 rounded-full hover:bg-primary/20 transition-colors"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Floating Cart Button */}
        {getCartItemsCount() > 0 && (
          <button
            onClick={() => setIsCartOpen(true)}
            className="fixed bottom-6 right-6 bg-primary text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3 font-bold hover:bg-orange-600 transition-all hover:scale-105 z-30"
          >
            <FiShoppingCart className="text-xl" />
            <span>View Cart ({getCartItemsCount()})</span>
            <span className="bg-white text-primary rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
              {getCartItemsCount()}
            </span>
          </button>
        )}
      </main>

      {/* Cart Sidebar */}
      <Cart />
    </div>
  );
};

export default RestaurantPublicView;
