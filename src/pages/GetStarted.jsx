import React, { useRef } from "react";
import { FaRegUser, FaCheck } from "react-icons/fa";
import { GiForkKnifeSpoon } from "react-icons/gi";
import { IoMdArrowRoundBack } from "react-icons/io";
import {
  MdRestaurantMenu,
  MdDashboard,
  MdShoppingCart,
  MdTrendingUp,
} from "react-icons/md";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const JoinQuickPlate = () => {
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      ".back-btn",
      { x: -20, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
    );

    gsap.fromTo(
      ".heading-anim",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.2 }
    );

    gsap.fromTo(
      ".role-card",
      { scale: 0.95, opacity: 0, y: 20 },
      {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".role-cards-container",
          start: "top 85%",
        },
      }
    );

    const benefitTimeline = gsap.timeline({
      scrollTrigger: { trigger: ".benefits-container", start: "top 85%" }
    });
    
    benefitTimeline.fromTo(".benefits-header", 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
    ).fromTo(".benefit-card", 
      { scale: 0.95, opacity: 0, y: 20 },
      { scale: 1, opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }, 
      "-=0.3"
    );

    gsap.fromTo(".footer-anim", 
      { y: 20, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.6, 
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".footer-anim",
          start: "top 95%",
        }
      }
    );
  }, { scope: containerRef });

  const userFeatures = [
    "Browse restaurants and menus",
    "Order food with ease",
    "Track your orders in real-time",
    "Save favorite restaurants",
    "Manage delivery addresses",
  ];

  const restaurantFeatures = [
    "Create your restaurant profile",
    "Manage menus and pricing",
    "Track orders and customers",
    "Upload photos and branding",
    "Analytics and insights",
  ];

  const benefits = [
    {
      icon: <MdRestaurantMenu className="text-2xl" />,
      title: "Easy Menu Management",
      description:
        "Add, edit, and organize your menu items with a simple interface",
    },
    {
      icon: <MdDashboard className="text-2xl" />,
      title: "Powerful Dashboard",
      description:
        "Monitor your business with real-time analytics and insights",
    },
    {
      icon: <MdShoppingCart className="text-2xl" />,
      title: "Seamless Ordering",
      description: "Customers can order directly from your digital menu",
    },
    {
      icon: <MdTrendingUp className="text-2xl" />,
      title: "Grow Your Business",
      description: "Reach more customers and increase your online presence",
    },
  ];

  return (
    <div ref={containerRef} className="bg-background-light dark:bg-background-dark font-display text-gray-900 dark:text-gray-100 min-h-screen transition-colors duration-300">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back Button */}
        <Link
          to="/"
          className="back-btn inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white rounded-full px-4 py-2 mb-8 transition-all hover:scale-105 shadow-md"
        >
          <IoMdArrowRoundBack />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>

        <main className="flex flex-col items-center gap-12">
          {/* Page Heading */}
          <div className="heading-anim flex flex-col items-center gap-4 text-center max-w-3xl">
            <h1 className="text-4xl font-black tracking-tight text-text-light dark:text-white sm:text-5xl md:text-6xl">
              Join QuickPlate
            </h1>
            <p className="text-lg text-text-secondary-light dark:text-gray-400 md:text-xl">
              Choose your path and start your journey with QuickPlate today.
              Whether you're looking to order food or grow your restaurant
              business, we've got you covered.
            </p>
          </div>

          {/* Role Selection Cards */}
          <div className="role-cards-container grid w-full grid-cols-1 gap-8 lg:grid-cols-2 max-w-5xl">
            {/* Card 1: User */}
            <div className="role-card">
              <Link
                to="/signupUser"
                className="group flex flex-col h-full rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-8 shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl hover:border-primary/50 dark:hover:border-primary/70"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary transition-all group-hover:bg-primary group-hover:text-white group-hover:scale-110">
                    <FaRegUser className="text-2xl" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-text-light dark:text-white">
                      I'm a Customer
                    </h2>
                    <p className="text-sm text-primary font-medium">
                      Order delicious food
                    </p>
                  </div>
                </div>

                <p className="text-text-secondary-light dark:text-gray-400 mb-6">
                  Discover amazing restaurants, browse menus, and order your
                  favorite meals with just a few clicks.
                </p>

                <div className="space-y-3 mb-6">
                  {userFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                        <FaCheck className="text-primary text-xs" />
                      </div>
                      <span className="text-sm text-text-secondary-light dark:text-gray-400">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-4">
                  <div className="inline-flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                    <span>Get Started</span>
                    <span className="group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Card 2: Restaurant Owner */}
            <div className="role-card">
              <Link
                to="/signupRestaurant"
                className="group flex flex-col h-full rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-8 shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl hover:border-primary/50 dark:hover:border-primary/70"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary transition-all group-hover:bg-primary group-hover:text-white group-hover:scale-110">
                    <GiForkKnifeSpoon className="text-2xl" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-text-light dark:text-white">
                      I'm a Restaurant
                    </h2>
                    <p className="text-sm text-primary font-medium">
                      Grow your business
                    </p>
                  </div>
                </div>

                <p className="text-text-secondary-light dark:text-gray-400 mb-6">
                  Create your digital presence, manage your menu, and reach more
                  customers with our powerful platform.
                </p>

                <div className="space-y-3 mb-6">
                  {restaurantFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                        <FaCheck className="text-primary text-xs" />
                      </div>
                      <span className="text-sm text-text-secondary-light dark:text-gray-400">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-4">
                  <div className="inline-flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                    <span>Get Started</span>
                    <span className="group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="benefits-container w-full max-w-5xl">
            <div className="benefits-header text-center mb-8">
              <h2 className="text-3xl font-bold text-text-light dark:text-white mb-3">
                Why Choose QuickPlate?
              </h2>
              <p className="text-text-secondary-light dark:text-gray-400">
                Built with modern technology to help your business thrive
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="benefit-card bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-xl p-6 text-center transition-all hover:shadow-lg"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg text-primary mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="font-bold text-text-light dark:text-white mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-text-secondary-light dark:text-gray-400">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="footer-anim pt-8 text-center">
            <p className="text-sm text-text-secondary-light dark:text-gray-500">
              Powered by QuickPlate Open Source • Built with ❤️ for the food
              industry
            </p>
            <p className="text-xs text-text-secondary-light dark:text-gray-500 mt-2">
              Licensed under{" "}
              <Link
                to="/license"
                className="text-primary hover:underline font-medium"
              >
                MIT License
              </Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default JoinQuickPlate;
