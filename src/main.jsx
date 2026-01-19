import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { CartProvider } from "./context/CartContext";
import { NotificationProvider } from "./context/NotificationContext";
import "./index.css";

// Layout
import App from "./App";

// Lazy loaded components and pages
const Main = lazy(() => import("./components/Main"));
const About = lazy(() => import("./pages/About"));
const Landing = lazy(() => import("./pages/Docs"));
const Contact = lazy(() => import("./pages/Contact"));
const JoinQuickPlate = lazy(() => import("./pages/GetStarted"));
const CreateUserAccount = lazy(() => import("./pages/SignupUser"));
const RestaurantSignup = lazy(() => import("./pages/SignupRestaurant"));
const Login = lazy(() => import("./pages/Login"));
const License = lazy(() => import("./pages/LICENSE"));
const UserDashboard = lazy(() => import("./pages/UserDashboard"));
const RestaurantDashboard = lazy(() => import("./pages/RestaurantDashboard"));
const RestaurantSetup = lazy(() => import("./pages/RestaurantSetup"));
const MenuManagement = lazy(() => import("./pages/MenuPage"));
const AddMenuItem = lazy(() => import("./pages/AddMenuItem"));
const RestaurantInfo = lazy(() => import("./pages/RestaurantDetails"));
const AuthCallback = lazy(() => import("./components/AuthCallBack"));
const Settings = lazy(() => import("./pages/Settings"));
const Orders = lazy(() => import("./pages/Orders"));
const UserOrdersPage = lazy(() => import("./pages/UserOrders"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const RestaurantsDirectoryPage = lazy(() => import("./pages/restaurantview"));
const UserRestaurantDetailsPage = lazy(() => import("./pages/UserRestaurantDetails"));
const RestaurantPublicView = lazy(() => import("./pages/RestaurantPublicView"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Favorites = lazy(() => import("./pages/Favorites"));
const NotificationsPage = lazy(() => import("./pages/Notifications"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

// Loading Component
const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-background-light dark:bg-background-dark">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-xl shadow-primary/20"></div>
  </div>
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <CartProvider>
        <NotificationProvider>
          <HashRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* App acts as the layout (with Navbar & Footer) */}
              <Route path="/" element={<App />}>
                {/* Index route (home page) */}
                <Route index element={<Main />} />
                {/* Other pages that use the App layout */}
                <Route path="/about" element={<About />} />
                <Route path="/docs" element={<Landing />} />
                <Route path="/contact" element={<Contact />} />
              </Route>
              {/* Pages without header/footer (standalone) */}
              <Route path="/getStarted" element={<JoinQuickPlate />} />
              <Route path="/signupUser" element={<CreateUserAccount />} />
              <Route path="/signupRestaurant" element={<RestaurantSignup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/license" element={<License />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route
                path="/restaurantDashboard"
                element={<RestaurantDashboard />}
              />
              <Route path="/restaurantsetup" element={<RestaurantSetup />} />
              <Route path="/menupage" element={<MenuManagement />} />
              <Route path="/addmenuitem" element={<AddMenuItem />} />
              <Route path="/restaurant-info" element={<RestaurantInfo />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/userOrders" element={<UserOrdersPage />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/userProfile" element={<UserProfile />} />
              <Route
                path="/restaurantview"
                element={<RestaurantsDirectoryPage />}
              />
              <Route
                path="/restaurantviewed"
                element={<UserRestaurantDetailsPage />}
              />
              <Route path="/restaurant/:id" element={<RestaurantPublicView />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </Suspense>
        </HashRouter>
        </NotificationProvider>
      </CartProvider>
    </ThemeProvider>
  </React.StrictMode>
);
