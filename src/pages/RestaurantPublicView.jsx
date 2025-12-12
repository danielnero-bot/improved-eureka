import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { FiHeart, FiShoppingCart, FiMenu } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import {
  MdOutlineDeliveryDining,
  MdOutlineLocationOn,
  MdOutlineSchedule,
  MdOutlineCall,
  MdStorefront,
} from "react-icons/md";
import { IoStar, IoStarHalfOutline } from "react-icons/io5";
import { AiOutlineClose } from "react-icons/ai";
import { BsStarFill, BsStar } from "react-icons/bs";
import { supabase } from "../supabase";
import UserSidebar from "../components/UserSidebar";
import Cart from "../components/Cart";
import RatingModal from "../components/RatingModal";
import { useCart } from "../context/CartContext";
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
    transition: { duration: 0.5 },
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
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const RestaurantPublicView = () => {
  // Constants
  const DEFAULT_RATING = 4.5;
  const DEFAULT_REVIEW_COUNT = 0;
  const DEFAULT_OPENING_HOURS = "Mon-Sun: 11:00 AM - 10:00 PM";
  const DEFAULT_DELIVERY_INFO = "Est. 30-45 min • Delivery available";
  const DEFAULT_FALLBACK_TEXT = "Not specified";
  const DEFAULT_DESCRIPTION = "No description provided.";
  const DEFAULT_ITEM_DESCRIPTION = "No description";
  const TOTAL_STARS = 5;
  const HALF_STAR_THRESHOLD = 0.5;
  const STORAGE_BUCKET_NAME = "restaurant-logos";
  const STORAGE_FILE_LIMIT = 1;

  // CSS Classes
  // CSS Classes - USING GLOBAL THEME VARIABLES
  const ICON_CLASSES =
    "text-text-secondary-light dark:text-text-secondary-dark mt-1";
  const CARD_CLASSES =
    "p-6 rounded-lg bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark shadow-sm";
  const BUTTON_PRIMARY_CLASSES =
    "bg-primary text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3 font-bold hover:bg-green-600 transition-all hover:scale-105";
  const BUTTON_SECONDARY_CLASSES =
    "flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-medium text-text-light dark:text-text-dark border-border-light dark:border-border-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors";
  const HEADING_PRIMARY_CLASSES =
    "text-text-light dark:text-text-dark text-4xl font-bold leading-tight";
  const HEADING_SECONDARY_CLASSES =
    "text-text-light dark:text-text-dark text-xl font-bold";
  const TEXT_MUTED_CLASSES =
    "text-text-secondary-light dark:text-text-secondary-dark";
  const MENU_ITEM_CARD_CLASSES =
    "flex flex-col rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark hover:shadow-lg transition-shadow overflow-hidden";

  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart, getCartItemsCount, setIsCartOpen } = useCart();
  const { darkMode } = useTheme();

  const [restaurant, setRestaurant] = useState(
    location.state?.restaurant || null
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(!restaurant);
  const [menuItems, setMenuItems] = useState([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [userReview, setUserReview] = useState(null);
  const [isRatingOpen, setIsRatingOpen] = useState(false);

  const details = [
    {
      icon: <MdOutlineLocationOn className={ICON_CLASSES} />,
      title: "Address",
      description:
        restaurant?.location || restaurant?.address || DEFAULT_FALLBACK_TEXT,
    },
    {
      icon: <MdOutlineCall className={ICON_CLASSES} />,
      title: "Phone",
      description:
        restaurant?.phone || restaurant?.contact_phone || DEFAULT_FALLBACK_TEXT,
    },
    {
      icon: <MdOutlineSchedule className={ICON_CLASSES} />,
      title: "Opening Hours",
      description: restaurant?.opening_hours || DEFAULT_OPENING_HOURS,
    },
    {
      icon: <MdOutlineDeliveryDining className={ICON_CLASSES} />,
      title: "Delivery",
      description: restaurant?.delivery_info || DEFAULT_DELIVERY_INFO,
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
            .from(STORAGE_BUCKET_NAME)
            .list(data.id, { limit: STORAGE_FILE_LIMIT });

          if (list && list.length > 0) {
            const { data: urlData } = supabase.storage
              .from(STORAGE_BUCKET_NAME)
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

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!user || !restaurant?.id) return;
      try {
        const { data, error } = await supabase
          .from("favorites")
          .select("id")
          .eq("user_id", user.id)
          .eq("restaurant_id", restaurant.id)
          .maybeSingle();

        if (error) throw error;
        setIsFavorite(!!data);
      } catch (err) {
        console.error("Error checking favorite:", err);
      }
    };

    checkFavoriteStatus();
  }, [user, restaurant?.id]);

  useEffect(() => {
    const fetchReview = async () => {
      if (!user || !restaurant?.id) return;
      try {
        const { data, error } = await supabase
          .from("reviews")
          .select("*")
          .eq("user_id", user.id)
          .eq("restaurant_id", restaurant.id)
          .maybeSingle();

        if (error && error.code !== "PGRST116") {
          console.error("Error fetching review:", error);
        }
        setUserReview(data);
      } catch (err) {
        console.error("Error:", err);
      }
    };
    fetchReview();
  }, [user, restaurant?.id]);

  const handleToggleFavorite = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (favLoading) return;
    setFavLoading(true);
    try {
      if (isFavorite) {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("restaurant_id", restaurant.id);
        if (error) throw error;
        setIsFavorite(false);
      } else {
        const { error } = await supabase
          .from("favorites")
          .insert([{ user_id: user.id, restaurant_id: restaurant.id }]);
        if (error) throw error;
        setIsFavorite(true);
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    } finally {
      setFavLoading(false);
    }
  };

  const renderStars = () => {
    const rating = restaurant?.rating || DEFAULT_RATING;
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= HALF_STAR_THRESHOLD;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<IoStar key={i} className="text-primary" />);
    }
    if (hasHalfStar) {
      stars.push(<IoStarHalfOutline key="half" className="text-primary" />);
    }
    const remainingStars = TOTAL_STARS - stars.length;
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
    <div className="relative flex min-h-screen w-full flex-row bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
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

      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 left-4 z-40 p-2 rounded-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-md border border-gray-200 dark:border-gray-700 lg:hidden hover:scale-105 transition-transform"
        aria-label="Open Sidebar"
      >
        <FiMenu size={24} />
      </button>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto lg:ml-16">
        <div className="max-w-7xl mx-auto">
          {/* HeaderImage - Prioritize logo_url over cover_image_url */}
          {restaurant.logo_url || restaurant.cover_image_url ? (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeIn}
              className="w-full h-60 md:h-72 rounded-xl bg-cover bg-center mb-6"
              style={{
                backgroundImage: `url('${
                  restaurant.logo_url || restaurant.cover_image_url
                }')`,
              }}
            ></motion.div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeIn}
              className="w-full h-60 md:h-72 rounded-xl bg-linear-to-r from-primary/20 to-blue-500/20 mb-6 flex items-center justify-center"
            >
              <MdStorefront className="text-6xl text-gray-400" />
            </motion.div>
          )}

          {/* PageHeading */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="flex flex-wrap justify-between items-start gap-4 mb-8"
          >
            <div className="flex flex-col gap-2">
              <h1 className={HEADING_PRIMARY_CLASSES}>{restaurant.name}</h1>
              <p
                className={`${TEXT_MUTED_CLASSES} text-base font-normal leading-normal`}
              >
                {restaurant.cuisine || "Restaurant"}
              </p>

              {/* RatingSummary (inline) */}
              {/* RatingSummary (inline) - Clickable to rate */}
              <button
                onClick={() => {
                  if (!user) navigate("/login");
                  else setIsRatingOpen(true);
                }}
                className="flex items-center gap-2 mt-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg px-2 -ml-2 transition-colors cursor-pointer"
                title="Click to rate"
              >
                <div className="flex gap-0.5 pointer-events-none">
                  {renderStars()}
                </div>
                <p className="text-text-light dark:text-text-dark text-sm font-medium">
                  {restaurant.rating || DEFAULT_RATING}
                </p>
                <p
                  className={`${TEXT_MUTED_CLASSES} text-sm font-normal underline decoration-dotted`}
                >
                  ({restaurant.review_count || DEFAULT_REVIEW_COUNT} reviews)
                </p>
                {!userReview && (
                  <span className="text-primary text-xs font-bold ml-1 border border-primary/30 px-2 py-0.5 rounded-full bg-primary/5">
                    Rate Now
                  </span>
                )}
              </button>
            </div>

            {/* Actions: Favorite & Rate */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (!user) {
                    navigate("/login");
                    return;
                  }
                  setIsRatingOpen(true);
                }}
                className={BUTTON_SECONDARY_CLASSES}
              >
                <IoStar className={userReview ? "text-yellow-400" : ""} />
                <span className="truncate">
                  {userReview ? `Rated ${userReview.rating}` : "Rate"}
                </span>
              </button>
              <button
                onClick={handleToggleFavorite}
                disabled={favLoading}
                className={`${BUTTON_SECONDARY_CLASSES} ${
                  isFavorite ? "bg-red-50 text-red-500 border-red-200" : ""
                }`}
              >
                {isFavorite ? (
                  <FaHeart className="text-red-500" />
                ) : (
                  <FiHeart />
                )}
                <span className="truncate">
                  {isFavorite ? "Favorited" : "Favorite"}
                </span>
              </button>
            </div>
          </motion.div>

          {/* Restaurant Info Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Left Column: About & Details */}
            <div className="flex flex-col gap-8">
              <motion.div variants={scaleIn} className={CARD_CLASSES}>
                <h2 className={`${HEADING_SECONDARY_CLASSES} mb-4`}>
                  About {restaurant.name}
                </h2>
                <p className={`${TEXT_MUTED_CLASSES} text-sm leading-relaxed`}>
                  {restaurant.description ||
                    restaurant.about ||
                    DEFAULT_DESCRIPTION}
                </p>
              </motion.div>

              <motion.div variants={scaleIn} className={CARD_CLASSES}>
                <h2 className={`${HEADING_SECONDARY_CLASSES} mb-4`}>Details</h2>
                <ul className="space-y-4">
                  {details.map((detail, index) => (
                    <li key={index} className="flex items-start gap-4">
                      {detail.icon}
                      <div className="flex flex-col">
                        <span className="text-text-light dark:text-text-dark text-sm font-medium">
                          {detail.title}
                        </span>
                        <span className={`${TEXT_MUTED_CLASSES} text-sm`}>
                          {detail.description}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Right Column: Menu Items */}
            <motion.div
              variants={scaleIn}
              className={`${CARD_CLASSES} lg:col-span-2`}
            >
              <h2 className={`${HEADING_SECONDARY_CLASSES} mb-6`}>Menu</h2>
              {menuLoading ? (
                <p className={`text-sm ${TEXT_MUTED_CLASSES}`}>
                  Loading menu...
                </p>
              ) : menuItems.length === 0 ? (
                <p className={`text-sm ${TEXT_MUTED_CLASSES}`}>
                  No menu items available.
                </p>
              ) : (
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {menuItems.map((item) => (
                    <motion.div
                      key={item.id}
                      variants={fadeInUp}
                      whileHover={{
                        scale: 1.03,
                        transition: { duration: 0.2 },
                      }}
                      className={MENU_ITEM_CARD_CLASSES}
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
                          <MdStorefront className="text-4xl text-text-muted-light dark:text-text-muted-dark" />
                        </div>
                      )}
                      <div className="p-4 flex flex-col grow">
                        <h3 className="text-text-light dark:text-text-dark font-bold">
                          {item.name}
                        </h3>
                        <p
                          className={`${TEXT_MUTED_CLASSES} text-sm line-clamp-2 mt-2`}
                        >
                          {item.description || DEFAULT_ITEM_DESCRIPTION}
                        </p>
                        <div className="mt-auto pt-4 flex items-center justify-between">
                          <p className="text-text-light dark:text-text-dark font-semibold">
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
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Cart Button */}
        {getCartItemsCount() > 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCartOpen(true)}
            className={`fixed bottom-6 right-6 ${BUTTON_PRIMARY_CLASSES} z-30`}
          >
            <FiShoppingCart className="text-xl" />
            <span>View Cart ({getCartItemsCount()})</span>
            <span className="bg-white text-primary rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
              {getCartItemsCount()}
            </span>
          </motion.button>
        )}
      </main>

      {/* Cart Sidebar */}
      <Cart />

      {/* Rating Modal */}
      <RatingModal
        isOpen={isRatingOpen}
        onClose={() => setIsRatingOpen(false)}
        restaurantId={restaurant?.id}
        userId={user?.id}
        initialRating={userReview?.rating || 0}
        initialComment={userReview?.comment || ""}
        onRatingSuccess={() => {
          // Refetch review to update UI
          const fetchReview = async () => {
            const { data } = await supabase
              .from("reviews")
              .select("*")
              .eq("user_id", user.id)
              .eq("restaurant_id", restaurant.id)
              .single();
            setUserReview(data);
          };
          fetchReview();
        }}
      />
    </div>
  );
};

export default RestaurantPublicView;
