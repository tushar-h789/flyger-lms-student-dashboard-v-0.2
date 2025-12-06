"use client";

import React from "react";
import { Review } from "@/lib/types/course";
import { ReviewForm, ReviewList } from "../reviews";

interface ReviewsTabProps {
  reviews: Review[];
  currentUserId: string;
  hasUserReview: boolean;
  editingReviewId: string | null;
  isSubmitting: boolean;
  onAddReview: (rating: number, comment: string) => Promise<void>;
  onEdit: (review: Review) => void;
  onSaveEdit: (
    reviewId: string,
    rating: number,
    comment: string
  ) => Promise<void>;
  onCancelEdit: () => void;
  onDelete: (reviewId: string) => void;
}

export default function ReviewsTab({
  reviews,
  currentUserId,
  hasUserReview,
  editingReviewId,
  isSubmitting,
  onAddReview,
  onEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
}: ReviewsTabProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Only show review form if user hasn't submitted a review yet */}
      {!hasUserReview && (
        <ReviewForm onSubmit={onAddReview} isSubmitting={isSubmitting} />
      )}
      <ReviewList
        reviews={reviews}
        currentUserId={currentUserId}
        editingReviewId={editingReviewId}
        onEdit={onEdit}
        onSaveEdit={onSaveEdit}
        onCancelEdit={onCancelEdit}
        onDelete={onDelete}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
