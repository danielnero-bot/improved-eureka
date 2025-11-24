import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { MdLightMode, MdDarkMode } from "react-icons/md";
import { supabase } from "../supabase";
import { FaImage } from "react-icons/fa6";
import { useTheme } from "../context/ThemeContext";

const AddMenuItem = () => {
  const { id } = useParams();
  const isEditing = !!id;

  const { darkMode, toggleTheme } = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Main Course",
    price: "",
    available: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [restaurantData, setRestaurantData] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  // ✅ Fetch restaurant data and menu item if editing
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Get current Supabase user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          alert("Please log in to continue.");
          navigate("/login");
          return;
        }

        setUserId(user.id);

        // 2. Fetch restaurant data
        const { data: restaurant, error: restaurantError } = await supabase
          .from("restaurants")
          .select("*")
          .eq("owner_uid", user.id)
          .single();

        if (restaurantError) {
          console.error("❌ Error fetching restaurant:", restaurantError);
          alert("Restaurant not found. Please complete setup.");
          navigate("/restaurantsetup");
          return;
        }

        setRestaurantData(restaurant);

        // 3. Fetch menu item if editing
        if (isEditing) {
          const { data: menuItem, error } = await supabase
            .from("menu_items")
            .select("*")
            .eq("id", id)
            .eq("restaurant_id", restaurant.id)
            .single();

          if (error) {
            console.error("Error fetching menu item:", error);
            alert("Menu item not found.");
            navigate("/menupage");
            return;
          }

          // Populate form with existing data
          setFormData({
            name: menuItem.name || "",
            description: menuItem.description || "",
            category: menuItem.category || "Main Course",
            price: menuItem.price || "",
            available: menuItem.available ?? true,
          });

          if (menuItem.image_url) {
            setExistingImage(menuItem.image_url);
            setImagePreview(menuItem.image_url);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to load data.");
        navigate("/menupage");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchData();
  }, [id, isEditing, navigate]);

  // ✅ Handle input change
  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  // ✅ Handle image upload and preview
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/gif",
      "image/webp",
    ];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a valid image (JPG, PNG, GIF, or WEBP)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("File must be less than 10MB");
      return;
    }

    setImageFile(file);
    setExistingImage(null); // Clear existing image when new one is uploaded
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  // ✅ Remove image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setExistingImage(null);
  };

  // ✅ Upload image to Supabase Storage and get URL
  const uploadImageToStorage = async (file) => {
    if (!file || !userId) return null;

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()
        .toString(36)
        .substring(2)}_${Date.now()}.${fileExt}`;
      // Use userId for folder structure
      const filePath = `menu-items/${userId}/${fileName}`;

      // Upload the file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("menu-images") // Make sure this bucket exists in your Supabase storage
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from("menu-images")
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Failed to upload image");
    }
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate fields
      if (!formData.name.trim() || !formData.price) {
        alert("Please fill in all required fields.");
        return;
      }

      if (!restaurantData) {
        alert("No restaurant data found.");
        return;
      }

      let imageUrl = existingImage;

      // ✅ Upload new image if provided
      if (imageFile) {
        try {
          imageUrl = await uploadImageToStorage(imageFile);
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError);
          alert("Failed to upload image. Please try again.");
          return;
        }
      }

      // ✅ Prepare data for insertion/update
      const menuItemData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        price: parseFloat(formData.price),
        available: formData.available,
        restaurant_id: restaurantData.id,
        ...(imageUrl && { image_url: imageUrl }),
      };

      let result;

      if (isEditing) {
        // ✅ Update existing menu item
        result = await supabase
          .from("menu_items")
          .update(menuItemData)
          .eq("id", id)
          .eq("restaurant_id", restaurantData.id);
      } else {
        // ✅ Insert new menu item
        result = await supabase
          .from("menu_items")
          .insert([{ ...menuItemData, created_at: new Date().toISOString() }]);
      }

      if (result.error) {
        console.error("❌ Database error:", result.error);
        alert(
          `Failed to ${
            isEditing ? "update" : "add"
          } menu item. Check console for details.`
        );
      } else {
        console.log(
          `✅ ${isEditing ? "Update" : "Insert"} success:`,
          result.data
        );
        alert(`Menu item ${isEditing ? "updated" : "added"} successfully!`);
        navigate("/menupage");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("Something went wrong. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle cancel and back
  const handleCancel = () => {
    if (window.confirm("Discard changes?")) navigate("/menupage");
  };
  const handleBack = () => navigate("/menupage");

  if (fetchLoading) {
    return (
      <div
        className={`bg-background-light dark:bg-background-dark font-display text-black dark:text-white min-h-screen flex items-center justify-center transition-colors duration-300 ${
          darkMode ? "bg-background-light" : "bg-background-dark"
        }`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading menu item...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-background-light dark:bg-background-dark font-display text-black dark:text-white min-h-screen flex flex-col transition-colors duration-300 ${
        darkMode ? "bg-background-light" : "bg-background-dark"
      }`}
    >
      {/* Header */}
      <header
        className={`sticky top-0 z-20 flex h-16 items-center justify-between border-b px-4 sm:px-6 backdrop-blur-md bg-opacity-80 ${
          darkMode
            ? "bg-card-dark border-border-dark"
            : "bg-card-light border-border-light"
        }`}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <IoMdArrowRoundBack className="text-xl" />
          </button>
          <h1 className="text-2xl font-bold tracking-tight">
            {isEditing ? "Edit Menu Item" : "Add New Menu Item"}
          </h1>
        </div>

        <button
          onClick={toggleTheme}
          className="rounded-full p-2 transition-colors"
        >
          {darkMode ? (
            <MdLightMode className="text-xl" />
          ) : (
            <MdDarkMode className="text-xl" />
          )}
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex justify-center px-4 sm:px-6 lg:px-8 py-5">
        <div className="w-full max-w-2xl flex flex-col">
          {/* Form */}
          <main className="grow space-y-8 py-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Menu Item Image {!isEditing && "*"}
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
                          onClick={handleRemoveImage}
                          className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                        >
                          Remove Image
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="text-5xl text-text-secondary-light dark:text-text-secondary-dark mb-2">
                          📷
                        </div>
                        <div className="flex text-sm text-text-secondary-light dark:text-text-secondary-dark justify-center">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80"
                          >
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              type="file"
                              className="sr-only"
                              onChange={handleImageUpload}
                              accept="image/*"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                          PNG, JPG, GIF, WEBP up to 10MB
                        </p>
                        {isEditing && (
                          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-2">
                            Leave empty to keep current image
                          </p>
                        )}
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
                  type="text"
                  placeholder="e.g., Classic Burger"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-lg border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-3 focus:border-primary focus:ring-primary focus:outline-none"
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
                  rows="3"
                  placeholder="A juicy beef patty with fresh lettuce, tomato, and our special sauce."
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-3 focus:border-primary focus:ring-primary focus:outline-none resize-none"
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
                    value={formData.category}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-lg border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark py-2 px-3 focus:border-primary focus:ring-primary focus:outline-none"
                  >
                    <option>Appetizers</option>
                    <option>Main Course</option>
                    <option>Drinks</option>
                    <option>Desserts</option>
                    <option>Sides</option>
                    <option>Salads</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium">
                    Price *
                  </label>
                  <div className="relative mt-1 rounded-lg shadow-sm">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-text-secondary-light dark:text-text-secondary-dark">
                      $
                    </span>
                    <input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      className="block w-full rounded-lg border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark pl-7 pr-4 focus:border-primary focus:ring-primary focus:outline-none p-3"
                    />
                  </div>
                </div>
              </div>

              {/* Availability */}
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
                    type="checkbox"
                    checked={formData.available}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-primary/50 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row-reverse gap-3 pt-4 border-t border-border-light dark:border-border-dark">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full sm:w-auto items-center justify-center h-12 px-5 bg-primary text-white text-base font-bold rounded-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {isEditing ? "Updating..." : "Saving..."}
                    </>
                  ) : isEditing ? (
                    "Update Item"
                  ) : (
                    "Save Item"
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex w-full sm:w-auto items-center justify-center h-12 px-5 bg-card-light dark:bg-card-dark text-text-light dark:text-text-dark border border-border-light dark:border-border-dark font-bold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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
