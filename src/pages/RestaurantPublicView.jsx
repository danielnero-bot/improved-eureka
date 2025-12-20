import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { FiHeart, FiShoppingCart, FiMenu } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import {
  MdOutlineDeliveryDining,
  MdOutlineLocationOn,
  MdOutlineSchedule,
  MdOutlineCall,
  MdStorefront,
  MdOutlineRestaurantMenu,
} from "react-icons/md";
import { IoStar, IoStarHalfOutline } from "react-icons/io5";
import { supabase } from "../supabase";
import UserSidebar from "../components/UserSidebar";
import Cart from "../components/Cart";
import RatingModal from "../components/RatingModal";
import ReviewsList from "../components/ReviewsList";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";


// Animation variants removed as they are now handled inline or simplified


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

  // CSS Classes - USING GLOBAL THEME VARIABLES
  const ICON_CLASSES = "text-primary mt-1";
  const CARD_CLASSES = "p-6 rounded-2xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark shadow-sm hover:shadow-md transition-all duration-300";
  const BUTTON_PRIMARY_CLASSES = "bg-primary text-white px-8 py-3 rounded-full shadow-lg shadow-primary/20 flex items-center gap-3 font-bold hover:bg-green-600 transition-all hover:scale-105 active:scale-95";
  const BUTTON_SECONDARY_CLASSES = "flex items-center gap-2 px-5 py-2.5 border rounded-full text-sm font-bold text-text-light dark:text-text-dark border-border-light dark:border-border-dark hover:bg-gray-100 dark:hover:bg-white/5 transition-all active:scale-95";
  const HEADING_PRIMARY_CLASSES = "text-text-light dark:text-text-dark text-4xl md:text-5xl font-black leading-tight tracking-tight";
  const HEADING_SECONDARY_CLASSES = "text-text-light dark:text-text-dark text-xl font-black tracking-tight";
  const TEXT_MUTED_CLASSES = "text-text-secondary-light dark:text-text-secondary-dark";
  const MENU_ITEM_CARD_CLASSES = "flex flex-col rounded-2xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 overflow-hidden group";

  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart, getCartItemsCount, setIsCartOpen, getCartTotal } = useCart();

  const [restaurant, setRestaurant] = useState(location.state?.restaurant || null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(!restaurant);
  const [menuItems, setMenuItems] = useState([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [userReview, setUserReview] = useState(null);
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [reviewsRefreshKey, setReviewsRefreshKey] = useState(0);

  const details = [
    {
      icon: <MdOutlineLocationOn className={ICON_CLASSES} />,
      title: "Address",
      description: restaurant?.location || restaurant?.address || DEFAULT_FALLBACK_TEXT,
    },
    {
      icon: <MdOutlineCall className={ICON_CLASSES} />,
      title: "Phone",
      description: restaurant?.phone || restaurant?.contact_phone || DEFAULT_FALLBACK_TEXT,
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
      // If we already have the correct restaurant, don't refetch
      if (restaurant && restaurant.id === id) return;

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
  }, [id]); // Only depend on id, not restaurant state to avoid loops but allow updates on navigation

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
  }, [user, restaurant?.id, reviewsRefreshKey]);

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
      <div className="flex min-h-screen items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-xl shadow-primary/20"></div>
          <p className="text-lg font-bold text-text-light dark:text-text-dark animate-pulse">
            Loading deliciousness...
          </p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background-light dark:bg-background-dark p-8 text-center">
        <div className="mb-6 rounded-full bg-red-100 p-6 dark:bg-red-900/20">
          <MdStorefront className="text-6xl text-red-500" />
        </div>
        <h2 className="text-3xl font-black text-text-light dark:text-text-dark mb-2">Restaurant Not Found</h2>
        <p className="text-text-secondary-light dark:text-text-secondary-dark mb-8 max-w-md">
          The restaurant you're looking for might have closed or changed its address.
        </p>
        <button
          onClick={() => navigate("/restaurantview")}
          className={BUTTON_PRIMARY_CLASSES}
        >
          Back to Restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-row bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
      <UserSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={user}
        onLogout={handleLogout}
      />

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden transition-all duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 left-4 z-40 p-3 rounded-xl bg-white dark:bg-card-dark text-primary shadow-xl border border-border-light dark:border-border-dark lg:hidden hover:scale-110 transition-all active:scale-95"
        aria-label="Open Sidebar"
      >
        <FiMenu size={24} />
      </button>

      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-16"}`}>
        {/* Hero Section */}
        <div className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden">
          {restaurant.logo_url || restaurant.cover_image_url ? (
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
              style={{
                backgroundImage: `url('${restaurant.logo_url || restaurant.cover_image_url}')`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-background-light via-background-light/20 to-transparent dark:from-background-dark dark:via-background-dark/20"></div>
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-blue-500/30 flex items-center justify-center">
              <MdStorefront className="text-9xl text-white/20" />
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 w-full p-6 md:p-10">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col md:flex-row md:items-end justify-between gap-6"
              >
                <div className="flex flex-col gap-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-wider backdrop-blur-md border border-primary/20">
                    {restaurant.cuisine || "Restaurant"}
                  </div>
                  <h1 className={HEADING_PRIMARY_CLASSES}>{restaurant.name}</h1>
                  
                  <button
                    onClick={() => {
                      const reviewsSection = document.getElementById("reviews-section");
                      if (reviewsSection) reviewsSection.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="flex items-center gap-2 hover:bg-white/10 dark:hover:bg-black/10 rounded-xl p-1 -ml-1 transition-all w-fit group"
                  >
                    <div className="flex gap-0.5">{renderStars()}</div>
                    <span className="text-lg font-black">{restaurant.rating || DEFAULT_RATING}</span>
                    <span className="text-sm font-medium underline decoration-primary/30 underline-offset-4 group-hover:text-primary transition-colors">
                      ({restaurant.review_count || DEFAULT_REVIEW_COUNT} reviews)
                    </span>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (!user) navigate("/login");
                      else setIsRatingOpen(true);
                    }}
                    className={BUTTON_SECONDARY_CLASSES + " bg-white/80 dark:bg-black/40 backdrop-blur-md"}
                  >
                    <IoStar className={userReview ? "text-yellow-400" : "text-primary"} />
                    <span>{userReview ? `Rated ${userReview.rating}` : "Rate"}</span>
                  </button>
                  <button
                    onClick={handleToggleFavorite}
                    disabled={favLoading}
                    className={`${BUTTON_SECONDARY_CLASSES} bg-white/80 dark:bg-black/40 backdrop-blur-md ${
                      isFavorite ? "text-red-500 border-red-200 bg-red-50/80" : ""
                    }`}
                  >
                    {isFavorite ? <FaHeart className="text-red-500" /> : <FiHeart className="text-primary" />}
                    <span>{isFavorite ? "Favorited" : "Favorite"}</span>
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6 md:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left Column: Info */}
            <div className="flex flex-col gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className={CARD_CLASSES}
              >
                <h2 className={HEADING_SECONDARY_CLASSES + " mb-4 flex items-center gap-2"}>
                  <MdStorefront className="text-primary" />
                  About
                </h2>
                <p className={TEXT_MUTED_CLASSES + " text-sm leading-relaxed"}>
                  {restaurant.description || restaurant.about || DEFAULT_DESCRIPTION}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className={CARD_CLASSES}
              >
                <h2 className={HEADING_SECONDARY_CLASSES + " mb-6 flex items-center gap-2"}>
                  <MdOutlineSchedule className="text-primary" />
                  Details
                </h2>
                <ul className="space-y-6">
                  {details.map((detail, index) => (
                    <li key={index} className="flex items-start gap-4 group">
                      <div className="p-2.5 rounded-xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                        {detail.icon}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-black uppercase tracking-widest text-primary/60 mb-0.5">
                          {detail.title}
                        </span>
                        <span className="text-sm font-bold text-text-light dark:text-text-dark">
                          {detail.description}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Right Column: Menu */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-8">
                <h2 className={HEADING_PRIMARY_CLASSES.replace("text-4xl md:text-5xl", "text-3xl")}>
                  Menu
                </h2>
                <div className="h-1 flex-1 mx-6 bg-gradient-to-r from-primary/20 to-transparent rounded-full hidden md:block"></div>
              </div>

              {menuLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[1, 2, 4].map((i) => (
                    <div key={i} className="h-64 rounded-2xl bg-gray-100 dark:bg-white/5 animate-pulse"></div>
                  ))}
                </div>
              ) : menuItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-gray-50 dark:bg-white/5 rounded-3xl border-2 border-dashed border-border-light dark:border-border-dark">
                  <MdOutlineRestaurantMenu className="text-6xl text-gray-300 mb-4" />
                  <p className="text-xl font-bold text-text-secondary-light">No menu items yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {menuItems.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={MENU_ITEM_CARD_CLASSES}
                    >
                      <div className="relative h-48 overflow-hidden">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                            <MdStorefront className="text-5xl text-gray-300" />
                          </div>
                        )}
                        <div className="absolute top-3 right-3">
                          <div className="bg-white/90 dark:bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-sm font-black shadow-lg">
                            ${Number(item.price).toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <div className="p-5 flex flex-col grow">
                        <h3 className="text-lg font-black mb-2 group-hover:text-primary transition-colors">
                          {item.name}
                        </h3>
                        <p className={TEXT_MUTED_CLASSES + " text-xs line-clamp-2 mb-6"}>
                          {item.description || DEFAULT_ITEM_DESCRIPTION}
                        </p>
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="mt-auto w-full bg-primary text-white font-black py-3 rounded-xl shadow-lg shadow-primary/20 hover:bg-green-600 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                          <FiShoppingCart />
                          Add to Cart
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <div id="reviews-section" className="mt-20">
            <div className="flex items-center gap-4 mb-10">
              <h2 className={HEADING_PRIMARY_CLASSES.replace("text-4xl md:text-5xl", "text-3xl")}>
                Customer Reviews
              </h2>
              <div className="flex-1 h-px bg-border-light dark:bg-border-dark"></div>
            </div>
            
            <ReviewsList
              key={reviewsRefreshKey}
              restaurantId={restaurant?.id}
              onReviewsUpdate={async () => {
                const { data: reviews } = await supabase
                  .from("reviews")
                  .select("rating")
                  .eq("restaurant_id", restaurant.id);

                const stats = reviews?.length > 0 
                  ? {
                      rating: Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10,
                      review_count: reviews.length
                    }
                  : { rating: 0, review_count: 0 };

                await supabase.from("restaurants").update(stats).eq("id", restaurant.id);
                setRestaurant(prev => ({ ...prev, ...stats }));
              }}
            />
          </div>
        </div>

        {/* Floating Cart Button */}
        {getCartItemsCount() > 0 && (
          <motion.button
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCartOpen(true)}
            className="fixed bottom-8 right-8 z-40 bg-primary text-white px-8 py-4 rounded-2xl shadow-2xl shadow-primary/40 flex items-center gap-4 font-black transition-all group"
          >
            <div className="relative">
              <FiShoppingCart className="text-2xl" />
              <span className="absolute -top-2 -right-2 bg-white text-primary text-[10px] w-5 h-5 flex items-center justify-center rounded-full shadow-md">
                {getCartItemsCount()}
              </span>
            </div>
            <span className="hidden md:block">View Order</span>
            <div className="w-px h-6 bg-white/20 hidden md:block"></div>
            <span className="text-lg">${getCartTotal().toFixed(2)}</span>
          </motion.button>
        )}
      </main>

      <Cart />
      
      <RatingModal
        isOpen={isRatingOpen}
        onClose={() => setIsRatingOpen(false)}
        restaurantId={restaurant?.id}
        userId={user?.id}
        initialRating={userReview?.rating || 0}
        initialComment={userReview?.comment || ""}
        onRatingSuccess={async () => {
          setReviewsRefreshKey(prev => prev + 1);
          setIsRatingOpen(false);
        }}
      />
    </div>
  );
};

export default RestaurantPublicView;
