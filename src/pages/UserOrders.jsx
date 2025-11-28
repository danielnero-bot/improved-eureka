import React from "react";
import UserSidebar from "../components/UserSidebar";
import { FiSearch, FiChevronDown } from "react-icons/fi";
import { MdShoppingBasket } from "react-icons/md";

const UserOrdersPage = () => {
  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <div className="flex h-full w-full">
        {/* SideNavBar */}
        <UserSidebar />

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="mx-auto max-w-4xl">
            {/* PageHeading */}
            <div className="flex flex-wrap justify-between gap-4 items-center mb-6">
              <div className="flex flex-col gap-1">
                <p className="text-3xl lg:text-4xl font-black leading-tight tracking-[-0.033em] text-gray-900 dark:text-white">
                  Your Orders
                </p>
                <p className="text-base font-normal leading-normal text-gray-500 dark:text-gray-400">
                  Track all your past and ongoing food orders.
                </p>
              </div>
            </div>

            {/* Search and Filter Section */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* SearchBar */}
              <div className="flex-1">
                <label className="flex flex-col h-12 w-full">
                  <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                    <div className="text-gray-500 dark:text-gray-400 flex border-gray-200 dark:border-gray-700 bg-white dark:bg-black/20 items-center justify-center pl-4 rounded-l-lg border-r-0">
                      <FiSearch className="text-xl" />
                    </div>
                    <input
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border-gray-200 dark:border-gray-700 bg-white dark:bg-black/20 h-full placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 pl-2 text-base font-normal leading-normal"
                      placeholder="Search by restaurant or item..."
                      defaultValue=""
                    />
                  </div>
                </label>
              </div>

              {/* Chips / Filter */}
              <div className="flex items-center">
                <button className="flex h-12 w-full md:w-auto shrink-0 items-center justify-between gap-x-2 rounded-lg bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 px-4">
                  <p className="text-gray-800 dark:text-gray-200 text-sm font-medium leading-normal">
                    All Orders
                  </p>
                  <FiChevronDown className="text-gray-500 dark:text-gray-400 text-xl" />
                </button>
              </div>
            </div>

            {/* Orders List */}
            <div className="grid grid-cols-1 gap-6">
              {/* Card 1 */}
              <div className="flex flex-col gap-4 rounded-xl bg-white dark:bg-black/20 p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 bg-center bg-no-repeat aspect-square bg-cover rounded-lg flex-shrink-0"
                      data-alt="The Gourmet Kitchen restaurant logo"
                      style={{
                        backgroundImage:
                          'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA49xkXDbORrtQmWLb94kvzZknqncpYJc5R0lkLKjVVaSBqbOxwvusJQS90WmRePvjj3HoaofR8HXyuO-OweQNq-oiyJNXUz-6LvoE5mcfhtpEelaHF40Fxrv_RsdkiJQlBX2VjC_TaO9gTzi2nP8vjH946kV9fhhAFSzDLHyWWzonxNMRJyZMDzNDiCXlLWW8vlFGyEphqqZU0cuTuEOYg_bLpnTU4uGFvNvjj64rFbHDbeHwlDsco0hADMSya11S36IL4eOOwSlfF")',
                      }}
                    ></div>
                    <div className="flex flex-col">
                      <p className="text-base font-bold leading-tight text-gray-900 dark:text-white">
                        The Gourmet Kitchen
                      </p>
                      <p className="text-sm font-normal leading-normal text-gray-500 dark:text-gray-400">
                        Oct 26, 2023
                      </p>
                    </div>
                  </div>
                  <div className="rounded-full px-3 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300">
                    Delivered
                  </div>
                </div>
                <p className="text-sm font-normal leading-normal text-gray-600 dark:text-gray-300">
                  3 items — Fried Rice, Chicken Wings, Coke
                </p>
                <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
                  <p className="text-base font-bold text-gray-900 dark:text-white">
                    $25.50
                  </p>
                  <button className="flex items-center justify-center rounded-lg h-10 px-4 bg-primary text-background-dark text-sm font-medium leading-normal hover:opacity-90">
                    <span>View Details</span>
                  </button>
                </div>
              </div>

              {/* Card 2 */}
              <div className="flex flex-col gap-4 rounded-xl bg-white dark:bg-black/20 p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 bg-center bg-no-repeat aspect-square bg-cover rounded-lg flex-shrink-0"
                      data-alt="Pizza Palace restaurant logo"
                      style={{
                        backgroundImage:
                          'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBiR9zmidYTtHzZAGeQyfUHqiamXlDqqzwqemlXd6YziZCQIQnjNh1njqp9WsXKWu8huXPUcygkaoSm6nx2PvR-EpduRFPKD3bBUIHOBQzyfYuPHK6ipjF4K8TlYiB1oajqpM9cM4zCqdclbtBdNHOmVw_nyAYmezNkq-SRkltBXFavEnv4FjEhP5z2ECYbaiWp7Ogv944wIRFYTItVMAYoe6nU2t14YsbIigfOCoC4l3V5brxthg8sLeY0CoKGC12QNUf4iwbWSG1Q")',
                      }}
                    ></div>
                    <div className="flex flex-col">
                      <p className="text-base font-bold leading-tight text-gray-900 dark:text-white">
                        Pizza Palace
                      </p>
                      <p className="text-sm font-normal leading-normal text-gray-500 dark:text-gray-400">
                        Oct 25, 2023
                      </p>
                    </div>
                  </div>
                  <div className="rounded-full px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                    In Progress
                  </div>
                </div>
                <p className="text-sm font-normal leading-normal text-gray-600 dark:text-gray-300">
                  2 items — Pepperoni Pizza, Garlic Bread
                </p>
                <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
                  <p className="text-base font-bold text-gray-900 dark:text-white">
                    $32.00
                  </p>
                  <button className="flex items-center justify-center rounded-lg h-10 px-4 bg-primary text-background-dark text-sm font-medium leading-normal hover:opacity-90">
                    <span>View Details</span>
                  </button>
                </div>
              </div>

              {/* Card 3 */}
              <div className="flex flex-col gap-4 rounded-xl bg-white dark:bg-black/20 p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 bg-center bg-no-repeat aspect-square bg-cover rounded-lg flex-shrink-0"
                      data-alt="Sushi House restaurant logo"
                      style={{
                        backgroundImage:
                          'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBaIiCKvEW0X9b_PhSlb-GslQwFvUGGTXGKKB1bxLTnTb5d4229gkxuGjHIEjRA5IU1x7DodYpExmyRsW_4SHiU7PCG-H3Y-3n9FgmqqURF-aYMIb3EwpQIabNEoQjptwVUykCHlcqfs0iidY2zp5UPxN-1rjffiprngcTwNXnurJ2GtNIhDRzT-GYjhuG14sSp0gSII1zBLMjPxTu4kHxDzMZuRydRHCWp98Qm0uAflVV2cQrsT5ugX2FLvaEvWcpaYOONcJRME-Ad")',
                      }}
                    ></div>
                    <div className="flex flex-col">
                      <p className="text-base font-bold leading-tight text-gray-900 dark:text-white">
                        Sushi House
                      </p>
                      <p className="text-sm font-normal leading-normal text-gray-500 dark:text-gray-400">
                        Oct 24, 2023
                      </p>
                    </div>
                  </div>
                  <div className="rounded-full px-3 py-1 text-xs font-medium bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300">
                    Pending
                  </div>
                </div>
                <p className="text-sm font-normal leading-normal text-gray-600 dark:text-gray-300">
                  4 items — California Roll, Tuna Nigiri, Miso Soup, Edamame
                </p>
                <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
                  <p className="text-base font-bold text-gray-900 dark:text-white">
                    $45.75
                  </p>
                  <button className="flex items-center justify-center rounded-lg h-10 px-4 bg-primary text-background-dark text-sm font-medium leading-normal hover:opacity-90">
                    <span>View Details</span>
                  </button>
                </div>
              </div>

              {/* Card 4 */}
              <div className="flex flex-col gap-4 rounded-xl bg-white dark:bg-black/20 p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 bg-center bg-no-repeat aspect-square bg-cover rounded-lg flex-shrink-0"
                      data-alt="Burger Barn restaurant logo"
                      style={{
                        backgroundImage:
                          'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCB0Jz_WL2qZ7CykermW4M-RLFNCUFCRKJHyPC1LP-cfTjvsQt74DXbTMqKhTIYsaMiS1R4apdJSXID5sekh-OkvB0MpKgFewlE_mgEWxpUvflUR2OpUEHwiHO_rzcWLeSD5wbtnmDXP5V4cNN6FKEt5lXUkqp2FbG6ATNRPuZteabc6jaqxWGwzEF2WGacvTcsSOTakvi5iwUP9csHwGfmF0tEmY62z5OidbFRs0x-iRU4BCDJknsTfPAYGYUtQZmrlsB31dYUTy6b")',
                      }}
                    ></div>
                    <div className="flex flex-col">
                      <p className="text-base font-bold leading-tight text-gray-900 dark:text-white">
                        Burger Barn
                      </p>
                      <p className="text-sm font-normal leading-normal text-gray-500 dark:text-gray-400">
                        Oct 22, 2023
                      </p>
                    </div>
                  </div>
                  <div className="rounded-full px-3 py-1 text-xs font-medium bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300">
                    Cancelled
                  </div>
                </div>
                <p className="text-sm font-normal leading-normal text-gray-600 dark:text-gray-300">
                  2 items — Cheeseburger, Fries
                </p>
                <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
                  <p className="text-base font-bold text-gray-900 dark:text-white">
                    $18.25
                  </p>
                  <button className="flex items-center justify-center rounded-lg h-10 px-4 bg-primary text-background-dark text-sm font-medium leading-normal hover:opacity-90">
                    <span>View Details</span>
                  </button>
                </div>
              </div>

              {/* Empty State */}
              <div className="flex flex-col items-center justify-center text-center gap-4 py-16 px-6 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700">
                <div className="flex items-center justify-center size-16 bg-primary/20 rounded-full">
                  <MdShoppingBasket className="text-3xl text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  You have no orders yet.
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-xs">
                  Start exploring restaurants to place your first order.
                </p>
                <button className="flex items-center justify-center rounded-lg h-10 px-4 bg-primary text-background-dark text-sm font-medium leading-normal hover:opacity-90 mt-2">
                  <span>Browse Restaurants</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserOrdersPage;
