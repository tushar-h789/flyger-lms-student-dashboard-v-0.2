"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import StarRating from "./StarRating";
import { X } from "lucide-react";
import { Review } from "@/lib/types/course";

interface ReviewEditFormProps {
  review: Review;
  onSave: (rating: number, comment: string) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function ReviewEditForm({
  review,
  onSave,
  onCancel,
  isSubmitting = false,
}: ReviewEditFormProps) {
  const [rating, setRating] = useState(review.rating);
  const [comment, setComment] = useState(review.comment);

  useEffect(() => {
    setRating(review.rating);
    setComment(review.comment);
  }, [review]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    await onSave(rating, comment.trim());
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm sm:text-base shrink-0">
            {review.userName.charAt(0)}
          </div>
          <p className="text-sm sm:text-base font-semibold text-gray-900">
            {review.userName}
          </p>
        </div>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer shrink-0"
          type="button"
        >
          <X className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        {/* Rating Selection */}
        <div>
          <label className="text-xs sm:text-sm font-medium text-gray-700 mb-2 block">
            Rating
          </label>
          <StarRating
            rating={rating}
            onRatingChange={setRating}
            size="md"
            interactive={true}
            showText={true}
          />
        </div>

        {/* Comment Input */}
        <div>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-20 sm:min-h-24 text-sm sm:text-base"
            rows={4}
            required
          />
        </div>

        {/* Save/Cancel Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Button
            type="submit"
            variant="customButton"
            disabled={isSubmitting || !comment.trim()}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            type="button"
            onClick={onCancel}
            variant="cancel"
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

