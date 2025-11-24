import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useTheme } from "./context/ThemeContext";

const App = () => {
  const { darkMode } = useTheme();

  return (
    <div
      className={`font-display min-h-screen flex flex-col transition-colors duration-300 ${
        darkMode
          ? "bg-background-dark text-text-dark"
          : "bg-background-light text-text-light"
      }`}
    >
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default App;
