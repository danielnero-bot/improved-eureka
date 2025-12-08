import React from "react";

const Landing = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-text-primary-light dark:text-gray-200">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <main className="py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <header className="mb-12 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-text-primary-light dark:text-gray-100">
                Welcome to Your QuickPlate Dashboard
              </h1>
              <p className="mt-4 text-lg text-text-secondary-light dark:text-gray-400 max-w-2xl mx-auto">
                Manage your food experience seamlessly — from tracking your
                orders to updating your profile and exploring your favorite
                restaurants.
              </p>
            </header>
            

            {/* Dashboard Overview */}
            <section className="space-y-12">
              {/* Step 1 - Orders */}
              <article>
                <h2 className="text-3xl font-bold text-text-primary-light dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-3 mb-6">
                  <span className="text-primary mr-3">1.</span> Track Your
                  Orders
                </h2>
                <p className="text-text-secondary-light dark:text-gray-300 mb-4">
                  View all your current and past orders in one place. Get
                  real-time status updates from when your food is being prepared
                  to when it's on the way.
                </p>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-sm text-gray-700 dark:text-gray-300">
                  <ul className="list-disc list-inside space-y-2">
                    <li>Monitor your live order progress.</li>
                    <li>View estimated delivery times.</li>
                    <li>Download your past order receipts.</li>
                  </ul>
                </div>
              </article>

              {/* Step 2 - Restaurants */}
              <article>
                <h2 className="text-3xl font-bold text- dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-3 mb-6">
                  <span className="text-primary mr-3">2.</span> Explore
                  Restaurants
                </h2>
                <p className="text- dark:text-gray-300 mb-4">
                  Browse a variety of restaurants, explore their menus, and find
                  something delicious to order — all from your dashboard.
                </p>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-sm text-gray-700 dark:text-gray-300">
                  <ul className="list-disc list-inside space-y-2">
                    <li>Filter restaurants by cuisine or rating.</li>
                    <li>View menu details and prices.</li>
                    <li>Save your favorites for quick access later.</li>
                  </ul>
                </div>
              </article>

              {/* Step 3 - Profile */}
              <article>
                <h2 className="text-3xl font-bold text- dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-3 mb-6">
                  <span className="text-primary mr-3">3.</span> Manage Your
                  Profile
                </h2>
                <p className="text- dark:text-gray-300 mb-4">
                  Update your personal details, delivery addresses, and
                  preferences so you always get the best experience.
                </p>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-sm text-gray-700 dark:text-gray-300">
                  <ul className="list-disc list-inside space-y-2">
                    <li>Edit your name, email, or contact info.</li>
                    <li>Add or remove delivery addresses.</li>
                    <li>Change your password and account settings.</li>
                  </ul>
                </div>
              </article>

              {/* Step 4 - Feedback */}
              <article>
                <h2 className="text-3xl font-bold text- dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-3 mb-6">
                  <span className="text-primary mr-3">4.</span> Leave Feedback
                </h2>
                <p className="text- dark:text-gray-300 mb-4">
                  Help us improve! Share your thoughts about your order or
                  dining experience with a restaurant.
                </p>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-sm text-gray-700 dark:text-gray-300">
                  <ul className="list-disc list-inside space-y-2">
                    <li>Rate restaurants after your order is complete.</li>
                    <li>Submit comments directly through your dashboard.</li>
                    <li>Your feedback helps improve service for everyone.</li>
                  </ul>
                </div>
              </article>
            </section>

            {/* CTA / Footer */}
            <section className="mt-16 text-center border-t border-gray-200 dark:border-gray-700 pt-12">
              <h2 className="text-3xl font-bold text- dark:text-gray-100">
                Ready to Get Started?
              </h2>
              <p className="mt-4 text-lg text-[#648772] dark:text-gray-400 max-w-2xl mx-auto">
                Log in to your dashboard now and experience fast, easy food
                management — anytime, anywhere.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="h-12 px-6 rounded-lg bg-primary text- font-bold hover:scale-105 transition-transform">
                  Go to Dashboard
                </button>
                <button className="h-12 px-6 rounded-lg border border- dark:border-gray-300 text- dark:text-gray-200 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                  View Restaurants
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Landing;
