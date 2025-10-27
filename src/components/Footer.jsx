import React from "react";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <footer className="mt-10 border-t border-gray-200 dark:border-gray-700 pt-8 pb-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4">
        <p className="text-sm text-[#648772] dark:text-gray-400">
          © 2025 QuickPlate. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <Link
            to="https://github.com/danielnero-bot/improved-eureka" target="_blank"
            className="text-[#648772] dark:text-gray-400 hover:text-primary transition-colors"
          >
            <i className="fa-brands fa-github text-xl"></i>
          </Link>
          <a
            href="#"
            className="text-[#648772] dark:text-gray-400 hover:text-primary transition-colors"
          >
            <i className="fa-brands fa-x-twitter text-xl"></i>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
