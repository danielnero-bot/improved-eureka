import React from "react";

const RestaurantInfo = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-text-light dark:text-text-dark min-h-screen flex">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 w-64 -translate-x-full flex-col border-r border-border-light bg-card-light transition-transform duration-300 dark:border-border-dark dark:bg-card-dark lg:sticky lg:translate-x-0">
        <div className="flex h-16 items-center gap-3 border-b border-border-light px-6 dark:border-border-dark">
          <div className="size-8 text-primary">
            <svg
              fill="none"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_6_319)">
                <path
                  d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z"
                  fill="currentColor"
                ></path>
              </g>
              <defs>
                <clipPath id="clip0_6_319">
                  <rect fill="white" height="48" width="48"></rect>
                </clipPath>
              </defs>
            </svg>
          </div>
          <span className="text-lg font-bold">QuickPlate</span>
        </div>

        <nav className="flex flex-1 flex-col justify-between p-4">
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-text-muted-light transition-colors hover:text-text-light dark:text-text-muted-dark dark:hover:text-text-dark"
              >
                <span className="material-symbols-outlined">dashboard</span>
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-text-muted-light transition-colors hover:text-text-light dark:text-text-muted-dark dark:hover:text-text-dark"
              >
                <span className="material-symbols-outlined">
                  restaurant_menu
                </span>
                <span>Menu</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2 text-primary dark:bg-primary/20"
              >
                <span className="material-symbols-outlined">store</span>
                <span>Restaurant Info</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-text-muted-light transition-colors hover:text-text-light dark:text-text-muted-dark dark:hover:text-text-dark"
              >
                <span className="material-symbols-outlined">settings</span>
                <span>Settings</span>
              </a>
            </li>
          </ul>

          <ul>
            <li>
              <a
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-text-muted-light transition-colors hover:text-text-light dark:text-text-muted-dark dark:hover:text-text-dark"
              >
                <span className="material-symbols-outlined">logout</span>
                <span>Logout</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border-light bg-card-light px-4 dark:border-border-dark dark:bg-card-dark sm:px-6">
          <button className="rounded-full p-2 lg:hidden">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <div className="flex-1"></div>
          <div className="flex items-center gap-4">
            <button className="rounded-full p-2 text-text-muted-light transition-colors hover:text-text-light dark:text-text-muted-dark dark:hover:text-text-dark">
              <span className="material-symbols-outlined">dark_mode</span>
            </button>
            <button>
              <img
                alt="Restaurant Logo"
                className="h-9 w-9 rounded-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDk1BrWCbvpbdnfuePPAkZzhS9uvFkE-lttGSwMCHvgXty5_hW_KZYS2de_gkr4CDePJx0cfkitvysv9XyowI896_UW3VyVUflzd_VLJWogC4Ytxf7kvTAsCjws542tij4tcS6F3Wzv2tmXQNKgZnpEEBjoZv-Q_Xzf_aRoTYbX2K1HklVZnN8hpxVi5RfNryhZv4b3ebGH3Pb5vI5qE_x6_giRj_RoOe_fDA_4j987ideV3ZJSlfhcEwqCJvT_crbNPGoCDFBILbAb"
              />
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-4xl space-y-8">
            <div>
              <h1 className="text-3xl font-bold">Restaurant Information</h1>
              <p className="text-text-muted-light dark:text-text-muted-dark">
                Manage your restaurant's details and branding.
              </p>
            </div>

            <div className="rounded-2xl border border-border-light bg-card-light shadow-md dark:border-border-dark dark:bg-card-dark">
              <div className="flex flex-col items-center gap-6 border-b border-border-light p-6 dark:border-border-dark md:flex-row">
                <div className="flex-shrink-0">
                  <img
                    alt="Restaurant Logo"
                    className="h-32 w-32 rounded-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDk1BrWCbvpbdnfuePPAkZzhS9uvFkE-lttGSwMCHvgXty5_hW_KZYS2de_gkr4CDePJx0cfkitvysv9XyowI896_UW3VyVUflzd_VLJWogC4Ytxf7kvTAsCjws542tij4tcS6F3Wzv2tmXQNKgZnpEEBjoZv-Q_Xzf_aRoTYbX2K1HklVZnN8hpxVi5RfNryhZv4b3ebGH3Pb5vI5qE_x6_giRj_RoOe_fDA_4j987ideV3ZJSlfhcEwqCJvT_crbNPGoCDFBILbAb"
                  />
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-xl font-bold">Bella Italia</h2>
                  <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                    Authentic Italian cuisine since 1985.
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
                    <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90">
                      Upload New Logo
                    </button>
                    <button className="rounded-lg border border-border-light bg-transparent px-4 py-2 text-sm font-semibold text-text-light transition-colors hover:bg-background-light dark:border-border-dark dark:text-text-dark dark:hover:bg-card-dark/80">
                      Remove Logo
                    </button>
                  </div>
                </div>
              </div>

              <form className="space-y-6 p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-1 block text-sm font-medium text-text-muted-light dark:text-text-muted-dark"
                    >
                      Restaurant Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      defaultValue="Bella Italia"
                      className="block w-full rounded-lg border border-border-light bg-background-light px-3 py-2 text-sm focus:border-primary focus:ring-primary dark:border-border-dark dark:bg-background-dark dark:placeholder-text-muted-dark"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="location"
                      className="mb-1 block text-sm font-medium text-text-muted-light dark:text-text-muted-dark"
                    >
                      Location
                    </label>
                    <input
                      id="location"
                      type="text"
                      defaultValue="123 Main St, Anytown, USA"
                      className="block w-full rounded-lg border border-border-light bg-background-light px-3 py-2 text-sm focus:border-primary focus:ring-primary dark:border-border-dark dark:bg-background-dark dark:placeholder-text-muted-dark"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="mb-1 block text-sm font-medium text-text-muted-light dark:text-text-muted-dark"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows="3"
                    defaultValue="Authentic Italian cuisine passed down through generations. We use only the freshest ingredients to bring the taste of Italy to your table."
                    className="block w-full rounded-lg border border-border-light bg-background-light px-3 py-2 text-sm focus:border-primary focus:ring-primary dark:border-border-dark dark:bg-background-dark dark:placeholder-text-muted-dark"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-1 block text-sm font-medium text-text-muted-light dark:text-text-muted-dark"
                    >
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      defaultValue="(555) 123-4567"
                      className="block w-full rounded-lg border border-border-light bg-background-light px-3 py-2 text-sm focus:border-primary focus:ring-primary dark:border-border-dark dark:bg-background-dark dark:placeholder-text-muted-dark"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1 block text-sm font-medium text-text-muted-light dark:text-text-muted-dark"
                    >
                      Contact Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      defaultValue="contact@bellaitalia.com"
                      className="block w-full rounded-lg border border-border-light bg-background-light px-3 py-2 text-sm focus:border-primary focus:ring-primary dark:border-border-dark dark:bg-background-dark dark:placeholder-text-muted-dark"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    className="rounded-lg border border-border-light bg-transparent px-5 py-2.5 text-sm font-semibold text-text-light transition-colors hover:bg-background-light dark:border-border-dark dark:text-text-dark dark:hover:bg-card-dark/80"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RestaurantInfo;
