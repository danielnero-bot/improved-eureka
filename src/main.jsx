import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import About from "./pages/about";
import Main from "./components/Main";
import Landing from "./pages/docs";
import Contact from "./pages/contact";
import "./index.css";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        {/* App acts as the layout (with Navbar & Footer) */}
        <Route path="/" element={<App />}>
          {/* Index route (home page) */}
          <Route index element={<Main />} />
          {/* Other pages */}
          <Route path="/about" element={<About />} />
          <Route path="/docs" element={<Landing />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
