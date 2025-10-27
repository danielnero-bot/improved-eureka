import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Main from "./components/Main";

const App = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-[#111714] dark:text-gray-200 min-h-screen flex flex-col p-8">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default App;
