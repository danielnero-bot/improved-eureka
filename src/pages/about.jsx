import React from "react";

const About = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-[#111714] dark:text-gray-200">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        {/* ====== MAIN CONTENT ====== */}
        <main className="flex flex-col flex-1 px-4 sm:px-8 md:px-10 lg:px-20 xl:px-40 py-5">
          <div className="mx-auto w-full max-w-[960px] flex-1">
            {/* ====== HERO SECTION ====== */}
            <section className="px-4 py-12 sm:py-16 md:py-20 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-[#111714] dark:text-gray-100 sm:text-4xl md:text-5xl">
                Empowering Restaurants to Go Digital — Effortlessly
              </h1>
              <p className="mt-4 text-base leading-relaxed text-[#648772] dark:text-gray-400 sm:text-lg">
                QuickPlate helps restaurant owners build, customize, and manage
                their websites — all from one intuitive dashboard. No coding, no
                hosting fees, just pure freedom to create and grow your brand
                online.
              </p>
            </section>

            {/* ====== STORY & PURPOSE SECTIONS ====== */}
            <section className="grid grid-cols-1 gap-12 px-4 md:grid-cols-2 md:gap-16">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-[#111714] dark:text-gray-100">
                  Our Story
                </h2>
                <p className="text-[#648772] dark:text-gray-400">
                  QuickPlate began as a project built to solve a simple problem:
                  many restaurants wanted a professional online presence, but
                  lacked the time or technical know-how. We envisioned a
                  platform that gave them control — a place to create menus,
                  upload photos, and manage everything from one easy dashboard.
                </p>
                <p className="text-[#648772] dark:text-gray-400">
                  Today, that vision powers local restaurants, cafés, and food
                  brands all over the world — all built on open technology and a
                  community-driven spirit.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-[#111714] dark:text-gray-100">
                  Why We’re Open Source
                </h2>
                <p className="text-[#648772] dark:text-gray-400">
                  We believe technology should empower, not exclude. That’s why
                  QuickPlate is free and open source — anyone can use it, extend
                  it, and make it better. Our code, our process, and our mission
                  are transparent because collaboration fuels innovation.
                </p>
                <p className="text-[#648772] dark:text-gray-400">
                  By being open source, we invite developers, designers, and
                  restaurant owners alike to join us in building the future of
                  digital food experiences.
                </p>
              </div>
            </section>

            {/* ====== CONTRIBUTOR ====== */}
            <section className="px-4 py-16 sm:py-20 md:py-24 text-center">
              <div className="mx-auto max-w-3xl">
                <h2 className="text-3xl font-bold tracking-tight text-[#111714] dark:text-gray-100 sm:text-4xl">
                  Meet the Creator
                </h2>
                <p className="mt-4 text-base leading-relaxed text-[#648772] dark:text-gray-400 sm:text-lg">
                  QuickPlate is built and maintained by a passionate developer
                  who believes in creating tools that help local businesses
                  thrive.
                </p>
              </div>

              <div className="mt-12 flex justify-center">
                <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-xl p-8 max-w-sm transition-colors duration-300">
                  <img
                    alt="Daniel Oghenero"
                    src="https://i.pinimg.com/1200x/0f/ae/04/0fae04c2b8cd52e0ee6b3fb4c254bb21.jpg"
                    className="mx-auto h-32 w-32 rounded-full object-cover border-4 border-primary/20"
                  />
                  <h3 className="mt-6 text-xl font-bold text-[#111714] dark:text-gray-100">
                    Daniel Oghenero
                  </h3>
                  <p className="mt-2 text-sm font-medium text-primary">
                    Lead Developer & Creator
                  </p>
                  <p className="mt-3 text-sm text-[#648772] dark:text-gray-400">
                    Building innovative solutions for the food industry
                  </p>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default About;
