import React from "react";
import UserSidebar from "../components/UserSidebar";
import { useNotifications } from "../context/NotificationContext";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";
import { FiBell, FiCheckCircle, FiClock, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

const NotificationsPage = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { darkMode } = useTheme();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <div className="flex h-full w-full">
        <UserSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          onLogout={handleLogout}
        />

        <main
          className={`flex-1 p-6 lg:p-8 transition-all duration-300 ${
            sidebarOpen ? "lg:ml-64" : "lg:ml-16"
          } ${
            darkMode ? "bg-background-dark text-white" : "bg-background-light text-black"
          }`}
        >
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-black">Notifications</h1>
                <p className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Stay updated with your orders and activity.
                </p>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-bold"
                >
                  <FiCheckCircle />
                  Mark all as read
                </button>
              )}
            </div>

            <div className="space-y-4">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    onClick={() => {
                      if (!notification.is_read) markAsRead(notification.id);
                      if (notification.link) navigate(notification.link);
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      notification.is_read
                        ? darkMode
                          ? "bg-card-dark/40 border-gray-800 opacity-60"
                          : "bg-white border-gray-100 opacity-60"
                        : darkMode
                        ? "bg-card-dark border-primary/30 shadow-lg shadow-primary/5"
                        : "bg-white border-primary/20 shadow-lg shadow-primary/5"
                    } hover:scale-[1.01]`}
                  >
                    <div className="flex gap-4">
                      <div
                        className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                          notification.is_read
                            ? "bg-gray-100 text-gray-400 dark:bg-gray-800"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        <FiBell className="text-xl" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`font-bold ${notification.is_read ? "" : "text-primary"}`}>
                            {notification.title}
                          </h3>
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <FiClock />
                            {new Date(notification.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                    <FiBell className="text-4xl text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold">No notifications yet</h3>
                  <p className="text-gray-500">We'll notify you when something happens!</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NotificationsPage;
