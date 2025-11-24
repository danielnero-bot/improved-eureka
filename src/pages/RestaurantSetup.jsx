import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { supabase } from "../supabase";
import { FaRegImage } from "react-icons/fa6";
import { useTheme } from "../context/ThemeContext";

const RestaurantSetup = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [uid, setUid] = useState(null);

  // 🔹 Restaurant details
  const [restaurantName, setRestaurantName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [openingHours, setOpeningHours] = useState("");
  const [closingHours, setClosingHours] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [logoFile, setLogoFile] = useState(null);

  // 🔹 UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ Get Supabase User once logged in
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setUid(session.user.id);
        setContactEmail(session.user.email);
      } else {
        navigate("/login");
      }
    };

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUid(session.user.id);
        setContactEmail(session.user.email);
      } else {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // 🧾 Save restaurant data to Supabase
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !restaurantName ||
      !address ||
      !description ||
      !phoneNumber ||
      !contactEmail
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!uid) {
      setError("You must be signed in to save restaurant details.");
      return;
    }

    setLoading(true);

    try {
      let logoURL = null;

      // 🔼 Upload logo to Supabase Storage
      if (logoFile) {
        const fileExt = logoFile.name.split(".").pop();
        const fileName = `logo_${Date.now()}.${fileExt}`;
        const filePath = `${uid}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("restaurant-logos")
          .upload(filePath, logoFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("restaurant-logos")
          .getPublicUrl(filePath);

        logoURL = publicUrlData.publicUrl;
      }

      // 🗄 Check if restaurant already exists for this user
      const { data: existingRestaurant } = await supabase
        .from("restaurants")
        .select("id")
        .eq("owner_uid", uid)
        .maybeSingle();

      const restaurantId = existingRestaurant?.id;

      // 🆕 Prepare payload
      const payload = {
        owner_uid: uid,
        name: restaurantName,
        address,
        description,
        opening_hours: openingHours,
        closing_hours: closingHours,
        phone_number: phoneNumber,
        contact_email: contactEmail,
        logo_url: logoURL,
        updated_at: new Date().toISOString(),
      };

      // Only include ID if updating an existing record
      if (restaurantId) {
        payload.id = restaurantId;
      }

      // 🆕 Insert or update restaurant record
      const { data, error: upsertError } = await supabase
        .from("restaurants")
        .upsert([payload], { onConflict: "owner_uid" })
        .select()
        .single();

      if (upsertError) throw upsertError;

      // 💾 Save restaurant ID locally
      if (data?.id) {
        localStorage.setItem("restaurant_id", data.id);
      }

      setSuccess("✅ Restaurant details saved successfully!");
      setTimeout(() => navigate("/restaurantDashboard"), 1500);
    } catch (err) {
      console.error("❌ Supabase Error:", err);
      setError(err.message || "Failed to save restaurant details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`font-display min-h-screen flex items-center justify-center p-6 transition-colors duration-300 ${
        darkMode
          ? "bg-background-dark text-white"
          : "bg-background-light text-black"
      }`}
    >
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Set Up Your Restaurant</h1>
          <p
            className={`mt-2 ${
              darkMode ? "text-text-muted-dark" : "text-text-muted-light"
            }`}
          >
            Add your restaurant details to start managing your menu.
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 p-3 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Restaurant Name */}
          <div>
            <label className="text-sm font-medium">Restaurant Name *</label>
            <input
              type="text"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              className={`w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-primary ${
                darkMode
                  ? "bg-card-dark border-border-dark text-white"
                  : "bg-card-light border-border-light text-black"
              }`}
              required
            />
          </div>

          {/* Logo Upload */}
          <div>
            <label className="text-sm font-medium flex items-center gap-2">
              <FaRegImage /> Upload Logo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
              className={`w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-primary ${
                darkMode
                  ? "bg-card-dark border-border-dark text-white"
                  : "bg-card-light border-border-light text-black"
              }`}
            />
          </div>

          {/* Address */}
          <div>
            <label className="text-sm font-medium">Address *</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={`w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-primary ${
                darkMode
                  ? "bg-card-dark border-border-dark text-white"
                  : "bg-card-light border-border-light text-black"
              }`}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium">Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className={`w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-primary ${
                darkMode
                  ? "bg-card-dark border-border-dark text-white"
                  : "bg-card-light border-border-light text-black"
              }`}
              required
            />
          </div>

          {/* Opening/Closing Hours */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Opening Hours *</label>
              <input
                type="time"
                value={openingHours}
                onChange={(e) => setOpeningHours(e.target.value)}
                className={`w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-primary ${
                  darkMode
                    ? "bg-card-dark border-border-dark text-white"
                    : "bg-card-light border-border-light text-black"
                }`}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Closing Hours *</label>
              <input
                type="time"
                value={closingHours}
                onChange={(e) => setClosingHours(e.target.value)}
                className={`w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-primary ${
                  darkMode
                    ? "bg-card-dark border-border-dark text-white"
                    : "bg-card-light border-border-light text-black"
                }`}
              />
            </div>
          </div>

          {/* Phone and Email */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Phone Number *</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className={`w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-primary ${
                  darkMode
                    ? "bg-card-dark border-border-dark text-white"
                    : "bg-card-light border-border-light text-black"
                }`}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Contact Email *</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className={`w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-primary ${
                  darkMode
                    ? "bg-card-dark border-border-dark text-white"
                    : "bg-card-light border-border-light text-black"
                }`}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate("/")}
              className={`border px-5 py-2 rounded transition-colors ${
                darkMode
                  ? "border-gray-600 hover:bg-gray-800 text-gray-300"
                  : "border-gray-300 hover:bg-gray-100 text-gray-700"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white px-5 py-2 rounded hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {loading ? "Saving..." : "Save & Continue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RestaurantSetup;
