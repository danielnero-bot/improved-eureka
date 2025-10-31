import React, { useState } from "react";
import { FaRegImage } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/config";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

const RestaurantSetup = () => {
  const navigate = useNavigate();

  // Form state
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

    // Basic validation
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

    const uid = auth.currentUser?.uid;
    if (!uid) {
      setError("You must be signed in to save restaurant details.");
      return;
    }

    setLoading(true);
    try {
      let logoURL = null;
      // If a logo file was selected, upload it to Firebase Storage and get a public URL
      if (logoFile) {
        // Basic client-side validation: type and size
        const allowed = ["image/png", "image/jpeg", "image/jpg", "image/gif"];
        const maxBytes = 5 * 1024 * 1024; // 5MB
        if (!allowed.includes(logoFile.type)) {
          throw new Error("Logo must be a PNG, JPG, or GIF image.");
        }
        if (logoFile.size > maxBytes) {
          throw new Error("Logo must be smaller than 5MB.");
        }

        // Generate a clean filename
        const fileExtension = logoFile.name.split(".").pop();
        const safeFileName = `logo_${Date.now()}.${fileExtension}`;

        const storage = getStorage();
        const fileRef = storageRef(
          storage,
          `restaurants/${uid}/${safeFileName}`
        );

        try {
          // Log the attempt
          console.debug("Attempting to upload logo to:", fileRef.fullPath);

          // Upload with metadata
          const metadata = {
            contentType: logoFile.type,
            customMetadata: {
              uploadedBy: uid,
              originalName: logoFile.name,
            },
          };

          const uploadTask = await uploadBytes(fileRef, logoFile, metadata);
          console.debug("Upload completed:", uploadTask.metadata);

          // Get the download URL
          logoURL = await getDownloadURL(fileRef);
          console.debug("Logo URL obtained:", logoURL);
        } catch (upErr) {
          // Log detailed error info
          console.error("Logo upload failed:", {
            error: upErr,
            errorCode: upErr.code,
            errorMessage: upErr.message,
            storagePath: fileRef.fullPath,
            fileName: safeFileName,
            fileType: logoFile.type,
            fileSize: logoFile.size,
          });

          // Show user-friendly error but allow form to continue
          setError(
            "Logo upload failed (will save other details). Please try uploading the logo again later."
          );
          logoURL = null;
        }
      }
      // Build payload and sanitize undefined values. Use serverTimestamp for dates.
      const payload = {
        restaurantName,
        address,
        description,
        openingHours,
        closingHours,
        phoneNumber,
        contactEmail,
        logoFileName: logoFile ? logoFile.name : null,
        logoURL: logoURL || null,
        setupComplete: true,
        // createdAt will only be set if not present because we use merge: true
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // Remove any undefined keys (Firestore rejects undefined)
      Object.keys(payload).forEach(
        (k) => payload[k] === undefined && delete payload[k]
      );

      // Attempt the Firestore write with a small retry/backoff in case of transient failures
      const MAX_ATTEMPTS = 3;
      let attempt = 0;
      while (attempt < MAX_ATTEMPTS) {
        try {
          await setDoc(doc(db, "restaurants", uid), payload, { merge: true });
          break; // success
        } catch (writeErr) {
          attempt += 1;
          console.warn(`setDoc attempt ${attempt} failed:`, writeErr);
          if (attempt >= MAX_ATTEMPTS) {
            throw writeErr;
          }
          // backoff
          await new Promise((r) => setTimeout(r, 300 * attempt));
        }
      }

      // Debug log for successful write
      console.debug("Restaurant payload written for", uid, payload);

      setSuccess("Restaurant details saved successfully.");
      // Continue to the admin dashboard (adjust route if your app differs)
      navigate("/adminDashboard");
    } catch (err) {
      // Log full error to console and show a friendly message to user
      console.error("Failed to save restaurant details:", err);
      setError(err?.message || "Failed to save restaurant details.");
    } finally {
      setLoading(false);
    }
  };

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
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Restaurant Name */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
              {success}
            </div>
          )}
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
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              className="w-full rounded-lg border border-border-light bg-white dark:border-border-dark dark:bg-gray-800 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Logo Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Logo<span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 shrink-0 rounded-lg bg-gray-100 dark:bg-gray-800 border border-border-light dark:border-border-dark flex items-center justify-center">
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
                    onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
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
              value={address}
              onChange={(e) => setAddress(e.target.value)}
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
                value={openingHours}
                onChange={(e) => setOpeningHours(e.target.value)}
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
                value={closingHours}
                onChange={(e) => setClosingHours(e.target.value)}
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
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
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
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
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
              disabled={loading}
              className="flex h-10 items-center justify-center rounded-lg bg-primary px-5 text-sm font-bold text-text-light-primary transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
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
