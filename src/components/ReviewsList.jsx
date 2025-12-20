import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";
import ReviewCard from "./ReviewCard";
import RatingModal from "./RatingModal";
import { motion } from "framer-motion";
import { IoStar, IoFilter } from "react-icons/io5";

const ReviewsList = ({ restaurantId, onReviewsUpdate }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest, highest, lowest
  const [filterRating, setFilterRating] = useState(0); // 0 = all, 1-5 = specific rating
  const [showFilters, setShowFilters] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchCurrentUser();
    fetchReviews();
  }, [restaurantId, sortBy, filterRating]);

  const fetchCurrentUser = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUser(user);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);

      // Build query
      let query = supabase
        .from("reviews")
        .select("*")
        .eq("restaurant_id", restaurantId);

      // Apply rating filter
      if (filterRating > 0) {
        query = query.eq("rating", filterRating);
      }

      // Apply sorting
      switch (sortBy) {
        case "newest":
          query = query.order("created_at", { ascending: false });
          break;
        case "oldest":
          query = query.order("created_at", { ascending: true });
          break;
        case "highest":
          query = query.order("rating", { ascending: false });
          break;
        case "lowest":
          query = query.order("rating", { ascending: true });
          break;
        default:
          query = query.order("created_at", { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;

      // Add generic user name since we can't join auth.users directly
      const reviewsWithNames = data.map((review) => ({
        ...review,
        user_name: "Verified Customer",
      }));

      setReviews(reviewsWithNames);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setIsEditModalOpen(true);
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", reviewId)
        .eq("user_id", currentUser.id); // Extra security check

      if (error) throw error;

      // Refresh reviews list
      await fetchReviews();

      // Notify parent to update restaurant stats
      if (onReviewsUpdate) {
        onReviewsUpdate();
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete review. Please try again.");
    }
  };

  const handleReviewUpdate = async () => {
    setIsEditModalOpen(false);
    setEditingReview(null);
    await fetchReviews();

    // Notify parent to update restaurant stats
    if (onReviewsUpdate) {
      onReviewsUpdate();
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      distribution[review.rating] = (distribution[review.rating] || 0) + 1;
    });
    return distribution;
  };

  const distribution = getRatingDistribution();
  const totalReviews = reviews.length;

  return (
    <div className="w-full">
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-text-light dark:text-text-dark">
            Customer Reviews
          </h3>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
            {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
          </p>
        </div>

        <div className="flex gap-2">
          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark text-text-light dark:text-text-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors flex items-center gap-2 ${
              filterRating > 0
                ? "bg-primary/10 border-primary text-primary"
                : "border-border-light dark:border-border-dark text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <IoFilter />
            {filterRating > 0 ? `${filterRating} Stars` : "Filter"}
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6 p-4 rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark"
        >
          <p className="text-sm font-medium text-text-light dark:text-text-dark mb-3">
            Filter by Rating
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterRating(0)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filterRating === 0
                  ? "bg-primary text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-text-light dark:text-text-dark hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              All ({totalReviews})
            </button>
            {[5, 4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                onClick={() => setFilterRating(rating)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${
                  filterRating === rating
                    ? "bg-primary text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-text-light dark:text-text-dark hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                <IoStar className="text-yellow-400" />
                {rating} ({distribution[rating] || 0})
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12">
          <IoStar className="text-4xl text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-text-secondary-light dark:text-text-secondary-dark">
            {filterRating > 0
              ? `No ${filterRating}-star reviews yet`
              : "No reviews yet. Be the first to review!"}
          </p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              currentUserId={currentUser?.id}
              onEdit={handleEditReview}
              onDelete={handleDeleteReview}
            />
          ))}
        </motion.div>
      )}

      {/* Edit Review Modal */}
      {editingReview && (
        <RatingModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingReview(null);
          }}
          restaurantId={restaurantId}
          userId={currentUser?.id}
          initialRating={editingReview.rating}
          initialComment={editingReview.comment || ""}
          onRatingSuccess={handleReviewUpdate}
        />
      )}
    </div>
  );
};

export default ReviewsList;
