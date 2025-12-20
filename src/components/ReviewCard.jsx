import React from "react";
import { IoStar } from "react-icons/io5";
import { FiUser, FiEdit2, FiTrash2 } from "react-icons/fi";
import { motion } from "framer-motion";

const ReviewCard = ({ review, currentUserId, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return date.toLocaleDateString();
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <IoStar
        key={index}
        className={`${
          index < rating
            ? "text-yellow-400"
            : "text-gray-300 dark:text-gray-600"
        }`}
      />
    ));
  };

  const isOwner = currentUserId && review.user_id === currentUserId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark hover:shadow-md transition-shadow"
    >
      {/* Header: User info and rating */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* User Avatar */}
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <FiUser className="text-primary text-lg" />
          </div>

          <div>
            <p className="font-medium text-text-light dark:text-text-dark text-sm">
              {review.user_name || "Anonymous User"}
            </p>
            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
              {formatDate(review.created_at)}
            </p>
          </div>
        </div>

        {/* Star Rating and Actions */}
        <div className="flex items-center gap-3">
          <div className="flex gap-0.5">{renderStars(review.rating)}</div>

          {/* Edit/Delete Buttons (only for review owner) */}
          {isOwner && (
            <div className="flex gap-2">
              <button
                onClick={() => onEdit && onEdit(review)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Edit review"
              >
                <FiEdit2 className="text-sm text-text-secondary-light dark:text-text-secondary-dark hover:text-primary" />
              </button>
              <button
                onClick={() => onDelete && onDelete(review.id)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Delete review"
              >
                <FiTrash2 className="text-sm text-text-secondary-light dark:text-text-secondary-dark hover:text-red-500" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Review Comment */}
      {review.comment && (
        <p className="text-sm text-text-light dark:text-text-dark leading-relaxed">
          {review.comment}
        </p>
      )}
    </motion.div>
  );
};

export default ReviewCard;
