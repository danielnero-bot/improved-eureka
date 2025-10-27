import React from "react";
import { MdCloudSync } from "react-icons/md";
import { BiCodeBlock } from "react-icons/bi";
import { FaPalette } from "react-icons/fa";
const Main = () => {
  return (
    <main>
      {/* Hero Section */}
      <section className="py-10">
        <div
          className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat rounded-xl items-start justify-end px-4 pb-10 sm:px-10"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuBRJUfDw1o7j4QSFBNpFzknkgHS6jfFfnP8DE4S5DTiAZ83SAZSxp8wMW-WEnUP0HEs9gB9hQ72wllB4O-VrMn1N7fpucVJODVOb8LQBnYIjNxIcLAz5L5QeE2WHrd9p9EovH2aSlnnx8RN_627TsYldHB3SSuFThRtBw4qAk_m_xchl5YnOOtPJ2heBijtua5f8xMlShQq1Sqh8fQ5o1XcNhpswU3caHWk1VmHblXg9_lfCAHz_Ewv--I1cvDWUSndJ6WEmNoMGapc")',
          }}
        >
          <div className="flex flex-col gap-2 text-left">
            <h1 className="text-white text-5xl font-black leading-tight">
              Launch Your Own Restaurant Website in Minutes
            </h1>
            <p className="text-white text-base">
              QuickPlate is a free, open-source tool for restaurant owners to
              create and manage their websites with ease.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            <button className="bg-primary text-[#111714] font-bold rounded-lg px-5 h-12 hover:scale-105 transition-transform">
              Get Started
            </button>
            <button className="bg-white dark:bg-gray-800 text-[#111714] dark:text-gray-200 font-bold rounded-lg px-5 h-12 hover:scale-105 transition-transform">
              View on GitHub
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="flex flex-col gap-10 px-4 py-10">
        <div>
          <h2 className="text-4xl font-black text-[#111714] dark:text-gray-100">
            Everything You Need, Nothing You Don’t
          </h2>
          <p className="text-[#648772] dark:text-gray-400 max-w-[720px]">
            QuickPlate is built with simplicity and power in mind, giving you
            the essential tools to launch your online presence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              icon: <BiCodeBlock />,
              title: "Free & Open Source",
              text: "Completely free to use, modify, and own. No hidden fees, ever.",
            },
            {
              icon: <MdCloudSync />,
              title: "Easy Firebase Integration",
              text: "Connect to your own Firebase project for easy setup and data management.",
            },
            {
              icon: <FaPalette />,
              title: "Customizable Design",
              text: "Tailor the look and feel to match your restaurant’s unique brand.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex flex-col gap-2 rounded-lg border border-[#dce5df] dark:border-gray-700 bg-white dark:bg-background-dark p-4"
            >
              <span className="material-symbols-outlined text-primary text-3xl">
                {item.icon}
              </span>
              <h3 className="text-[#111714] dark:text-gray-100 font-bold">
                {item.title}
              </h3>
              <p className="text-[#648772] dark:text-gray-400 text-sm">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-10">
        <h2 className="text-2xl font-bold text-[#111714] dark:text-gray-100 pb-3">
          How It Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              icon: <i class="fa-solid fa-code-fork"></i>,
              title: "1. Fork the Repository",
              text: "Get a copy of the project on your GitHub account in one click.",
            },
            {
              icon: <i class="fa-solid fa-gear"></i>,
              title: "2. Configure Your Details",
              text: "Easily add your menu, business hours, and contact information.",
            },
            {
              icon: <i class="ph ph-rocket-launch"></i>,
              title: "3. Deploy Your Website",
              text: "Go live with your new website for the world to see.",
            },
          ].map((step) => (
            <div
              key={step.title}
              className="flex flex-col gap-2 rounded-lg border border-[#dce5df] dark:border-gray-700 bg-white dark:bg-background-dark p-4"
            >
              <span className="material-symbols-outlined text-primary text-3xl">
                {step.icon}
              </span>
              <h3 className="text-[#111714] dark:text-gray-100 font-bold">
                {step.title}
              </h3>
              <p className="text-[#648772] dark:text-gray-400 text-sm">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-4 py-10">
        <div className="flex flex-col items-center justify-center gap-6 rounded-xl bg-primary/20 dark:bg-primary/30 p-8 text-center">
          <h2 className="text-3xl font-bold text-[#111714] dark:text-white">
            Ready to Build?
          </h2>
          <p className="text-base text-[#111714] dark:text-gray-200 max-w-md">
            Get started today by forking the project on GitHub. It’s completely
            free and takes just a few minutes to set up.
          </p>
          <button className="bg-primary text-[#111714] font-bold rounded-lg px-5 h-12 hover:scale-105 transition-transform">
            Fork on GitHub
          </button>
        </div>
      </section>
    </main>
  );
};

export default Main;
