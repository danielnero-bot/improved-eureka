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
                Our Mission: Your Restaurant&apos;s Success
              </h1>
              <p className="mt-4 text-base leading-relaxed text-[#648772] dark:text-gray-400 sm:text-lg">
                We believe every restaurant, big or small, deserves a beautiful,
                professional online presence without the hefty price tag.
                QuickPlate was born from a simple idea: to empower local
                restaurant owners with the tools they need to thrive in the
                digital world.
              </p>
            </section>

            {/* ====== STORY & OPEN SOURCE SECTIONS ====== */}
            <section className="grid grid-cols-1 gap-12 px-4 md:grid-cols-2 md:gap-16">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-[#111714] dark:text-gray-100">
                  Our Story
                </h2>
                <p className="text-[#648772] dark:text-gray-400">
                  QuickPlate started as a passion project by a small team of
                  developers who loved both food and technology. We saw our
                  favorite local eateries struggling with outdated websites or
                  no online presence at all. High costs and technical complexity
                  were major barriers. We decided to build a solution that was
                  simple, powerful, and completely free.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-[#111714] dark:text-gray-100">
                  Why Open Source?
                </h2>
                <p className="text-[#648772] dark:text-gray-400">
                  Making QuickPlate open source was a natural choice. We want to
                  foster a community of collaboration where developers and
                  restaurant owners can contribute, improve, and adapt the
                  platform for everyone&apos;s benefit. Transparency and
                  community are at the heart of what we do. By being open
                  source, we ensure QuickPlate will always be free and
                  accessible to all.
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
                  QuickPlate is built and maintained by a dedicated community of
                  volunteers. We&apos;re proud to have contributors from all
                  over the world.
                </p>
              </div>

              <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {[
                  {
                    name: "Daniel Oghenero",
                    role: "Lead Developer",
                    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB51QXV_OheVaxfs3cOADp-xXwAXw46m8KgPot13ubViAUQZhBeiZX7b9jNjawOrvBUTs5roeBYoXrgmupCzc4mLVKaqx8VvAM3yO3j4E3pSrmYJ8KuZxNuqEeNwy0Ud9A_342TWTzhVCuXtC94-OJB6q0c_wgTA8rIGuN3WJez0lGG9YPwp-5fwBl6Zngl2YO9uOnD6AQGVilDVHrCuI7cX4dSCDW9omYGoYHOs6Yy3D8sKsY_tlUVXQf9jQb6J1BrgvC6z6u5xlN0",
                  },
                  {
                    name: "Favour Benson",
                    role: "Co Founder",
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
