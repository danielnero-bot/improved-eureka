import React from "react";
import {
  FaGithub,
  FaXTwitter,
  FaFacebook,
  FaWhatsapp,
  FaLinkedinIn,
  FaInstagram
} from "react-icons/fa6";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <footer className="mt-10 border-t border-gray-200 dark:border-gray-700 pt-8 pb-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4">
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-[#648772] dark:text-gray-400">
          <p>
            © {new Date().getFullYear()} QuickPlate. All rights reserved.
          </p>
          <Link
            to="/privacy"
            className="hover:text-primary transition-colors"
          >
            Privacy
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="https://github.com/danielnero-bot/improved-eureka"
            target="_blank"
            className="text-[#648772] dark:text-gray-400 hover:text-primary transition-colors"
          >
            <FaGithub />
          </Link>
          <a
            href="https://x.com/getquickplate"
            target="_blank"
            className="text-[#648772] dark:text-gray-400 hover:text-primary transition-colors"
          >
            <FaXTwitter />
          </a>
          <a
            href="https://web.facebook.com/people/Daniel-Nero/61573024959905/#"
            target="_blank"
            className="text-[#648772] dark:text-gray-400 hover:text-primary transition-colors"
          >
            <FaFacebook />
          </a>
          <a
            href="#"
            target="_blank"
            className="text-[#648772] dark:text-gray-400 hover:text-primary transition-colors"
          >
            <FaWhatsapp />
          </a>
          <a
            href="https://www.linkedin.com/in/daniel-oghenero-b23937388?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
            target="_blank"
            className="text-[#648772] dark:text-gray-400 hover:text-primary transition-colors"
          >
            <FaLinkedinIn />
          </a>
          <a
            href="https://www.instagram.com/getquickplate?igsh=bTM5bTl6aXJ2OGNt"
            target="_blank"
            className="text-[#648772] dark:text-gray-400 hover:text-primary transition-colors"
          >
            <FaInstagram />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
