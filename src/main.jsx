import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import App from "./App";
import About from "./pages/about";
import Main from "./components/Main";
import Landing from "./pages/docs";
import Contact from "./pages/contact";
import JoinQuickPlate from "./pages/getStarted";
import CreateUserAccount from "./pages/signupUser";
import RestaurantSignup from "./pages/signupRestaurant";
import Login from "./pages/login";
import License from "./pages/LICENSE";
import UserDashboard from "./pages/UserDashboard";
import RestaurantDashboard from "./pages/restaurantdashboard";
import RestaurantSetup from "./pages/RestaurantSetup";
import MenuManagement from "./pages/menupage";
import AddMenuItem from "./pages/addmenuitem";
import RestaurantInfo from "./pages/restaurantdetails";
import AuthCallback from "./components/AuthCallBack";
import Settings from "./pages/Settings";
import Orders from "./pages/Orders";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
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
        </Routes>
      </HashRouter>
    </ThemeProvider>
  </React.StrictMode>
);
