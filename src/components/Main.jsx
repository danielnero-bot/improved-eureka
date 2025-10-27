import React from "react";
import { MdCloudSync } from "react-icons/md";
import { BiCodeBlock } from "react-icons/bi";
import { FaPalette } from "react-icons/fa";
import { FiSettings, FiEdit3, FiSend } from "react-icons/fi";


function Main () {
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
              Launch Your Restaurant Website in Minutes
            </h1>
            <p className="text-white text-base">
              QuickPlate lets you easily create, edit, and manage your
              restaurant website — all from one simple dashboard.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            <button className="bg-primary text-[#111714] font-bold rounded-lg px-5 h-12 hover:scale-105 transition-transform">
              Get Started Free
            </button>
            <button className="bg-white dark:bg-gray-800 text-[#111714] dark:text-gray-200 font-bold rounded-lg px-5 h-12 hover:scale-105 transition-transform">
              Go to Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="flex flex-col gap-10 px-4 py-10">
        <div>
          <h2 className="text-4xl font-black text-[#111714] dark:text-gray-100">
            Everything You Need to Run Your Online Restaurant
          </h2>
          <p className="text-[#648772] dark:text-gray-400 max-w-[720px]">
            QuickPlate combines powerful tools and an intuitive dashboard so you
            can focus on serving great food while we handle your website.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              icon: <BiCodeBlock />,
              title: "Free & Open Source",
              text: "Completely free to use and customize. You control your data and your brand.",
            },
            {
              icon: <MdCloudSync />,
              title: "Realtime Firebase Backend",
              text: "Securely store your restaurant data in your own Firebase project.",
            },
            {
              icon: <FaPalette />,
              title: "Beautiful & Customizable",
              text: "Personalize colors, fonts, and layout to match your restaurant’s identity.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex flex-col gap-2 rounded-lg border border-[#dce5df] dark:border-gray-700 bg-white dark:bg-background-dark p-4"
            >
              <span className="text-primary text-3xl">{item.icon}</span>
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
              icon: <FiSettings />,
              title: "1. Create Your Account",
              text: "Sign up for free and access your QuickPlate dashboard instantly.",
            },
            {
              icon: <FiEdit3 />,
              title: "2. Add Your Restaurant Details",
              text: "Upload your menu, set business hours, and customize your website content.",
            },
            {
              icon: <FiSend />,
              title: "3. Go Live Instantly",
              text: "Publish your restaurant website with one click — no coding required.",
            },
          ].map((step) => (
            <div
              key={step.title}
              className="flex flex-col gap-2 rounded-lg border border-[#dce5df] dark:border-gray-700 bg-white dark:bg-background-dark p-4"
            >
              <span className="text-primary text-3xl">{step.icon}</span>
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
            Ready to Build Your Restaurant Website?
          </h2>
          <p className="text-base text-[#111714] dark:text-gray-200 max-w-md">
            Manage your menu, orders, and branding easily — all from your
            dashboard. Get started in just minutes.
          </p>
          <button className="bg-primary text-[#111714] font-bold rounded-lg px-5 h-12 hover:scale-105 transition-transform">
            Go to Dashboard
          </button>
        </div>
      </section>
    </main>
  );
};

export default Main;
