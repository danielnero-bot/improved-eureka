import React from "react";

const Dashboard = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-[#111714] dark:text-gray-200">
      <div className="flex min-h-screen w-full flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="sticky top-0 z-20 flex h-16 w-full flex-shrink-0 flex-row items-center justify-between border-b border-border-light bg-card-light px-4 dark:border-border-dark dark:bg-card-dark lg:h-screen lg:w-64 lg:flex-col lg:items-stretch lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-4 text-primary p-4">
            <div className="size-8">
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
            <h2 className="text-[#111714] dark:text-gray-100 text-lg font-bold leading-tight tracking-[-0.015em]">
              QuickPlate
            </h2>
          </div>

          {/* Sidebar Nav */}
          <nav className="hidden w-full px-2 lg:block">
            <ul className="flex flex-col gap-2">
              {[
                { name: "Dashboard", icon: "dashboard" },
                { name: "Menu", icon: "restaurant_menu" },
                { name: "Orders", icon: "receipt_long" },
                { name: "Settings", icon: "settings" },
              ].map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      item.name === "Dashboard"
                        ? "bg-primary/10 text-primary dark:bg-primary/20"
                        : "text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button className="rounded-full lg:hidden">
            <span className="material-symbols-outlined">menu</span>
          </button>

          {/* Sidebar User */}
          <div className="hidden lg:block p-4 mt-auto">
            <div className="flex items-center gap-3">
              <img
                alt="User Avatar"
                className="h-10 w-10 rounded-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfkxg6ifPj4QRPWLZb2zVK5Cucw1ThX5a4qVIKxhlq2DTKYTSpZBivFOgXAR12cItnVEdZ8xby25hTsvUIhFww4pF_BTCdv3_MKSqcE9Z5XqpqtDjHooGF69-iXqraDnioLuW9Viip2XiuCLRPD0KUo7AuLxB56RAGVK_0vF_9_hixoY596zRgDLTkDgkzCVXB6iWVIgAIA1EaclIpw5DAc5vT5Iph35r-XAtpie3UuCr-FeTPIqyxFEk2s04IEVjNOGpH7qJxks_1"
              />
              <div>
                <p className="text-sm font-semibold text-[#111714] dark:text-gray-100">
                  Alex Doe
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Owner
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex w-full flex-col">
          {/* Topbar */}
          <header className="sticky top-0 z-10 hidden h-16 w-full items-center justify-end border-b border-border-light bg-card-light px-6 dark:border-border-dark dark:bg-card-dark lg:flex">
            <button className="relative rounded-full">
              <img
                alt="User Avatar"
                className="h-10 w-10 rounded-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVLSxgRYti_cekGDdfTG-N_aHj1N86JWXgItTZSsDFcyZMgDcuZNCLqTjztczwFeF3y_MkH6deQ4yR6sKN77lhNuVVnyhPPj4GuqGcZE7rBmz6a8nQf7sAfUChAjeMqg1qtZT8TVUC33sq1f5CrMAr6EkQY3nnhiuz5XdIv-h_gWKeGiRhLN905NqBZ0skBPnjfD9UoeXtOLllOQBvVFGnpMSJpPhfnkp-WkkvK_Fmog4CjYyP1k-YftUCTmvVXzk1tqREwg406M6p"
              />
              <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-white dark:ring-card-dark"></span>
            </button>
          </header>

          {/* Dashboard Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
              {/* Stats Section */}
              <section>
                <h1 className="mb-4 text-2xl font-bold text-[#111714] dark:text-gray-100">
                  Dashboard
                </h1>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      title: "Total Orders",
                      value: "1,250",
                      icon: "shopping_cart",
                      desc: "+12% from last month",
                      color: "text-green-500",
                    },
                    {
                      title: "Total Revenue",
                      value: "$28,450.75",
                      icon: "attach_money",
                      desc: "+8.5% from last month",
                      color: "text-green-500",
                    },
                    {
                      title: "Menu Dishes",
                      value: "42",
                      icon: "ramen_dining",
                      desc: "Active dishes",
                      color: "text-gray-500",
                    },
                  ].map((card, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-border-light bg-card-light p-5 dark:border-border-dark dark:bg-card-dark"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          {card.title}
                        </h3>
                        <span className="material-symbols-outlined text-gray-400 dark:text-gray-500">
                          {card.icon}
                        </span>
                      </div>
                      <div className="mt-4">
                        <p className="text-3xl font-bold text-[#111714] dark:text-gray-100">
                          {card.value}
                        </p>
                        <p className={`text-xs ${card.color}`}>{card.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Orders Table */}
              <section>
                <h2 className="mb-4 text-xl font-bold text-[#111714] dark:text-gray-100">
                  Recent Orders
                </h2>
                <div className="overflow-hidden rounded-xl border border-border-light bg-card-light dark:border-border-dark dark:bg-card-dark">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border-light text-sm dark:divide-border-dark">
                      <thead className="bg-gray-50 dark:bg-black/20">
                        <tr>
                          {[
                            "Order ID",
                            "Customer",
                            "Date",
                            "Amount",
                            "Status",
                          ].map((h, i) => (
                            <th
                              key={i}
                              className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-light dark:divide-border-dark">
                        {[
                          {
                            id: "#QP-84321",
                            name: "Jane Cooper",
                            date: "2024-05-20",
                            amount: "$42.50",
                            status: "Delivered",
                            color: "green",
                          },
                          {
                            id: "#QP-84320",
                            name: "John Smith",
                            date: "2024-05-20",
                            amount: "$25.00",
                            status: "Delivered",
                            color: "green",
                          },
                          {
                            id: "#QP-84319",
                            name: "Emily White",
                            date: "2024-05-19",
                            amount: "$55.10",
                            status: "Preparing",
                            color: "yellow",
                          },
                          {
                            id: "#QP-84318",
                            name: "Michael Brown",
                            date: "2024-05-19",
                            amount: "$18.90",
                            status: "Cancelled",
                            color: "red",
                          },
                          {
                            id: "#QP-84317",
                            name: "Sarah Jones",
                            date: "2024-05-18",
                            amount: "$72.00",
                            status: "Delivered",
                            color: "green",
                          },
                        ].map((order, i) => (
                          <tr key={i}>
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-[#111714] dark:text-gray-100">
                              {order.id}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-gray-600 dark:text-gray-300">
                              {order.name}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-gray-600 dark:text-gray-300">
                              {order.date}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-gray-600 dark:text-gray-300">
                              {order.amount}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              <span
                                className={`inline-flex items-center rounded-full bg-${order.color}-100 px-2.5 py-0.5 text-xs font-medium text-${order.color}-800 dark:bg-${order.color}-900 dark:text-${order.color}-300`}
                              >
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
