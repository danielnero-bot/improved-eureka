import React from "react";
import {
  FiHome,
  FiShoppingBag,
  FiUser,
  FiSettings,
  FiLogOut,
  FiMapPin,
  FiPhone,
  FiClock,
  FiTruck,
  FiHeart,
  FiStar,
} from "react-icons/fi";
import {
  MdOutlineRestaurantMenu,
  MdOutlineDeliveryDining,
  MdOutlineLocationOn,
  MdOutlineSchedule,
  MdOutlineCall,
} from "react-icons/md";
import { IoStar, IoStarHalfOutline, IoStarOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const UserRestaurantDetailsPage = () => {
  const menuItems = [
    {
      name: "Spaghetti Bolognese",
      price: "$18.50",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCv1wSv8uiMmyF12vV_Dii9MGlGfQjWc3n5OxPCdfyPrfSb32VWfWKDKJnbaOxX-YmOKf73MIe6H76iEeF_c0gAeYnp-Y4ILRqzHqpkXGYVi7vQpKg5etUyKKEqZTiRRlE7UePlzf54_2f9xd0iUC6su56uVykDrpN9ShQF12uOSN4qlO8Jf_mrIjiGcFsuW-ZbyYwPStqyM5xd7pTw_NAvpOqpxREyxcs47kmlXElMpCcVaseKMPFOML7cGRObV1JgZyg9KekJWd1j",
      alt: "A plate of classic spaghetti bolognese",
    },
    {
      name: "Margherita Pizza",
      price: "$22.00",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAjmE6SH8biM-lsrfEhLnEY_dr81SY0QOZzQl008-72065-0DQzXiKUfPYDMcH8C_k2jcSjMuoTIH8cOthVYAq7xtNWk4u7PK6HZ_ErrAEvYJqCpQ8uxtkKUnRQytUYg0-EBKL4hmOEX5ZazssjCozZ6NmSKH2R0zT70HhdfjuerQBxcLH4vGkLUpnKEJrPSz2r19wzgwm2b4l5nuGW83K8y1S8vCFAYfVDF8o7S7Xchm70zeErseTxBJeDG_4Iq86l3G5yN55gSdti",
      alt: "Margherita pizza with fresh basil",
    },
    {
      name: "Fettuccine Alfredo",
      price: "$19.00",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBDwoCS38oLsM_JQnR50PTZSpSworf1NHPu-W62zHpzq-Y2G7sPP15O9eHwlpqFx3EzvIosO286Me1PaEABZVmDXc4nkDLUExQAdQQf1v7fyVvVpIaOzJA-Pq0w36vbtu_MTPvbjVzt2l4Br61E5Ttrzf4lAZ0_41_HUfO1nS_qNsVzefsHSmhj_EYN_R81Bi-tlPusBSyqWNQmzfhupo2rp4gstgk12ts9gAUF4EYT5bMziih3-VxkHEK06s5mtoM9AoMYT-f8SWe6",
      alt: "Creamy Fettuccine Alfredo pasta",
    },
    {
      name: "Caprese Salad",
      price: "$14.00",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDpfMZtF_YEiWTQgz7bAHU8Fb6fZxtHHywjfNJ7TZat54fTmwIXiQhBuO3Qpfd4TM6R4dSsp-VcU6u2m9Q2ZrL2c7bUBFM_2PB1lO-ubMn3GWAgyk85-pUKAoF5cXTA6uHNuUm3LOLTOzJSSFA7_s1ToaLUeC7Rwe90sLtj8Vq5QxZCxc3gVPYVtqsLMoNwfYNnk1ZbsscR6D_TvDQbbqPIkKmU0mckrul1PHLyfOB1DoQH77lWjnagBApr0xxKpyNYqUmG9oIUjiqj",
      alt: "A fresh Caprese salad",
    },
  ];

  const details = [
    {
      icon: (
        <MdOutlineLocationOn className="text-gray-500 dark:text-gray-400 mt-1" />
      ),
      title: "Address",
      description: "123 Pasta Lane, Culinary City, 45678",
    },
    {
      icon: <MdOutlineCall className="text-gray-500 dark:text-gray-400 mt-1" />,
      title: "Phone",
      description: "(555) 123-4567",
    },
    {
      icon: (
        <MdOutlineSchedule className="text-gray-500 dark:text-gray-400 mt-1" />
      ),
      title: "Opening Hours",
      description: "Mon-Sun: 11:00 AM - 10:00 PM",
    },
    {
      icon: (
        <MdOutlineDeliveryDining className="text-gray-500 dark:text-gray-400 mt-1" />
      ),
      title: "Delivery",
      description: "Est. 30-45 min • $2.99 fee",
    },
  ];

  const renderStars = () => {
    return (
      <>
        <IoStar className="text-primary" />
        <IoStar className="text-primary" />
        <IoStar className="text-primary" />
        <IoStar className="text-primary" />
        <IoStarHalfOutline className="text-primary" />
      </>
    );
  };

  return (
    <div className="relative flex min-h-screen w-full flex-row">
      {/* SideNavBar */}
      <div className="hidden md:flex flex-col border-r border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900/20 w-64 p-4">
        <div className="flex flex-col gap-4">
          <div className="flex gap-3 items-center p-2">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              data-alt="User avatar of Alex Chen"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBBn982eTsoIhHnzn9ZLarzD4BAOml_cwR6GkcmH2PQpNBvkUfCJauoam2hpp2NAyElQZtpHBfzMYn6ofGiu9lKKShzr4hGBmDBbhr4fUOVVoXW-Z7I5pN0qUTeHXwracgOQz7G2pMBqeNi0irbOvyx89BU_Oa0osbJIVPBXhBl0aF7dHZsytvqt880MDopLkB9FU4EtyLJCS33cmUQglU5Tlc0h95sIAZMWRgxy3yutfGJwUZwuFuGm_x-4bJVoSBoxrnJzGkHaJiA")',
              }}
            ></div>
            <div className="flex flex-col">
              <h1 className="text-gray-900 dark:text-gray-100 text-base font-medium leading-normal">
                Alex Chen
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">
                alex.chen@example.com
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <a
              className="flex items-center gap-3 px-3 py-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              href="#"
            >
              <FiHome className="text-gray-800 dark:text-gray-200" />
              <p className="text-sm font-medium leading-normal">Home</p>
            </a>
            <a
              className="flex items-center gap-3 px-3 py-2 rounded-full bg-primary/20 text-primary"
              href="#"
            >
              <MdOutlineRestaurantMenu className="fill-current" />
              <p className="text-sm font-medium leading-normal">Restaurants</p>
            </a>
            <a
              className="flex items-center gap-3 px-3 py-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              href="#"
            >
              <FiShoppingBag className="text-gray-800 dark:text-gray-200" />
              <p className="text-sm font-medium leading-normal">My Orders</p>
            </a>
            <a
              className="flex items-center gap-3 px-3 py-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              href="#"
            >
              <FiUser className="text-gray-800 dark:text-gray-200" />
              <p className="text-sm font-medium leading-normal">Profile</p>
            </a>
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-1">
          <a
            className="flex items-center gap-3 px-3 py-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            href="#"
          >
            <FiSettings className="text-gray-800 dark:text-gray-200" />
            <p className="text-sm font-medium leading-normal">Settings</p>
          </a>
          <a
            className="flex items-center gap-3 px-3 py-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            href="#"
          >
            <FiLogOut className="text-gray-800 dark:text-gray-200" />
            <p className="text-sm font-medium leading-normal">Log out</p>
          </a>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* HeaderImage */}
          <div
            className="w-full h-60 md:h-72 rounded-xl bg-cover bg-center mb-6"
            data-alt="Vibrant, delicious-looking pasta dish in a white bowl."
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAkAXG5FUF9fMqe6l46UQaezmBop2RJTPmhI4xbYj_tkD30vHZ9HPrnq8AUBLmN1NeQVSNXuhef-G4vgnUTeWH1Fb1ARlTJuAB65MkX4e-0qploUorJND1hebNrZQp9-KYt0nEtERK2Bs-I20aTZkUfb0kDqyc_QDfG_tLri3RZQjmTZrAXXa0cEkgkzMuGkFPVORcpTSOLZ9FwDAA7Thbauf9JYTe5AG9P4n_ZiqT9DfLYphxxC1vcRpOkLHoTQJebhn54rw5XubHb")',
            }}
          ></div>

          {/* PageHeading */}
          <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-gray-900 dark:text-white text-4xl font-bold leading-tight">
                The Golden Spoon
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-base font-normal leading-normal">
                Authentic Italian Cuisine
              </p>

              {/* RatingSummary (inline) */}
              <div className="flex items-center gap-2 mt-1">
                <div className="flex gap-0.5 text-primary">{renderStars()}</div>
                <p className="text-gray-800 dark:text-gray-200 text-sm font-medium">
                  4.5
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-normal">
                  (2,154 reviews)
                </p>
              </div>
            </div>

            <button className="flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
              <FiHeart />
              <span className="truncate">Favorite</span>
            </button>
          </div>

          {/* Restaurant Info Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: About & Details */}
            <div className="flex flex-col gap-8">
              <div className="p-6 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm">
                <h2 className="text-gray-900 dark:text-white text-xl font-bold mb-4">
                  About The Golden Spoon
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Experience the heart of Italy right here. The Golden Spoon
                  brings generations of family recipes to your table, crafted
                  with the freshest local ingredients and a passion for
                  authentic flavors. From our handmade pasta to our wood-fired
                  pizzas, every dish is a celebration of Italian tradition.
                </p>
              </div>

              <div className="p-6 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm">
                <h2 className="text-gray-900 dark:text-white text-xl font-bold mb-4">
                  Details
                </h2>
                <ul className="space-y-4">
                  {details.map((detail, index) => (
                    <li key={index} className="flex items-start gap-4">
                      {detail.icon}
                      <div className="flex flex-col">
                        <span className="text-gray-800 dark:text-gray-200 text-sm font-medium">
                          {detail.title}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400 text-sm">
                          {detail.description}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column: Menu Items */}
            <div className="p-6 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm lg:col-span-2">
              <h2 className="text-gray-900 dark:text-white text-xl font-bold mb-6">
                Menu
              </h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {menuItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/10 hover:shadow-lg transition-shadow overflow-hidden"
                  >
                    <div
                      className="w-full h-40 bg-cover bg-center"
                      data-alt={item.alt}
                      style={{ backgroundImage: `url('${item.image}')` }}
                    ></div>
                    <div className="p-4 flex flex-col grow">
                      <h3 className="text-gray-800 dark:text-gray-200 font-bold">
                        {item.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-auto pt-2">
                        {item.price}
                      </p>
                      <button className="w-full mt-4 bg-primary/10 text-primary text-sm font-bold py-2 px-4 rounded-full hover:bg-primary/20 transition-colors">
                        Add to Order
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Order Summary Bar */}
        <div className="fixed bottom-6 right-6">
          <button className="bg-primary text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3 font-bold hover:bg-orange-600 transition-colors">
            <span>3 items</span>
            <div className="w-px h-4 bg-white/40"></div>
            <span>View Order</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default UserRestaurantDetailsPage;
