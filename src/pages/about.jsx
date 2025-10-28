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

            {/* ====== CONTRIBUTORS ====== */}
            <section className="px-4 py-16 sm:py-20 md:py-24 text-center">
              <div className="mx-auto max-w-3xl">
                <h2 className="text-3xl font-bold tracking-tight text-[#111714] dark:text-gray-100 sm:text-4xl">
                  Meet the Contributors
                </h2>
                <p className="mt-4 text-base leading-relaxed text-[#648772] dark:text-gray-400 sm:text-lg">
                  QuickPlate is powered by a passionate global community —
                  developers, designers, and creators who believe in building
                  tools that help local businesses thrive.
                </p>
              </div>

              <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2">
                {[
                  {
                    name: "Daniel Oghenero",
                    role: "Lead Developer",
                    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB51QXV_OheVaxfs3cOADp-xXwAXw46m8KgPot13ubViAUQZhBeiZX7b9jNjawOrvBUTs5roeBYoXrgmupCzc4mLVKaqx8VvAM3yO3j4E3pSrmYJ8KuZxNuqEeNwy0Ud9A_342TWTzhVCuXtC94-OJB6q0c_wgTA8rIGuN3WJez0lGG9YPwp-5fwBl6Zngl2YO9uOnD6AQGVilDVHrCuI7cX4dSCDW9omYGoYHOs6Yy3D8sKsY_tlUVXQf9jQb6J1BrgvC6z6u5xlN0",
                  },
                  {
                    name: "Favour Benson",
                    role: "Co-Founder",
                    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCj_fPjBvjG2XQxj9BC7J2KN3BGSuiGZjxWbx2kTzmfKPqFU-Ow7VuQShmTipwKJuhTbwhfkY021y8qCVkEQ4DjAyDgV0KM-WjVB7VtP2s7FdL2CsC9r8bj0ZQoC5dLtFKHFrG1cx9soFm4n0liufg-bT4YYMhhMC85Gdt6C1nMph_w59m_sUPKz3PaFxar2m0Z14BJjZsxYlKFWB1DhTzQgId2-Z9Rv1Kyz-_wzhEx_eWRH1Pkd8fyiM3xHlrQfk6oSI3hFm5k8S6O",
                  },
                  {
                    name: "Tolu Bakare",
                    role: "Backend Engineer",
                    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCIpMtzVpAdT5Y6buzPwQ4XpVq2glY4YMi6cCVhnvsuPVQBXYE0l1eK_-tNgypBsJgBHDtFNKyb03BeNsWESJr4-Q2ZnRX79TOlIR1BxMDBANh0bS4IZSFmeOMxu5y8Mqdcsow7O1_K0_ZKCT5TkT5_oTyAx6M5vqBfHkCuAOH2vjLR87yr8TNAslwvbUTUOoM-w4xXQQEqyhAh9YmgJPcX48MeC7AkbS4RxqEM7lJ-SRQtwLXSWWCTDxAvsdnHuRwO6PX_7RvZaq0l",
                  },
                  {
                    name: "Sarah Lee",
                    role: "Community Manager",
                    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDKCSz-gN5CSTI4iQ6xFYD1T8LG-Vs44Numj5RChXqmyNoH8x9mPkjara3seLdZEQhwjrH5ehYlq6MTnEtpiEa4HInWqDfEejSMzaM8DtNNpuGESLX9po-oOdylFxgvvgoedDne3hHxI02sXK4-8XafUoeyBDwlpv-C5ucWo7q4CHa2N0MXaWZnR-NQGUfVsYthqOKGARg8VHXukrOKvpm25CZY-hRPEP8k_dZDiM-NAjFa4MygBesVcqDrKq3_KBh4WAgsJsZdp-5q",
                  },
                ].map((contributor) => (
                  <div key={contributor.name} className="text-center">
                    <img
                      alt={contributor.name}
                      src={contributor.img}
                      className="mx-auto h-24 w-24 rounded-full object-cover"
                    />
                    <h3 className="mt-4 text-lg font-bold text-[#111714] dark:text-gray-100">
                      {contributor.name}
                    </h3>
                    <p className="text-sm text-primary">{contributor.role}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default About;
