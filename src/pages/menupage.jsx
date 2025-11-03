import React, { useState, useEffect } from "react";
import { IoIosAddCircle, IoIosAdd } from "react-icons/io";
const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [search, setSearch] = useState("");

  // Simulate fetching data
  useEffect(() => {
    // Comment this out to see the "No Menu" empty state
    const mockData = [
    //   {
    //     id: 1,
    //     name: "Spaghetti Carbonara",
    //     category: "Pasta",
    //     description:
    //       "Classic Italian pasta with eggs, cheese, pancetta, and black pepper.",
    //     price: "$18.99",
    //     available: true,
    //     image:
    //       "https://lh3.googleusercontent.com/aida-public/AB6AXuBab7mHgVkWppxgOFJb5_lSBdrJFQ6EWj8LTcwHcGvMWxTe08qeXgeQ-BCFupx8d8aGycSMUx-GDpUINq5PDjWinQJ31WlabOn7VdqJEAt47cFVZVx-wziLKue8uoN4pr5NtdHRR0yGkmAhcgbjtQH0hErFV28iHK9YWoRDprT9EqiWXod7Way2ntfqEMvQ-WBcxOSJt3_kOETwxyG5So0hYqZ4nJiG1xY1PwAmo_HXyC-eH7MRyfcfYr003t_-egoT8OyJE6BI-q-7",
    //   },
    //   {
    //     id: 2,
    //     name: "Margherita Pizza",
    //     category: "Pizza",
    //     description:
    //       "Simple yet delicious pizza with San Marzano tomatoes, fresh mozzarella, and basil.",
    //     price: "$22.50",
    //     available: true,
    //     image:
    //       "https://lh3.googleusercontent.com/aida-public/AB6AXuCMszL6vyRWQFAm9PY0GZJanHL60W5dTzDIKEq1UQWmPrTSaA8_yE7bnHh6OBcd9xQY3csciEUPt0t5-SwN2CYG8MPRe4I1CqtHLLW163nWXyjkhheaYlLAahN5NFgb9w-Xtk3cVPp9MzHdRSokW7998NRqhwS0VFxd0_CigtmWOT2h0JF6F1wo1WKMZCNrSeShMyYYk7t5LaHTTYPAdToXxCevfzKETyoDoXaclBzTh9AbVqxS87feJL07qCs-3Uj_ELMDbqmd4FwN",
    //   },
    ];
    setMenuItems(mockData);
  }, []);

  const filteredMenu = menuItems.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-black dark:text-white min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border-light/80 dark:border-border-dark/80 bg-background-light/80 dark:bg-background-dark/80 px-4 sm:px-6 lg:px-8 backdrop-blur-md ">
        <h1 className="text-xl font-bold tracking-tight">Menu Management</h1>
        <button className="flex min-w-[84px] items-center justify-center gap-2 rounded-md h-9 px-4 bg-primary text-text-light text-sm font-bold leading-normal transition-transform hover:scale-105">
          <span className="material-symbols-outlined text-base">
            <IoIosAddCircle />
          </span>
          <span className="hidden sm:inline">Add New Item</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {/* Empty State */}
        {filteredMenu.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
            <span className="material-symbols-outlined text-6xl text-primary/70">
              <IoIosAddCircle />
            </span>
            <h2 className="text-2xl font-bold">No Menu Items Yet</h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark max-w-sm">
              You haven’t added any dishes yet. Start by adding your first menu
              item to showcase what your restaurant offers!
            </p>
            <button className="mt-4 flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-bold text-text-light transition-transform hover:scale-105">
              <span className="material-symbols-outlined text-base">
                <IoIosAdd />
              </span>
              Add Your First Item
            </button>
          </div>
        ) : (
          <>
            {/* Search + Filter */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
              <div className="relative w-full sm:max-w-xs">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search for a dish..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 rounded-md border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                />
              </div>

              <div className="relative w-full sm:w-auto">
                <button className="flex h-10 w-full items-center justify-between gap-2 rounded-md border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark px-4 text-sm transition-colors hover:bg-background-light dark:hover:bg-background-dark/50">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-text-secondary-light dark:text-text-secondary-dark">
                      filter_list
                    </span>
                    <span>All Categories</span>
                  </div>
                  <span className="material-symbols-outlined text-base text-text-secondary-light dark:text-text-secondary-dark">
                    expand_more
                  </span>
                </button>
              </div>
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredMenu.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col overflow-hidden rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark shadow-sm transition-shadow hover:shadow-lg"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-48 w-full object-cover"
                  />
                  <div className="flex flex-1 flex-col p-4">
                    <div className="flex items-start justify-between">
                      <h2 className="text-lg font-bold">{item.name}</h2>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          item.available
                            ? "bg-success/10 text-success"
                            : "bg-error/10 text-error"
                        }`}
                      >
                        {item.available ? "Available" : "Out of Stock"}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                      {item.category}
                    </p>
                    <p className="mt-2 flex-1 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                      {item.description}
                    </p>
                    <p className="mt-4 text-lg font-semibold text-primary">
                      {item.price}
                    </p>
                  </div>
                  <div className="flex items-center justify-end gap-2 border-t border-border-light dark:border-border-dark p-3">
                    <button className="h-8 px-3 text-sm font-medium rounded-md hover:bg-background-light dark:hover:bg-background-dark/50 transition-colors">
                      Edit
                    </button>
                    <button className="h-8 px-3 text-sm font-medium text-error rounded-md hover:bg-error/10 transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default MenuManagement;
