import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { getAuth } from "firebase/auth";
import { IoMdArrowRoundBack } from "react-icons/io";

const AddMenuItem = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Main Course",
    price: "",
    available: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [restaurantId, setRestaurantId] = useState(null);

  const navigate = useNavigate();
  const auth = getAuth();

  // Handle form input changes
  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle image upload with preview
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      alert("Please select a valid image file (JPEG, PNG, GIF)");
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    setImageFile(file);

    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  // Get restaurant ID for current user
  const getRestaurantId = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in to add menu items");
      navigate("/login");
      return null;
    }

    try {
      const { data, error } = await supabase
        .from("restaurants")
        .select("id")
        .eq("firebase_uid", user.uid)
        .single();

      if (error) {
        console.error("Error fetching restaurant:", error);
        return null;
      }

      return data.id;
    } catch (error) {
      console.error("Error getting restaurant ID:", error);
      return null;
    }
  };

  // Upload image to Supabase Storage
  const uploadImage = async (file) => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `menu-items/${fileName}`;

      const { data, error } = await supabase.storage
        .from("menu-images") // Make sure this bucket exists in your Supabase storage
        .upload(filePath, file);

      if (error) {
        throw error;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("menu-images").getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form
      if (!formData.name.trim()) {
        alert("Please enter a menu item name");
        return;
      }

      if (!formData.price || parseFloat(formData.price) <= 0) {
        alert("Please enter a valid price");
        return;
      }

      if (!imageFile) {
        alert("Please upload an image for the menu item");
        return;
      }

      // Get restaurant ID
      const restaurantId = await getRestaurantId();
      if (!restaurantId) {
        alert("Unable to find restaurant information");
        return;
      }

      // Upload image
      const imageUrl = await uploadImage(imageFile);

      // Insert menu item into database
      const { data, error } = await supabase
        .from("menu_items")
        .insert([
          {
            name: formData.name.trim(),
            description: formData.description.trim(),
            category: formData.category,
            price: parseFloat(formData.price),
            available: formData.available,
            image_url: imageUrl,
            restaurant_id: restaurantId,
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (error) {
        throw error;
      }

      alert("Menu item added successfully!");
      navigate("/menupage"); // Redirect back to menu page
    } catch (error) {
      console.error("Error adding menu item:", error);
      alert("Failed to add menu item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (
      window.confirm(
        "Are you sure you want to cancel? Any unsaved changes will be lost."
      )
    ) {
      navigate("/menupage");
    }
  };

  // Handle back button
  const handleBack = () => {
    navigate("/menupage");
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-black dark:text-white min-h-screen flex flex-col">
      <div className="flex-1 flex justify-center px-4 sm:px-6 lg:px-8 py-5">
        <div className="w-full max-w-2xl flex flex-col">
          {/* Header */}
          <header className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <span className="material-symbols-outlined"><IoMdArrowRoundBack/></span>
              </button>
              <h1 className="text-2xl font-bold tracking-tight">
                Add New Menu Item
              </h1>
            </div>
          </header>

          {/* Main Form */}
          <main className="grow space-y-8 py-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div>
                <label
                  htmlFor="file-upload"
                  className="block text-sm font-medium mb-2"
                >
                  Menu Item Image *
                </label>
                <div className="mt-1 flex justify-center rounded-lg border-2 border-dashed border-border-light dark:border-border-dark px-6 pt-5 pb-6">
                  <div className="space-y-1 text-center">
                    {imagePreview ? (
                      <div className="flex flex-col items-center">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="rounded-lg object-cover h-32 w-32 border border-border-light dark:border-border-dark mb-2"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setImageFile(null);
                          }}
                          className="text-sm text-error hover:text-error/80"
                        >
                          Remove Image
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-5xl text-text-secondary-light dark:text-text-secondary-dark">
                          image
                        </span>
                        <div className="flex text-sm text-text-secondary-light dark:text-text-secondary-dark">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 dark:ring-offset-background-dark"
                          >
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              onChange={handleImageUpload}
                              accept="image/jpeg,image/jpg,image/png,image/gif"
                              required
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Item Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium">
                  Item Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="e.g., Classic Burger"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-lg border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-3"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  placeholder="A juicy beef patty with fresh lettuce, tomato, and our special sauce."
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark shadow-sm focus:border-primary focus:ring-primary sm:text-sm resize-none p-3"
                ></textarea>
              </div>

              {/* Category + Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium"
                  >
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-lg border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark py-2 px-3 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  >
                    <option value="Appetizers">Appetizers</option>
                    <option value="Main Course">Main Course</option>
                    <option value="Drinks">Drinks</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Sides">Sides</option>
                    <option value="Salads">Salads</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium">
                    Price *
                  </label>
                  <div className="relative mt-1 rounded-lg shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-text-secondary-light dark:text-text-secondary-dark sm:text-sm">
                        $
                      </span>
                    </div>
                    <input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      className="block w-full rounded-lg border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark pl-7 pr-4 focus:border-primary focus:ring-primary sm:text-sm p-3"
                    />
                  </div>
                </div>
              </div>

              {/* Availability Toggle */}
              <div className="flex items-center justify-between rounded-lg p-3 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark">
                <div>
                  <h3 className="font-medium">Available for Ordering</h3>
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    Make this item visible to customers.
                  </p>
                </div>
                <label
                  htmlFor="available"
                  className="relative inline-flex items-center cursor-pointer"
                >
                  <input
                    id="available"
                    name="available"
                    type="checkbox"
                    checked={formData.available}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-primary/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                </label>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row-reverse gap-3 pt-4 border-t border-border-light dark:border-border-dark">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full sm:w-auto items-center justify-center h-12 px-5 bg-primary text-text-light text-base font-bold rounded-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    "Save Item"
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex w-full sm:w-auto items-center justify-center h-12 px-5 bg-card-light dark:bg-card-dark text-text-light dark:text-text-dark border border-border-light dark:border-border-dark font-bold rounded-lg transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AddMenuItem;
