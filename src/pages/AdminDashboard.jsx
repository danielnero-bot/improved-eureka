import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { useTheme } from "../context/ThemeContext";
import {
  FiUsers,
  FiHome,
  FiTrash2,
  FiSearch,
  FiShield,
  FiLogOut,
  FiMenu
} from "react-icons/fi";
import { MdStorefront } from "react-icons/md";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const AdminDashboard = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview"); // overview, users, restaurants
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRestaurants: 0,
    totalOrders: 0
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const containerRef = useRef(null);

  useGSAP(() => {
    if (!loading) {
      gsap.from(".tab-content-anim", {
        opacity: 0,
        y: 20,
        duration: 0.4,
        ease: "power2.out",
        clearProps: "all"
      });
    }
  }, { scope: containerRef, dependencies: [activeTab, loading] });

  // Check admin access (Mock implementation: allowed for now, or check specific email)
  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      
      if (!user) {
         navigate("/login");
         return;
      }
      
      // OPTIONAL: Add your admin email here to secure it
      // if (user.email !== "admin@example.com") {
      //   alert("Unauthorized access");
      //   navigate("/dashboard");
      // }
      
      fetchData();
    };
    checkAdmin();
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Users
      const { data: usersData, error: usersError } = await supabase
        .from("user_details")
        .select("*");
      
      // Fetch Restaurants
      const { data: restData, error: restError } = await supabase
        .from("restaurants")
        .select("*");

      // Fetch Orders count (optional)
      const { count: orderCount, error: orderError } = await supabase
        .from("orders")
        .select("*", { count: 'exact', head: true });

      if (usersError) console.error("Error fetching users:", usersError);
      if (restError) console.error("Error fetching restaurants:", restError);

      setUsers(usersData || []);
      setRestaurants(restData || []);
      setStats({
        totalUsers: usersData?.length || 0,
        totalRestaurants: restData?.length || 0,
        totalOrders: orderCount || 0
      });

    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRestaurant = async (id) => {
    if (!window.confirm("Are you sure you want to delete this restaurant? This action cannot be undone.")) return;
    
    try {
        const { error } = await supabase.from("restaurants").delete().eq("id", id);
        if (error) throw error;
        setRestaurants(prev => prev.filter(r => r.id !== id));
        setStats(prev => ({...prev, totalRestaurants: prev.totalRestaurants - 1}));
    } catch (err) {
        console.error("Error deleting restaurant:", err);
        alert("Failed to delete restaurant.");
    }
  };

  // Filter Logic
  const filteredUsers = users.filter(u => 
    (u.full_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(searchQuery.toLowerCase()) // assuming email is in user_details or we joined it
  );

  const filteredRestaurants = restaurants.filter(r => 
    (r.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const SidebarItem = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => { setActiveTab(id); if (window.innerWidth < 1024) setSidebarOpen(false); }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
        activeTab === id
          ? "bg-primary text-white shadow-lg shadow-primary/25"
          : darkMode ? "text-gray-400 hover:bg-white/5" : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      <Icon className="text-xl" />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className={`min-h-screen flex ${darkMode ? "bg-background-dark text-white" : "bg-background-light text-gray-900"}`}>
      
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out border-r lg:relative lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${darkMode ? "bg-card-dark border-border-dark" : "bg-white border-gray-200"}`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <FiShield className="text-white text-lg" />
            </div>
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>

          <nav className="flex-1 space-y-2">
            <SidebarItem id="overview" icon={FiHome} label="Overview" />
            <SidebarItem id="users" icon={FiUsers} label="Users" />
            <SidebarItem id="restaurants" icon={MdStorefront} label="Restaurants" />
          </nav>

          <button 
            onClick={() => navigate("/login")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors mt-auto ${
                darkMode ? "text-gray-400 hover:bg-red-500/10 hover:text-red-500" : "text-gray-600 hover:bg-red-50 hover:text-red-600"
            }`}
          >
            <FiLogOut className="text-xl" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className={`sticky top-0 z-30 px-6 py-4 border-b backdrop-blur-md ${
            darkMode ? "bg-background-dark/80 border-border-dark" : "bg-white/80 border-gray-200"
        }`}>
          <div className="flex items-center justify-between">
            <button 
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg lg:hidden hover:bg-gray-100 dark:hover:bg-gray-800"
            >
                <FiMenu className="text-2xl" />
            </button>
            <div className="flex-1 px-4 lg:px-0">
                <div className="relative max-w-md">
                    <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
                    <input 
                        type="text" 
                        placeholder="Search users or restaurants..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary ${
                            darkMode 
                             ? "bg-card-dark border-border-dark focus:border-primary" 
                             : "bg-gray-50 border-gray-200"
                        }`}
                    />
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    A
                </div>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-10 max-w-7xl mx-auto" ref={containerRef}>
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : (
                <>
                    {activeTab === "overview" && (
                        <div 
                            key="overview"
                            className="tab-content-anim space-y-6"
                        >
                            <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className={`p-6 rounded-2xl border flex items-center gap-4 ${darkMode ? "bg-card-dark border-border-dark" : "bg-white border-gray-200"}`}>
                                    <div className="p-4 rounded-xl bg-blue-500/10 text-blue-500">
                                        <FiUsers className="text-2xl" />
                                    </div>
                                    <div>
                                        <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Total Users</p>
                                        <h3 className="text-3xl font-bold">{stats.totalUsers}</h3>
                                    </div>
                                </div>
                                <div className={`p-6 rounded-2xl border flex items-center gap-4 ${darkMode ? "bg-card-dark border-border-dark" : "bg-white border-gray-200"}`}>
                                    <div className="p-4 rounded-xl bg-orange-500/10 text-orange-500">
                                        <MdStorefront className="text-2xl" />
                                    </div>
                                    <div>
                                        <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Total Restaurants</p>
                                        <h3 className="text-3xl font-bold">{stats.totalRestaurants}</h3>
                                    </div>
                                </div>
                                <div className={`p-6 rounded-2xl border flex items-center gap-4 ${darkMode ? "bg-card-dark border-border-dark" : "bg-white border-gray-200"}`}>
                                    <div className="p-4 rounded-xl bg-green-500/10 text-green-500">
                                        <FiShield className="text-2xl" />
                                    </div>
                                    <div>
                                        <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Total Orders</p>
                                        <h3 className="text-3xl font-bold">{stats.totalOrders}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "users" && (
                        <div 
                            key="users"
                            className="tab-content-anim"
                        >
                             <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">Users Management</h2>
                                <span className={`px-3 py-1 rounded-full text-sm ${darkMode ? "bg-white/10" : "bg-gray-100"}`}>
                                    {filteredUsers.length} Users Found
                                </span>
                            </div>

                            <div className={`rounded-2xl border overflow-hidden ${darkMode ? "bg-card-dark border-border-dark" : "bg-white border-gray-200"}`}>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className={`border-b ${darkMode ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-100"}`}>
                                            <tr>
                                                <th className="p-4 font-semibold">User</th>
                                                <th className="p-4 font-semibold">Phone</th>
                                                <th className="p-4 font-semibold">Joined Date</th>
                                                <th className="p-4 font-semibold text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                            {filteredUsers.map(user => (
                                                <tr key={user.id} className="group hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                                    <td className="p-4 flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden">
                                                            {user.avatar_url ? (
                                                                <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                (user.full_name || "U")[0]
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold">{user.full_name || "Unknown"}</div>
                                                            <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>ID: {user.user_id?.slice(0,8)}...</div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-sm opacity-80">{user.phone_number || "-"}</td>
                                                    <td className="p-4 text-sm opacity-80">{user.created_at ? new Date(user.created_at).toLocaleDateString() : "-"}</td>
                                                    <td className="p-4 text-right">
                                                        <button 
                                                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                                            title="Delete User (Mock)"
                                                        >
                                                            <FiTrash2 />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {filteredUsers.length === 0 && (
                                                <tr>
                                                    <td colSpan="4" className="p-8 text-center opacity-50">No users found matching your search.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "restaurants" && (
                        <div 
                            key="restaurants"
                            className="tab-content-anim"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">Restaurant Management</h2>
                                <span className={`px-3 py-1 rounded-full text-sm ${darkMode ? "bg-white/10" : "bg-gray-100"}`}>
                                    {filteredRestaurants.length} Restaurants Found
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredRestaurants.map(rest => (
                                    <div key={rest.id} className={`group relative rounded-2xl border overflow-hidden transition-all hover:shadow-lg ${darkMode ? "bg-card-dark border-border-dark" : "bg-white border-gray-200"}`}>
                                        <div className="h-32 bg-gray-200 dark:bg-gray-700 relative">
                                            {rest.cover_image_url ? (
                                                <img src={rest.cover_image_url} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <MdStorefront className="text-4xl" />
                                                </div>
                                            )}
                                            <div className="absolute top-4 right-4">
                                                <button 
                                                    onClick={() => handleDeleteRestaurant(rest.id)}
                                                    className="p-2 bg-white/90 text-red-500 rounded-full shadow-sm hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-5">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold text-lg line-clamp-1">{rest.name}</h3>
                                                <div className="flex items-center gap-1 text-yellow-500 text-sm font-bold">
                                                    <span>★</span>
                                                    <span>{rest.rating?.toFixed(1) || "0.0"}</span>
                                                </div>
                                            </div>
                                            <p className={`text-sm mb-4 line-clamp-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                                {rest.description || "No description provided."}
                                            </p>
                                            <div className={`pt-4 border-t flex justify-between items-center text-sm ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
                                                <span className="opacity-60">{rest.location || "No address"}</span>
                                                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                                                    rest.is_open ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
                                                }`}>
                                                    {rest.is_open ? "Open" : "Closed"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {filteredRestaurants.length === 0 && (
                                <div className="p-12 text-center opacity-50 border rounded-2xl border-dashed">
                                    No restaurants found matching your search.
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
