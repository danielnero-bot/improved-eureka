import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { MdCloudSync } from "react-icons/md";
import { BiCodeBlock } from "react-icons/bi";
import { FaPalette } from "react-icons/fa";
import { FiSettings, FiEdit3, FiSend, FiArrowRight } from "react-icons/fi";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function Main() {
  const containerRef = useRef(null);

  useGSAP(() => {
    // Hero Animation
    const tl = gsap.timeline();
    
    tl.fromTo(".hero-bg", 
      { scale: 1.1, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.5, ease: "power3.out" }
    ).fromTo(".hero-content > *",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power2.out" },
      "-=0.8"
    );

    // Features Section
    gsap.fromTo(".feature-header > *",
      { y: 30, opacity: 0 },
      { 
        y: 0, opacity: 1, duration: 0.6, stagger: 0.1, 
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".feature-section",
          start: "top 80%"
        }
      }
    );

    gsap.fromTo(".feature-card",
      { y: 40, opacity: 0, scale: 0.95 },
      { 
        y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.15, 
        ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: ".feature-grid",
          start: "top 85%"
        }
      }
    );

    // How It Works
    gsap.fromTo(".step-card",
      { x: -30, opacity: 0 },
      { 
        x: 0, opacity: 1, duration: 0.6, stagger: 0.2, 
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".steps-section",
          start: "top 80%"
        }
      }
    );

    // CTA Banner
    gsap.fromTo(".cta-banner",
      { opacity: 0, y: 50, scale: 0.95 },
      { 
        opacity: 1, y: 0, scale: 1, duration: 0.8, 
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".cta-section",
          start: "top 85%"
        }
      }
    );
  }, { scope: containerRef });

  return (
    <main 
      ref={containerRef} 
      className="overflow-hidden font-display mb-20 transition-colors duration-300 bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark"
    >
      
      {/* Hero Section */}
      <section className="relative pt-6 px-4 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto">
        <div className="hero-bg relative rounded-3xl overflow-hidden min-h-[85vh] flex items-center shadow-2xl">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80")',
            }}
          ></div>
          
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
          
          <div className="hero-content relative z-10 px-6 sm:px-12 md:px-20 max-w-4xl pt-20 pb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 mb-6 w-fit">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-white text-xs font-bold tracking-wider uppercase">QuickPlate Platform</span>
            </div>
            
            <h1 className="text-white text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] mb-6 drop-shadow-lg">
              Launch Your Restaurant <span className="text-primary">Online Today.</span>
            </h1>
            
            <p className="text-gray-200 text-lg md:text-xl font-medium mb-10 max-w-2xl leading-relaxed drop-shadow-md">
              The premier ecosystem to create, customize, and manage your restaurant's digital presence instantly. Built for scale, designed for beauty.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/getStarted"
                className="bg-primary text-black font-black text-lg rounded-xl px-8 py-4 flex justify-center items-center gap-2 hover:bg-green-500 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300"
              >
                Get Started Free <FiArrowRight className="text-xl" />
              </Link>
              <Link
                to="/login"
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-lg rounded-xl px-8 py-4 flex justify-center items-center gap-2 hover:bg-white/20 hover:shadow-xl transition-all duration-300"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="feature-section py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="feature-header flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-black tracking-widest uppercase text-primary mb-3">Premium Toolkit</h2>
          <h3 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">
            Everything You Need To Grow
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Focus on creating incredible culinary experiences. We handle your branding, menus, online orders, and customer engagement automatically.
          </p>
        </div>

        <div className="feature-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <BiCodeBlock />,
              title: "Enterprise Architecture",
              text: "Rock-solid open-source foundation. You retain complete ownership of your data, customers, and digital brand footprint.",
              color: "text-blue-500",
              bg: "bg-blue-50 dark:bg-blue-900/10"
            },
            {
              icon: <MdCloudSync />,
              title: "Lightning Fast Backend",
              text: "Powered by Supabase and real-time syncing. Watch orders roll in instantly and never miss a delivery request again.",
              color: "text-primary",
              bg: "bg-primary/10 dark:bg-primary/5"
            },
            {
              icon: <FaPalette />,
              title: "Aesthetic Excellence",
              text: "Say goodbye to generic templates. Customize typography, color palettes, and interactive elements to build a world-class brand.",
              color: "text-purple-500",
              bg: "bg-purple-50 dark:bg-purple-900/10"
            },
          ].map((item, index) => (
            <div
              key={index}
              className="feature-card group relative p-8 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-card-dark hover:shadow-2xl hover:shadow-black/5 dark:hover:shadow-black/20 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${item.bg} ${item.color} text-3xl mb-6 group-hover:scale-110 transition-transform duration-300 drop-shadow-sm`}>
                {item.icon}
              </div>
              
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {item.title}
              </h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="steps-section py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gray-50 dark:bg-[#1a2c23] rounded-[3rem] border border-gray-200 dark:border-gray-800 my-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-6 lg:ml-8">
            <h2 className="text-sm font-black tracking-widest uppercase text-primary">Simple Process</h2>
            <h3 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight">
              Live in Three Easy Steps
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
              We've stripped away the complexity of building a website. No code, no hosting setups, no confusing dashboards. Just your restaurant, presented beautifully.
            </p>
            
            <div className="flex flex-col gap-8 mt-4">
              {[
                {
                  step: "01",
                  title: "Create Account",
                  desc: "Sign up instantly. Access your personalized management portal immediately.",
                  icon: <FiSettings className="text-primary text-xl" />
                },
                {
                  step: "02",
                  title: "Design & Populate",
                  desc: "Upload menus, set your aesthetics, and define your delivery zones in minutes.",
                  icon: <FiEdit3 className="text-primary text-xl" />
                },
                {
                  step: "03",
                  title: "Receive Orders",
                  desc: "Click publish and watch the orders flow in. You're open for business digitally.",
                  icon: <FiSend className="text-primary text-xl" />
                }
              ].map((item, idx) => (
                <div key={idx} className="step-card flex gap-6 items-start group">
                  <div className="shrink-0 w-14 h-14 rounded-full bg-white dark:bg-background-dark border-2 border-primary/20 flex items-center justify-center shadow-md group-hover:border-primary transition-colors">
                    <span className="text-sm font-black text-gray-900 dark:text-white">{item.step}</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white mb-2">
                      {item.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative h-full min-h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800">
             <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80")',
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          </div>
        </div>
      </section>

      {/* Modern CTA Banner */}
      <section className="cta-section py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="cta-banner relative rounded-[3rem] overflow-hidden bg-neutral-900 dark:bg-card-dark shadow-2xl border border-gray-800 dark:border-gray-700 flex flex-col items-center justify-center p-12 md:p-20 text-center">
          
          {/* Decorative shapes */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/20 blur-[80px] rounded-full"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-500/20 blur-[80px] rounded-full"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6 tracking-tight">
              Ready to Upgrade Your <span className="text-primary italic">Restaurant?</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300 mb-10">
              Join thousands of restaurant owners managing their digital footprint with QuickPlate today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
              <Link
                to="/signupRestaurant"
                className="bg-primary text-black font-black text-lg rounded-full px-10 py-4 flex justify-center items-center hover:bg-green-500 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300"
              >
                Start Building Now
              </Link>
            </div>
          </div>
        </div>
      </section>
      
    </main>
  );
};

export default Main;
