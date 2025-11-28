import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { FiHome, FiHeart, FiUser, FiSettings, FiLogOut } from "react-icons/fi";
import { MdStorefront, MdReceiptLong } from "react-icons/md";

const UserSidebar = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      }
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: "/dashboard", label: "Home", icon: FiHome },
    { path: "/restaurants", label: "Restaurants", icon: MdStorefront },
    { path: "/userOrders", label: "Your Orders", icon: MdReceiptLong },
    { path: "/favorites", label: "Favorites", icon: FiHeart },
    { path: "/profile", label: "Profile", icon: FiUser },
  ];

  return (
    <aside className="sticky top-0 h-screen w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-black/20 p-4 hidden lg:flex flex-col justify-between">
      <div className="flex flex-col gap-4">
        <div className="flex gap-3 items-center">
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
            style={{
              backgroundImage: `url("${
                user?.user_metadata?.avatar_url ||
                "https://lh3.googleusercontent.com/aida-public/AB6AXuDvlMrdnETeXr6ZpjqVsmYmzVAb6LYzYQ54fvjDYP5CQlVbYZHZsSZDYozjk-Wl0H8iPM5AXlRWtI3JDIU8C32pK4TuaiVWgmrusyfit4LBnfVvPkmEzdAjaFvGNZlXGVd1wmS03ZxNDCLUhQw7yht2PnYYwaxzAgqWsAEFvY7xXuerT-ZWivSpbLbq2RBNZXtCD3AFgRcn_stvLCyoZcmS647kaGak-eGRBO8NTEN1hmwjO9SpLqC65bxRfOLDJIVKHW658Tu45gnC"
              }")`,
            }}
          ></div>
          <div className="flex flex-col">
            <h1 className="text-base font-medium leading-normal text-gray-900 dark:text-white">
              {user?.user_metadata?.full_name || "Guest User"}
            </h1>
            <p className="text-sm font-normal leading-normal text-gray-500 dark:text-gray-400">
              {user?.email || "guest@example.com"}
            </p>
          </div>
        </div>
        <nav className="flex flex-col gap-2 mt-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                isActive(item.path)
                  ? "bg-primary/20"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <item.icon
                className={`text-xl ${
                  isActive(item.path)
                    ? "text-primary font-bold"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              />
              <p
                className={`text-sm font-medium leading-normal ${
                  isActive(item.path)
                    ? "text-primary"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {item.label}
              </p>
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex flex-col gap-1">
        <Link
          to="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <FiSettings className="text-xl text-gray-700 dark:text-gray-300" />
          <p className="text-sm font-medium leading-normal text-gray-700 dark:text-gray-300">
            Settings
          </p>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left"
        >
          <FiLogOut className="text-xl text-gray-700 dark:text-gray-300" />
          <p className="text-sm font-medium leading-normal text-gray-700 dark:text-gray-300">
            Log out
          </p>
        </button>
      </div>
    </aside>
  );
};

export default UserSidebar;
