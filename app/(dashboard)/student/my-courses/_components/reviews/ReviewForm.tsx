"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import StarRating from "./StarRating";

interface ReviewFormProps {
  onSubmit: (rating: number, comment: string) => Promise<void>;
  isSubmitting?: boolean;
}

export default function ReviewForm({
  onSubmit,
  isSubmitting = false,
}: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    await onSubmit(rating, comment.trim());
    setComment("");
    setRating(5);
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
        Write a Review
      </h3>
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        {/* Rating Selection */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
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
          <label
            htmlFor="review-comment"
            className="text-sm font-medium text-gray-700 mb-2 block"
          >
            Your Review
          </label>
          <Textarea
            id="review-comment"
            placeholder="Share your thoughts about this course..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-24"
            rows={4}
            required
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting || !comment.trim()}
          variant="customButton"
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </form>
    </div>
  );
}
