import React from "react";

const AdminDashboard = () => {
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
                className="flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2 text-primary dark:bg-primary/20"
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
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-text-muted-light transition-colors hover:text-text-light dark:text-text-muted-dark dark:hover:text-text-dark"
              >
                <span className="material-symbols-outlined">storefront</span>
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
        {/* Header */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border-light bg-card-light px-4 dark:border-border-dark dark:bg-card-dark sm:px-6 lg:justify-end">
          <button className="rounded-full p-2 lg:hidden">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <div className="flex items-center gap-4">
            <button className="relative rounded-full p-2 text-text-muted-light transition-colors hover:text-text-light dark:text-text-muted-dark dark:hover:text-text-dark">
              <span className="material-symbols-outlined">light_mode</span>
            </button>
            <div className="flex h-16 items-center gap-3 px-6">
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
              <span className="text-lg font-bold">Bella Italia</span>
            </div>
          </div>
        </header>

        {/* Main Section */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <div>
              <h1 className="text-3xl font-bold">Dashboard Overview</h1>
              <p className="text-text-muted-light dark:text-text-muted-dark">
                Welcome back, here's an overview of your restaurant's
                performance.
              </p>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl border border-border-light bg-card-light p-6 shadow-md dark:border-border-dark dark:bg-card-dark">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark">
                      Today's Revenue
                    </p>
                    <p className="text-3xl font-bold">$1,250</p>
                  </div>
                  <span className="material-symbols-outlined rounded-full bg-primary/10 p-2 text-primary">
                    payments
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-border-light bg-card-light p-6 shadow-md dark:border-border-dark dark:bg-card-dark">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark">
                      Today's Orders
                    </p>
                    <p className="text-3xl font-bold">68</p>
                  </div>
                  <span className="material-symbols-outlined rounded-full bg-primary/10 p-2 text-primary">
                    receipt_long
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-border-light bg-card-light p-6 shadow-md dark:border-border-dark dark:bg-card-dark">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark">
                      New Customers
                    </p>
                    <p className="text-3xl font-bold">12</p>
                  </div>
                  <span className="material-symbols-outlined rounded-full bg-primary/10 p-2 text-primary">
                    person_add
                  </span>
                </div>
              </div>
            </div>

            {/* Analytics Placeholder */}
            <div className="rounded-2xl border border-border-light bg-card-light p-6 text-center shadow-md dark:border-border-dark dark:bg-card-dark">
              <div className="flex flex-col items-center justify-center space-y-4 py-16">
                <span className="material-symbols-outlined text-6xl text-text-muted-light dark:text-text-muted-dark">
                  analytics
                </span>
                <h2 className="text-2xl font-bold">Order Analytics</h2>
                <p className="max-w-md text-text-muted-light dark:text-text-muted-dark">
                  Detailed charts and reports for your order history will be
                  displayed here. This feature is coming soon!
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
