import React, { useState } from "react";
import { IoStar, IoClose } from "react-icons/io5";
import { supabase } from "../supabase";

const RatingModal = ({
  isOpen,
  onClose,
  restaurantId,
  userId,
  onRatingSuccess,
  initialRating = 0,
  initialComment = "",
}) => {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState(initialComment);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return;

    setLoading(true);
    try {
      // Upsert review based on user_id and restaurant_id uniqueness
      const { error } = await supabase.from("reviews").upsert(
        {
          restaurant_id: restaurantId,
          user_id: userId,
          rating,
          comment,
          created_at: new Date().toISOString(),
        },
        { onConflict: "user_id, restaurant_id" }
      );

      if (error) throw error;
      onRatingSuccess();
      onClose();
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl transition-all">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <IoClose size={24} />
        </button>

        <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          Rate this Restaurant
        </h2>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          Share your experience with others
        </p>

        <form onSubmit={handleSubmit}>
          {/* Star Rating */}
          <div className="mb-6 flex justify-center gap-2">
            {[...Array(5)].map((_, index) => {
              const ratingValue = index + 1;
              return (
                <button
                  type="button"
                  key={ratingValue}
                  className="transition-transform hover:scale-110 focus:outline-none"
                  onClick={() => setRating(ratingValue)}
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(0)}
                >
                  <IoStar
                    className={`text-4xl transition-colors ${
                      ratingValue <= (hover || rating)
                        ? "text-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Comment Area */}
          <div className="mb-6">
            <label
              htmlFor="comment"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Write a review (optional)
            </label>
            <textarea
              id="comment"
              rows="4"
              className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              placeholder="Tell us what you liked..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || rating === 0}
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:opacity-50 dark:focus:ring-green-800"
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RatingModal;
