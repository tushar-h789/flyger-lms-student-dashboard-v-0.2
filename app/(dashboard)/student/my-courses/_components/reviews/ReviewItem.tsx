"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import StarRating from "./StarRating";
import { Edit, Trash2 } from "lucide-react";
import { Review } from "@/lib/types/course";

interface ReviewItemProps {
  review: Review;
  isOwnReview: boolean;
  onEdit: () => void;
  onDelete: () => void;
  isSubmitting?: boolean;
}

export default function ReviewItem({
  review,
  isOwnReview,
  onEdit,
  onDelete,
  isSubmitting = false,
}: ReviewItemProps) {
  return (
    <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm sm:text-base shrink-0">
            {review.userName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                {review.userName}
              </p>
              {isOwnReview && (
                <Badge className="bg-blue-100 text-blue-800 text-xs shrink-0">
                  You
                </Badge>
              )}
            </div>
            <div className="mt-1">
              <StarRating rating={review.rating} size="sm" />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-2">
          <span className="text-xs sm:text-sm text-gray-500">{review.date}</span>
          {isOwnReview && (
            <div className="flex items-center gap-1">
              <button
                onClick={onEdit}
                className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                title="Edit review"
                type="button"
              >
                <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
              <button
                onClick={onDelete}
                disabled={isSubmitting}
                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 cursor-pointer"
                title="Delete review"
                type="button"
              >
                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
      <p className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap break-words">
        {review.comment}
      </p>
    </div>
  );
}
