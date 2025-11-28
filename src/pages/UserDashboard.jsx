import React from "react";
import { FiHeart, FiBell, FiSearch, FiMapPin, FiTruck } from "react-icons/fi";
import { MdFastfood, MdHistory } from "react-icons/md";
import UserSidebar from "../components/UserSidebar";

const QuickPlateDashboard = () => {
  return (
    <div className="relative flex min-h-screen w-full">
      {/* Desktop Sidebar */}
      <UserSidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border-light dark:border-border-dark bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-md px-4 md:px-8">
          <div className="relative w-full max-w-md">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light-secondary dark:text-dark-secondary" />
            <input
              className="w-full rounded-full border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark py-2 pl-10 pr-4 focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="Search for restaurants or dishes..."
              type="text"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative rounded-full p-2 text-text-light-secondary dark:text-dark-secondary hover:bg-gray-100 dark:hover:bg-white/10">
              <FiBell className="text-lg" />
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            <img
              alt="User profile"
              className="h-10 w-10 rounded-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuC2LyVfy6uW_KTx1m_sqlJrfn8MhaQTMJ493YKy7EA92tiXfxvclYzvGvFjnRl0mghzRnOt3S6lh7jWGaW-5m0N17Y86WJZlmi7zFSJlBkA0bB0pe-mAZ1sBKOjP7ALJxkqMgl7P6o7kaYsDf7lD6sQ2PMFKhh_a_aG0ZAZSUC7d0esfpbSlaW-jr2bHZ2Z9APfFxZxUZQ-VgeqtDk5nNKkgKuZ6-XuzLA_pRZsUQS7ogiapqd-ilb0RWyT8AaFhU1zNmSgFai0ht"
            />
          </div>
        </header>

        {/* Main Content Sections */}
        <main className="p-4 md:p-8 space-y-8">
          {/* Welcome Section */}
          <section className="rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-6">
            <h2 className="text-2xl font-bold">Welcome back, Jane!</h2>
            <p className="text-text-light-secondary dark:text-dark-secondary mt-1">
              Your last order from{" "}
              <span className="font-semibold text-primary">Pizza Palace</span>{" "}
              was delivered successfully.
            </p>
          </section>

          {/* Order Tracking Section */}
          <section className="rounded-xl border border-primary/50 dark:border-primary/40 bg-primary/10 dark:bg-primary/20 p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-text-light-primary dark:text-dark-primary">
                  Your order is on the way!
                </h3>
                <p className="text-text-light-secondary dark:text-dark-secondary mt-1">
                  Rider: <span className="font-semibold">Alex Ray</span> • ETA:{" "}
                  <span className="font-semibold">12 mins</span>
                </p>
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="w-full md:w-48 h-2 bg-primary/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: "75%" }}
                  ></div>
                </div>
                <button className="flex-shrink-0 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600">
                  <FiMapPin className="text-base" />
                  <span>Track</span>
                </button>
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <section>
            <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: MdFastfood, label: "Order Food", color: "primary" },
                { icon: FiTruck, label: "Track Order", color: "blue" },
                { icon: FiHeart, label: "Saved", color: "red" },
                { icon: MdHistory, label: "Past Orders", color: "purple" },
              ].map((action, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-4 text-center cursor-pointer hover:shadow-lg hover:border-primary dark:hover:border-primary transition-all"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full bg-${action.color}-100 dark:bg-${action.color}-900/20`}
                  >
                    <action.icon
                      className={`text-${action.color}-600 dark:text-${action.color}-400 text-2xl`}
                    />
                  </div>
                  <p className="font-semibold">{action.label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Orders */}
          <section>
            <h3 className="text-xl font-bold mb-4">Recent Orders</h3>
            <div className="space-y-4">
              {[
                {
                  name: "Pizza Palace",
                  items: "1x Pepperoni Pizza, 1x Coke",
                  date: "July 20, 2024",
                  price: "$25.50",
                  image:
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuDZSlpCLCemzXjm4wMo7GTJ93Fhgs9ViVHiUqQofWJmRKTbE8XvyvGmsBrpbUN-OkpdGByBZcuDRQ3pcZRH8pTAVsn4xtfPkfI5TmNbGhiZBnN4puUHJBfGndLYPCrkGfswYy2SnrjH4zNRwf_alIQFey6xtN2CbwX0bFohwcNIzqpSOKw7nnvYOx7GNPkNazYjHR01K0zKhV96EpOj0l57CThyBrl3ZX7u2dwT5yl7KWvZC0V5VHb8ilb-yBPzXDyIW0OH_8t8e9BW",
                },
                {
                  name: "Sushi House",
                  items: "2x California Roll, 1x Edamame",
                  date: "July 18, 2024",
                  price: "$32.00",
                  image:
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuAqHLQWZkBlLvmpKt-puHzBTnbMFt5ePkT6gqrD_9aCh1pWluPPn0WszFgGdaytLIaRzjTwy9Kcu5YWhBurBklSzUoZSDhpgdvSos_EzBPVG5XakDzKZmWQhG6nudUvpPW6DkarDpzyL7ZnWGWSVisAfMmcFl7mHHmRXFQq8V423zD5wR0QAnzTPXT5L27h-ojxQQZUW4goLgH_V1Jh5Pvzs6YqiEUKyJ_zsTpyAbS6YnfQLraXxsjEvC1o4j1ZJa3OOfLc8OMwL7pW",
                },
              ].map((order, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-4"
                >
                  <img
                    alt={`${order.name} Logo`}
                    className="h-16 w-16 rounded-lg object-cover"
                    src={order.image}
                  />
                  <div className="flex-1">
                    <h4 className="font-bold">{order.name}</h4>
                    <p className="text-sm text-text-light-secondary dark:text-dark-secondary">
                      {order.items}
                    </p>
                    <p className="text-sm text-text-light-secondary dark:text-dark-secondary mt-1">
                      {order.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{order.price}</p>
                    <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900 px-2 py-0.5 text-xs font-medium text-green-800 dark:text-green-200">
                      Delivered
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Saved Restaurants */}
          <section>
            <h3 className="text-xl font-bold mb-4">Your Saved Restaurants</h3>
            <div className="relative">
              <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                {[
                  {
                    name: "The Burger Joint",
                    category: "American • Burgers",
                    image:
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuAK-AL_sfEOjezncPDUoO0fyu6tLYqVrxDCixthad79YSnuh50Iz5mM0d4cx0dDTOZWDvQlM9CKkkNIK9gJSurXMDtU0YFm6gqxsk5IJRGaS3ph02-BCpIM0Br1wSYE8HKQQgyKMy7WUCSucmrS3dws574KLMcVqRpDqmFG85zkQbL8dmmb9RthIii6WCLs-yWTSXgqhnvBWTb8j0V4hz4HFb8WvLXmw8tg8xqaI8tS4gfIZtzS4PmMPCcA320jlagr9LSbl-dtGfOl",
                  },
                  {
                    name: "Taco Fiesta",
                    category: "Mexican • Tacos",
                    image:
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuBFdLUPBEHawDfQKvWEwlB1DL2BQq_s6LQmi8jredFheJiofN7_qUhRfOudqAKko4AwP9y58Gd8W9AJopbUx0HQoLsCnxRQTrVcfKpCbzNId5uCoBXQxX14fCtD2PZ6DFLTvApstvCe_vr8jxKtUfVq6lUz50NIQ-LGHiP6LeJuDjXS-9PZ6bPymSONw7dWk5JI3lVfP-T5XietKRaaJcACEw-57BmrPqQ2AQdxAcqklganUzcj0h1Ikzcmt_wlHaYDMvLWssCzi4LS",
                  },
                  {
                    name: "Pasta Bella",
                    category: "Italian • Pasta",
                    image:
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuDJzthGsErcSHmY9k2J4SeZl6QULvKeZwj-2_MF-fXRj8k_iR3-cB-luPdyt40kX8eatuQo14BZ_WjHqQLT8fNcbT_y1qV8Z0EgXC4opd8qN527DX908ovpqoIxpWodoKicpZom7Cqyv9Kvo9JTO_rw1FFrdrojd38v0pktmWFKfiDMRJ0w_GqtkYC8B0xcsXehpMbZofnaZUQeFjgD-A0hBL4HZEyq18ge-CCIjamGBqZH4O5l-pZ5hKyA9QTQC9GJlUyWXIKrMz3P",
                  },
                  {
                    name: "Vegan Vibes",
                    category: "Vegan • Salads",
                    image:
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuCg5fhS83mEgZ9jlLgvlVMjqOd4LMaELv4jweiDl0e20wRBq9v7pv7sJYhTgWJH69O-6n8APQ48q7Q6FOcwMd_Cy7UT6No4GLg_tDcQ4zm7aWVIGPNRtLyFRHMpNrWJSccpVa7vNKUzt-FKhyAB-qXispq_hYLad1T634n1v4auEumBlPzvpm4WnBA7ejnsbbjVF2Kh_4UgcKY1WI3XNNAMoaj5G-FXwDIFx-ScJUq0Q8-Eh-rC8DN0OoVfbG1Up3W09ufsYfLIRCB7",
                  },
                ].map((restaurant, index) => (
                  <div key={index} className="flex-shrink-0 w-64">
                    <div className="rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark overflow-hidden group">
                      <img
                        alt={restaurant.name}
                        className="h-32 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        src={restaurant.image}
                      />
                      <div className="p-4">
                        <h4 className="font-bold">{restaurant.name}</h4>
                        <p className="text-sm text-text-light-secondary dark:text-dark-secondary">
                          {restaurant.category}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default QuickPlateDashboard;
