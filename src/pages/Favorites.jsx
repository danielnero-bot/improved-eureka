import React, { useState, useEffect } from "react";
import { FiSearch, FiStar, FiMenu, FiHeart } from "react-icons/fi";
import { MdStorefront, MdOutlineFavoriteBorder } from "react-icons/md";
import UserSidebar from "../components/UserSidebar";
import { supabase } from "../supabase";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const Favorites = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
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
        } else {
          navigate("/login");
        }
      } catch {
        navigate("/login");
      }
    };
    getUser();
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchFavorites = async () => {
      try {
        setLoading(true);
        // Fetch favorites joined with restaurants
        const { data, error } = await supabase
          .from("favorites")
          .select(
            `
            id,
            restaurants!favorites_restaurant_id_fkey (
              *
            )
          `
          )
          .eq("user_id", user.id);

        if (error) throw error;

        // Extract restaurant data and handle logos
        const favoriteRestaurants = await Promise.all(
          (data || [])
            .map((item) => item.restaurants)
            .filter((r) => r !== null) // Filter out any nulls if join failed
            .map(async (restaurant) => {
              const logoUrl = await loadRestaurantLogo(restaurant.id);
              return {
                ...restaurant,
                logo_url: logoUrl || restaurant.logo_url,
              };
            })
        );

        setRestaurants(favoriteRestaurants);
      } catch (error) {
        console.error("Error fetching favorites:", error);
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  const loadRestaurantLogo = async (restaurantId) => {
    try {
      const { data, error } = await supabase.storage
        .from("restaurant-logos")
        .list(restaurantId, {
          limit: 1,
        });

      if (error) return null;

      if (data && data.length > 0) {
        const { data: urlData } = supabase.storage
          .from("restaurant-logos")
          .getPublicUrl(`${restaurantId}/${data[0].name}`);
        return urlData?.publicUrl;
      }
      return null;
    } catch {
      return null;
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FiStar key={i} className="text-yellow-500 fill-yellow-500" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <FiStar
          key="half"
          className="text-yellow-500 fill-yellow-500 opacity-50"
        />
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FiStar
          key={`empty-${i}`}
          className="text-gray-300 dark:text-gray-600"
        />
      );
    }

    return stars;
  };

  const filteredRestaurants = restaurants.filter(
    (restaurant) =>
      restaurant.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisine?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative flex min-h-screen w-full bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors duration-300">
      {/* Sidebar */}
      <UserSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={user}
        onLogout={handleLogout}
      />

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main
        className={`flex-1 p-6 transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-16"
        }`}
      >
        <div className="mx-auto w-full max-w-7xl">
          <header>
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center mb-6">
              <button
                onClick={toggleSidebar}
                className="mr-4 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <FiMenu className="text-2xl text-text-light dark:text-text-dark" />
              </button>
              <h1 className="text-xl font-bold text-text-light dark:text-text-dark">
                Your Favorites
              </h1>
            </div>

            <div className="hidden lg:block">
              <h1 className="text-3xl font-bold text-text-light dark:text-text-dark">
                Your Favorites
              </h1>
              <p className="mt-1 text-text-secondary-light dark:text-text-secondary-dark">
                Restaurants you have saved.
              </p>
            </div>

            <div className="relative mt-4">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted-light dark:text-text-muted-dark" />
              <input
                className={`w-full max-w-md rounded-xl p-3 pl-10 focus:ring-2 focus:ring-primary transition-colors duration-300 outline-none ${
                  darkMode
                    ? "border border-border-dark bg-card-dark text-text-dark placeholder-text-muted-dark"
                    : "border border-border-light bg-card-light text-text-light placeholder-text-muted-light"
                }`}
                placeholder="Search favorites..."
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </header>

          {loading && (
            <div className="mt-12 flex flex-col items-center justify-center text-text-secondary-light dark:text-text-secondary-dark">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
              <p>Loading favorites...</p>
            </div>
          )}

          {!loading && filteredRestaurants.length === 0 && (
            <div className="mt-12 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                <FiHeart className="text-4xl text-text-muted-light dark:text-text-muted-dark" />
              </div>
              <h3 className="text-lg font-bold text-text-light dark:text-text-dark">
                No favorites yet
              </h3>
              <p className="mt-2 text-text-secondary-light dark:text-text-secondary-dark max-w-xs mx-auto">
                {searchQuery
                  ? "No matches found for your search."
                  : "Start exploring and heart your favorite restaurants to see them here!"}
              </p>
              {!searchQuery && (
                <Link
                  to="/restaurantview"
                  className="mt-6 px-6 py-2 bg-primary text-white font-bold rounded-full hover:bg-green-600 transition-colors"
                >
                  Explore Restaurants
                </Link>
              )}
            </div>
          )}

          {!loading && filteredRestaurants.length > 0 && (
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredRestaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  className={`flex flex-col rounded-xl p-4 shadow-sm transition hover:shadow-md ${
                    darkMode
                      ? "bg-card-dark border border-border-dark"
                      : "bg-card-light border border-border-light"
                  }`}
                >
                  <div
                    className="h-40 w-full rounded-xl bg-cover bg-center bg-gray-200 dark:bg-gray-800 relative"
                    style={{
                      backgroundImage: restaurant.logo_url
                        ? `url('${restaurant.logo_url}')`
                        : "none",
                    }}
                  >
                    {!restaurant.logo_url && (
                      <div className="flex h-full items-center justify-center">
                        <MdStorefront className="text-4xl text-text-muted-light dark:text-text-muted-dark" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-white dark:bg-black/50 backdrop-blur-sm p-1.5 rounded-full">
                      <FiHeart className="text-red-500 fill-red-500" />
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col flex-1">
                    <h2 className="text-lg font-bold text-text-light dark:text-text-dark">
                      {restaurant.name}
                    </h2>
                    <p className="mt-1 text-sm text-text-secondary-light dark:text-text-secondary-dark line-clamp-1">
                      {restaurant.cuisine || "Cuisine not specified"}
                    </p>
                    <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark line-clamp-1">
                      {restaurant.location || "Location not specified"}
                    </p>

                    <div className="mt-3 flex items-center gap-1">
                      {renderStars(restaurant.rating || 0)}
                      <span className="ml-1 text-sm font-medium text-text-light dark:text-text-dark">
                        {restaurant.rating?.toFixed(1) || "0.0"}
                      </span>
                      <span className="text-text-muted-light dark:text-text-muted-dark text-sm ml-1">
                        ({restaurant.review_count || 0})
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border-light dark:border-border-dark">
                    <Link
                      to={`/restaurant/${restaurant.id}`}
                      state={{ restaurant }}
                      className="flex items-center justify-center w-full rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white px-4 py-2 text-sm font-bold transition-colors"
                    >
                      View Menu
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Favorites;
