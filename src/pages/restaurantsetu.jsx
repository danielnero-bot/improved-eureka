import React, { useState } from "react";
import { FaRegImage } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/config"; // still Firebase auth
import { supabase } from "../supabse" 

const RestaurantSetup = () => {
  const navigate = useNavigate();

  const [restaurantName, setRestaurantName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [openingHours, setOpeningHours] = useState("");
  const [closingHours, setClosingHours] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [logoFile, setLogoFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const uid = auth.currentUser?.uid;
    if (!uid) {
      setError("You must be signed in to save restaurant details.");
      return;
    }

    if (!restaurantName || !address || !description || !phoneNumber || !contactEmail) {
      setError("Please fill in all required fields.");
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
          .upload(filePath, logoFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("restaurant-logos")
          .getPublicUrl(filePath);

        logoURL = publicUrlData.publicUrl;
      }

      // 🗄 Save data in Supabase table
      const { error: insertError } = await supabase.from("restaurants").upsert(
        [
          {
            user_id: uid,
            name: restaurantName,
            address,
            description,
            opening_hours: openingHours,
            closing_hours: closingHours,
            phone_number: phoneNumber,
            contact_email: contactEmail,
            logo_url: logoURL,
            updated_at: new Date(),
          },
        ],
        { onConflict: "user_id" }
      );

      if (insertError) throw insertError;

      setSuccess("Restaurant details saved successfully!");
      navigate("/adminDashboard");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save restaurant details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-black dark:text-white min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Set Up Your Restaurant</h1>
          <p className="mt-2 text-gray-500">Add your restaurant details to start managing your menu.</p>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded">{error}</div>}
        {success && <div className="bg-green-100 border border-green-400 text-green-700 p-3 rounded">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Restaurant Name */}
          <div>
            <label className="text-sm font-medium">Restaurant Name *</label>
            <input
              type="text"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              className="w-full border p-3 rounded"
              required
            />
          </div>

          {/* Logo Upload */}
          <div>
            <label className="text-sm font-medium">Logo *</label>
            <input
              type="file"
              onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
              className="w-full border p-3 rounded"
            />
          </div>

          {/* Address */}
          <div>
            <label className="text-sm font-medium">Address *</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border p-3 rounded"
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
              className="w-full border p-3 rounded"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Opening Hours *</label>
              <input
                type="time"
                value={openingHours}
                onChange={(e) => setOpeningHours(e.target.value)}
                className="w-full border p-3 rounded"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Closing Hours *</label>
              <input
                type="time"
                value={closingHours}
                onChange={(e) => setClosingHours(e.target.value)}
                className="w-full border p-3 rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Phone Number *</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full border p-3 rounded"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Contact Email *</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full border p-3 rounded"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              className="border border-gray-300 px-5 py-2 rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
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
