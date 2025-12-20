import React, { useState, useEffect } from "react";
import { FiSearch, FiStar, FiMenu } from "react-icons/fi";
import { MdStorefront } from "react-icons/md";
import UserSidebar from "../components/UserSidebar";
import { supabase } from "../supabase";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const RestaurantsDirectoryPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );

  useEffect(() => {
    const query = searchParams.get("search");
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

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
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("restaurants")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        // Load logos from storage for each restaurant
        const restaurantsWithLogos = await Promise.all(
          (data || []).map(async (restaurant) => {
            const logoUrl = await loadRestaurantLogo(restaurant.id);
            return {
              ...restaurant,
              logo_url: logoUrl || restaurant.logo_url, // Use storage URL or fallback to DB URL
            };
          })
        );

        setRestaurants(restaurantsWithLogos);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const loadRestaurantLogo = async (restaurantId) => {
    try {
      // Check if logo exists in storage
      const { data, error } = await supabase.storage
        .from("restaurant-logos")
        .list(restaurantId, {
          limit: 1,
        });

      if (error) {
        console.error("Error loading restaurant logo:", error);
        return null;
      }

      if (data && data.length > 0) {
        // Get public URL for the logo
        const { data: urlData } = supabase.storage
          .from("restaurant-logos")
          .getPublicUrl(`${restaurantId}/${data[0].name}`);

        if (urlData) {
          return urlData.publicUrl;
        }
      }
      return null;
    } catch (error) {
      console.error("Error loading restaurant logo:", error);
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

  const filteredRestaurants = restaurants.filter((restaurant) => {
    if (!restaurant) return false;
    const query = String(searchQuery || "").toLowerCase();
    const name = String(restaurant.name || "").toLowerCase();
    const cuisine = String(restaurant.cuisine || "").toLowerCase();
    const location = String(restaurant.location || 
                          restaurant.address || "").toLowerCase();
    
    return name.includes(query) || cuisine.includes(query) || location.includes(query);
  });

  return (
    <div className="relative flex min-h-screen w-full">
      {/* Sidebar */}
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
      <main
        className={`flex-1 p-6 transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-16"
        } bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark`}
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
                Explore Restaurants
              </h1>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block">
              <h1 className="text-3xl font-bold text-text-light dark:text-text-dark">
                Explore Restaurants
              </h1>
              <p className="mt-1 text-text-secondary-light dark:text-text-secondary-dark">
                View and connect with other restaurants on QuickPlate.
              </p>
            </div>

            <div className="relative mt-4">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className={`w-full max-w-md rounded-xl p-3 pl-10 focus:ring-2 focus:ring-primary transition-colors duration-300 outline-none ${
                  darkMode
                    ? "border border-border-dark bg-card-dark text-text-dark placeholder-text-muted-dark"
                    : "border border-border-light bg-card-light text-text-light placeholder-text-muted-light"
                }`}
                placeholder="Search restaurants..."
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </header>

          {/* Loading State */}
          {loading && (
            <div className="mt-6 text-center">
              <p className="text-text-secondary-light dark:text-text-secondary-dark">
                Loading restaurants...
              </p>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredRestaurants.length === 0 && (
            <div className="mt-12 text-center">
              <MdStorefront className="mx-auto text-6xl text-text-muted-light dark:text-text-muted-dark" />
              <h3 className="mt-4 text-lg font-medium text-text-light dark:text-text-dark">
                No restaurants found
              </h3>
              <p className="mt-2 text-text-secondary-light dark:text-text-secondary-dark">
                {searchQuery
                  ? "Try adjusting your search criteria"
                  : "No restaurants are currently registered on the platform"}
              </p>
            </div>
          )}

          {/* Restaurants Grid */}
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
                    className="h-40 w-full rounded-xl bg-cover bg-center bg-gray-200 dark:bg-gray-700"
                    style={{
                      backgroundImage: restaurant.logo_url
                        ? `url('${restaurant.logo_url}')`
                        : "none",
                    }}
                  >
                    {!restaurant.logo_url && (
                      <div className="flex h-full items-center justify-center">
                        <MdStorefront className="text-4xl text-gray-400 dark:text-gray-500" />
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex flex-col">
                    <h2 className="text-lg font-bold text-text-light dark:text-text-dark">
                      {restaurant.name}
                    </h2>
                    <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-1">
                      ID:{" "}
                      <span className="font-mono text-[11px]">
                        {restaurant.id}
                      </span>
                    </p>

                    <p className="mt-1 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                      {restaurant.location ||
                        restaurant.address ||
                        "Location not specified"}
                    </p>

                    <div className="mt-3 flex items-center gap-1 text-text-light dark:text-text-dark">
                      {renderStars(restaurant.rating || 0)}
                      <span className="ml-1 text-sm font-medium">
                        {restaurant.rating?.toFixed(1) || "0.0"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-auto flex gap-3 pt-4">
                    <Link
                      className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-green-600 transition-colors text-center"
                      to={`/restaurant/${restaurant.id}`}
                      state={{ restaurant }}
                    >
                      View Profile
                    </Link>
                    <button className="flex-1 rounded-lg border border-border-light dark:border-border-dark px-4 py-2 text-sm text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                      Message
                    </button>
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

export default RestaurantsDirectoryPage;
