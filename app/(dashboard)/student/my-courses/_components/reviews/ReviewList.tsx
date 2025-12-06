"use client";

import React, { useState, useEffect } from "react";
import { Review } from "@/lib/types/course";
import ReviewItem from "./ReviewItem";
import ReviewEditForm from "./ReviewEditForm";
import ConfirmDialog from "@/components/common/ConfirmDialog";

interface ReviewListProps {
  reviews: Review[];
  currentUserId: string;
  editingReviewId: string | null;
  onEdit: (review: Review) => void;
  onSaveEdit: (reviewId: string, rating: number, comment: string) => Promise<void>;
  onCancelEdit: () => void;
  onDelete: (reviewId: string) => void;
  isSubmitting?: boolean;
}

export default function ReviewList({
  reviews,
  currentUserId,
  editingReviewId,
  onEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  isSubmitting = false,
}: ReviewListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const isOwnReview = (review: Review) => review.userName === currentUserId;

  const handleDeleteClick = (reviewId: string) => {
    setReviewToDelete(reviewId);
    setIsProcessing(true);
    
    // Show processing state briefly, then show confirm dialog
    setTimeout(() => {
      setIsProcessing(false);
      setDeleteDialogOpen(true);
    }, 500);
  };

  const handleConfirmDelete = () => {
    if (reviewToDelete) {
      onDelete(reviewToDelete);
      setReviewToDelete(null);
    }
  };

  // Reset processing state when dialog closes
  useEffect(() => {
    if (!deleteDialogOpen) {
      setIsProcessing(false);
    }
  }, [deleteDialogOpen]);

  if (reviews.length === 0) {
    return (
      <div className="bg-white p-6 sm:p-8 rounded-lg border border-gray-200 text-center">
        <p className="text-sm sm:text-base text-gray-600">
          No reviews yet. Be the first to review this course!
        </p>
      </div>
    );
  }

  return (
    <>
      <div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
          Reviews ({reviews.length})
        </h3>
        <div className="space-y-3 sm:space-y-4">
          {reviews.map((review) => (
            <div key={review.id}>
              {editingReviewId === review.id ? (
                <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
                  <ReviewEditForm
                    review={review}
                    onSave={(rating, comment) =>
                      onSaveEdit(review.id, rating, comment)
                    }
                    onCancel={onCancelEdit}
                    isSubmitting={isSubmitting}
                  />
                </div>
              ) : (
                <ReviewItem
                  review={review}
                  isOwnReview={isOwnReview(review)}
                  onEdit={() => onEdit(review)}
                  onDelete={() => handleDeleteClick(review.id)}
                  isSubmitting={isSubmitting || isProcessing}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Review"
        description="Are you sure you want to delete this review? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        variant="destructive"
        isLoading={isSubmitting}
      />
    </>
  );
}

