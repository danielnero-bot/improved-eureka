import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { CartProvider } from "./context/CartContext";
import App from "./App";
import About from "./pages/About";
import Main from "./components/Main";
import Landing from "./pages/Docs";
import Contact from "./pages/Contact";
import JoinQuickPlate from "./pages/GetStarted";
import CreateUserAccount from "./pages/SignupUser";
import RestaurantSignup from "./pages/SignupRestaurant";
import Login from "./pages/Login";
import License from "./pages/LICENSE";
import UserDashboard from "./pages/UserDashboard";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import RestaurantSetup from "./pages/RestaurantSetup";
import MenuManagement from "./pages/MenuPage";
import AddMenuItem from "./pages/AddMenuItem";
import RestaurantInfo from "./pages/RestaurantDetails";
import AuthCallback from "./components/AuthCallBack";
import Settings from "./pages/Settings";
import Orders from "./pages/Orders";
import UserOrdersPage from "./pages/UserOrders";
import UserProfile from "./pages/UserProfile";
import RestaurantsDirectoryPage from "./pages/restaurantview";
import UserRestaurantDetailsPage from "./pages/UserRestaurantDetails";
import RestaurantPublicView from "./pages/RestaurantPublicView";
import Checkout from "./pages/Checkout";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <CartProvider>
        <HashRouter>
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
          </Routes>
        </HashRouter>
      </CartProvider>
    </ThemeProvider>
  </React.StrictMode>
);
