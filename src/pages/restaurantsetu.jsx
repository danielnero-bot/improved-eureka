import React from "react";
import { FaRegImage } from "react-icons/fa6";

const RestaurantSetup = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-black dark:text-white min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-text-light-primary dark:text-text-dark-primary">
            Set Up Your Restaurant
          </h1>
          <p className="mt-2 text-text-light-secondary dark:text-text-dark-secondary">
            Add your restaurant details to start managing your menu.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6">
          {/* Restaurant Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="restaurantName">
              Restaurant Name <span className="text-red-500">*</span>
            </label>
            <input
              id="restaurantName"
              name="restaurantName"
              type="text"
              required
              className="w-full rounded-lg border border-border-light bg-white dark:border-border-dark dark:bg-gray-800 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Logo Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Logo<span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 flex-shrink-0 rounded-lg bg-gray-100 dark:bg-gray-800 border border-border-light dark:border-border-dark flex items-center justify-center">
                <span className=" text-gray-400">
                  <FaRegImage />
                </span>
              </div>
              <div className="w-full">
                <label
                  htmlFor="logo"
                  className="cursor-pointer rounded-lg border border-border-light dark:border-border-dark px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 inline-block"
                >
                  <span>Upload Image</span>
                  <input
                    id="logo"
                    name="logo"
                    type="file"
                    className="sr-only"
                  />
                </label>
                <p className="text-xs text-text-light-secondary dark:text-text-dark-secondary mt-2">
                  PNG, JPG, GIF up to 5MB.
                </p>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="address">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              id="address"
              name="address"
              type="text"
              required
              className="w-full rounded-lg border border-border-light bg-white dark:border-border-dark dark:bg-gray-800 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="description">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              required
              className="w-full rounded-lg border border-border-light bg-white dark:border-border-dark dark:bg-gray-800 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            ></textarea>
          </div>

          {/* Opening & Closing Hours */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="openingHours">
                Opening Hours <span className="text-red-500">*</span>
              </label>
              <input
                id="openingHours"
                name="openingHours"
                type="time"
                className="w-full rounded-lg border border-border-light bg-white dark:border-border-dark dark:bg-gray-800 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="closingHours">
                Closing Hours <span className="text-red-500">*</span>
              </label>
              <input
                id="closingHours"
                name="closingHours"
                type="time"
                className="w-full rounded-lg border border-border-light bg-white dark:border-border-dark dark:bg-gray-800 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="phoneNumber">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                className="w-full rounded-lg border border-border-light bg-white dark:border-border-dark dark:bg-gray-800 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="contactEmail">
                Contact Email <span className="text-red-500">*</span>
              </label>
              <input
                id="contactEmail"
                name="contactEmail"
                type="email"
                className="w-full rounded-lg border border-border-light bg-white dark:border-border-dark dark:bg-gray-800 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end pt-4">
            <button
              type="button"
              className="flex h-10 items-center justify-center rounded-lg border border-border-light dark:border-border-dark bg-transparent px-5 text-sm font-bold text-text-light-primary dark:text-text-dark-primary transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex h-10 items-center justify-center rounded-lg bg-primary px-5 text-sm font-bold text-text-light-primary transition-transform hover:scale-105"
            >
              Save &amp; Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RestaurantSetup;
